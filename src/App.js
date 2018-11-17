import React, { Component } from 'react'
import axios from 'axios'
// axios downloaded as per Yahya Elharony's walkthrough -- specified in README
// axios used to work with Foursquare API

import './App.css';

class App extends Component {

    //calling our rendered map
    componentDidMount() {
      this.loadMap()
    }

    // function that loads the map with my api
    loadMap = () => {
        loadMapScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyC0QW_gzDqHmmc48BjJrgRPRkOEi_FD4HM&callback=initMap")
        // initializes initMap so JavaScript can read it and successfully do that callback
        window.initMap = this.initMap
    }

    // retrieve places information from Foursquare
    getPlaces = () => {
      const endPoint = "https://api.foursquare.com/v2/venues/explore"
      // a list of objects we need from Foursquare, inclu our api info
      const parameters = {
        client_id: "J4H31X3T25IDXZF3IMI3A12WNTUDKZ43MGIWNGYJLFGJFLH4",
        client_secret: "KPDF2NV5SL4UKISN24J1KJF13Q1F20WXKYURK2I1LJ5YIYCQ",
        query: "food",
        near: "Bushwick, Brooklyn, NY"
      }

    }

    // integrating Google Maps API into our app
    initMap = () => {
        const map = new window.google.maps.Map(document.getElementById('map'), {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8
        });
    }


    render() {
        return ( 
          <main>
            <div id = "map"></div>
          </main>
        );
    }
}


// creating the map script function
function loadMapScript(url) {
    // selects the first isntances of elements with tag name of 'script'
    var index = window.document.getElementsByTagName("script")[0]
        // create the script tag element
    var script = window.document.createElement("script")
        // url is the one called in the function
    script.src = url
    script.async = true
    script.defer = true
        // inserts the script at the very beginning of our scrips to the parent, gets passed down to the child
    index.parentNode.insertBefore(script, index)
}

export default App;