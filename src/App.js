import React, { Component } from 'react'
import axios from 'axios'
// axios downloaded as per Yahya Elharony's walkthrough -- specified in README
// axios used to work with Foursquare API


import './App.css';

class App extends Component {

  // set the state for our locations and markers
  state = {
    foodPlaces: [],
    markers: [],
  }

  // setting up the constructor for our props
  constructor(props) {
    super(props)
    this.state = {
      query: 'food'
    }
  }


  // call our rendered map once the component mounts
  // invoke the function to get our food places
  componentDidMount() {
    this.getFood()
  }

   // load the map
   // and initialize initMap so JavaScript can read it and successfully do the callback in the script url
   // loadMapScript function is down below
   loadMap = () => {
    loadMapScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyC0QW_gzDqHmmc48BjJrgRPRkOEi_FD4HM&callback=initMap")
    window.initMap = this.initMap
  }

  // get our food data from foursquare!
  // list out all the objects we want from Foursquare
  // using my api to pull data from the 3rd party site
  // then use the axios to link Foursqaure to our app by passing the endPoint url and param objects
  // once we have that information we're going to log it and pass the info into the state 'foodPlaces' above onto the map
  // after all that is done, we render the map
  // catch any errors
  getFood = () => {
    let endPoint = "https://api.foursquare.com/v2/venues/explore?"
    let parameters = {
      client_id: "J4H31X3T25IDXZF3IMI3A12WNTUDKZ43MGIWNGYJLFGJFLH4",
        client_secret: "KPDF2NV5SL4UKISN24J1KJF13Q1F20WXKYURK2I1LJ5YIYCQ",
        query: "food",
        near: "Bushwick, NY",
        v: "20182507"
    }
    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          foodPlaces:response.data.response.groups[0].items
        }, this.loadMap())
      })
      .catch(error => {
        console.log("ERROR! " + error)
      })
  }

  // initialize the map so we can actually see it on screen
  // variable 'map' for the Map element
  // create variable 'infowindow' for info about the biz
  // loop over the state 'foodPlaces' to populate markers for the map
  // and pass the biz info into the variable called 'infowindow'
  // for each place, we want to dynamically create a marker
    initMap = () => {
      let map = window.google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.703177, lng: -73.923904},
        zoom: 15
      });

        let infowindow = new window.google.maps.InfoWindow()

      this.state.foodPlaces.map(foodBiz => {
        let contentString = `${foodBiz.venue.name}`
        let marker = new window.google.maps.Marker({
          position: {lat: foodBiz.venue.location.lat, lng: foodBiz.venue.location.lng},
          map: map,
          name: foodBiz.venue.name
        });

        // tying everything together in an event listener
        // we change the content and whenever a marker is clicked, an modal pops open with the relevant information
        marker.addListener('click', function() {
          infowindow.setContent(contentString)
          infowindow.open(map, marker);
        });
      });
    }

    // here we loop through each marker and check that the query matches the input in our search bar
    filterFood(query) {
      this.markers.forEach(marker => {
        console.log(marker);

        marker.name.toLowerCase().includes(query.toLowerCase()) === true ?
          marker.setVisible(true) :
          marker.setVisible(false)
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