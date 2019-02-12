document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("JS imported successfully!");
  },
  false
);

// ------ INIT MAP -------- //
function initMap() {
  var options = {
    enableHighAccuracy: true,
    // timeout: 5000,
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
        {
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

    // Create a marker and set its position.
    var marker = new google.maps.Marker({
      map: map,
      position: { lat: coord.latitude, lng: coord.longitude },
      title: "This is YOU!"
    });

    // Create transit layer
    var transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);

    allMarkers(map);
    collectedMarkers(map);
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
}

// Display all markers from DB
function allMarkers(map) {
  axios
    .get("/allmetros")
    .then(response => {
      const allItems = response.data;

      allItems.forEach(item => {
        var marker = new google.maps.Marker({
          map: map,
          position: { lat: item.location[0], lng: item.location[1] },
          title: item.name
        });
      });
    })
    .catch(err => console.log("Metro Error", err));
}

function collectedMarkers() {
  collectedItems.forEach(metroElem => {
    var marker = new google.maps.Marker({
      map: map,
      position: { lat: metroElem.location[0], lng: metroElem.location[1] },
      title: metroElem.name
    });
  });
}
