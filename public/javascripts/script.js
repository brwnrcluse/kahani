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
    timeout: 5000,
    maximumAge: 0
  };

  function success(pos) {
    coord = pos.coords;

    console.log("Your current position is:");
    console.log(`Latitude : ${coord.latitude}`);
    console.log(`Longitude: ${coord.longitude}`);
    console.log(`More or less ${coord.accuracy} meters.`);

    // Create a map object and specify the DOM element
    // for display.
    var map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: coord.latitude, lng: coord.longitude },
      zoom: 16
    });

    // Create a marker and set its position.
    var marker = new google.maps.Marker({
      map: map,
      position: { lat: coord.latitude, lng: coord.longitude },
      title: "This is YOU!"
    });
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
}
