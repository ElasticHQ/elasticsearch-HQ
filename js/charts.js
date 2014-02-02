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
var chart = {
    addData:function (data, primeXY, newXY) {
        if (data === undefined) {
            data = [primeXY];
        }
        else {
            if (data.length > 5) {
                data.shift(); // remove first item
            }
        }
        return data;
        /*
         data.push(newXY);
         return data;*/
    },
    draw:function (id, data, options) {
        return $.plot($(id), [
            {data:data,
                points:{
                    fill:1,
                    fillColor:false,
                    radius:2,
                    show:true
                },
                lines:{
                    show:true,
                    fill:false,
                    //fillColor:"#c0d0f0",
                    lineWidth:3
                },
                curvedLines:{apply:true},
                shadowSize:1}
        ], options);
    }
};

chart.ts_xaxis =
{
    mode:"time", localTimezone:true,
    timeformat:"%h:%M:%S",
    tickFormatter:function (v, axis) {
        var date = new Date(v);

        if (date.getSeconds() % 10 === 0) {
            var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
            var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
            var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

            return hours + ":" + minutes + ":" + seconds;
        } else {
            return "";
        }
    }
};

chart.jvmHeap = {
    options:function () {
        return {
            series:{
                /*curvedLines:{
                 active:true
                 },*/
                color:"#2f8bfa"
            },
            tooltip:true,
            grid:{
                show:true,
                hoverable:true,
                autoHighlight:true,
                mouseActiveRadius:30,
                backgroundColor:{ colors:[ "#fff", "#eee" ] },
                borderWidth:1,
                borderColor:'#CCCCCC'
            },
            xaxis:chart.ts_xaxis,
            yaxis:{
                //tickSize:50
            },
            tooltipOpts:{
                //content: "'%s' of %x.1 is %y.4",
                content:"%yMB",
                shifts:{
                    x:-60,
                    y:25
                }
            }

        };
    }
};
chart.indices = {
    options:function () {
        return {
            series:{
                /*curvedLines:{
                 active:true
                 },*/
                color:"#2f8bfa"
            },
            tooltip:true,
            grid:{
                show:true,
                hoverable:true,
                autoHighlight:true,
                mouseActiveRadius:30,
                backgroundColor:{ colors:[ "#fff", "#eee" ] },
                borderWidth:1,
                borderColor:'#CCCCCC'
            },
            xaxis:chart.ts_xaxis,
            yaxis:{
                min:0
                //tickSize:20
            },
            tooltipOpts:{
                //content: "'%s' of %x.1 is %y.4",
                content:"%y",
                shifts:{
                    x:-60,
                    y:25
                }
            }
        };
    }
};

chart.cpu = {
    options:function () {
        return {
            series:{
                /* curvedLines:{
                 active:true
                 },*/
                color:"#2f8bfa"
            },
            tooltip:true,
            grid:{
                show:true,
                hoverable:true,
                autoHighlight:true,
                mouseActiveRadius:30,
                backgroundColor:{ colors:[ "#fff", "#eee" ] },
                borderWidth:1,
                borderColor:'#CCCCCC'
            },
            xaxis:chart.ts_xaxis,
            yaxis:{
                min:0,
                max:100,
                tickSize:20
            },
            tooltipOpts:{
                //content: "'%s' of %x.1 is %y.4",
                content:"%y%",
                shifts:{
                    x:-60,
                    y:25
                }
            }
        };
    }
};

chart.mem = {
    options:function (max) {
        return {
            series:{
                /* curvedLines:{
                 active:true
                 },*/
                color:"#2f8bfa"
            },
            tooltip:true,
            grid:{
                show:true,
                hoverable:true,
                autoHighlight:true,
                mouseActiveRadius:30,
                backgroundColor:{ colors:[ "#fff", "#eee" ] },
                borderWidth:1,
                borderColor:'#CCCCCC'
            },
            xaxis:chart.ts_xaxis,
            yaxis:{
                min:0,
                max:max,
                tickSize:2
            },
            tooltipOpts:{
                //content: "'%s' of %x.1 is %y.4",
                content:"%yGB",
                shifts:{
                    x:-60,
                    y:25
                }
            }
        };
    }
};
chart.procscpu = {
    options:function (max) {
        return {
            series:{
                /*  curvedLines:{
                 active:true
                 },*/
                color:"#2f8bfa"
            },
            tooltip:true,
            grid:{
                show:true,
                hoverable:true,
                autoHighlight:true,
                mouseActiveRadius:30,
                backgroundColor:{ colors:[ "#fff", "#eee" ] },
                borderWidth:1,
                borderColor:'#CCCCCC'
            },
            xaxis:chart.ts_xaxis,
            yaxis:{
                min:0,
                max:max,
                tickSize:100
            },
            tooltipOpts:{
                //content: "'%s' of %x.1 is %y.4",
                content:"%y%",
                shifts:{
                    x:-60,
                    y:25
                }
            }
        };
    }
};

chart.procmem = {
    options:function (max) {
        return {
            series:{
                /*  curvedLines:{
                 active:true
                 },*/
                color:"#2f8bfa"
            },
            tooltip:true,
            grid:{
                show:true,
                hoverable:true,
                autoHighlight:true,
                mouseActiveRadius:30,
                backgroundColor:{ colors:[ "#fff", "#eee" ] },
                borderWidth:1,
                borderColor:'#CCCCCC'
            },
            xaxis:chart.ts_xaxis,
            yaxis:{
                min:0,
                max:max,
                tickSize:0.5
            },
            tooltipOpts:{
                //content: "'%s' of %x.1 is %y.4",
                content:"%y",
                shifts:{
                    x:-60,
                    y:25
                }
            }
        };
    }
};


chart.fsreads = {
    options:function () {
        return {
            series:{
                /*  curvedLines:{
                 active:true
                 },*/
                color:"#2f8bfa"
            },
            tooltip:true,
            grid:{
                show:true,
                hoverable:true,
                autoHighlight:true,
                mouseActiveRadius:30,
                backgroundColor:{ colors:[ "#fff", "#eee" ] },
                borderWidth:1,
                borderColor:'#CCCCCC'
            },
            xaxis:chart.ts_xaxis,
            yaxis:{
                min:0
            },
            tooltipOpts:{
                //content: "'%s' of %x.1 is %y.4",
                content:"%y",
                shifts:{
                    x:-60,
                    y:25
                }
            }
        };
    }
};
chart.fswrites = {
    options:function () {
        return {
            series:{
                /*curvedLines:{
                 active:true
                 },*/
                color:"#2f8bfa"
            },
            tooltip:true,
            grid:{
                show:true,
                hoverable:true,
                autoHighlight:true,
                mouseActiveRadius:30,
                backgroundColor:{ colors:[ "#fff", "#eee" ] },
                borderWidth:1,
                borderColor:'#CCCCCC'
            },
            xaxis:chart.ts_xaxis,
            yaxis:{
                min:0
            },
            tooltipOpts:{
                //content: "'%s' of %x.1 is %y.4",
                content:"%y",
                shifts:{
                    x:-60,
                    y:25
                }
            }
        };
    }
};

chart.transporttxcount = {
    options:function () {
        return {
            series:{
                /*   curvedLines:{
                 active:true
                 },*/
                color:"#2f8bfa"
            },
            tooltip:true,
            grid:{
                show:true,
                hoverable:true,
                autoHighlight:true,
                mouseActiveRadius:30,
                backgroundColor:{ colors:[ "#fff", "#eee" ] },
                borderWidth:1,
                borderColor:'#CCCCCC'
            },
            xaxis:chart.ts_xaxis,
            yaxis:{
                min:0
            },
            tooltipOpts:{
                //content: "'%s' of %x.1 is %y.4",
                content:"%y",
                shifts:{
                    x:-60,
                    y:25
                }
            }
        };
    }
};


chart.httpopen = {
    options:function () {
        return {
            series:{
                /*    curvedLines:{
                 active:true
                 },*/
                color:"#2f8bfa"
            },
            tooltip:true,
            grid:{
                show:true,
                hoverable:true,
                autoHighlight:true,
                mouseActiveRadius:30,
                backgroundColor:{ colors:[ "#fff", "#eee" ] },
                borderWidth:1,
                borderColor:'#CCCCCC'
            },
            xaxis:chart.ts_xaxis,
            yaxis:{
                min:0
            },
            tooltipOpts:{
                //content: "'%s' of %x.1 is %y.4",
                content:"%y",
                shifts:{
                    x:-60,
                    y:25
                }
            }
        };
    }
};
chart.threadindex = {
    options:function () {
        return {
            series:{
                /*   curvedLines:{
                 active:true
                 },*/
                color:"#2f8bfa"
            },
            tooltip:true,
            grid:{
                show:true,
                hoverable:true,
                autoHighlight:true,
                mouseActiveRadius:30,
                backgroundColor:{ colors:[ "#fff", "#eee" ] },
                borderWidth:1,
                borderColor:'#CCCCCC'
            },
            xaxis:chart.ts_xaxis,
            yaxis:{
                min:0
            },
            tooltipOpts:{
                //content: "'%s' of %x.1 is %y.4",
                content:"%y",
                shifts:{
                    x:-60,
                    y:25
                }
            }
        };
    }
};
chart.threadsearch = {
    options:function () {
        return {
            series:{
                /*  curvedLines:{
                 active:true
                 },*/
                color:"#2f8bfa"
            },
            tooltip:true,
            grid:{
                show:true,
                hoverable:true,
                autoHighlight:true,
                mouseActiveRadius:30,
                backgroundColor:{ colors:[ "#fff", "#eee" ] },
                borderWidth:1,
                borderColor:'#CCCCCC'
            },
            xaxis:chart.ts_xaxis,
            yaxis:{
                min:0
            },
            tooltipOpts:{
                //content: "'%s' of %x.1 is %y.4",
                content:"%y",
                shifts:{
                    x:-60,
                    y:25
                }
            }
        };
    }
};
