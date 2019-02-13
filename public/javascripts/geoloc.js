let currentPositionMarker = {};
const mapCenter = new google.maps.LatLng(48.864716, 2.349014);
let map = {};
const markers = [];

const initOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
};

// used for marker style
const iconBase = "https://maps.google.com/mapfiles/ms/icons/";

// set map type and display specifications
const mapOptions = {
  center: mapCenter,
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

function initializeMap() {
  map = new google.maps.Map(document.getElementById("map"), mapOptions);

  // Create transit layer
  let transitLayer = new google.maps.TransitLayer();
  transitLayer.setMap(map);

  // Collect all markers and push them inside the array
  allMarkers(map, markers);

  // Collect all collected markers from the user and update color in map
  collectedMarkers(map, markers);
}

function locError(error) {
  // tell the user if the current position could not be located
  alert("The current position could not be found!");
}

// current position of the user
function setCurrentPosition(pos) {
  currentPositionMarker = new google.maps.Marker({
    map: map,
    position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 12,
      fillColor: "#00F",
      fillOpacity: 0.6,
      strokeWeight: 0.4
    },
    title: "Current Position"
  });

  console.log("Your current position is:");
  console.log(`Latitude : ${pos.coords.latitude}`);
  console.log(`Longitude: ${pos.coords.longitude}`);
  console.log(`More or less ${pos.coords.accuracy} meters.`);

  map.panTo(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
}

function displayAndWatch(position) {
  // set current position
  setCurrentPosition(position);

  // watch position
  watchCurrentPosition();
}

function watchCurrentPosition() {
  let positionTimer = navigator.geolocation.watchPosition(function(position) {
    setMarkerPosition(currentPositionMarker, position);
  });
}

function setMarkerPosition(marker, position) {
  marker.setPosition(
    new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
  );
}

function initLocationProcedure() {
  initializeMap();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      displayAndWatch,
      locError,
      initOptions
    );
  } else {
    // tell the user if a browser doesn't support this amazing API
    alert("Your browser does not support the Geolocation API!");
  }
}

// initialize with a little help of jQuery
$(document).ready(function() {
  initLocationProcedure();
});

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
