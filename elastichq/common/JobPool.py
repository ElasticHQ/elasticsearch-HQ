


class JobPool():

    def init_app(self, app):
        self.app = app
        return self

    def blah(self):
        from elastichq.service import ClusterService
        clusters = ClusterService().get_clusters(create_if_missing=False)
        return clusters
