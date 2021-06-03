import React, {Component} from 'react';
import * as d3 from "d3";

class Visualization extends Component {
    componentDidMount() {
      this.drawVisualization();
    }
      
    drawVisualization() {
      
      const svg = d3.select("body")
      .append("svg")
      .attr("width", 100)
      .attr("height", 100)
                    
      svg.append("rect")
        .attr("x", 25)
        .attr("y", 25)
        .attr("width", 50)
        .attr("height", 50)
        .attr("fill", "green")
    }
          
    render(){
        return <svg ref={node => this.node = node}
        width={500} height={500}>
        </svg>
    }
  }
      
  export default Visualization;