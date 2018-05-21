import './cluster-nodes-line-graph.style.scss';

import * as d3 from 'd3';
import numeral from 'numeral';
import nearest from 'nearest-date';

class clusterNodesLineGraphController {
    constructor($element, $window, $scope) {
        'ngInject';

        this.$element = $element;
        this.$window = $window;
        this.widthFrom = angular.element($element[0].children[0])[0];

        this.h = 220;
        this.svgContainer = d3.select(angular.element($element[0].querySelector('.chart'))[0])
                            .append('svg').attr('height', this.h);

        //  Tooltip styling in the cluster-nodes-line-graph.style.scss file
        //  Special class give to this tool tip
        this.tooltip = d3.select("body")
                            .append("div")
                            .attr('class', "node-line-graph-tooltip")
                            .style("z-index", "10")
                            .style("visibility", "hidden");

        this.margin = {
            left: 50,
            right: 10,
            top: 10,
            bottom: 20  // Basically Font-Size + Tick Size
        }
                
        this.draw = this.draw.bind(this)
        angular.element($window).on('resize', this.draw);

        $scope.$on('$destroy', () => {
            angular.element($window).off('resize', this.draw);
            this.tooltip.remove();
        });
        
    }

    $onInit() {
        this.paths = this.svgContainer.append('g').attr('class', 'cpu-container')
                                .attr('transform', 'translate(' + this.margin.left + ','+this.margin.top+')')
                                .append('g').attr('class', "paths");
        
        this.axisContainer = this.svgContainer.append('g').attr('class', 'x-axis')
                                .attr('transform', 'translate(' + this.margin.left + ',0)');
        
        this.yAxisContainer = this.svgContainer.append('g').attr('class', 'y-axis')
                                .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        // Attach mouse events to this primary items
        this.mouseG = this.svgContainer.append('g').attr('class', 'mouse-container')
                                .attr('transform', 'translate(' + this.margin.left + ','+this.margin.top+')')
        
        // RECT that will be catching the mouse events
        this.mouseG.append('rect')
                        .attr('fill', 'none')
                        .attr('pointer-events', 'all');

        // this is the black vertical line to follow mouse
        this.mouseG.append("path") 
                        .attr("class", "mouse-line")
                        .style("stroke", "black")
                        .style("stroke-width", "1px")
                        .style("opacity", "0")
   
    }

    $doCheck() {
        if(!angular.equals(this._data, this.data)){
            this._data = JSON.parse(JSON.stringify(this.data));
            // Check if browser is in the background.
            //  If so, stop here, else render updates.
            if (!this.allowRendering) return;
            this.draw()
        }
    }

    draw() {
        if (!this.key) return;
        if (!this._data) return;

        // Minor transformation from key / object to array of objects
        let data = Object.keys(this._data).map((key) => {
            let obj = this._data[key];
            if (!obj.active) return;
            return {
              key: key,
              color: obj.color,
              values: obj.data.map((d) => {
                  return {
                      date: new Date(d.date), // Since we Stringify during cheack, re-init Date
                      value: d[this.key],
                      name: key,
                      color: obj.color
                  }
              })
            }
        }).filter(obj => !!obj);

        // Get the computed styled version
        //  If style coming from outer container, this should be
        //  accessible from the clientWidth, but if styling
        //  happening internally from a class styling applied to the element
        //  itself, then have to wait until all CSS rules have been applied.
        const computed = this.$window.getComputedStyle(this.widthFrom);
        const width = (parseInt(computed.width) - parseInt(computed.paddingLeft) - parseInt(computed.paddingRight));

        const w = this.widthFrom.clientWidth - this.margin.left - this.margin.right;
        const totalHight = this.h;
        const h = (totalHight - this.margin.bottom - this.margin.top);

        this.svgContainer.attr('width', this.widthFrom.clientWidth).attr('height', totalHight);
        this.yAxisContainer.attr('width', this.margin.left).attr('height', h);
        
        this.axisContainer.attr('transform', 'translate(' + this.margin.left + ',' + (h  + this.margin.top )+ ')');

        this.mouseG.select('rect').attr('width', w).attr('height', h);

        let x = d3.scaleTime().range([0, w]),
            y = d3.scaleLinear().range([h, 0]);

        // Defaults so graph does not start with empty Axis's
        let dates = [],
            yDomain;
        if (!data.length) {
            dates = [new Date(new Date() - 500), new Date()];
            yDomain = [0.00, 1.00]
        } else {
            // Shorter than flattening array of dates
            data.map((d) => {return dates = [].concat(dates, d.values.map((dd) => dd.date))});

            yDomain = [
                d3.min(data, function(d) { return d3.min(d.values, function(d) { return d.value; }); }) * 0.95,
                d3.max(data, function(d) { return d3.max(d.values, function(d) { return d.value; }); }) * 1.05
            ];
        }

        // Domains for X and Y
        y.domain(yDomain);
        x.domain(d3.extent(dates));
    
        // Apply the Axis's 
        this.axisContainer.attr('width', w)
                                    .attr('height', this.margin.bottom)
                                    .call(d3.axisBottom(x));

        this.yAxisContainer.call(d3.axisLeft(y)
                                        .tickFormat((d) => numeral(d).format(this.numFormat)));
        
        // What draws the lines
        let line = d3.line()
                    .x(function(d) { return x(d.date); })
                    .y(function(d) { return y(d.value); });


        // Because this is an array where the nested data changes
        //  we utilize the D3 Groups way of updating the nested info.
        let groups = this.svgContainer.selectAll('.data-block').data(data);


        let groupEnter = groups.enter().append('g').attr('class','data-block')
                                                .attr('transform', 'translate(' + this.margin.left + ','+this.margin.top+')');

        groups.exit().remove();
        // Lines
        let paths = groups.merge(groupEnter).selectAll('path').data((d) => [d.values]);

        paths.enter()
                .append('path')
                .attr('class', (d) => `${d[0].name} line`)
                .attr('d', line)
                .attr('stroke', (d) => d[0].color)
                .attr('stroke-width', 1)
                .attr('fill', 'none')
                .attr('pointer-events', 'none')
            .merge(paths)
                .attr('stroke', (d) => d[0].color)
                .attr('d', line)

        paths.exit().remove()

        // Commenting out the circles because they seem a bit much
        //   but without them, it's hard to see what is an entry on the timeline
        // // We draw circles to make it easier to see the actual entries
        // let circles = groups.merge(groupEnter).selectAll('circle').data((d) => d.values);

        // FIXME
        // Should really consider making a shared directive for this.
        let setToolTip = (x,y,str) => {

            // Add the HTML first so we can determine size and placement.
            this.tooltip.html(str);

            let toolTipExtra = this.tooltip.node().getBoundingClientRect(),
                bodyWidth = document.body.clientWidth,
                extraX;

            
            // Place tool tip on either the left or right side
            // of the line.
            if ((x + toolTipExtra.width) > bodyWidth) {
                extraX = (x - toolTipExtra.width) - 10
            } else {
                extraX = x;
            }
            

            // Add some spacing to y so it does not render
            // exactly where the mouse is causing a mouse enter / out loop.
            this.tooltip.style('visibility', 'visible')
                            .style('top', `${y + 10}px`) 
                            .style('left', `${extraX}px`);
        }

        // circles
        //     .enter()
        //         .append('circle')
        //         .attr('r', 2)
        //         .attr('cx', (d) => x(d.date))
        //         .attr('cy', (d, i) => y(d.value))
        //         .attr('fill', (d) => d.color)
        //         .attr('pointer-events', 'none')
        //     .merge(circles)
        //         .transition()
        //         .duration(350)
        //         .attr('cx', (d) => x(d.date))
        //         .attr('cy', (d, i) => y(d.value))
        //         .attr('fill', (d) => d.color)

        // circles.exit().remove();


        // We use flattenData for not only pulling the unique dates
        //  but also on the hover to pull the Matching items for a Date.
        let flattenData = _.flattenDeep(data.map(d => d.values))
        let uniqDates = _.uniqBy(flattenData, 'date').map(d => d.date)

        this.mouseG.on('mousemove', () => {

                        let mouse = d3.mouse(this.mouseG.select('rect').node());
                        let invertedD = x.invert(mouse[0]);
                        let found = nearest(uniqDates, invertedD),
                            date = uniqDates[found];

                        // If mouseover before any data has been loaded, 
                        //   just return.
                        if (x(date) === NaN) return;

                        this.mouseG.select('.mouse-line')
                                .attr("d", () => {
                                    var d = "M" + x(date) + "," + h;
                                    d += " " + x(date) + "," + 0;
                                    return d;
                                })
                                .style("opacity", "1");

                        let str = ''

                        flattenData.filter(d => d.date.getTime() == date.getTime())
                                                    .forEach(itm => {
                                                        str += `<div style="color: ${itm.color}"><div>${itm.name}: </div>` +
                                                                `<div>${numeral(itm.value).format(this.numFormat)}</div></div>`;
                                                    });

                        let { pageX, pageY } = d3.event;
                        setToolTip(pageX, pageY, str);
                        
                    })
                    .on('mouseout', () => {
                        this.mouseG.select('.mouse-line').style('opacity', '0');
                        this.tooltip.style('visibility', 'hidden')
                    })
        
    }
}

export default clusterNodesLineGraphController;
