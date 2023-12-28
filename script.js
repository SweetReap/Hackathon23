
let map;
let markers = [];
let res = null;
let data = [];

async function getData(){
  try {
  // fetch data about NYC art galleries 
  res = await fetch('https://data.cityofnewyork.us/resource/43hw-uvdj.json')

  // get JSON data from the response body
  data = await res.json()

  } catch (error) {
    console.error(error);
    alert("Something went wrong - Check console for more details.")
  }
}

getData();

//get user input zip and fetches matches - filters items found by name
function getZip() {
    const zipcode = document.getElementById("zip").value;
    // console.log("you searched for galleries in: " + zipcode)

    // the zipcode you want to search for
    // const filteredData = data.filter(item => item.zip.split(".")[0] === zipcode);
    const filteredData = getName(data).filter(item => item.zip.split(".")[0] === zipcode); 

    // console.log(filteredData);

    showCard(filteredData);
    return filteredData;
}

//get user input name and fetches matches
function getName() {
  const name = document.getElementById("name").value;
  const filteredData = data.filter(item => item.name.includes(name));

  if(filteredData === null){
    alert("Input is invalid. No results showed.");
  }

  showCard(filteredData);
  return filteredData;
}

// Get a reference to the results div
const resultsDiv = document.getElementById('results');

function showCard(data){
  // Create a card element
  const card = document.createElement('div');
  card.classList.add('card');

  if(resultsDiv.hasChildNodes){
    resultsDiv.innerHTML = '';
  }

  // Build card HTML
  data.forEach(place => {
      if(place != null){
        const card = document.createElement('li');
        card.classList.add('card')

        let placeZip = place.zip.replace(".0","");

        const cardHTML = `
        <h2>${place.name}</h2>
        <p>${place.address1}</p>
        <p>${placeZip}</p>
        `;
        card.innerHTML = cardHTML;
        resultsDiv.appendChild(card);
      }
  });
  console.log(data);

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
  map.zoom = 10;
  map.center = new google.maps.LatLng( 
    40.802213, 
    -73.947022);
};

window.initMap = initMap;
window.eqfeed_callback = eqfeed_callback;

//search button for zipcode
const searchButtonZip = document.querySelector("#search-zip");

searchButtonZip.onclick = async function(){
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
  
};

//search button for name
const searchButtonName = document.querySelector("#search-name");

searchButtonName.onclick = async () => {
  //get the content
  var content = document.querySelector("#map-contain");
  if(!content) return;

  //toggle content
  toggle(content);

  const data = getName();

  for(let i = 0; i < markers.length;i++){
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
};


let eventContainer = document.getElementById('map-contain');

//hide specific element
const hide = (element) => {
   element.style.display = 'none';
};

//show element
const show = (element) => {
  element.style.display = 'block';
};

//toggle
const toggle = (element) => {
  if(window.getComputedStyle(element).display === 'none'){
    show(element);
    console.log("clicked");
    return;
  }
};
hide(eventContainer);



// //listen for click events
// document.addEventListener('click', (event) => {

// }, false);
