var queryTemplate = {};

queryTemplate.sideNav = [
    '<div id="queryError-loc"></div>',
    '<form>',

    '<input type="text" placeholder="Search Query..." name="queryString" class="span12" id="queryString">',
    '<hr/>',
    '<div class="accordion" id="queryAccordion">',

    '<a data-toggle="collapse" data-parent="#queryAccordion" href="#collapseIndices">',
    '<b><i class="icon-expand-alt"></i> Indices</b>',
    '</a>',
    '<a href="#toggleIndex" id="toggleIndex" class="pull-right checked">',
    '<b><i class="icon-check"></i> Toggle</b>',
    '</a>',
    '<div id="collapseIndices" class="accordion-body collapse in">',
    '<div class="accordion-inner">',

    '<ul class="nav nav-list" id="checkboxindices">',
    '<% _.each(indices, function(index) { %>',
    '<li>',
    '<label><input type="checkbox" name="<%- index %>" style="margin: 0px;" checked> <span><%- index %></span></label>',
    '</li>',
    '<% }) %>',
    '</ul>',

    '</div>',
    '</div>',

    '<a data-toggle="collapse" data-parent="#queryAccordion" href="#collapseFields">',
    '<b><i class="icon-expand-alt"></i> Fields</b>',
    '</a>',
    '<a href="#toggleFields" id="toggleFields" class="pull-right checked">',
    '<b><i class="icon-check"></i> Toggle</b>',
    '</a>',
    '<div id="collapseFields" class="accordion-body collapse in">',
    '<div class="accordion-inner">',

    '<ul class="nav nav-list" id="checkboxfields">',
    '<% _.each(fields, function(field) { %>',
    '<li>',
    '<label><input type="checkbox" name="<%- field %>" style="margin: 0px;" checked> <span><%- field %></span></label>',
    '</li>',
    '<% }) %>',
    '</ul>',

    '</div>',
    '</div>',

    '<a data-toggle="collapse" data-parent="#queryAccordion" href="#collapseSort">',
    '<b><i class="icon-expand-alt"></i> Sort By</b>',
    '</a>',
    '<div id="collapseSort" class="accordion-body collapse in">',
    '<div class="accordion-inner" style="padding-left: 0px;">',

    '<div id="collapseSort" style="padding-left: 0px;">',
    '<select id="sortBy" class="span12 selectpicker" data-container="body">',
    '<% _.each(types, function(type) { %>',
    '<option><%- type %></option>',
    '<% }) %>',
    '</select>',
    '<select id="sortDir" class="span12 selectpicker" data-container="body">',
    '<option data-icon="icon-chevron-sign-up">Ascending</option>',
    '<option data-icon="icon-chevron-sign-down">Descending</option>',
    '</select>',
    '</div>',

    '</div>',
    '</div>',


    '<a data-toggle="collapse" data-parent="#queryAccordion" href="#collapseDisplay">',
    '<b><i class="icon-expand-alt"></i> Display</b>',
    '</a>',
    '<div id="collapseDisplay" class="accordion-body collapse in">',
    '<div class="accordion-inner" style="padding-left: 0px;">',

    '<div  style="padding-left: 0px;">',
    '<div class="controls form-inline">',
    '<label class="control-label">Per Page</label>',
    '<select id="perPage" class="span6">',
    '<option>50</option>',
    '<option>100</option>',
    '<option>500</option>',
    '<option>1000</option>',
    '</select>',
    '</div>',
    '</div>',

    '</div>',
    '</div>',


    '</div>',

    '<hr/>',

    '<button class="btn btn-success pull-right" type="button" id="querySubmit"><b>Search <i class="icon-caret-right"></i></b></button>',

    '</form>'
].join("\n");

queryTemplate.view = [

    '<div class="span2 sidebar-nav well">',
    queryTemplate.sideNav,
    '</div>',

    '<div class="span10" id="searchResults">',
    '<h2>Query UI</h2>',
    '<p>Use the options on the left-hand menu to query your indices.</p>',
    '</div>'

].join("\n");

queryTemplate.results = [

    '<div class="row-fluid">',

    '<div class="span6">',
    '<div class="pull-left muted"><small><%- results.totalHits %> results in <%- results.responseTime %>ms<br/>',
    'Page <%- currentPage %> of <%- maxPages %>. Showing <%- pageSize %> Per Page.</small>',
    '</div>',
    '</div>',

    '<div class="span6">',
    '<div class="pull-right">',

    '<% if (currentPage != 1) { %>',
    '<a href="#" id="loadPrev" class="btn btn-success"><i class="icon-double-angle-left"></i> Prev</a>',
    '<% } %>',
    '<% if(currentPage != maxPages) { %>',
    '<a href="#" id="loadNext" class="btn btn-success">Next <i class="icon-double-angle-right"></i></a>',
    '<% } %>',
    '<a href="#queryJSONRequestModal" id="queryRequest" class="btn" rel="tipRight" data-title="View JSON Request." data-toggle="modal" role="button" ><i class="icon-upload"></i></a>',
    '<a href="#queryJSONResponseModal" id="queryResponse" class="btn"  rel="tipRight" data-title="View JSON Response." data-toggle="modal" role="button" ><i class="icon-download"></i></a>',

    '</div>',
    '</div>',

    '</div>',

    '<div class="row-fluid">',
    '<div class="span12">',
    '<div class="center-table">',
    '<table class="table table-bordered table-striped table-hover" id="queryResultsTable">',
    '<thead><tr>',
    '<th></th>',
    '<% _.each(columns, function(col) { %>',
    '<% if (col.type == "source" )  { %> <th style="color: green"> ',
    '<% } else { %> <th> <% } %>',
    '<span style="font-size: 13px;"><%- col.name %></span></th>',
    '<% }); %>',
    '</tr>',
    '</thead>',
    '<tbody>',
    '<% _.each(results.results, function(hit, key) { %>',
    '<tr>',
    '<td><a href="#itemJSONReponseModal"  data-toggle="modal" role="button" data-id="<%- key %>"class="btn btn-mini itemjsoncl" rel="tipRight" data-title="View JSON Data"><i class="icon-code" style="font-size: 12px;"></i></a></td>',
    '<% _.each(columns, function(col) { %>',
    '<td style="font-size: 12px;"><%- hit[col.key] %></td>',
    '<% }); %>',
    '</tr>',
    '<% }); %>',
    '</tbody',
    '</table>',
    '</div>',
    '</div>',
    '</div>',

    '<div class="modal hide fade large" id="itemJSONReponseModal">',
    '<div class="modal-header">',
    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>',
    '<h3>JSON Response</h3>',
    '</div>',
    '<div class="modal-body">',
    '<pre class="prettyprint language-json">',
    '<div id="itemraw"></div> ',
    '</pre>',
    '</div>',
    '<div class="modal-footer">',
    '<a href="#" class="btn" data-dismiss="modal">Close</a>',
    '</div>',
    '</div>',

    '<div class="modal hide fade large" id="queryJSONResponseModal">',
    '<div class="modal-header">',
    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>',
    '<h3>JSON Response</h3>',
    '</div>',
    '<div class="modal-body">',
    '<pre class="prettyprint language-json">',
    '<%- resultBody %>',
    '</pre>',
    '</div>',
    '<div class="modal-footer">',
    '<a href="#" class="btn" data-dismiss="modal">Close</a>',
    '</div>',
    '</div>',

    '<div class="modal hide fade large" id="queryJSONRequestModal">',
    '<div class="modal-header">',
    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>',
    '<h3>Query Request</h3>',
    '</div>',
    '<div class="modal-body">',
    '<pre class="prettyprint language-json">',
    '<%- requestBody %>',
    '</pre>',
    '</div>',
    '<div class="modal-footer">',
    '<a href="#" class="btn" data-dismiss="modal">Close</a>',
    '</div>',
    '</div>'

].join("\n");