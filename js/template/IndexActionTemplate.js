var indexActionTemplate = {};


indexActionTemplate.optimizeAll = [
    '<div class="modal hide fade" id="optimizeallmodal">',
    '<div class="modal-header">',
    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>',
    '<h3>Success!</h3>',
    '</div>',
    '<div class="modal-body">',
    '<p>Response from Server is... </p>',
    '<pre class="prettyprint linenums languague-json">',
    '<%- res %>',
    '</pre>',
    '</div>',
    '<div class="modal-footer">',
    '<a href="#indices" class="btn" data-dismiss="modal">Close</a>',
    '</div>',
    '</div>'
].join("\n");