var mappingTemplate = {};


mappingTemplate.mappingList = [
    '<div class="text-center"><h2>Type Mappings</h2></div>',
    '<div class="span11 center-table">',

    /*
     '<div class="pull-left" style="padding-bottom: 10px;">',
     '<a href="#createmapping" class="btn" rel="popRight" data-trigger="hover" data-placement="bottom" data-title="Create Mapping" data-content="Create a New Mapping."><i class="icon-edit"></i> Create Mapping</a>',
     '</div>',
     */

    '<table class="table table-bordered table-striped table-hover" id="indicesTable">',
    '<thead>',
    '<tr><th>Type</th><th>Index</th></tr>',
    '</thead>',
    '<tbody>',
    '<% _.each(maps, function(map) { %>',
    '<tr><td>',
    '<a href="#mappings/<%- map.indexId %>/<%- map.mappingName %>"  rel="tipRight" data-placement="bottom" data-title="Mapping Information"><%- map.mappingName %></a>',
    '</td><td><%- map.indexId %></td></tr>',
    '<% }); %>',
    '</tbody>',
    '</table>',
    '<div class="alert alert-info"><i class="icon-info-sign"></i> Only the basic mapping actions are available here. Power-users are advised to use the <a href="http://www.elasticsearch.org/guide/reference/api/admin-indices-put-mapping/" target="_blank">Mapping API</a> directly and read the <a href="http://www.elasticsearch.org/guide/reference/mapping/" target="_blank">Documentation</a>. </div>',
    '</div>'

].join("\n");

mappingTemplate.mapView = [
    '<div class="text-center"><h2>Index: <%- mapType.indexId %>, Type: <%- mapType.mappingName %></h2></div>',
    '<div class="span11 center-table">',

    '<div class="pull-right" style="padding-bottom: 10px;">',
    '<a href="#deletemappingmodal" data-toggle="modal" role="button" class="btn btn-danger" rel="popRight" data-trigger="hover" data-placement="bottom" data-title="Delete Mapping" data-content="WARNING! This action cannot be undone!"><i class="icon-warning-sign"></i> Delete Mapping</a>',
    '</div> <!-- toolbar --> ',

    '<table class="table table-bordered table-striped table-hover" id="indicesTable">',
    '<thead>',
    '<tr><th>Name</th><th>Type</th><th>Format</th><th>Store?</th></tr>',
    '</thead>',
    '<tbody>',
    '<% _.each(props, function(item, key, list) { %>',
    '<tr><td><%- key %></td>',
    '<td><%- item.type %></td>',
    '<td><%- item.format %></td>',
    '<td><%- item.store %></td></tr>',
    '<% }); %>',
    '</tbody>',
    '</table>',
    '</div>',
    '<div class="modal hide fade" id="deletemappingmodal">',
    '<div class="modal-header">',
    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>',
    '<h3>WARNING!</h3>',
    '</div>',
    '<div class="modal-body">',
    '<p>Are you sure you want to delete this mapping?<br/><br/>This action will delete the mapping and its data!</p>',
    '</div>',
    '<div class="modal-footer">',
    '<a href="#" class="btn" data-dismiss="modal">Close</a>',
    '<a href="#deletemapping/<%- mapType.indexId %>/<%- mapType.mappingName %>" class="btn btn-danger">Delete</a>',
    '</div>',
    '</div>'

].join("\n");

mappingTemplate.createType = [
    '<div class="span8 center-table">',

    '<form class="form-horizontal" id="createIndexForm">',
    '<fieldset>',
    '<div id="legend">',
    '<legend class="">Create Mapping</legend>',
    '</div>',
    '<div class="control-group">',
    '<label class="control-label"  for="indexId">Index ID</label>',
    '<div class="controls">',
    '<select>',
    '</select>',
    /*'<input type="text" id="indexId" name="indexId" placeholder="" class="input-xlarge"  data-error-style="inline">',*/
    '</div>',
    '</div>',

    '<div class="control-group">',
    '<label class="control-label" for="shards">Mapping Type</label>',
    '<div class="controls">',
    '<input type="text" id="shards" name="shards" placeholder="" class="input-xlarge"  data-error-style="inline">',
    '</div>',
    '</div>',

    '<div class="control-group">',
    '<div class="controls">',
    '<button type="submit" class="btn btn-success">Create</button>',
    '<a href="#indices" class="btn">Cancel</a>',
    '</div>',
    '</div>',
    '</fieldset>',
    '</form>',

    '</div>'
].join("\n");