import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import DropFile from './DropFile'

require("../node_modules/react-dropzone-component/styles/filepicker.css");
require("../node_modules/dropzone/dist/min/dropzone.min.css");


class App extends Component {


  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Deeplearni.ng</h2>
          <h4>Nisanthan Nanthakumar</h4>
        </div>
        <DropFile />
      </div>
    );
  }
}

export default App;
