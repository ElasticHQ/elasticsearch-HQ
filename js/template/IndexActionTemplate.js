var indexActionTemplate = {};

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