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

    '<a data-toggle="collapse" data-parent="#queryAccordion" href="#collapseDisplay">',
    '<b><i class="icon-expand-alt"></i> Display</b>',
    '</a>',
    '<div id="collapseDisplay" class="accordion-body collapse">',
    '<div class="accordion-inner" style="padding-left: 0px;">',

    '<div class="nav nav-list" id="collapseDisplay">',
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
    '<div class="pull-right pagination" style="margin: 0px;">',
    '<ul>',
    '<% if (currentPage != 1) { %>',
    '<li><a href="#" id="loadPrev"><i class="icon-double-angle-left"></i> Prev</a></li>',
    '<% } %>',
    '<% if(currentPage != maxPages) { %>',
    '<li><a href="#" id="loadNext">Next <i class="icon-double-angle-right"></i></a></li>',
    '<% } %>',
    '</ul>',
    '</div>',
    '</div>',

    '</div>',

    '<div class="row-fluid">',
    '<div class="span12">',
    '<div class="center-table">',
    '<table class="table table-bordered table-striped table-hover" id="queryResultsTable">',
    '<thead><tr>',
    //'<th></th>',
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
    //'<td><button class="btn"><i class="icon-code" style="font-size: 12px;"></i></button> </td>',
    '<% _.each(columns, function(col) { %>',
    '<td style="font-size: 12px;"><%- hit[col.key] %></td>',
    '<% }); %>',
    '</tr>',
    '<% }); %>',
    '</tbody',
    '</table>',
    '</div>',
    '</div>',
    '</div>'
].join("\n");


