__author__ = 'royrusso'

from elastichq.globals import db
from elastichq.model import ClusterModel


class ClusterDBService:
    """
    Handles interactions with the database cluster model.
    """

    def get_by_id(self, cluster_name):
        """
        Fetches a cluster object from the DB
        :param cluster_id: cluster name 
        :return:
        """
        return ClusterModel.query.filter_by(cluster_name=cluster_name).one_or_none()

    def save_cluster(self, cluster):
        if self.get_by_id(cluster.cluster_name) is None:
            db.session.add(cluster)
            db.session.commit()

    def delete_cluster_by_name(self, cluster_name):
        cluster = self.get_by_id(cluster_name)
        db.session.delete(cluster)
        db.session.commit()

    def get_all(self):
        return ClusterModel.query.all()
