"""
.. module:: ClusterModel

.. moduleauthor:: Roy Russo <royrusso.gmail.com>
"""

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
    cluster_username = db.Column(db.String, nullable=True)
    cluster_password = db.Column(db.String, nullable=True)
    cluster_connected = False
    cluster_health = None

    def __init__(self, cluster_name, cluster_ip, cluster_port='9200', cluster_scheme='http', username=None,
                 password=None):
        """
        Init

        :param cluster_name:
        :param cluster_ip:
        :param cluster_port:
        :param cluster_scheme:
        """
        self.cluster_name = cluster_name
        self.cluster_port = cluster_port
        self.cluster_ip = cluster_ip
        self.cluster_scheme = cluster_scheme
        self.cluster_username = username
        self.cluster_password = password

    @property
    def cluster_host(self):
        """
        Concats scheme, ip, port

        :return: SCHEME://IP:PORT
        """
        return self.cluster_scheme + "://" + self.cluster_ip + ":" + self.cluster_port

    @property
    def is_basic_auth(self):
        if self.cluster_username is not None and self.cluster_password is not None:
            return True
        return False


class ClusterDTO(ma.ModelSchema):
    """
    Generic data transfer object for a cluster.

    """
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
            'cluster_name', 'cluster_ip', 'cluster_port', 'cluster_scheme', 'cluster_connected', 'cluster_host',
            'cluster_version', 'cluster_health', '_links')
