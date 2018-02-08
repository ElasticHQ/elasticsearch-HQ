import json
from urllib import request

from flask import current_app

from elastichq.model import ClusterDTO
from elastichq.service import ClusterService
from ..globals import LOG


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

        clusters = ClusterService().get_clusters()
        schema = ClusterDTO(many=True)
        result = schema.dump(clusters)

        status = {
            "name": "ElasticHQ",
            "installed_version": current_app.config.get('API_VERSION'),
            "current_stable_version": stable_version,
            "tagline": "You know, for Elasticsearch",
            "clusters": result.data
        }
        return status
