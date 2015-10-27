/*
 Copyright 2013 Roy Russo

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 Latest Builds: https://github.com/royrusso/elasticsearch-HQ
 */


var visualTemplate = {};

visualTemplate.init = [
    '<div class="span12 center-table">',

    '<div class="span2" style="padding-right: 5px;">',
    '<form>',
    '<div class="accordion" id="queryAccordion">',

    '<a data-toggle="collapse" data-parent="#queryAccordion" href="#collapseVIndices">',
    '<b><i class="icon-expand-alt"></i> Indices</b>',
    '</a>',
    '<div id="collapseVIndices" class="accordion-body collapse in">',
    '<div class="accordion-inner">',

    '<ul class="nav nav-list" id="vcheckboxindices">',
    '<% _.each(indices, function(index) { %>',
    '<li>',
    '<% if (_.contains(indicesArray, index)) { %>',
    '<label><input type="checkbox" name="<%- index %>" style="margin: 0px;" checked> <span><%- index %></span></label>',
    '<% } else { %>',
    '<label><input type="checkbox" name="<%- index %>" style="margin: 0px;"> <span><%- index %></span></label>',
    '<% } %>',
    '</li>',
    '<% }) %>',
    '</ul>',

    '<div class="center-table text-center" style="padding-top: 8px;padding-bottom: 10px;">',
    '<button class="btn btn-success btn-small" type="button" id="filterVizSubmit">Filter <i class="icon-caret-right"></i></button>',
    '</div>',

    '</div>',
    '</div>',


    '<a data-toggle="collapse" data-parent="#queryAccordion" href="#collapseLegend">',
    '<b><i class="icon-expand-alt"></i> Legend</b>',
    '</a>',
    '<div id="collapseLegend" class="accordion-body collapse in">',
    '<div class="accordion-inner">',
    '<ul class="nav nav-list" style="font-size: 13px;">',
    '<li><i class="icon-circle-blank" style="color:blue;font-weight: bold;"></i> Node</li>',
    '<li><i class="icon-circle-blank" style="color:green;font-weight: bold;"></i> Shard</li>',
    '<li><i class="icon-circle-blank" style="color:orange;font-weight: bold;"></i> Index</li>',
    '<li><i class="icon-asterisk" style="color:black;font-weight: bold;font-size: 10px;"></i> Primary</li>',
    '</ul>',

    '<div class="alert alert-info" style="margin-top: 20px;font-size: 12px;">Pan around the diagram using your mouse. Zoom in/out using a scroll wheel.</div>',

    '</div></div>',
    '</form>',
    '</div>',

    '</div>',

    '<div class="span10" id="thechart" style="width: <%- svgwidth-10 %>px; margin: 0 auto;"></div>',
    '</div>'
].join("\n");