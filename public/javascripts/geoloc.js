let currentPositionMarker = {};
const mapCenter = new google.maps.LatLng(48.864716, 2.349014);
let map = {};
const circles = [];
const circleRadius = 250;

const collectedColor = "#0F0";

const initOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
};

// set map type and display specifications
const mapOptions = {
  center: mapCenter,
  zoom: 12,
  disableDefaultUI: true,
  zoomControl: true,
  scaleControl: true,
  rotateControl: true,
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
          visibility: "simplified"
        },
        {
          color: "#000000"
        },
        {
          lightness: "80"
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

  // Collect all items from DB and push them inside the array
  allItems(map, circles);

  // Collect all collected items from the user and update color in map
  collectedItems(map, circles);
}

function locError(error) {
  // tell the user if the current position could not be located
  alert("The current position could not be found!");
}

// current position of the user
function setCurrentPosition(position) {
  currentPositionMarker = new google.maps.Marker({
    map: map,
    position: new google.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    ),
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10,
      fillColor: "#00F",
      fillOpacity: 0.7,
      strokeWeight: 0.1,
      strokeColor: "#00F"
    },
    title: "Current Position"
  });

  console.log("Your current position is:");
  console.log(`Latitude : ${position.coords.latitude}`);
  console.log(`Longitude: ${position.coords.longitude}`);
  console.log(`More or less ${position.coords.accuracy} meters.`);

  map.panTo(
    new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
  );
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
    console.log("WATCHING POSITION");
    updateDistance(position);
  });
}

function setMarkerPosition(marker, position) {
  marker.setPosition(
    new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
  );
}

function updateDistance(position) {
  circles.forEach(circle => {
    let circleLat = circle.getCenter().lat();
    let circleLng = circle.getCenter().lng();

    let userPos = new google.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    );
    let circlePos = new google.maps.LatLng(circleLat, circleLng);

    let distance = google.maps.geometry.spherical.computeDistanceBetween(
      userPos,
      circlePos
    );

    if (distance <= circleRadius) {
      /*
      circle.setOptions({
        fillColor: "#0FF",
        fillOpacity: 0.7,
        strokeWeight: 0.1,
        strokeColor: "#0FF"
      });
      */
      if (!circle.fillColor === collectedColor) {
        circle.addListener("click", function() {
          this.setOptions({
            fillColor: "#000",
            fillOpacity: 0.7,
            strokeWeight: 0.1,
            strokeColor: "#000"
          });

          updateCollectionAfterClick(circle);
        });
      }
    }
  });
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

// Display all items
function allItems(map, circleArray) {
  axios
    .get("/allmetros")
    .then(response => {
      const allItems = response.data;

      allItems.forEach(item => {
        var circle = new google.maps.Circle({
          map: map,
          center: { lat: item.location[0], lng: item.location[1] },
          radius: circleRadius,
          fillColor: "#F00",
          fillOpacity: 0.4,
          strokeWeight: 0.1,
          strokeColor: "#F00",
          title: item.name,
          collected: false
        });

        //circle is the google.maps.Circle-instance
        circle.addListener("click", function() {
          this.setOptions({
            fillColor: "#FF0",
            fillOpacity: 0.7,
            strokeWeight: 0.1,
            strokeColor: "#FF0"
          });
        });

        circleArray.push(circle);
      });
    })
    .catch(err => console.log("ERROR in allItems", err.response.data));
}

// Display collected items only (different color)
function collectedItems(map, circleArray) {
  axios
    .get("/mymetros")
    .then(response => {
      const userCollection = response.data.collected;

      userCollection.forEach(item => {
        circleArray.forEach(circle => {
          if (item.name === circle.title) {
            console.log(`IS IN COLLECTED ITEMS: ${circle.title}`);

            circle.setOptions({
              fillColor: collectedColor,
              fillOpacity: 0.7,
              strokeWeight: 0.1,
              strokeColor: collectedColor
            });

            console.log(`COLOR CHANGED on ${circle.title}`);
          }
        });
      });
    })
    .catch(err => console.log("ERROR in collectedItems", err.response.data));
}

// Update DB after clicking on a circle
function updateCollectionAfterClick(circle) {
  axios
    .post("/clicked", { itemName: circle.title })
    .then(() => {
      collectedItems(map, circles);
      console.log("Collection updated, map should be too.");
    })
    .catch(err =>
      console.log("ERROR in updateCollectionAfterClick", err.response.data)
    );
}
