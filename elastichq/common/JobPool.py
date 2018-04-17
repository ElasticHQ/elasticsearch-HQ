from elastichq.globals import scheduler

# TODO: rename this to Metrics Service and move to service package
class JobPool():

    app = None

    def init_app(self, app):
        self.app = app
        return self

    def blah(self):
        JOB = {
            'trigger': 'interval',
            'seconds': 3  # ,
            # 'args': (app, 'in')
        }
        scheduler.add_job('job1', self.do_task, **JOB)


    def do_task(self):
        from elastichq.service import ClusterService
        clusters = ClusterService().get_clusters(create_if_missing=False)
        return clusters
