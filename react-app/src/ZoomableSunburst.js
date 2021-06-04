import React, {Component} from 'react';
import * as d3 from "d3";
import { svg } from 'd3';

class ZoomableSunburst extends Component {
    componentDidMount() {
        this.drawVisualization();
    }

      
    drawVisualization() {

        d3.json("exampleDataset.json").then( data => {

            var width = 932;
            var radius = width / 6;

            var currentDepth = 0; 

            const svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", width)
            .style("border", "2px solid lightgrey")
            .style("margin", "50px")

            console.log(data);
            const root = d3.hierarchy(data)
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value);
            console.log(root);
            const partition = d3.partition().size([2 * Math.PI, root.height + 1])(root)

            root.each(d => d.current = d);

            const g = svg.append("g")
                .attr("transform", `translate(${width / 2},${width / 2})`);

            var currentList = root.descendants();

            var current1 = currentList.filter( (d) => {
                return d['depth'] == currentDepth + 1;
            });
            var current2 = currentList.filter( (d) => {
                return d['depth'] == currentDepth + 2;
            });

            console.log(current2);

            const colorScale = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))

            current1.forEach( (d,i)=>{
                g.append("path")
                        .attr("class", "arc")
                        .attr("fill", colorScale(d.data.name))
                        .attr("fill-opacity", .6)
                        .attr("stroke","black")
                        .attr("stroke-width", 1)
                        .attr("opacity", 0.5)
                        .attr("d", d3.arc()
                            .innerRadius(100)
                            .outerRadius(200)
                            .padAngle(Math.min((d.current.x1 - d.current.x0) / 2, 0.005))
                            .startAngle(d.x0)
                            .endAngle(d.x1));
            });

            current2.forEach( (d,i)=>{
                g.append("path")
                        .attr("class", "arc")
                        .attr("fill",  colorScale(d.data.name))
                        .attr("fill-opacity", .5)
                        .attr("stroke","black")
                        .attr("stroke-width", 1)
                        .attr("opacity", 0.5)
                        .attr("d", d3.arc()
                            .innerRadius(220)
                            .outerRadius(350)
                            .padAngle(Math.min((d.current.x1 - d.current.x0) / 2, 0.005))
                            .startAngle(d.x0)
                            .endAngle(d.x1));
                console.log(d.x1 * 180 / Math.PI);
            });
            

                        // .attr("d", d => d3.arc()
                        // .startAngle(d.current.x0)
                        // .endAngle(d.current.x1)
                        // .padAngle(Math.min((d.current.x1 - d.current.x0) / 2, 0.005))
                        // .padRadius(radius * 1.5)
                        // .innerRadius(d.current.y0 * radius)
                        // .outerRadius(Math.max(d.current.y0 * radius, d.current.y1 * radius - 1)));            
            // root.each(d => d.target = {
            //     x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            //     x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            //     y0: Math.max(0, d.y0 - p.depth),
            //     y1: Math.max(0, d.y1 - p.depth)
            // });

        });

    }
          
    render(){
        return svg;
    }
  }
      
  export default ZoomableSunburst;