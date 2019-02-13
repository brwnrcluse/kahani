document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("DOM content loaded successfully!");
  },
  false
);

// ------ INIT MAP -------- //
function initMap() {
  var options = {
    enableHighAccuracy: true,
    //  timeout: 5000,
    maximumAge: 0
  };

  function success(pos) {
    coord = pos.coords;

    console.log("Your current position is:");
    console.log(`Latitude : ${coord.latitude}`);
    console.log(`Longitude: ${coord.longitude}`);
    console.log(`More or less ${coord.accuracy} meters.`);

    // Set map type and display specifications
    var mapOptions = {
      center: { lat: coord.latitude, lng: coord.longitude },
      zoom: 13,
      styles: [
        /* {
          featureType: "transit.station.rail",
          elementType: "labels.icon",
          stylers: [
            {
              color: "#ff0000"
            },
            {
              visibility: "on"
            }
          ]
        },*/ {
          featureType: "all",
          elementType: "geometry",
          stylers: [
            {
              visibility: "off"
            }
          ]
        },
        {
          featureType: "all",
          elementType: "labels",
          stylers: [
            {
              visibility: "off"
            }
          ]
        },
        {
          featureType: "landscape",
          elementType: "all",
          stylers: [
            {
              color: "#ffffff"
            },
            {
              visibility: "on"
            }
          ]
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [
            {
              visibility: "on"
            },
            {
              color: "#000000"
            }
          ]
        },
        {
          featureType: "transit.line",
          elementType: "labels.text",
          stylers: [
            {
              visibility: "on"
            }
          ]
        },
        {
          featureType: "transit.line",
          elementType: "labels.icon",
          stylers: [
            {
              visibility: "on"
            }
          ]
        },
        {
          featureType: "transit.station.rail",
          elementType: "labels",
          stylers: [
            {
              visibility: "on"
            },
            {
              weight: "4"
            }
          ]
        },
        {
          featureType: "water",
          elementType: "geometry.fill",
          stylers: [
            {
              visibility: "on"
            }
          ]
        }
      ]
    };

    // Create a map object and specify the DOM element for display.
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var iconBase = "https://maps.google.com/mapfiles/ms/icons/";

    // Create a marker and set its position.
    var marker = new google.maps.Marker({
      map: map,
      position: { lat: coord.latitude, lng: coord.longitude },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: "#00F",
        fillOpacity: 0.6,
        strokeWeight: 0.4
      },
      title: "You are HERE."
    });

    // Create transit layer
    var transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);

    const markers = [];

    allMarkers(map, markers);
    collectedMarkers(map, markers);
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
}

// Display all markers
function allMarkers(map, markerArray) {
  var iconBase = "https://maps.google.com/mapfiles/ms/icons/";

  axios
    .get("/allmetros")
    .then(response => {
      const allItems = response.data;

      allItems.forEach(item => {
        var marker = new google.maps.Marker({
          map: map,
          position: { lat: item.location[0], lng: item.location[1] },
          title: item.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: "#F00",
            fillOpacity: 0.4,
            strokeWeight: 0.4
          }
        });
        markerArray.push(marker);
      });
    })
    .catch(err => console.log("ERROR in allMarkers", err.response.data));
}

// Display collected markers only (different color)
function collectedMarkers(map, markerArray) {
  var iconBase = "https://maps.google.com/mapfiles/ms/icons/";

  console.log("markerArray IN collectedMarkers", markerArray);

  axios
    .get("/mymetros")
    .then(response => {
      const userCollection = response.data.collected;

      userCollection.forEach(item => {
        markerArray.forEach(marker => {
          if (item.name === marker.title) {
            console.log(`MATCH FOUND: ${marker.title}`);

            marker.setIcon({
              path: google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: "#0F0",
              fillOpacity: 0.6,
              strokeWeight: 0.4
            });
            console.log(`changed color on ${marker.title}`);
          }
        });
      });
    })
    .catch(err => console.log("ERROR in collectedMarkers", err.response.data));
}
