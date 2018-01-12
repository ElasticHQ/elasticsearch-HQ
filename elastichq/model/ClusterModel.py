__author__ = 'royrusso'

from ..globals import db, ma


class ClusterModel(db.Model):
    """
    Keeping it simple... cluster_name must be unique.
    """
    __tablename__ = 'cluster'

    cluster_name = db.Column(db.String, primary_key=True)
    cluster_ip = db.Column(db.String, nullable=False)
    cluster_port = db.Column(db.String, nullable=False, default="9200")
    cluster_scheme = db.Column(db.String, nullable=False, default="http")
    cluster_version = db.Column(db.String, nullable=False, default="http")
    cluster_connected = False
    cluster_health = None

    def __init__(self, cluster_name, cluster_ip, cluster_port='9200', cluster_scheme='http'):
        self.cluster_name = cluster_name
        self.cluster_port = cluster_port
        self.cluster_ip = cluster_ip
        self.cluster_scheme = cluster_scheme

    @property
    def cluster_host(self):
        return self.cluster_scheme + "://" + self.cluster_ip + ":" + self.cluster_port


class ClusterDTO(ma.ModelSchema):
    _links = ma.Hyperlinks({
        'summary': ma.AbsoluteURLFor('.clusters_summary', cluster_name='<cluster_name>', _external=True),
        'stats': ma.AbsoluteURLFor('.clusters_stats', cluster_name='<cluster_name>', _external=True),
        'health': ma.AbsoluteURLFor('.clusters_health', cluster_name='<cluster_name>', _external=True),
        'collection': ma.AbsoluteURLFor('.clusters_list')
    })

    class Meta:
        ordered = True
        model = ClusterModel
        fields = (
            'cluster_name', 'cluster_ip', 'cluster_port', 'cluster_scheme', 'cluster_connected', 'cluster_host', 'cluster_version', 'cluster_health', '_links')
