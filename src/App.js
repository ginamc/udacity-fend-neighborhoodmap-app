import React, { Component } from 'react'
// import axios from 'axios'
// axios downloaded as per Yahya Elharony's walkthrough -- specified in README
// axios used to work with Foursquare API

// import { load_google_maps } from './utils'

import './App.css';

class App extends Component {


   // load the map
   // and initialize initMap so JavaScript can read it and successfully do the callback in the script url
   // loadMapScript function is down below
   loadMap = () => {
    loadMapScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyC0QW_gzDqHmmc48BjJrgRPRkOEi_FD4HM&callback=initMap")
    window.initMap = this.initMap
  }

  // initialize the map so we can actually see it on screen
  // variable 'myMap' for the Map element
    initMap = () => {
      let myMap = window.google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.703177, lng: -73.923904},
        zoom: 15
      });

    }




    // RENDER THE DAMN THING

    render() {
        return ( 
          <div>
            <div id="map"></div>
          </div>
        );
    }
}

// this is the map script function that gets called in the loadMap inside the react component above
// first we select the first instance of elements with the tag of 'script'
// then we create the script tag element, i.e. <script></script>
// the url called here is the google map api link called in loadMap above
// the last line -- insertBefore -- inserts the script at the very beginning of all scripts, and passes it downward
function loadMapScript(url) {
  let index = window.document.getElementsByTagName("script")[0]
  let script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}


export default App;