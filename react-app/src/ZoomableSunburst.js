import React, { useState, useEffect } from 'react'
import Sunburst from './Sunburst';
import * as d3 from "d3";
import { svg } from 'd3';
//import rd3 from 'react-d3-library';

class ZoomableSunburst extends React.Component {
    

    constructor(props) {
        super(props);
        this.state = {data : JSON.parse(props.data)};
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log(nextProps.data);
        this.setState({data : JSON.parse(nextProps.data)});
        //this.drawVisualization();
    }
    
    render(){
        return (
            <Sunburst data = {this.state.data}/>
        );
    }
  }
      

  

  export default ZoomableSunburst;