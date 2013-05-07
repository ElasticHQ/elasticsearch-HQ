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

$(document).ready(
    function ($) {

        var elasticHQRouter = Backbone.Router.extend({

            routes:{
                "cluster":"cluster",
                "nodes":"nodes",
                "nodes/:nodeId":"nodes",
                "indices":"indices",
                "query":"query",
                "admin":"admin",
                "admin/action":"admin",
                "*actions":"defaultRoute"
            },
            cluster:function () {
                console.log('cluster route');
            },
            nodes:function (nodeId) {
                console.log("route nodeId: " + nodeId);
                var nodeInfo = new NodeInfoModel({nodeId:nodeId, connectionRootURL:cluster.get("connectionRootURL")});

                var nodeInfoView = new NodeInfoView({model:nodeInfo});

                cluster.set({monitorNode:nodeInfo});

                var polloptions = {delay:3000};
                var poller = Backbone.Poller.get(nodeInfo, polloptions);
                poller.start();
                poller.on('success', function (nodeInfo) {
                    console.log('another successful fetch!');
                    nodeInfoView.render();
//                    updateChart();
                    // model is updated, now update graph with data
                });

                /*
                 poller.on('complete', function (nodeInfo) {
                 console.log('hurray! we are done!');
                 });
                 */
                poller.on('error', function (nodeInfo) {
                    console.log('oops! something went wrong');
                });

            },
            defaultRoute:function () {
                console.log('defaultRoute');
            }
        });

        var router = new elasticHQRouter();

        Backbone.history.start();

    });

var updateChart = function () {
    var res = [];
    for (var i = 0; i < 5000; ++i) {
        res.push([i, 34])
    }

    plot.setData([res]);

    // Since the axes don't change, we don't need to call plot.setupGrid()

    plot.draw();
}

var doChart = function () {

    // We use an inline data source in the example, usually data would
    // be fetched from a server

    var data = [],
        totalPoints = 300;

    function getRandomData() {

        if (data.length > 0)
            data = data.slice(1);

        // Do a random walk

        while (data.length < totalPoints) {

            var prev = data.length > 0 ? data[data.length - 1] : 50,
                y = prev + Math.random() * 10 - 5;

            if (y < 0) {
                y = 0;
            } else if (y > 100) {
                y = 100;
            }

            data.push(y);
        }

        // Zip the generated y values with the x values

        var res = [];
        for (var i = 0; i < data.length; ++i) {
            res.push([i, data[i]])
        }

        return res;
    }

    // Set up the control widget

    var updateInterval = 30;
    /*
     $("#updateInterval").val(updateInterval).change(function () {
     var v = $(this).val();
     if (v && !isNaN(+v)) {
     updateInterval = +v;
     if (updateInterval < 1) {
     updateInterval = 1;
     } else if (updateInterval > 2000) {
     updateInterval = 2000;
     }
     $(this).val("" + updateInterval);
     }
     });
     */

    var plot = $.plot("#placeholder", [ getRandomData() ], {
        grid:{
            borderWidth:1,
            minBorderMargin:20,
            labelMargin:10,
            backgroundColor:{
                colors:["#fff", "#e4f4f4"]
            },
            margin:{
                top:8,
                bottom:20,
                left:20
            },
            markings:function (axes) {
                var markings = [];
                var xaxis = axes.xaxis;
                for (var x = Math.floor(xaxis.min); x < xaxis.max; x += xaxis.tickSize * 2) {
                    markings.push({ xaxis:{ from:x, to:x + xaxis.tickSize }, color:"rgba(232, 232, 255, 0.2)" });
                }
                return markings;
            }
        },
        series:{
            shadowSize:0    // Drawing is faster without shadows
        },
        yaxis:{
            show:true,
            min:0,
            max:100
        },
        xaxis:{
            show:true
        },
        legend:{
            show:true,
            container:'legend'
        }
    });

    // Create the demo X and Y axis labels

    /*
     var yaxisLabel = $("<div class='axisLabel yaxisLabel'></div>")
     .text("Response Time (ms)")
     .appendTo($('#placeholder'));
     */

    /*
     function update() {

     plot.setData([getRandomData()]);

     // Since the axes don't change, we don't need to call plot.setupGrid()

     plot.draw();
     setTimeout(update, updateInterval);
     }

     update();

     // Add the Flot version string to the footer

     $("#footer").prepend("Flot " + $.plot.version + " &ndash; ");
     */
};