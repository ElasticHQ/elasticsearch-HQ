from .connections import connections
from .search import Search

class Index(object):
    def __init__(self, name, using='default'):
        self._name = name
        self._doc_types = {}
        self._mappings = {}
        self._using = using
        self._settings = {}
        self._aliases = {}
        self._analysis = {}

    def clone(self, name, using=None):
        i = Index(name, using=using or self._using)
        for attr in ('_doc_types', '_mappings', '_settings', '_aliases'):
            setattr(i, attr, getattr(self, attr).copy())
        return i

    def _get_connection(self):
        return connections.get_connection(self._using)
    connection = property(_get_connection)

    def doc_type(self, doc_type):
        name = doc_type._doc_type.name
        self._doc_types[name] = doc_type
        self._mappings[name] = doc_type._doc_type.mapping

        if not doc_type._doc_type.index:
            doc_type._doc_type.index = self._name
        return doc_type # to use as decorator???

    def settings(self, **kwargs):
        self._settings.update(kwargs)
        return self

    def aliases(self, **kwargs):
        self._aliases.update(kwargs)
        return self

    def analyzer(self, analyzer):
        d = analyzer.get_analysis_definition()
        # empty custom analyzer, probably already defined out of our control
        if not d:
            return

        # merge the definition
        # TODO: conflict detection/resolution
        for key in d:
            self._analysis.setdefault(key, {}).update(d[key])

    def search(self):
        return Search(
            using=self._using,
            index=self._name,
            doc_type=[self._doc_types.get(k, k) for k in self._mappings]
        )

    def _get_mappings(self):
        analysis, mappings = {}, {}
        for mapping in self._mappings.values():
            mappings.update(mapping.to_dict())
            a = mapping._collect_analysis()
            # merge the definition
            # TODO: conflict detection/resolution
            for key in a:
                analysis.setdefault(key, {}).update(a[key])

        return mappings, analysis

    def to_dict(self):
        out = {}
        if self._settings:
            out['settings'] = self._settings
        if self._aliases:
            out['aliases'] = self._aliases
        mappings, analysis = self._get_mappings()
        if mappings:
            out['mappings'] = mappings
        if analysis or self._analysis:
            for key in self._analysis:
                analysis.setdefault(key, {}).update(self._analysis[key])
            out.setdefault('settings', {})['analysis'] = analysis
        return out

    def exists(self, **kwargs):
        return self.connection.indices.exists(index=self._name, **kwargs)

    def refresh(self, **kwargs):
        return self.connection.indices.refresh(index=self._name, **kwargs)

    def flush(self, **kwargs):
        return self.connection.indices.flush(index=self._name, **kwargs)

    def open(self, **kwargs):
        return self.connection.indices.open(index=self._name, **kwargs)

    def close(self, **kwargs):
        return self.connection.indices.close(index=self._name, **kwargs)

    def create(self, **kwargs):
        self.connection.indices.create(index=self._name, body=self.to_dict(), **kwargs)

    def delete(self, **kwargs):
        self.connection.indices.delete(index=self._name, **kwargs)
