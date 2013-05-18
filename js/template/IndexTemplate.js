var indexTemplate = {};


indexTemplate.indexList = [
    '<div class="text-center"><h2>Indices</h2>',
    '<div class="span8 center-table">',
    '<table class="table table-bordered table-striped table-hover" id="indicesTable">',
    '<thead>',
    '<tr><th>Index</th><th># Docs</th><th>Primary Size</th><th># Shards</th><th># Replicas</th></tr>',
    '</thead>',
    '<tbody>',
    '<% _.each(indices, function(index) { %>',
    '<tr><td><a href="#index/<%- index.id %>" class="btn btn-info"><%- index.id %></a></td><td><%- index.docs.num_docs %></td><td><%- index.index.primary_size %></td><td><%- index.numshards %></td><td><%- index.numreplicas %></td></tr>',
    '<% }); %>',
    '</tbody>',
    '</table>',
    '</div></div>'
].join("\n");