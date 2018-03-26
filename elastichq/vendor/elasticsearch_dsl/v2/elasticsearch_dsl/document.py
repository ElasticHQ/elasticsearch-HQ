import re

from elastichq.vendor.elasticsearch.exceptions import NotFoundError, RequestError
from six import iteritems, add_metaclass

from .field import Field
from .mapping import Mapping
from .utils import ObjectBase, AttrDict, merge
from .result import ResultMeta
from .search import Search
from .connections import connections
from .exceptions import ValidationException

DELETE_META_FIELDS = frozenset((
    'id', 'parent', 'routing', 'version', 'version_type'
))

DOC_META_FIELDS = frozenset((
    'timestamp', 'ttl'
)).union(DELETE_META_FIELDS)

META_FIELDS = frozenset((
    # Elasticsearch metadata fields, except 'type'
    'index', 'using', 'score',
)).union(DOC_META_FIELDS)

class MetaField(object):
    def __init__(self, *args, **kwargs):
        self.args, self.kwargs = args, kwargs

class DocTypeMeta(type):
    def __new__(cls, name, bases, attrs):
        # DocTypeMeta filters attrs in place
        attrs['_doc_type'] = DocTypeOptions(name, bases, attrs)
        return super(DocTypeMeta, cls).__new__(cls, name, bases, attrs)

class DocTypeOptions(object):
    def __init__(self, name, bases, attrs):
        meta = attrs.pop('Meta', None)

        # default index, if not overriden by doc.meta
        self.index = getattr(meta, 'index', None)

        # default cluster alias, can be overriden in doc.meta
        self._using = getattr(meta, 'using', None)

        # get doc_type name, if not defined take the name of the class and
        # transform it to lower_case
        doc_type = getattr(meta, 'doc_type',
                re.sub(r'(.)([A-Z])', r'\1_\2', name).lower())

        # create the mapping instance
        self.mapping = getattr(meta, 'mapping', Mapping(doc_type))

        # register all declared fields into the mapping
        for name, value in list(iteritems(attrs)):
            if isinstance(value, Field):
                self.mapping.field(name, value)
                del attrs[name]

        # add all the mappings for meta fields
        for name in dir(meta):
            if isinstance(getattr(meta, name, None), MetaField):
                params = getattr(meta, name)
                self.mapping.meta(name, *params.args, **params.kwargs)

        # document inheritance - include the fields from parents' mappings and
        # index/using values
        for b in bases:
            if hasattr(b, '_doc_type') and hasattr(b._doc_type, 'mapping'):
                self.mapping.update(b._doc_type.mapping, update_only=True)
                self._using = self._using or b._doc_type._using
                self.index = self.index or b._doc_type.index

    @property
    def using(self):
        return self._using or 'default'

    @property
    def name(self):
        return self.mapping.properties.name

    @property
    def parent(self):
        if '_parent' in self.mapping._meta:
            return self.mapping._meta['_parent']['type']
        return

    def init(self, index=None, using=None):
        self.mapping.save(index or self.index, using=using or self.using)

    def refresh(self, index=None, using=None):
        self.mapping.update_from_es(index or self.index, using=using or self.using)


@add_metaclass(DocTypeMeta)
class DocType(ObjectBase):
    def __init__(self, meta=None, **kwargs):
        meta = meta or {}
        for k in list(kwargs):
            if k.startswith('_') and k[1:] in META_FIELDS:
                meta[k] = kwargs.pop(k)

        if self._doc_type.index:
            meta.setdefault('_index', self._doc_type.index)
        super(AttrDict, self).__setattr__('meta', ResultMeta(meta))

        super(DocType, self).__init__(**kwargs)

    def __getstate__(self):
        return (self.to_dict(), self.meta._d_)

    def __setstate__(self, state):
        data, meta = state
        super(AttrDict, self).__setattr__('_d_', data)
        super(AttrDict, self).__setattr__('meta', ResultMeta(meta))

    def __getattr__(self, name):
        if name.startswith('_') and name[1:] in META_FIELDS:
            return getattr(self.meta, name[1:])
        return super(DocType, self).__getattr__(name)

    def __repr__(self):
        return '%s(%s)' % (
            self.__class__.__name__,
            ', '.join('%s=%r' % (key, getattr(self.meta, key)) for key in
                      ('index', 'doc_type', 'id') if key in self.meta)
        )

    def __setattr__(self, name, value):
        if name.startswith('_') and name[1:] in META_FIELDS:
            return setattr(self.meta, name[1:], value)
        return super(DocType, self).__setattr__(name, value)

    @classmethod
    def init(cls, index=None, using=None):
        cls._doc_type.init(index, using)

    @classmethod
    def search(cls, using=None, index=None):
        return Search(
            using=using or cls._doc_type.using,
            index=index or cls._doc_type.index,
            doc_type={cls._doc_type.name: cls.from_es},
        )

    @classmethod
    def get(cls, id, using=None, index=None, **kwargs):
        es = connections.get_connection(using or cls._doc_type.using)
        doc = es.get(
            index=index or cls._doc_type.index,
            doc_type=cls._doc_type.name,
            id=id,
            **kwargs
        )
        if not doc['found']:
            return None
        return cls.from_es(doc)

    @classmethod
    def mget(cls, docs, using=None, index=None, raise_on_error=True,
             missing='none', **kwargs):
        if missing not in ('raise', 'skip', 'none'):
            raise ValueError("'missing' must be 'raise', 'skip', or 'none'.")
        es = connections.get_connection(using or cls._doc_type.using)
        body = {'docs': [doc if isinstance(doc, dict) else {'_id': doc}
                         for doc in docs]}
        results = es.mget(
            body,
            index=index or cls._doc_type.index,
            doc_type=cls._doc_type.name,
            **kwargs
        )

        objs, error_docs, missing_docs = [], [], []
        for doc in results['docs']:
            if doc.get('found'):
                if error_docs or missing_docs:
                    # We're going to raise an exception anyway, so avoid an
                    # expensive call to cls.from_es().
                    continue

                objs.append(cls.from_es(doc))

            elif doc.get('error'):
                if raise_on_error:
                    error_docs.append(doc)
                if missing == 'none':
                    objs.append(None)

            # The doc didn't cause an error, but the doc also wasn't found.
            elif missing == 'raise':
                missing_docs.append(doc)
            elif missing == 'none':
                objs.append(None)

        if error_docs:
            error_ids = [doc['_id'] for doc in error_docs]
            message = 'Required routing/parent not provided for documents %s.'
            message %= ', '.join(error_ids)
            raise RequestError(400, message, error_docs)
        if missing_docs:
            missing_ids = [doc['_id'] for doc in missing_docs]
            message = 'Documents %s not found.' % ', '.join(missing_ids)
            raise NotFoundError(404, message, missing_docs)
        return objs

    @classmethod
    def from_es(cls, hit):
        # don't modify in place
        meta = hit.copy()
        doc = meta.pop('_source', {})

        if 'fields' in meta:
            for k, v in iteritems(meta.pop('fields')):
                if k == '_source':
                    doc.update(v)
                if k.startswith('_') and k[1:] in META_FIELDS:
                    meta[k] = v
                else:
                    doc[k] = v

        return cls(meta=meta, **doc)

    def _get_connection(self, using=None):
        return connections.get_connection(using or self._doc_type.using)
    connection = property(_get_connection)

    def _get_index(self, index=None):
        if index is None:
            index = getattr(self.meta, 'index', self._doc_type.index)
        if index is None:
            raise ValidationException('No index')
        return index

    def delete(self, using=None, index=None, **kwargs):
        es = self._get_connection(using)
        # extract parent, routing etc from meta
        doc_meta = dict(
            (k, self.meta[k])
            for k in DELETE_META_FIELDS
            if k in self.meta
        )
        doc_meta.update(kwargs)
        es.delete(
            index=self._get_index(index),
            doc_type=self._doc_type.name,
            **doc_meta
        )

    def to_dict(self, include_meta=False):
        d = super(DocType, self).to_dict()
        if not include_meta:
            return d

        meta = dict(
            ('_' + k, self.meta[k])
            for k in DOC_META_FIELDS
            if k in self.meta
        )

        # in case of to_dict include the index unlike save/update/delete
        if 'index' in self.meta:
            meta['_index'] = self.meta.index
        elif self._doc_type.index:
            meta['_index'] = self._doc_type.index

        meta['_type'] = self._doc_type.name
        meta['_source'] = d
        return meta

    def update(self, using=None, index=None, **fields):
        es = self._get_connection(using)

        # update the data locally
        merge(self._d_, fields)

        # extract parent, routing etc from meta
        doc_meta = dict(
            (k, self.meta[k])
            for k in DOC_META_FIELDS
            if k in self.meta
        )
        meta = es.update(
            index=self._get_index(index),
            doc_type=self._doc_type.name,
            body={'doc': fields},
            **doc_meta
        )
        # update meta information from ES
        for k in META_FIELDS:
            if '_' + k in meta:
                setattr(self.meta, k, meta['_' + k])

    def save(self, using=None, index=None, validate=True, **kwargs):
        if validate:
            self.full_clean()

        es = self._get_connection(using)
        # extract parent, routing etc from meta
        doc_meta = dict(
            (k, self.meta[k])
            for k in DOC_META_FIELDS
            if k in self.meta
        )
        doc_meta.update(kwargs)
        meta = es.index(
            index=self._get_index(index),
            doc_type=self._doc_type.name,
            body=self.to_dict(),
            **doc_meta
        )
        # update meta information from ES
        for k in META_FIELDS:
            if '_' + k in meta:
                setattr(self.meta, k, meta['_' + k])

        # return True/False if the document has been created/updated
        return meta['created']

