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


nodeTemplate.nodeInfo = [
    '<div class="text-center"><span style="font-size: 28px;padding:20px 0 3px 0;"><%- nodeName %></span><br/>',
    '<small><%- address %> on <%- hostName %></small></div>',

    '<div class="lead text-left"><i class="icon-th-large"></i> JVM</div>',
    '<div class="row-fluid">',
    'JVM Heap Used: <%- jvmStats.mem.heap_used %>',
    '<div class="text-center"><strong>Heap Memory</strong>',
    '<div class="chart-container text-center">',
    '<div id="placeholder" class="chart-placeholder"></div>',
    '<div id="legend"></div>',
    '</div>',
    '</div>',

    '</div> <!-- end row -->',

    '<div class="lead text-left"><i class="icon-th-large"></i> Indices</div>',


    '<div class="lead text-left"><i class="icon-th-large"></i> OS</div>',


    '<div class="lead text-left"><i class="icon-th-large"></i> Process</div>',


    '<div class="lead text-left"><i class="icon-th-large"></i> JVM</div>',
    '<div class="lead text-left"><i class="icon-th-large"></i> Threads</div>',
    '<div class="lead text-left"><i class="icon-th-large"></i> Network</div>',
    '<div class="lead text-left"><i class="icon-th-large"></i> File System</div>',


].join("\n");