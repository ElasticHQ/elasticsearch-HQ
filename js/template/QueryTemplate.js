var queryTemplate = {};

queryTemplate.sideNav = [
    '<div id="queryError-loc"></div>',
    '<form>',

    '<input type="text" placeholder="Search Query..." name="queryString" class="span12" id="queryString">',
    '<hr/>',
    '<div class="accordion" id="accordion2">',

    '<a data-toggle="collapse" data-parent="#accordion2" href="#collapseOne">',
    '<b><i class="icon-expand-alt"></i> Indices</b>',
    '</a>',
    '<div id="collapseOne" class="accordion-body collapse in">',
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

    '</div>',

    '<hr/>',

    '<button class="btn btn-success pull-right" type="button" id="querySubmit"><b>Search <i class="icon-caret-right"></i></b></button>',

    '</form>'
].join("\n");


queryTemplate.view = [
    '<div class="span2 sidebar-nav well">',
    queryTemplate.sideNav,
    '</div>',
    '<div class="span10">',

    '<div id="searchResults"><h2>Query UI</h2>',
    '<p>Use the options on the left-hand menu to query your indices.</p>',
    '</div>',

    '</div>'
].join("\n");

queryTemplate.results = [

    '<div class="alert alert-info">',
    '<h4>Warning!</h4>',
    'The Query UI is still experimental and is not in a finished state!',
    '</div>',

    '<div class="pull-left muted"><small><%- results.totalHits %> Hits returned in <%- results.responseTime %>ms</small></div>',
    '<div class="center-table">',
    '<table class="table table-bordered table-striped table-hover" id="resultsTable">',
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
    '</div>'
].join("\n");
