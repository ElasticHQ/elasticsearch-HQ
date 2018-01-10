__author__ = 'royrusso'

from ..globals import db


class ClusterModel(db.Model):
    """
    Keeping it simple... cluster_name must be unique.
    """
    __tablename__ = 'cluster'

    cluster_name = db.Column(db.String, primary_key=True)
    cluster_url = db.Column(db.String, nullable=False)

    def __init__(self, cluster_name, cluster_url):
        self.cluster_name = cluster_name
        self.cluster_url = cluster_url
