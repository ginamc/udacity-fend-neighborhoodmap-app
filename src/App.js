import React, { Component } from 'react'
import axios from 'axios'
// axios downloaded as per Yahya Elharony's walkthrough -- specified in README
// axios used to work with Foursquare API

// import { load_google_maps } from './utils'

import './App.css';

class App extends Component {

    //setting a state
    state = {
      foodPlaces: [],
    }

    //calling our rendered map
    componentDidMount() {
      // invoking function to get places info
      this.getPlaces()
    }

    // function that loads the map with my api
    loadMap = () => {
        loadMapScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyC0QW_gzDqHmmc48BjJrgRPRkOEi_FD4HM&callback=initMap")
        // initializes initMap so JavaScript can read it and successfully do that callback
        window.initMap = this.initMap
    }

    // retrieve places information from Foursquare
    getPlaces = () => {
      let endPoint = "https://api.foursquare.com/v2/venues/explore?"
      // a list of objects we need from Foursquare, inclu our api info
      let parameters = {
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
        // after places are pulled and saved, then render the map
        this.setState({
          foodPlaces:response.data.response.groups[0].items
        }, this.loadMap())
      })
      // catching errors
      .catch(error => {
        console.log("ERROR! " + error)
      })
    }

   
    // integrating Google Maps API into our app
    initMap = () => {
      let map = new window.google.maps.Map(document.getElementById('map'), {
          center: {lat: 40.703177, lng: -73.923904},
          zoom: 15
      });

      // display the infowindow for the selected marker
      let infowindow = new window.google.maps.InfoWindow()

      // looping over our state (foodPlaces) to populate a bunch of markers onto the map
      this.state.foodPlaces.map(foodVenue => {
        
        // passes venue information into a variable that's called in the infowindow
        let contentString = `${foodVenue.venue.name}`
  
        // for each place, we want to create a marker dynamically
        let marker = new window.google.maps.Marker({
          position: {lat: foodVenue.venue.location.lat, lng: foodVenue.venue.location.lng},
          map: map,
          name: foodVenue.venue.name
        });        
        
       

        // ties everything together in an event listener
        marker.addListener('click', function() {
        // change the content 
        infowindow.setContent(contentString)
        // on click, open the infowindow with the relevant info
        infowindow.open(map, marker);
        });
      });      
    }

      // going to loop thru each marker and check that the query matches input in search bar
    filterFood(query) {
      this.markers.forEach(marker => {
        console.log(marker);
      });
      
      this.setState({ query });
    }

    render() {
        return ( 
          <div>
            <div id="map"></div>
            <div id="sidebar">
              <input value={this.state.query} onChange={(e) => { this.filterFood(e.target.value) }}/>
            </div>
          </div>
        );
    }
}


// creating the map script function
function loadMapScript(url) {
    // selects the first isntances of elements with tag name of 'script'
    let index = window.document.getElementsByTagName("script")[0]
        // create the script tag element
    let script = window.document.createElement("script")
        // url is the one called in the function
    script.src = url
    script.async = true
    script.defer = true
        // inserts the script at the very beginning of our scrips to the parent, gets passed down to the child
    index.parentNode.insertBefore(script, index)
}

export default App;