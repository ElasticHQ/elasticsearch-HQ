from six import iteritems, u

from .utils import AttrDict, AttrList

class SuggestResponse(AttrDict):
    def success(self):
        return not self._shards.failed

class Response(AttrDict):
    def __init__(self, response, callbacks=None):
        super(AttrDict, self).__setattr__('_callbacks', callbacks or {})
        super(Response, self).__init__(response)

    def __iter__(self):
        return iter(self.hits)

    def __getitem__(self, key):
        # for slicing etc
        return self.hits[key]

    def __nonzero__(self):
        return bool(self.hits)
    __bool__ = __nonzero__

    def __repr__(self):
        return '<Response: %r>' % self.hits

    def __len__(self):
        return len(self.hits)

    def success(self):
        return self._shards.total == self._shards.successful and not self.timed_out

    def _get_result(self, hit):
        dt = hit['_type']
        for t in hit.get('inner_hits', ()):
            hit['inner_hits'][t] = Response(hit['inner_hits'][t], callbacks=self._callbacks)
        return self._callbacks.get(dt, Result)(hit)

    @property
    def hits(self):
        if not hasattr(self, '_hits'):
            h = self._d_['hits']

            try:
                hits = AttrList(map(self._get_result, h['hits']))
            except AttributeError as e:
                # avoid raising AttributeError since it will be hidden by the property
                raise TypeError("Could not parse hits.", e)

            # avoid assigning _hits into self._d_
            super(AttrDict, self).__setattr__('_hits', hits)
            for k in h:
                setattr(self._hits, k, h[k])
        return self._hits


class ResultMeta(AttrDict):
    def __init__(self, document, exclude=('_source', '_fields')):
        d = dict((k[1:] if k.startswith('_') else k, v) for (k, v) in iteritems(document) if k not in exclude)
        if 'type' in d:
            # make sure we are consistent everywhere in python
            d['doc_type'] = d.pop('type')
        super(ResultMeta, self).__init__(d)

class Result(AttrDict):
    def __init__(self, document):
        data = {}
        if '_source' in document:
            data = document['_source']
        if 'fields' in document:
            data.update(document['fields'])

        super(Result, self).__init__(data)
        # assign meta as attribute and not as key in self._d_
        super(AttrDict, self).__setattr__('meta', ResultMeta(document))

    def __dir__(self):
        # be sure to expose meta in dir(self)
        return super(Result, self).__dir__() + ['meta']

    def __repr__(self):
        return '<Result(%s): %s>' % (
            '/'.join(getattr(self.meta, key) for key in
                      ('index', 'doc_type', 'id') if key in self.meta),
            super(Result, self).__repr__()
        )
