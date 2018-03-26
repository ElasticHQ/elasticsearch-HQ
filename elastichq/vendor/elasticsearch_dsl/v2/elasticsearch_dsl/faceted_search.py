from datetime import timedelta, datetime
from six import iteritems, itervalues
from functools import partial

from .search import Search
from .aggs import A
from .utils import AttrDict
from .result import Response
from .query import Q

__all__ = ['FacetedSearch', 'HistogramFacet', 'TermsFacet', 'DateHistogramFacet', 'RangeFacet']

class Facet(object):
    """
    A facet on faceted search. Wraps and aggregation and provides functionality
    to create a filter for selected values and return a list of facet values
    from the result of the aggregation.
    """
    agg_type = None

    def __init__(self, **kwargs):
        self.filter_values = ()
        self._params = kwargs

    def get_aggregation(self):
        """
        Return the aggregation object.
        """
        return A(self.agg_type, **self._params)

    def add_filter(self, filter_values):
        """
        Construct a filter.
        """
        if not filter_values:
            return

        f = self.get_value_filter(filter_values[0])
        for v in filter_values[1:]:
            f |= self.get_value_filter(v)
        return f

    def get_value_filter(self, filter_value):
        """
        Construct a filter for an individual value
        """
        pass

    def is_filtered(self, key, filter_values):
        """
        Is a filter active on the given key.
        """
        return key in filter_values

    def get_value(self, bucket):
        """
        return a value representing a bucket. Its key as default.
        """
        return bucket['key']

    def get_values(self, data, filter_values):
        """
        Turn the raw bucket data into a list of tuples containing the key,
        number of documents and a flag indicating whether this value has been
        selected or not.
        """
        out = []
        for bucket in data:
            key = self.get_value(bucket)
            out.append((
                key,
                bucket['doc_count'],
                self.is_filtered(key, filter_values)
            ))
        return out


class TermsFacet(Facet):
    agg_type = 'terms'

    def add_filter(self, filter_values):
        """ Create a terms filter instead of bool containing term filters.  """
        if filter_values:
            return Q('terms', **{self._params['field']: filter_values})


class RangeFacet(Facet):
    agg_type = 'range'

    def _range_to_dict(self, range):
        key, range = range
        out = {'key': key}
        if range[0] is not None:
            out['from'] = range[0]
        if range[1] is not None:
            out['to'] = range[1]
        return out

    def __init__(self, ranges, **kwargs):
        super(RangeFacet, self).__init__(**kwargs)
        self._params['ranges'] = list(map(self._range_to_dict, ranges))
        self._params['keyed'] = False
        self._ranges = dict(ranges)

    def get_value_filter(self, filter_value):
        f, t = self._ranges[filter_value]
        limits = {}
        if f is not None:
            limits['from'] = f
        if t is not None:
            limits['to'] = t

        return Q('range', **{
            self._params['field']: limits
        })

class HistogramFacet(Facet):
    agg_type = 'histogram'

    def get_value_filter(self, filter_value):
        return Q('range', **{
            self._params['field']: {
                'gte': filter_value,
                'lt': filter_value + self._params['interval']
            }
        })


class DateHistogramFacet(Facet):
    agg_type = 'date_histogram'

    DATE_INTERVALS = {
        'month': lambda d: (d+timedelta(days=32)).replace(day=1),
        'week': lambda d: d+timedelta(days=7),
        'day': lambda d: d+timedelta(days=1),
        'hour': lambda d: d+timedelta(hours=1),
    }

    def __init__(self, **kwargs):
        kwargs.setdefault("min_doc_count", 0)
        super(DateHistogramFacet, self).__init__(**kwargs)

    def get_value(self, bucket):
        return datetime.utcfromtimestamp(int(bucket['key']) / 1000)

    def get_value_filter(self, filter_value):
        return Q('range', **{
            self._params['field']: {
                'gte': filter_value,
                'lt': self.DATE_INTERVALS[self._params['interval']](filter_value)
            }
        })


class FacetedResponse(Response):
    def __init__(self, search, *args, **kwargs):
        super(FacetedResponse, self).__init__(*args, **kwargs)
        super(AttrDict, self).__setattr__('_search', search)

    @property
    def query_string(self):
        return self._search._query

    @property
    def facets(self):
        if not hasattr(self, '_facets'):
            super(AttrDict, self).__setattr__('_facets', AttrDict({}))
            for name, facet in iteritems(self._search.facets):
                self._facets[name] = facet.get_values(
                    self.aggregations['_filter_' + name][name]['buckets'],
                    self._search.filter_values.get(name, ())
                )
        return self._facets


class FacetedSearch(object):
    index = '_all'
    doc_types = ['_all']
    fields = ('*', )
    facets = {}

    def __init__(self, query=None, filters={}):
        self._query = query
        self._filters = {}
        self.filter_values = {}
        for name, value in iteritems(filters):
            self.add_filter(name, value)

        self._s = self.build_search()

    def count(self):
        return self._s.count()

    def __getitem__(self, k):
        self._s = self._s[k]
        return self

    def __iter__(self):
        return iter(self._s)

    def add_filter(self, name, filter_values):
        """
        Add a filter for a facet.
        """
        # normalize the value into a list
        if not isinstance(filter_values, (tuple, list)):
            if filter_values in (None, ''):
                return
            filter_values = [filter_values, ]

        # remember the filter values for use in FacetedResponse
        self.filter_values[name] = filter_values

        # get the filter from the facet
        f = self.facets[name].add_filter(filter_values)
        if f is None:
            return

        self._filters[name] = f

    def search(self):
        """
        Construct the Search object.
        """
        s = Search(doc_type=self.doc_types, index=self.index)
        return s.response_class(partial(FacetedResponse, self))

    def query(self, search, query):
        """
        Add query part to ``search``.

        Override this if you wish to customize the query used.
        """
        if query:
            return search.query('multi_match', fields=self.fields, query=query)
        return search

    def aggregate(self, search):
        """
        Add aggregations representing the facets selected, including potential
        filters.
        """
        for f, facet in iteritems(self.facets):
            agg = facet.get_aggregation()
            agg_filter = Q('match_all')
            for field, filter in iteritems(self._filters):
                if f == field:
                    continue
                agg_filter &= filter
            search.aggs.bucket(
                '_filter_' + f,
                'filter',
                filter=agg_filter
            ).bucket(f, agg)

    def filter(self, search):
        """
        Add a ``post_filter`` to the search request narrowing the results based
        on the facet filters.
        """
        post_filter = Q('match_all')
        for f in itervalues(self._filters):
            post_filter &= f
        return search.post_filter(post_filter)

    def highlight(self, search):
        """
        Add highlighting for all the fields
        """
        return search.highlight(*(f if '^' not in f else f.split('^', 1)[0]
                                  for f in self.fields))

    def build_search(self):
        """
        Construct the ``Search`` object.
        """
        s = self.search()
        s = self.query(s, self._query)
        s = self.filter(s)
        s = self.highlight(s)
        self.aggregate(s)
        return s

    def execute(self):
        return self._s.execute()
