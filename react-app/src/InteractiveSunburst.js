import './App.css';
import Sunburst from './ZoomableSunburst.js';
import React, { Component } from 'react';
import { render } from 'react-dom';

class InteractiveSunburst extends Component {
  constructor() {
    super();
    this.state = {
      name: 'example'
    };
   
    this.handleChange = this.handleChange.bind(this);
  }
  
  

  handleChange(event) {
    this.setState({name: event.target.value});
    console.log(this.state.name);
  }

  
  render() {
    return (
      <div>
        <h1>label</h1>
        <form onSubmit={this.handleSubmit}>
          <textarea
              value={this.state.name} 
              rows="40" 
              cols="100"
              onChange={this.handleChange} />
        </form>
        <Sunburst jsonThing = {this.state.name}></Sunburst>
      </div>
      
    );
  }
}
render(<InteractiveSunburst />, document.getElementById('root'));

export default InteractiveSunburst;
