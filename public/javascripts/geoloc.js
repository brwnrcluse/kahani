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
  return new Promise(resolve => {
    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // Create transit layer
    let transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);

    // Collect all items from DB and push them inside the array
    allItems(map, circles);

    // Collect all collected items from the user and update color in map
    collectedItems(map, circles);

    resolve("done");
  });
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
    name: "Current Position"
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

  //smoothZoom(map, 16, map.getZoom());

  // watch position
  watchCurrentPosition();
}

function watchCurrentPosition() {
  let positionTimer = navigator.geolocation.watchPosition(function(position) {
    setMarkerPosition(currentPositionMarker, position);
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

    if (distance <= circleRadius && circle.collected === false) {
      let direction = 1;
      let rMin = circleRadius - 150,
        rMax = circleRadius;
      let interval = setInterval(() => {
        let rad = circle.getRadius();
        console.log(rad);
        if (rad > rMax || rad < rMin) {
          direction *= -1;
        }
        circle.setRadius(rad + direction * 10);
      }, 100);

      circle.setOptions({
        fillOpacity: 0.8
      });

      circle.addListener("click", function() {
        this.removeListener();
        this.setOptions({
          fillColor: collectedColor,
          fillOpacity: 0.7,
          strokeWeight: 0.1,
          strokeColor: collectedColor,
          collected: true,
          radius: circleRadius
        });
        clearInterval(interval);
        updateCollectionAfterClick(circle.name);
      });
    }
  });
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
          name: item.name,
          collected: false
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
          if (item.name === circle.name) {
            circle.setOptions({
              fillColor: collectedColor,
              fillOpacity: 0.7,
              strokeWeight: 0.1,
              strokeColor: collectedColor,
              collected: true
            });

            console.log(`COLOR CHANGED on ${circle.name}`);
          }
        });
      });
    })
    .catch(err => console.log("ERROR in collectedItems", err.response.data));
}

// Update DB after clicking on a circle
function updateCollectionAfterClick(name) {
  axios
    .post("/clicked", { itemName: name })
    .then(() => {
      collectedItems(map, circles);
      console.log("Collection updated, map should be too.");
    })
    .catch(err =>
      console.log("ERROR in updateCollectionAfterClick", err.response.data)
    );
}

async function initLocationProcedure() {
  let status = await initializeMap();

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

function smoothZoom(map, max, cnt) {
  if (cnt >= max) {
    return;
  } else {
    setTimeout(function() {
      z = google.maps.event.addListener(map, "zoom_changed", function(event) {
        google.maps.event.removeListener(z);
        smoothZoom(map, max, cnt + 0.1);
      });
      setTimeout(function() {
        map.setZoom(cnt);
      }, 100);
    }, 2000);
  }
}
