var nodeTemplate = {};

nodeTemplate.nodeList = [
    '<% _.each(nodes.models, function(node) { %>',
    '<a href="#nodes/<%- node.attributes.id %>" class="btn btn-info" rel="popRight" data-trigger="hover" data-placement="bottom" data-nodeid="<%- node.id %>"',
    'data-content="<b>IP:</b> <%- node.attributes.transport_address %>.<br/><b>ID:</b> <%- node.id %>" data-html="true" data-title="Click for Node Information.">',
    '<% if (node.attributes.master == true) { %>',
    '<i class="icon-bolt"></i> ',
    '<% } %>',
    '<%= node.attributes.name %></a>',
    '<% }); %>'
].join("\n");


nodeTemplate.nodeInfo = ['<div class="pull-right"><small><%- lastUpdateTime %></small></div>',
    '<div class="text-center">',

    '<span style="font-size: 28px;padding:20px 0 3px 0;"><%- nodeName %></span><br/>',
    '<small><%- address %> on <%- hostName %></small></div>',
    /*JVM*/
    '<div class="lead text-left"><i class="icon-th-large"></i> JVM</div>',
    '<div class="row-fluid">',

    '<div class="span4"> ',
    '<div class="text-center">&nbsp;</strong></div>',
    '<table class="table table-condensed table-striped table-bordered">',
    '<tr><td>Heap Used:</td><td><%- jvmStats.mem.heap_used %></td></tr>',
    '<tr><td>Heap Committed:</td><td><%- jvmStats.mem.heap_committed %></td></tr>',
    '<tr><td>Non Heap Used:</td><td><%- jvmStats.mem.non_heap_used %></td></tr>',
    '<tr><td>Non Heap Committed:</td><td><%- jvmStats.mem.non_heap_committed %></td></tr>',
    '<tr><td>JVM Uptime:</td><td><%- jvmStats.uptime %></td></tr>',
    '<tr><td>Thread Count:</td><td><%- jvmStats.threads.count %></td></tr>',
    '<tr><td>Thread Peak Count:</td><td><%- jvmStats.threads.peak_count %></td></tr>',
    '<tr><td>GC Count:</td><td><%- jvmStats.gc.collection_count %></td></tr>',
    '<tr><td>GC Time:</td><td><%- jvmStats.gc.collection_time %></td></tr>',
    '</table>',
    '</div>',

    '<div class="span4">',
    '<div class="text-center"><strong>Heap Memory</strong></div>',
    '<div class="chart-container text-center">',
    '<div id="chart-jvmheap" class="chart-placeholder"></div>',
    '<div id="legend"></div>',
    '</div>',
    '</div>',

    '<div class="span4">',
    '<div class="text-center"><strong>Non Heap Memory</strong></div>',
    '<div class="chart-container text-center">',
    '<div id="chart-jvmnonheap" class="chart-placeholder"></div>',
    '<div id="legend"></div>',
    '</div>',
    '</div>',
    '</div>',

    '</div> <!-- end row -->',

    /*INDICES*/
    '<div class="lead text-left"><i class="icon-th-large"></i> Indices</div>',
    '<div class="row-fluid">',

    '<div class="span4"> ',
    '<div class="text-center">&nbsp;</strong></div>',
    '<table class="table table-condensed table-striped table-bordered">',
    '<tr><td>Documents:</td><td><%- indices.docs.count%></td></tr>',
    '<tr><td>Documents Deleted:</td><td><%- indices.docs.deleted%></td></tr>',
    '<tr><td>Store Size:</td><td><%- indices.store.size %></td></tr>',
    '<tr><td>Index Req Total:</td><td><%- indices.indexing.index_total %></td></tr>',
    '<tr><td>Delete Req Total:</td><td><%- indices.indexing.delete_total %></td></tr>',
    '<tr><td>Get Req Total:</td><td><%- indices.get.total %></td></tr>',
    '<tr><td>Get(Exists) Total:</td><td><%- indices.get.exists_total %></td></tr>',
    '<tr><td>Get(Missing) Total:</td><td><%- indices.get.missing_total %></td></tr>',
    '<tr><td>Query Total:</td><td><%- indices.search.query_total %></td></tr>',
    '<tr><td>Fetch Total:</td><td><%- indices.search.fetch_total %></td></tr>',
    '</table>',
    '</div>',

    '<div class="span4">',
    '<div class="text-center"><strong>Index Requests Total</strong></div>',
    '<div class="chart-container text-center">',
    '<div id="chart-index" class="chart-placeholder"></div>',
    '<div id="legend"></div>',
    '</div>',
    '</div>',

    '<div class="span4">',
    '<div class="text-center"><strong>Get Requests Total</strong></div>',
    '<div class="chart-container text-center">',
    '<div id="chart-indexget" class="chart-placeholder"></div>',
    '<div id="legend"></div>',
    '</div>',
    '</div>',
    '</div>',

    '</div> <!-- end row -->',

    '<div class="lead text-left"><i class="icon-th-large"></i> OS</div>',


    '<div class="lead text-left"><i class="icon-th-large"></i> Process</div>',


    '<div class="lead text-left"><i class="icon-th-large"></i> JVM</div>',
    '<div class="lead text-left"><i class="icon-th-large"></i> Threads</div>',
    '<div class="lead text-left"><i class="icon-th-large"></i> Network</div>',
    '<div class="lead text-left"><i class="icon-th-large"></i> File System</div>',


].join("\n");