var indexTemplate = {};


indexTemplate.indexList = [
    '<div class="text-center"><h2>Indices</h2>',
    '<div class="span8 center-table">',
    '<table class="table table-bordered table-striped table-hover" id="indicesTable">',
    '<thead>',
    '<tr><th>Index</th><th># Docs</th><th>Primary Size</th><th># Shards</th><th># Replicas</th><th>Status</th></tr>',
    '</thead>',
    '<tbody>',
    '<% _.each(indices, function(index) { %>',
    '<tr><td><a href="#index/<%- index.id %>"  rel="tipRight" data-placement="bottom" data-title="Index Information">',
    '<%- index.name %></a></td><td><%- index.docs.num_docs %></td><td><%- index.index.primary_size %></td><td><%- index.numshards %></td><td><%- index.numreplicas %></td><td><%- index.status %></td></tr>',
    '<% }); %>',
    '</tbody>',
    '</table>',
    '</div></div>'
].join("\n");

indexTemplate.indexView = [
    '<div class="text-center"><h2>Some Index Name</h2>',
    '<div class="span9 center-table">',
    '<ul class="nav nav-tabs">',
    '<li><a href="#home"  class="active" data-toggle="tab" id="indexTab">Home</a></li>',
    '<li><a href="#home1" data-toggle="tab">Home1</a></li>',
    '<li><a href="#home2" data-toggle="tab">Home2</a></li>',
    '</ul>',
    '<div class="tab-content">',
    '<div class="tab-pane active" id="home">home</div>',
    '<div class="tab-pane" id="home1">11</div>',
    '<div class="tab-pane" id="home2">22</div>',
    /*    '<div class="tab-pane" id="profile">...</div>',
     '<div class="tab-pane" id="messages">...</div>',
     '<div class="tab-pane" id="settings">...</div>',*/
    '</div>',
    '</div></div>'
].join("\n");