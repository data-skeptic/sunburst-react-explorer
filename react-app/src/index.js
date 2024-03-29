import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Sunburst from './ZoomableSunburst';
import Editor from './Editor';
import reportWebVitals from './reportWebVitals';
import { timeHours } from 'd3';
 

ReactDOM.render(
  <React.StrictMode>
    <Editor />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

