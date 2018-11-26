import React, { Component } from 'react'
import axios from 'axios'
// axios downloaded as per Yahya Elharony's walkthrough -- specified in README
// axios used to work with Foursquare API

// import MapDisplay from './components/MapDisplay'

import './App.css';

class App extends Component {

    //set the state for our food places and venuePins
    state = {
        venueInfo: [],
        venuePins: []

    }

    // create a constructor for our properties
    constructor(props) {
        super(props)
        this.state = {
            query: '',
        };
    }

    //call our rendered rendered map
    // and invoke a function to get our food info
    componentDidMount() {
        this.getFsqPlaces()
    }

    // function loads the map with my api
    // initializes initMap so the app can read and do the callback in the url
    loadFoodMap = () => {
        loadFoodMapScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyC0QW_gzDqHmmc48BjJrgRPRkOEi_FD4HM&callback=initMap")
        window.initMap = this.initMap
    }

    // retrieve places information from Foursquare
    // with the list of objects we want to show
    getFsqPlaces = () => {
        let endPoint = "https://api.foursquare.com/v2/venues/explore?"
        let parameters = {
            client_id: "J4H31X3T25IDXZF3IMI3A12WNTUDKZ43MGIWNGYJLFGJFLH4",
            client_secret: "KPDF2NV5SL4UKISN24J1KJF13Q1F20WXKYURK2I1LJ5YIYCQ",
            query: "food",
            near: "Bushwick, NY",
            v: "20182507"
        }

        // use axios to get Foursquare data into our app
        // use the endPoint url and our parameter objects to display desired info over the venuePins
        // when we get our info, log it
        // call the state from above, pass the info into 'venueInfo' save the info, then render the map
        // catch any errors
        axios.get(endPoint + new URLSearchParams(parameters))
            .then(response => {
                this.setState({
                    venueInfo: response.data.response.groups[0].items
                }, this.loadFoodMap())
            })
            .catch(error => {
                console.log("ERROR! " + error)
            })
    }

    // create the map!
    // display our infomation for a selected marker
    // loop over our state (venueInfo) to populate venuePins onto the map
    // pass the venue info into the venuePopup variable and
    // for each place, dynamically create a marker
    initMap = () => {
        let venueMap = new window.google.maps.Map(document.getElementById('map'), {
            center: { lat: 40.703177, lng: -73.923904 },
            zoom: 15
        });

        let venuePopup = new window.google.maps.InfoWindow()
        this.state.venueInfo.map(loadVenueInfo => {
            let popupContents = `${loadVenueInfo.venue.name}` // <-- change what goes into this variable 
            let locationMarker = new window.google.maps.Marker({
                position: { lat: loadVenueInfo.venue.location.lat, lng: loadVenueInfo.venue.location.lng },
                map: venueMap,
                name: loadVenueInfo.venue.name
            });

            // tie everything together in an event listener
            // change the content, and on click, open the venuePopup with relevant info
            locationMarker.addListener('click', function() {
                venuePopup.setContent(popupContents)
                venuePopup.open(venueMap, locationMarker);
            });
        });
    }



    // loop thru each marker and check that the query matches our input in search bar
    filterFood(query) {

        this.venuePins.forEach(locationMarker => {
            console.log(locationMarker);
            locationMarker.name.toLowerCase().includes(query.toLowerCase()) === true ?
                locationMarker.setVisible(true) :
                locationMarker.setVisible(false)
        });

        this.setState({ query });

    }


    render() {
        return ( <
            div >
            <
            div id = "map" > < /div> <
            div id = "sidebar" >
            <
            input value = { this.state.query }
            onChange = {
                (e) => { this.filterFood(e.target.value) }
            }
            /> <br/ > {
                this.state.loadVenueInfo && this.state.loadVenueInfo.length > 0 && this.state.loadVenueInfo.map((loadVenueInfo, index) => ( <
                    div className = "foodplace-item" > { loadVenueInfo.name } < /div>
                ))
            } <
            /div>  < /
            div >
        );
    }
}


// creating the map script function by
// selecting the first instance of elements with the tag name 'script'
// and create the script element (i.e. <script></script>)
// url is called in the function
// insert the script at the vergy beginning of our script and pass it down to children
function loadFoodMapScript(url) {
    let index = window.document.getElementsByTagName("script")[0]
    let script = window.document.createElement("script")

    script.src = url
    script.async = true
    script.defer = true

    index.parentNode.insertBefore(script, index)
}

export default App;