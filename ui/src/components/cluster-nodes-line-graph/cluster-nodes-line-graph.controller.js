import './cluster-nodes-line-graph.style.scss';

import * as d3 from 'd3';
import numeral from 'numeral';

class clusterNodesLineGraphController {
    constructor($element, $window, $scope) {
        'ngInject';

        this.$element = $element;
        this.$window = $window;
        this.widthFrom = angular.element($element[0].children[0])[0];

        this.h = 220;
        this.svgContainer = d3.select(angular.element($element[0].querySelector('.chart'))[0])
                            .append('svg').attr('height', this.h);


        this.tooltip = d3.select("body")
                            .append("div")
                            .style("position", "absolute")
                            .style("z-index", "10")
                            .style("padding-top", "5px")
                            .style("padding-bottom", "5px")
                            .style("padding-left", "10px")
                            .style("padding-right", "10px")
                            .style("background", "#2d2d2d")
                            .style("color", "#eee")
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
   
    }

    $doCheck() {
        // console.log('---- checkint: ', this.data)
        // console.log('---- aginst: ', this._data)
        if(!angular.equals(this._data, this.data)){
            this._data = JSON.parse(JSON.stringify(this.data));
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
            .merge(paths)
                .attr('stroke', (d) => d[0].color)
                .attr('d', line)

        paths.exit().remove()

        // We draw circles to make it easier to see the actual entries
        let circles = groups.merge(groupEnter).selectAll('circle').data((d) => d.values);

        let setToolTip = (x,y,d) => {
            // TBD
            // What information is valuable for the hover.
            let str = `<h6>${d.name}</h6>` +
                                `<div>${numeral(d.value).format(this.numFormat)}</div>` +
                                `<div>${d.date}</div>`;

            // Add the HTML first so we can determine size and placement.
            this.tooltip.html(str);

            let toolTipExtra = this.tooltip.node().getBoundingClientRect(),
                bodyWidth = document.body.clientWidth,
                extraX;

            // IF tooltip will be to big to fit in view, and leak to the left
            //  then make the tool tip right align to the X.
            // IF tooltip will be off screen to the right, then left align.
            // ELSE just center.
            if ((x + (toolTipExtra.width / 2)) > bodyWidth) {
                extraX = (x - toolTipExtra.width)
            } else if ((x - (toolTipExtra.width / 2)) < 0) {
                extraX = x
            } else {
                extraX = (x - (toolTipExtra.width / 2))
            }

            // Add some spacing to y so it does not render
            // exactly where the mouse is causing a mouse enter / out loop.
            this.tooltip.style('visibility', 'visible')
                            .style('top', `${y + 10}px`) 
                            .style('left', `${extraX}px`);
        }

        circles
            .enter()
                .append('circle')
                .attr('r', 2.5)
                .attr('cx', (d) => x(d.date))
                .attr('cy', (d, i) => y(d.value))
                .attr('fill', (d) => d.color)
            .merge(circles)
                .on('mouseover', (d, i, arr) => {
                    // When hover, make the circle slightly larger
                    // so user knows which circle tooltip is showing.
                    d3.select(arr[i]).transition().delay(100).attr('r', 5);
                    let { pageX, pageY } = d3.event;
                    setToolTip(pageX, pageY, d);                  

                })
                .on('mousemove', (d, i, arr) => {
                    // Follow the mouse as new items come into the view.
                    d3.select(arr[i]).transition().delay(100).attr('r', 5);
                    let { pageX, pageY } = d3.event;
                    setToolTip(pageX, pageY, d);
                })
                .on('mouseout', (d, i, arr) => {
                    // As new item comes in, old gets moved,
                    // circle goes back to normal size and new circle gets hover effect.
                    let elm = d3.select(arr[i]).transition().delay(100).attr('r', 2.5);
                    this.tooltip.style('visibility', 'hidden');
                })
                .transition()
                .duration(350)
                .attr('cx', (d) => x(d.date))
                .attr('cy', (d, i) => y(d.value))
                .attr('fill', (d) => d.color)

        circles.exit().remove();
        
    }
}

export default clusterNodesLineGraphController;
