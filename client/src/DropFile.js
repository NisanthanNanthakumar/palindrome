import React, { Component } from 'react';
import axios from 'axios';
import DropzoneComponent from 'react-dropzone-component';
import PalindromeView from './PalindromeView';

export default class DropFile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: []
    };
  }

   handleUpdate() {
    Promise.all([
    axios.get("/palindromes"),
    axios.get("/palindromes/count")
    ])
    .then((results) => {
      console.log('results[0]', results[0].data);
      console.log('results[1]', results[1].data);
    let result = results[1].data.map((x) => Object.assign(x, results[0].data.find(y => y.id === x.id))) //merge data into 1 object
    console.log('result ', result);
    this.setState({posts: result});
    })
  .catch((error) => console.log(error))
  }
  componentWillMount() {
    this.handleUpdate();
  }

    render() {
      const djsConfig = {
          addRemoveLinks: false,
          acceptedFiles: "application/json"
      };

      const componentConfig = {
          iconFiletypes: ['.json'],
          showFiletypeIcon: true,
          postUrl: '/uploadJson'
      };

      const eventHandlers = {
          init: dz => null ,
          success: (file, x) => {
            this.handleUpdate();
            console.log(x)
          }
      };


      return (
      <div>
        <DropzoneComponent config={componentConfig} eventHandlers={eventHandlers} djsConfig={djsConfig} />
        <PalindromeView s={this.state.posts} />
        {console.log(this.state.posts)}
      </div>
      )
      }
}
