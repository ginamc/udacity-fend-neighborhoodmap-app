import React, { Component } from 'react'
import axios from 'axios'
// axios downloaded as per Yahya Elharony's walkthrough -- specified in README
// axios used to work with Foursquare API

import MapDisplay from './components/MapDisplay'
// import MenuBar from './components/MenuBar'

import './App.css';

class App extends Component {

    //set the state for our food places and venuePins
    // setting the state to be empty array for each of below while info is fetched (food info, markers, search)
    state = {
        venueInfo: [],
        venuePins: [],
        searchFood: []
    } 
    

    // create a constructor for our properties
    // strictly managed the query, setting query to be an empty string to start
    constructor(props) {
        super(props)
        this.state = {
            query: ''
        };
    }

    // once the component mounts, we load the fetched venue (getting from Foursquare)
    // once that loads, render the map
    // and invoke a function to get our food info
    componentDidMount() {
        // check for errors when component mounts
        window.gm_authFailure=()=> {
            console.log("Error! Map couldn't load")
        }
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
                    venueInfo: response.data.response.groups[0].items,
                    searchFood: response.data.response.groups[0].items
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
    // used Google API lessons here
    initMap = () => {
        let venueMap = new window.google.maps.Map(document.getElementById('map'), {
            center: { lat: 40.703177, lng: -73.923904 },
            zoom: 15
        });
        this.map = venueMap

        let venuePopup = new window.google.maps.InfoWindow()
        this.venuePopup = new window.google.maps.InfoWindow()

        // setting the state of the map and infoWindow
        let allMarkers = []
        this.setState ({
            map: venueMap,
            venuePopup: this.venuePopup
        })

        // looping over our venues array to create the markers and the information in the popup box
        this.state.venueInfo.map(loadVenueInfo => {
            let popupContents = `${loadVenueInfo.venue.name}` // <-- change what goes into this variable 
            // the below markers are those that get returned based on the map, they're not all there
            // if you want to change the markers do it here (from Google Map lessons; developer.google.com)
            /* put in at line 111 >> icon: name of icon variable 
             also can add location.city: name of city */
            let locationMarker = new window.google.maps.Marker({
                position: { lat: loadVenueInfo.venue.location.lat, lng: loadVenueInfo.venue.location.lng },
                map: venueMap,
                name: loadVenueInfo.venue.name,
                address: loadVenueInfo.venue.location.address,
                photo: loadVenueInfo.venue.photos,
                animation: window.google.maps.Animation.DROP
            });

            // tie everything together in an event listener
            // change the content, and on click, open the venuePopup with relevant info
            locationMarker.addListener('click', function() {
                venuePopup.setContent(popupContents)
                venuePopup.open(venueMap, locationMarker);
            });

            // updating allMarkers array with returned data
            allMarkers.push(locationMarker)
        });

        this.setState({
            venuePins: allMarkers
        })

        this.setState({
            filterFood: this.state.venues
        })
    }

    

    // function that filters our marker and sidemenu list when something is typed into the search box
    // 'let f' is updating the results based on what's in the search box
     filterFood(query) {
        let f = this.state.venueInfo.filter(loadVenueInfo => loadVenueInfo.venue.name.toLowerCase().includes(query.toLowerCase()))
            console.log(this.state)
        // showing or hiding map markers and list items depending on what's being searched
        this.state.venuePins.forEach(locationMarker => {
            console.log(locationMarker);
            locationMarker.name.toLowerCase().includes(query.toLowerCase()) === true ?
                locationMarker.setVisible(true) :
                locationMarker.setVisible(false)
        });

        this.setState({ filterFood: f, query });

    }

    // when food venue button on side menu is clicked, this function triggers the map marker to open its infoWindow
    // when button is clicked, check for a match, if it's true, the infowindow opens
        clickFood=(venueInfo) => {
            let marker = this.state.venuePins.filter(m => m.name === venueInfo.name)[0]
            this.venuePopup.setContent(`${marker.name + "<br/> " + marker.address}`)
            this.map.setCenter(marker.position)
            this.venuePopup.open(this.state.map, marker)
        }

        


    render() {

        let restaurants = (this.state.query) ?
        this.state.filterFood:this.state.venueInfo;
        // console.log(restaurants);

        return ( <div>
           <div id = "map"><MapDisplay /></div>
           <div id = "sidebar">
           <input placeholder = "search for food"
                    value = {this.state.query}
                    onChange={(e)=>{this.filterFood(e.target.value)}}/><br/>
                        {this.state.venueInfo && this.state.venueInfo.length > 0 && restaurants.map((loadVenueInfo, index) => ( <div key={index} className = "foodplace-item"> <button onClick={() => {this.clickFood(loadVenueInfo.venue)}}>{loadVenueInfo.venue.name} </button> </div>
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
function loadFoodMapScript(url) {
    let index = window.document.getElementsByTagName("script")[0]
    let script = window.document.createElement("script")

    script.src = url
    script.async = true
    script.defer = true

    index.parentNode.insertBefore(script, index)
}

export default App;