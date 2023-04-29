
let map;
let markers = [];


function inputZip() {
  const zip = document.getElementById("zip").value;
  console.log(zip)
}

//get user zip and fetches matches
async function getZip() {
  try {
    // fetch data about NYC art galleries 
    const res = await fetch('https://data.cityofnewyork.us/resource/43hw-uvdj.json')
    // get JSON data from the response body
    const data = await res.json()
    // console.log(data)
    const zipcode = document.getElementById("zip").value;
    // console.log("you searched for galleries in: " + zipcode)
    // the zipcode you want to search for
    const filteredData = data.filter(item => item.zip.split(".")[0] === zipcode);
    // console.log(filteredData);
    showCard(filteredData);
    return filteredData
  } catch (e) {
    // handle error if API call in try block fails
    console.error(e)
    alert("Something went wrong - check the dev console")
  }
}


// Get a reference to the results div
const resultsDiv = document.getElementById('results');

 function showCard(data){

   // Create a list element to hold our cards
    const cardList = document.createElement('ul');
    cardList.classList.add('card-list');

    // // Loop through the data and create a card for each item
     data.forEach((item) => {
      // Create a card element
      const card = document.createElement('li');
       card.classList.add('card');
 
    // Build card HTML
    const cardHTML = `
      <h2>${item.name}</h2>
      <p>${item.tel}</p>
      <p>${item.address1}</p>
    `;
       
    // Update card content
    card.innerHTML = cardHTML
     // Add the card to the list
   cardList.appendChild(card);
  });
     // console.log()
   // Add the card to the results div 
    resultsDiv.appendChild(cardList);
 
  // .catch(error => console.error(error));
   
}

// run script that will showcase map

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: new google.maps.LatLng(40.87490033561466, -73.89453248547771),
    mapTypeId: "terrain",
  });

  // Create a <script> tag and set the USGS URL as the source.
  const script = document.createElement("script");

  // This example tries to uses our JSON data for the locations
  script.src = "https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js";
  document.getElementsByTagName("head")[0].appendChild(script);
}

// Loop through the results array and place a marker for each
// set of coordinates.
const eqfeed_callback = function (results) {
  for (let i = 0; i < results.features.length; i++) {
    const coords = results.features[i].geometry.coordinates;
    const latLng = new google.maps.LatLng(coords[1], coords[0]);

    markers.push(
      new google.maps.Marker({
        position: latLng,
        map: map,
      })
    )  
  }
};

window.initMap = initMap;
window.eqfeed_callback = eqfeed_callback;

const searchButton = document.querySelector("#search");
searchButton.onclick = async function(){
  const data = await getZip();

  for( let i = 0; i < markers.length;i++){
    markers[i].setMap(null);
  }

  markers = [];

  for (let i = 0; i < data.length; i++) {
    const coords = data[i].the_geom.coordinates;
    const latLng = new google.maps.LatLng(coords[1], coords[0]);

    markers.push(
      new google.maps.Marker({
        position: latLng,
        map: map,
      })
    )  
  }
  
}