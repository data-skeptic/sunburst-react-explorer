import React, {Component} from 'react';
import * as d3 from "d3";
import { svg } from 'd3';

class Visualization extends Component {
    componentDidMount() {
        this.drawVisualization();
    }

      
    drawVisualization() {

        d3.json("exampleDataset.json").then( data => {

            var currentDepth = 0; 

            console.log(data);
            const root = d3.hierarchy(data)
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value);
            console.log(root);
            const partition = d3.partition().size([2 * Math.PI, root.height + 1])(root)

            root.each(d => d.target = {
                
                length: 1,
                
            });
            // root.each(d => d.target = {
            //     x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            //     x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            //     y0: Math.max(0, d.y0 - p.depth),
            //     y1: Math.max(0, d.y1 - p.depth)
            // });

        });

        

        const svg = d3.select("body")
        .append("svg")
        .attr("width", 700)
        .attr("height", 700)
        .style("border", "2px solid lightgrey")
        .style("margin", "50px")

        
                        
        svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 600)
            .attr("height", 600)
            .attr("fill", "green")

    }
          
    render(){
        return svg;
    }
  }
      
  export default Visualization;