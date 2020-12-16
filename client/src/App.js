import logo from './logo.svg';
import './App.css';


/* This is pure js */
var myMap = new window.Mazemap.Map({
  // container id specified in the HTML
  container: 'map',
  //	sharepoitype:'poi',
  //   sharepoi:'773314',
  campusid: 289,

  // initial position in lngLat format
  center: {
    lng: 20.31,
    lat: 63.82
  },
  zoom: 17,
  zLevel: 1,
  scrollZoom: true,
  doubleClickZoom: false,
  touchZoomRotate: false
});

// Add zoom and rotation controls to the map.
myMap.addControl(new window.Mazemap.mapboxgl.NavigationControl());

myMap.on('load', function() {
  // Initialize a Highlighter for POIs
  // Storing the object on the map just makes it easy to access for other things
  myMap.highlighter = new window.Mazemap.Highlighter(myMap, {
    showOutline: true,
    showFill: true,
    outlineColor: window.Mazemap.Util.Colors.MazeColors.MazeBlue,
    fillColor: window.Mazemap.Util.Colors.MazeColors.MazeBlue
  });
  myMap.on('click', onMapClick);

});

// define a global
var mazeMarker;

function onMapClick(e) {
  // Clear existing, if any
  clearPoiMarker();

  var lngLat = e.lngLat;
  var zLevel = myMap.zLevel;

  // Fetching via Data API
  window.Mazemap.Data.getPoiAt(lngLat, zLevel).then(poi => {
    console.log('Found poi', poi);
    //  printPoiData(poi);

    placePoiMarker(poi);

  }).catch(function() {
    return false;
  });
}
/*
function printPoiData(poi) {
  var poiStr = JSON.stringify(poi, null, 2); // spacing level = 2
  document.getElementById('poi-data').innerHTML = poiStr;

  console.log(poi); // Can also look in your console to see the object there
}
*/

function clearPoiMarker(poi) {
  if (mazeMarker) {
    mazeMarker.remove();
  }
  myMap.highlighter.clear();
};

function placePoiMarker(poi) {

  // Get a center point for the POI, because the data can return a polygon instead of just a point sometimes
  var lngLat = window.Mazemap.Util.getPoiLngLat(poi);

  mazeMarker = new window.Mazemap.MazeMarker({
      color: '#ff00cc',
      innerCircle: true,
      innerCircleColor: '#FFF',
      size: 34,
      innerCircleScale: 0.5,
      zLevel: poi.properties.zLevel
    })
    .setLngLat(lngLat)
    .addTo(myMap);

  // If we have a polygon, use the default 'highlight' function to draw a marked outline around the POI.
  if (poi.geometry.type === "Polygon") {
    myMap.highlighter.highlight(poi);
  }
  myMap.flyTo({
    center: lngLat,
    zoom: 19,
    speed: 0.5
  });
}

/* this is end of pure js */


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>hejsan</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
