var clusterTemplate = {};

clusterTemplate.Health = [
    '<a class="btn btn-<%- statusClass %> btn-large" rel="popRight" data-trigger="hover"',
    'data-content="Status: <%- status %>.<br/> Click for Cluster Information." data-html="true"',
    'href="#clusterHealthModal" data-title="" role="button"',
    'data-toggle="modal">',
    '<i class="icon-info-sign"></i> <%- cluster_name %></a>'
].join("\n");

