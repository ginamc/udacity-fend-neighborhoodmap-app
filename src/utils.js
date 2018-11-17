
// pulled from Ryan Waite's github 
// https://github.com/ryanwaite28/script-store/blob/master/js/react_resolve_google_maps.js

// returns a promise
// asynchronously and dynamically load google's script
// when it loads, it resolves the google object and
// create a marker, infowindow, etc.

export function load_google_maps() {
    return new Promise(function(resolve, reject) {
      // define the global callback that will run when google maps is loaded
      window.resolveGoogleMapsPromise = function() {
        // resolve the google object
        resolve(window.google);
        // delete the global callback to tidy up since it is no longer needed
        delete window.resolveGoogleMapsPromise;
      }
      // Now, Load the Google Maps API
      const script = document.createElement("script");
      const API_KEY = 'AIzaSyC0QW_gzDqHmmc48BjJrgRPRkOEi_FD4HM';
      script.src = `https://maps.googleapis.com/maps/api/js?libraries=places&key=${API_KEY}&callback=resolveGoogleMapsPromise`;
      script.async = true;
      document.body.appendChild(script);
    });
  }