var clusterTemplate = {};

clusterTemplate.Health = [
    '<a id="clusterHealthButton" class="btn btn-<%- statusClass %> btn-large" rel="popRight" data-trigger="hover"',
    'data-content="Status: <span style=\'font-weight: bold; color: <%- status %>\'><%- status %></span>" data-html="true"',
    'href="#cluster" data-title="Click for Cluster Information" role="button">',
    '<i class="icon-info-sign"></i> <%- cluster_name %></a>'
].join("\n");


clusterTemplate.HealthDescribe = [
    '<div class="text-center"><h2>Cluster Health</h2></div>',
    '<div class="span5 center-table">',
    '<table class="table table-striped table-hover table-bordered  center-table">',
    '<tr>',
    '<td>Status</td>',
    '<td><span style="color:<%- status %>"><i class="icon-circle icon-large"></i></span></td>',
    '</tr>',
    '<tr>',
    '<td>Timed Out?</td>',
    '<td><%- timed_out %></td>',
    '</tr>',
    '<tr>',
    '<td># Nodes</td>',
    '<td><%-number_of_nodes %></td>',
    '</tr>',
    '<tr>',
    '<td># Data Nodes</td>',
    '<td><%-number_of_data_nodes %></td>',
    '</tr>',
    '<tr>',
    '<td>Active Primary Shards</td>',
    '<td><%-active_primary_shards %></td>',
    '</tr>',
    '<tr>',
    '<td>Active Shards</td>',
    '<td><%- active_shards%></td>',
    '</tr>',
    '<tr>',
    '<td>Reloacting Shards</td>',
    '<td><%- relocating_shards%></td>',
    '</tr>',
    '<tr>',
    '<td>Initializing Shards</td>',
    '<td><%- initializing_shards%></td>',
    '</tr>',
    '<tr>',
    '<td>Unassigned Shards</td>',
    '<td><%- unassigned_shards%></td>',
    '</tr>',
    '</table>',
    '</div>'
].join("\n");
