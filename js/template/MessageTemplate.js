var messageTemplate = {};

messageTemplate.error = [
    '<div class="alert alert-error">',
    '<button type="button" class="close" data-dismiss="alert">&times;</button>',
    '<h4><%- warningTitle %></h4>',
    '<% if (warningMessage != "") { %>',
    '<%- warningMessage %>',
    '<% } %>',
    '</div>'
].join("\n");

messageTemplate.warn = [
    '<div class="alert alert-danger">',
    '<button type="button" class="close" data-dismiss="alert">&times;</button>',
    '<h4><%- warningTitle %></h4>',
    '<%- warningMessage %>',
    '</div>'
].join("\n");

messageTemplate.info = [
    '<div class="alert alert-info">',
    '<button type="button" class="close" data-dismiss="alert">&times;</button>',
    '<h4><%- infoTitle %></h4>',
    '<%- infoMessage %>',
    '</div>'
].join("\n");

messageTemplate.success = [
    '<div class="alert alert-success">',
    '<button type="button" class="close" data-dismiss="alert">&times;</button>',
    '<h4><%- infoTitle %></h4>',
    '<%- infoMessage %>',
    '</div>'
].join("\n");