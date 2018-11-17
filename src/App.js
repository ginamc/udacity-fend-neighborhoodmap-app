import React, { Component } from 'react'
import axios from 'axios'
// axios downloaded as per Yahya Elharony's walkthrough -- specified in README
// axios used to work with Foursquare API

import './App.css';

class App extends Component {

    //setting a state
    state = {
      foodPlaces: []
    }

    //calling our rendered map
    componentDidMount() {
      // invoking function to get places info
      this.getPlaces()
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
      const endPoint = "https://api.foursquare.com/v2/venues/explore?"
      // a list of objects we need from Foursquare, inclu our api info
      const parameters = {
        client_id: "J4H31X3T25IDXZF3IMI3A12WNTUDKZ43MGIWNGYJLFGJFLH4",
        client_secret: "KPDF2NV5SL4UKISN24J1KJF13Q1F20WXKYURK2I1LJ5YIYCQ",
        query: "food",
        near: "Bushwick, Brooklyn, NY",
        v: "20182507"
      }

      // using axios to get Foursquare to talk to the application
      // passing the endPoint url and our parameter objects for info to display on click/hover/etc
      axios.get(endPoint + new URLSearchParams(parameters)) 
      // when we get this information, log it (similar to 'fetch')
      .then(response => {
        // calling the state from above
        // info being passed into 'foodPlaces' pulls from console in browser, looking for the data info
        this.setState({
          foodPlaces:response.data.response.groups[0].items
        })
      })
      // catching errors
      .catch(error => {
        console.log("ERROR! " + error)
      })
    }

   
    // integrating Google Maps API into our app
    initMap = () => {
      var map = new window.google.maps.Map(document.getElementById('map'), {
          center: {lat: 40.694428, lng: -73.921286},
          zoom: 15
      });
      // getting our markers on the map
      var marker = new window.google.maps.Marker({
        position: {lat: 40.694428, lng: -73.921286},
        map: map,
        title: 'Hello World!'
      })
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