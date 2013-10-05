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


var VisualView = Backbone.View.extend(
    {
        render:function () {

            var realWidth = window.innerWidth;
            var realHeight = window.innerHeight;
            var m = [40, 240, 40, 240],
                w = realWidth - m[1] - m[3],
                h = realHeight - m[0] - m[2],
                i = 0,
                root;

            var tpl = _.template(visualTemplate.init);
            $('#workspace').html(tpl(
                {
                    svgwidth: w
                }));

            var jsontree = {};
            // clustername

            // add nodes

            // add shards to nodes

            // add indices to shards


            var tree = d3.layout.tree()
                .size([h, w]);

            var diagonal = d3.svg.diagonal()
                .projection(function (d) {
                    return [d.y, d.x];
                });

            var vis = d3.select("#thechart").append("svg:svg")
                .attr("class","svg_container")
                .attr("width", w)
                .attr("height", h)
                .style("overflow", "scroll")
                .style("margin", "0 auto")
                .style("background-color","#F4F4F4")
                .style("border","1px solid #CCCCCC")
                .append("svg:g")
                .attr("class","drawarea")
                .append("svg:g")
                .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

/*
                .attr("width", w + m[1] + m[3])
                .attr("height", h + m[0] + m[2])
                .append("svg:g")
                .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
*/

            d3.json("flare.json", function (json) {
                root = json;
                root.x0 = h / 2;
                root.y0 = 0;

                function toggleAll(d) {
                    if (d.children) {
                        d.children.forEach(toggleAll);
                        toggle(d);
                    }
                }

                // Initialize the display to show a few nodes.
                root.children.forEach(toggleAll);
                /*
                 toggle(root.children[1]);
                 toggle(root.children[1].children[2]);
                 toggle(root.children[9]);
                 toggle(root.children[9].children[0]);*/


                update(root);
            });

            function update(source) {
                var duration = d3.event && d3.event.altKey ? 5000 : 500;

                // Compute the new tree layout.
                var nodes = tree.nodes(root).reverse();

                // Normalize for fixed-depth.
                nodes.forEach(function (d) {
                    d.y = d.depth * 180;
                });

                // Update the nodes…
                var node = vis.selectAll("g.node")
                    .data(nodes, function (d) {
                        return d.id || (d.id = ++i);
                    });

                // Enter any new nodes at the parent's previous position.
                var nodeEnter = node.enter().append("svg:g")
                    .attr("class", "node")
                    .attr("transform", function (d) {
                        return "translate(" + source.y0 + "," + source.x0 + ")";
                    })
                    .on("click", function (d) {
                        toggle(d);
                        update(d);
                    });

                /*
                 nodeEnter.append("svg:circle")
                 .attr("r", 1e-6)
                 .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; })
                 .style("stroke", function(d) { return d.type === "shard" ? "red" : ""; });
                 */
                //.style("fill", function(d) { return d.type == 'shard' ? "red" : "#CCC"; });

                nodeEnter.append("svg:text")
                    .attr("x", function (d) {
                        return d.children || d._children ? -10 : 10;
                    })
                    .attr("dy", ".35em")
                    .attr("text-anchor", function (d) {
                        return d.children || d._children ? "end" : "start";
                    })
                    .text(function (d) {
                        return d.name;
                    })
                    .style("fill-opacity", 1e-6);

                node.append("image")
                    .attr("xlink:href", "https://github.com/favicon.ico")
                    .attr("x", -8)
                    .attr("y", -8)
                    .attr("width", 16)
                    .attr("height", 16);

                // Transition nodes to their new position.
                var nodeUpdate = node.transition()
                    .duration(duration)
                    .attr("transform", function (d) {
                        return "translate(" + d.y + "," + d.x + ")";
                    });

                nodeUpdate.select("circle")
                    .attr("r", 4.5)
                    .style("fill", function (d) {
                        return d._children ? "lightsteelblue" : "#fff";
                    });

                nodeUpdate.select("text")
                    .style("fill-opacity", 1);

                // Transition exiting nodes to the parent's new position.
                var nodeExit = node.exit().transition()
                    .duration(duration)
                    .attr("transform", function (d) {
                        return "translate(" + source.y + "," + source.x + ")";
                    })
                    .remove();

                nodeExit.select("circle")
                    .attr("r", 1e-6);

                nodeExit.select("text")
                    .style("fill-opacity", 1e-6);

                // Update the links…
                var link = vis.selectAll("path.link")
                    .data(tree.links(nodes), function (d) {
                        return d.target.id;
                    });

                // Enter any new links at the parent's previous position.
                link.enter().insert("svg:path", "g")
                    .attr("class", "link")
                    .attr("d", function (d) {
                        var o = {x:source.x0, y:source.y0};
                        return diagonal({source:o, target:o});
                    })
                    .transition()
                    .duration(duration)
                    .attr("d", diagonal);

                // Transition links to their new position.
                link.transition()
                    .duration(duration)
                    .attr("d", diagonal);

                // Transition exiting nodes to the parent's new position.
                link.exit().transition()
                    .duration(duration)
                    .attr("d", function (d) {
                        var o = {x:source.x, y:source.y};
                        return diagonal({source:o, target:o});
                    })
                    .remove();

                // Stash the old positions for transition.
                nodes.forEach(function (d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });

                d3.select("svg")
                    .call(d3.behavior.zoom()
                    .scaleExtent([0.5, 5])
                    .on("zoom", zoom));
            }

// Toggle children.
            function toggle(d) {
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else {
                    d.children = d._children;
                    d._children = null;
                }
            }

            function zoom() {
                var scale = d3.event.scale,
                    translation = d3.event.translate,
                    tbound = -h * scale,
                    bbound = h * scale,
                    lbound = (-w + m[1]) * scale,
                    rbound = (w - m[3]) * scale;
                // limit translation to thresholds
                translation = [
                    Math.max(Math.min(translation[0], rbound), lbound),
                    Math.max(Math.min(translation[1], bbound), tbound)
                ];
                d3.select(".drawarea")
                    .attr("transform", "translate(" + translation + ")" +
                    " scale(" + scale + ")");
            }


            return this;
        }
    }
);