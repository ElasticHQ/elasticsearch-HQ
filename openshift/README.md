# ElasticHQ on OpenShift

In this directory you'll find a ready to use [ElasticHQ](https://github.com/ElasticHQ/elasticsearch-HQ) application to deploy in your OpenShift cluster for internal ElasticSearch Logging monitoring.

## How to use

1. Import all required images to your `logging` namespace. Just make sure that your cluster have access to the docker public registry:

```shell
oc import-image nginx-114-rhel7 --from=registry.access.redhat.com/rhscl/nginx-114-rhel7 -n openshift-logging --confirm
oc import-image elastic-hq-proxy --from=elastichq/elasticsearch-hq -n openshift-logging --confirm
```

Please note that in some OpenShift 3.x installations the logging namespace may vary. Make sure to use the correct one when importing this template. The templates and files in this repository are using the default `openshift-logging` namespace, if you are using a different one make sure to add the parameter `-p LOGGING_NAMESPACE=<your-logging-namespace-name>` and to alter the [NGINX file configuration appropriately](https://github.com/ElasticHQ/elasticsearch-HQ/blob/develop/openshift/proxy/nginx.conf#L41).

2. Clone this repository

```shell
git clone https://github.com/ElasticHQ/elasticsearch-HQ
```

3. Process and create the application inside your `logging` namespace. Your cluster must have access to the GitHub. If not, just import this repository to your internal one and parameterize the template.

```shell
oc project openshift-logging
oc process -f elasticsearch-HQ/openshift/elastic-hq-template.yaml -p LOGGING_NAMESPACE=openshift-logging | oc apply -f -
```

Without GitHub access:

```shell
oc project openshift-logging
oc process -f elasticsearch-HQ/openshift/elastic-hq-template.yaml PROXY_GIT_REPO=<your-repo-url> -p LOGGING_NAMESPACE=openshift-logging | oc apply -f -
```

4. A new build should start, otherwise just run

```shell
oc start-build elastic-hq-proxy
```

5. Now, access the ElasticHQ application using the route created by the template and connect to `http://localhost:8080`. Voilà! You have your internal ElasticSearch Logging monitored by ElasticHQ.

## More information

An article detailing the background info and the motivation behind deploying ElasticHQ on OpenShift using this approach [is published in Medium](https://medium.com/@ricardozanini/how-to-monitor-openshift-elasticsearch-logging-with-elastichq-fe641a6b04e3).
