var indexTemplate = {};


indexTemplate.indexList = [
    '<div class="text-center"><h2>Indices</h2>',
    '<div class="span8 center-table">',
    '<table class="table table-bordered table-striped table-hover">',
    '<thead>',
    '<tr><th>Index</th><th># Docs</th><th>Primary Size</th><th># Shards</th><th># Replicas</th></tr>',
    '</thead>',
    '<tbody>',
    '<% _.each(indices, function(index) { %>',
    '<tr><td><%- index.id %></td><td><%- index.docs.num_docs %></td><td><%- index.index.primary_size %></td><td><%- index.numshards %></td><td><%- index.numreplicas %></td></tr>',
    '<% }); %>',
    '<tr class="success"><td></td><td></td><td></td><td></td><td></td></tr>',
    '</tbody>',
    '',
    '',
    '',
    '',
    '',
    '',
    '</table>',
    '</div></div>'
].join("\n");