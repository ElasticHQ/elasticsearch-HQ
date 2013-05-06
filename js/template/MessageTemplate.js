var messageTemplate = {};

messageTemplate.error = [
    '<div class="alert alert-error">',
    '<button type="button" class="close" data-dismiss="alert">&times;</button>',
    '<h4><%- warningTitle %></h4>',
    '<%- warningMessage %>',
    '</div>'
].join("\n");