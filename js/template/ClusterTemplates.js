var clusterTemplate = {};

clusterTemplate.Health = [
    '<a class="btn btn-<%- statusClass %> btn-large" rel="popRight" data-trigger="hover"',
    'data-content="Status: <span style=\'font-weight: bold; color: <%- status %>\'><%- status %></span>" data-html="true"',
    'href="#clusterHealthModal" data-title="Click for Cluster Information" role="button"',
    'data-toggle="modal">',
    '<i class="icon-info-sign"></i> <%- cluster_name %></a>'
].join("\n");

