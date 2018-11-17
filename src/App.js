import React, { Component } from 'react';
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