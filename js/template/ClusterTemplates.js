var clusterTemplate = {};

clusterTemplate.Health = [
    '<a id="clusterHealthButton" class="btn btn-<%- statusClass %> btn-large" rel="popRight" data-trigger="hover"',
    'data-content="Status: <span style=\'font-weight: bold; color: <%- status %>\'><%- status %></span>" data-html="true"',
    'href="#" data-title="Click for Cluster Information" role="button">',
    '<i class="icon-info-sign"></i> <%- cluster_name %></a>'
].join("\n");


