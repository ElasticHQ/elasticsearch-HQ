import json
import os
from urllib import request

from flask import current_app

from elastichq.model import ClusterDTO
from elastichq.vendor.elasticsearch.exceptions import NotFoundError
from .ConnectionService import ConnectionService
from ..globals import CACHE_REGION, LOG


class HQService:

    def get_status(self):

        version_str = ""
        try:
            fp = request.urlopen("http://www.elastichq.org/currversion.json", timeout=10)
            mbyte = fp.read()
            version_str = mbyte.decode("utf-8")
            fp.close()
        except Exception as ex:
            LOG.error("error retrieving version information", ex)

        stable_version = (json.loads(version_str)).get("version", None)

        from elastichq.service import ClusterService
        clusters = ClusterService().get_clusters(create_if_missing=False)
        schema = ClusterDTO(many=True)
        result = schema.dump(clusters)

        status = {
            "name": "ElasticHQ",
            "installed_version": current_app.config.get('API_VERSION'),
            "current_stable_version": stable_version,
            "tagline": "You know, for Elasticsearch",
            "clusters": result.data,
            "default_url": os.environ.get('HQ_DEFAULT_URL', current_app.config.get('DEFAULT_URL'))
        }
        return status

    @CACHE_REGION.cache_on_arguments()
    def get_settings(self, cluster_name):

        try:
            connection = ConnectionService().get_connection(cluster_name)
            settings_doc = connection.get_source(index=current_app.config.get('HQ_CLUSTER_SETTINGS')[
                'index_name'],
                                                 id=current_app.config.get('HQ_CLUSTER_SETTINGS')[
                                                     'doc_id'],
                                                 doc_type=current_app.config.get('HQ_CLUSTER_SETTINGS')[
                                                     'doc_type'])

            return settings_doc
        except NotFoundError as nfe:
            if current_app.config.get('HQ_CLUSTER_SETTINGS')['store_metrics']:
                self.save_settings(cluster_name)

        return current_app.config.get('HQ_CLUSTER_SETTINGS')

    def save_settings(self, cluster_name, body=None):
        try:
            if body is None:
                body = current_app.config.get('HQ_CLUSTER_SETTINGS')
            connection = ConnectionService().get_connection(cluster_name)
            connection.index(index=current_app.config.get('HQ_CLUSTER_SETTINGS')['index_name'],
                             doc_type=current_app.config.get('HQ_CLUSTER_SETTINGS')['doc_type'],
                             id=current_app.config.get('HQ_CLUSTER_SETTINGS')['doc_id'],
                             body=body, refresh=True)
        except NotFoundError as nfe:
            LOG.error("Unable to save index. Is action.auto_create_index disabled in the ES configuration file?", nfe)

    def update_settings(self, cluster_name, body=None):
        if body is None:
            body = current_app.config.get('HQ_CLUSTER_SETTINGS')

        current_settings = self.get_settings(cluster_name)
        new_settings = {
            'doc_id': current_app.config.get('HQ_CLUSTER_SETTINGS')['doc_id'],
            'index_name': current_app.config.get('HQ_CLUSTER_SETTINGS')['index_name'],
            'version': 1,
            'doc_type': current_app.config.get('HQ_CLUSTER_SETTINGS')['doc_type'],
            'store_metrics': body.get('store_metrics', current_settings.get('store_metrics')),
            'websocket_interval': body.get('websocket_interval',
                                           current_settings.get('websocket_interval')),
            'historic_poll_interval': body.get('historic_poll_interval',
                                               current_settings.get('historic_poll_interval')),
            'historic_days_to_store': body.get('historic_days_to_store',
                                               current_settings.get('historic_days_to_store')),
            'show_dot_indices': body.get('show_dot_indices',
                                         current_settings.get('show_dot_indices'))
        }

        connection = ConnectionService().get_connection(cluster_name)
        connection.update(index=current_app.config.get('HQ_CLUSTER_SETTINGS')['index_name'],
                          doc_type=current_app.config.get('HQ_CLUSTER_SETTINGS')['doc_type'],
                          id=current_app.config.get('HQ_CLUSTER_SETTINGS')['doc_id'],
                          body={"doc": new_settings}, refresh=True)

        self.get_settings.invalidate(self, cluster_name)  # alter cache

        return new_settings

    def delete_settings(self, cluster_name):
        connection = ConnectionService().get_connection(cluster_name)
        self.get_settings.invalidate(self, cluster_name)  # alter cache
        return connection.indices.delete(index=current_app.config.get('HQ_CLUSTER_SETTINGS')['index_name'])
