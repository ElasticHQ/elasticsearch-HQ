var indexTemplate = {};


indexTemplate.indexList = [
    '<div class="text-center"><h2>Indices</h2></div>',
    '<div class="span11 center-table">',

    '<div id="toolbar" class="pull-right" style="padding-bottom: 10px;">',
    '<div class="btn-group">',
    '<a href="#optimizeall" class="btn" rel="popRight" data-trigger="hover" data-placement="bottom" data-title="Optimize all Indices" ',
    'data-content="The optimize process basically optimizes the index for faster search operations (and relates to the number of segments a lucene index holds within each shard). The optimize operation allows to reduce the number of segments by merging them."',
    '><i class="icon-rocket"></i> Optimize</a>',
    '<a href="#flushall" class="btn" rel="popRight" data-trigger="hover" data-placement="bottom" data-title="Flush all Indices" ',
    'data-content="The flush process of an index basically frees memory from the index by flushing data to the index storage and clearing the internal transaction log. By default, ElasticSearch uses memory heuristics in order to automatically trigger flush operations as required in order to clear memory.">',
    '<i class="icon-rotate-right"></i> Flush</a>',
    '<a href="#clearcacheall" class="btn" rel="popRight" data-trigger="hover" data-placement="bottom" data-title="Clear all Caches" data-content="Clears the cache on all indices."><i class="icon-eraser"></i> Clear Cache</a>',
    '</div> <!-- btn group -->',
    '</div> <!-- toolbar --> ',
    '<div id="indicesToolbar" class="pull-left" style="padding-bottom: 10px;">',
    //'<div class="btn-group">',
    '<a href="#createindex" class="btn" rel="popRight" data-trigger="hover" data-placement="bottom" data-title="Create Index" data-content="Create a New Index on your cluster."><i class="icon-edit"></i> Create Index</a>',
    //'</div> <!-- btn group -->',
    '</div> <!-- toolbar --> ',

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
    '</div>'

].join("\n");

indexTemplate.indexView = [
    '<div class="text-center"><h2><%- indexName %></h2>',
    '<div class="span11 center-table">',
    '<ul class="nav nav-tabs">',
    '<li><a href="#overview"  class="active" data-toggle="tab" id="indexTab">Overview</a></li>',
    '<li><a href="#metrics" data-toggle="tab">Metrics</a></li>',
    '<li><a href="#shards" data-toggle="tab">Shards</a></li>',
    '<li><a href="#mappings" data-toggle="tab">Mappings</a></li>',
    '<li><a href="#administration" data-toggle="tab">Administration</a></li>',
    '</ul>',
    '<div class="tab-content">',
    '<div class="tab-pane active" id="overview">home</div>',
    '<div class="tab-pane" id="metrics">11</div>',
    '<div class="tab-pane" id="shards">22</div>',
    '<div class="tab-pane" id="mappings">22</div>',

    '<div class="tab-pane" id="administration">',
    '<table class="table table-bordered table-striped">',
    '<tr><td><a href="#flushindex/<%- indexId %>" class="btn" style="white-space: nowrap;">Flush Index</a></td><td>The flush process of an index frees memory from the index by flushing data to the index storage and clearing the internal transaction log. By default, ElasticSearch uses memory heuristics in order to automatically trigger flush operations as required in order to clear memory.</td></tr>',
    '<tr><td><a href="#clearcacheindex/<%- indexId %>" class="btn" style="white-space: nowrap;">Clear Cache</a></td><td>Clears the cache on all indices.</td></tr>',
    '<tr><td><a href="#optimizeindex/<%- indexId %>" class="btn" style="white-space: nowrap;">Optimize Index</a></td><td>The optimize process basically optimizes the index for faster search operations (and relates to the number of segments a lucene index holds within each shard). The optimize operation allows to reduce the number of segments by merging them.</td></tr>',
    '<tr><td><a href="#refreshindex/<%- indexId %>" class="btn" style="white-space: nowrap;">Refresh Index</a></td><td>Refresh the index, making all operations performed since the last refresh available for search. The (near) real-time capabilities depend on the index engine used. For example, the robin one requires refresh to be called, but by default a refresh is scheduled periodically.</td></tr>',
    '<tr><td><a href="#deleteindex/<%- indexId %>" class="btn btn-danger" style="white-space: nowrap;">Delete Index</a></td><td><strong>WARNING! This action cannot be undone. You will destroy this index and all documents associated with this, by clicking this button.</strong></td></tr>',
    '</table>',
    '</div>',

    '</div>',
    '</div></div>'
].join("\n");