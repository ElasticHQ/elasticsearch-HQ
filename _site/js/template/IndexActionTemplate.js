var indexActionTemplate = {};

indexActionTemplate.createIndex = [
    '<div class="span8 center-table">',

    '<form class="form-horizontal" id="createIndexForm">',
    '<fieldset>',
    '<div id="legend">',
    '<legend class="">Create an Index</legend>',
    '</div>',
    '<div class="control-group">',
    '<label class="control-label"  for="indexId">Index ID</label>',
    '<div class="controls">',
    '<input type="text" id="indexId" name="indexId" placeholder="" class="input-xlarge"  data-error-style="inline">',
    '</div>',
    '</div>',

    '<div class="control-group">',
    '<label class="control-label" for="shards"># Shards</label>',
    '<div class="controls">',
    '<input type="text" id="shards" name="shards" placeholder="" class="input-mini"  data-error-style="inline">',
    '</div>',
    '</div>',
    '<div class="control-group">',
    '<label class="control-label" for="replicas"># Replicas</label>',
    '<div class="controls">',
    '<input type="text" id="replicas" name="replicas" placeholder="" class="input-mini"  data-error-style="inline">',
    '</div>',
    '</div>',

    '<div class="control-group">',
    '<div class="controls">',
    '<button type="submit" id="createIndexSubmit" class="btn btn-success">Create</button>',
    '<a href="#indices" class="btn">Cancel</a>',
    '</div>',
    '</div>',
    '</fieldset>',
    '</form>',

    '</div>'
].join("\n");

indexActionTemplate.defaultModal = [
    '<div class="modal hide fade" id="defaultindexmodal">',
    '<div class="modal-header">',
    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>',
    '<h3><%- title %></h3>',
    '</div>',
    '<div class="modal-body">',
    '<p>Response from Server is... </p>',
    '<pre class="prettyprint linenums language-json">',
    '<%- res %>',
    '</pre>',
    '</div>',
    '<div class="modal-footer">',
    '<a href="#" class="btn" data-dismiss="modal">Close</a>',
    '</div>',
    '</div>'
].join("\n");

indexActionTemplate.optimizeAll = [
    '<div class="modal hide fade" id="optimizeallmodal">',
    '<div class="modal-header">',
    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>',
    '<h3>Indices Optimized</h3>',
    '</div>',
    '<div class="modal-body">',
    '<p>Response from Server is... </p>',
    '<pre class="prettyprint linenums language-json">',
    '<%- res %>',
    '</pre>',
    '</div>',
    '<div class="modal-footer">',
    '<a href="#" class="btn" data-dismiss="modal">Close</a>',
    '</div>',
    '</div>'
].join("\n");

indexActionTemplate.flushAll = [
    '<div class="modal hide fade" id="flushallmodal">',
    '<div class="modal-header">',
    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>',
    '<h3>Indices Flushed</h3>',
    '</div>',
    '<div class="modal-body">',
    '<p>Response from Server is... </p>',
    '<pre class="prettyprint linenums language-json">',
    '<%- res %>',
    '</pre>',
    '</div>',
    '<div class="modal-footer">',
    '<a href="#" class="btn" data-dismiss="modal">Close</a>',
    '</div>',
    '</div>'
].join("\n");

indexActionTemplate.clearCacheAll = [
    '<div class="modal hide fade" id="clearcacheallmodal">',
    '<div class="modal-header">',
    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>',
    '<h3>Indices Cache Cleared</h3>',
    '</div>',
    '<div class="modal-body">',
    '<p>Response from Server is... </p>',
    '<pre class="prettyprint linenums language-json">',
    '<%- res %>',
    '</pre>',
    '</div>',
    '<div class="modal-footer">',
    '<a href="#" class="btn" data-dismiss="modal">Close</a>',
    '</div>',
    '</div>'
].join("\n");

indexActionTemplate.createAlias = [
    '<div class="span8 center-table">',

    '<form class="form-horizontal" id="createAliasForm">',
    '<input type="hidden" name="indexId" value="<%- indexId %>">',
    '<fieldset>',
    '<div id="legend">',
    '<legend class="">Create an Alias on Index "<%- indexName %>"</legend>',
    '</div>',
    '<div class="control-group">',
    '<label class="control-label"  for="aliasId">Alias ID</label>',
    '<div class="controls">',
    '<input type="text" id="aliasId" name="aliasId" placeholder="" class="input-xlarge"  data-error-style="inline">',
    '</div>',
    '</div>',

    '<div class="control-group">',
    '<label class="control-label" for="index_routing">Index Routing</label>',
    '<div class="controls">',
    '<input type="text" id="index_routing" name="index_routing" placeholder="" class="input-mini"  data-error-style="inline">',
    '</div>',
    '</div>',
    '<div class="control-group">',
    '<label class="control-label" for="search_routing">Search Routing</label>',
    '<div class="controls">',
    '<input type="text" id="search_routing" name="search_routing" placeholder="" class="input-mini"  data-error-style="inline">',
    '</div>',
    '</div>',

    '<div class="control-group">',
    '<div class="controls">',
    '<button type="submit" id="createAliasSubmit" class="btn btn-success">Create</button>',
    '<a href="#index/<%- indexId %>" class="btn">Cancel</a>',
    '</div>',
    '</div>',
    '</fieldset>',
    '</form>',

    '</div>'
].join("\n");