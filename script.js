require('dotenv').config()

let map;
let markers = [];
let res = null;
let data = [];
let sk = process.env.main_key

async function getData(){
  try {
  // fetch data about NYC art galleries 
  res = await fetch('https://data.cityofnewyork.us/resource/43hw-uvdj.json');

  // get JSON data from the response body
  data = await res.json();

  } catch (error) {
    console.error(error);
    alert("Something went wrong - Check console for more details.")
  }
}
getData();

//import google maps from the script itself
(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
  key: sk,
  v: "weekly",
});

// initMap is now async -UPDATED GOOGLE INIT FUNC
async function initMap() {
  // Request libraries when needed, not in the script tag.
  const { Map } = await google.maps.importLibrary("maps");
 
  // Short namespaces can be used.
  map = new Map(document.getElementById("map"), {
      center: { lat: 40.87490033561466, lng: -73.89453248547795 },
      zoom: 10,
      minZoom: 10,
      maxZoom: 14,
  });
  const script = document.createElement("script");
  script.src = 'https://data.cityofnewyork.us/resource/43hw-uvdj.json';
  document.getElementsByTagName("head")[0].appendChild(script);
  
}

initMap();


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
const resultsDiv = document.querySelector('.results-container')

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
        const card = document.createElement('div');
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

//OUTDATED SCRIPT RUN
// // run script that will showcase map
// async function initMap() {

//   map = new google.maps.Map(document.getElementById("map"), {
//     zoom: 15,
//     center: new google.maps.LatLng(40.87490033561466, -73.89453248547771),
//     mapTypeId: "terrain",
//   });

//   // Create a <script> tag and set the USGS URL as the source.
//   const script = document.createElement("script");

//   // This example tries to uses our JSON data for the locations
//   script.src = "https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js";
//   document.getElementsByTagName("head")[0].appendChild(script);

// }

// initMap();



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
// hide(eventContainer);

document.addEventListener("DOMContentLoaded", () =>{
  const slider = document.getElementById("price");
  const output = document.querySelector(".curr-range");
  
  slider.oninput = () =>{
    let val = this.value;
    output.innerText = `${val}`;
    console.log(val)
  };
})
