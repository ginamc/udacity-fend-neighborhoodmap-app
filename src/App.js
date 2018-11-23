import React, { Component } from 'react'
import axios from 'axios'
// axios downloaded as per Yahya Elharony's walkthrough -- specified in README
// axios used to work with Foursquare API

import './App.css';

class App extends Component {

    //set the state for our food places and markers
    state = {
        foodPlaces: [],
        markers: [],
    }

    

    // create a constructor for our properties
    constructor(props) {
        super(props)
        this.state = {
            query: ''
        }
    }

    //call our rendered rendered map
    // and invoke a function to get our food info
    componentDidMount() {
        this.getPlaces()
    }

    // function loads the map with my api
    // initializes initMap so the app can read and do the callback in the url
    loadMap = () => {
        loadMapScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyC0QW_gzDqHmmc48BjJrgRPRkOEi_FD4HM&callback=initMap")
        window.initMap = this.initMap
    }

    // retrieve places information from Foursquare
    // with the list of objects we want to show
    getPlaces = () => {
        let endPoint = "https://api.foursquare.com/v2/venues/explore?"
        let parameters = {
            client_id: "J4H31X3T25IDXZF3IMI3A12WNTUDKZ43MGIWNGYJLFGJFLH4",
            client_secret: "KPDF2NV5SL4UKISN24J1KJF13Q1F20WXKYURK2I1LJ5YIYCQ",
            query: "food",
            near: "Bushwick, Brooklyn, NY",
            v: "20182507"
        }

        // use axios to get Foursquare data into our app
        // use the endPoint url and our parameter objects to display desired info over the markers
        // when we get our info, log it
        // call the state from above, pass the info into 'foodPlaces' save the info, then render the map
        // catch any errors
        axios.get(endPoint + new URLSearchParams(parameters))
            .then(response => {
                this.setState({
                    foodPlaces: response.data.response.groups[0].items
                }, this.loadMap())
            })
            .catch(error => {
                console.log("ERROR! " + error)
            })
    }

    // create the map!
    // display our infomation for a selected marker
    // loop over our state (foodPlaces) to populate markers onto the map
    // pass the venue info into the infowindow variable and
    // for each place, dynamically create a marker
    initMap = () => {
        let map = new window.google.maps.Map(document.getElementById('map'), {
            center: { lat: 40.703177, lng: -73.923904 },
            zoom: 15
        });

        let infowindow = new window.google.maps.InfoWindow()
        this.state.foodPlaces.map(foodVenue => {
            let contentString = `${foodVenue.venue.name}`
            let marker = new window.google.maps.Marker({
                position: { lat: foodVenue.venue.location.lat, lng: foodVenue.venue.location.lng },
                map: map,
                name: foodVenue.venue.name
            });

            // tie everything together in an event listener
            // change the content, and on click, open the infowindow with relevant info
            marker.addListener('click', function() {
                infowindow.setContent(contentString)
                infowindow.open(map, marker);
            });
        });
    }

    
    // loop thru each marker and check that the query matches our input in search bar
    filterFood(query) {

     this.markers.forEach(marker => {
            console.log(marker);
            marker.name.toLowerCase().includes(query.toLowerCase()) === true ?
                marker.setVisible(true) :
                marker.setVisible(false)
        });

        this.setState({ query });
      
    }

    render() {
        return ( 
          <div>
            <div id = "map" > </div>
            <div id = "sidebar">
            <input value = { this.state.query }
            onChange = {
                (e) => { this.filterFood(e.target.value) }}/> <br/> 
                { this.state.foodVenue && this.state.foodVenue.length > 0 && this.state.foodVenue.map((foodVenue, index) => ( 
                  <div className = "foodplace-item"> { foodVenue.name } </div>
                ))
            }
            </div> 
          </div>
        );
    }
}


// creating the map script function by
// selecting the first instance of elements with the tag name 'script'
// and create the script element (i.e. <script></script>)
// url is called in the function
// insert the script at the vergy beginning of our script and pass it down to children
function loadMapScript(url) {
    let index = window.document.getElementsByTagName("script")[0]
    let script = window.document.createElement("script")

    script.src = url
    script.async = true
    script.defer = true

    index.parentNode.insertBefore(script, index)
}

export default App;