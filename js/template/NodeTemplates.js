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
    '<div class="text-center" style="font-size: 28px;padding:20px 0 20px 0;"><%- nodeName %></div>',
    '<div class="lead"><i class="icon-th-large"></i> Memory</div>',
    'JVM Heap Used: <%- jvmStats.mem.heap_used %>',
    '<div class="chart-container">',
    '<div id="placeholder" class="chart-placeholder"></div>',
    '<div id="legend"></div>',
    '</div>'
].join("\n");