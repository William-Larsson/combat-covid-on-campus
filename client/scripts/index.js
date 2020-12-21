/**
 * Axios test -- make sure it works when Daresay API is running again
 */
function fetchSensorData() {
    const data = axios.get('http://localhost:8081/api/sensordata')
    .then(response => {
        // console.log(response);
        response.data.forEach(item => {
            placeSensorMarker(item);
        })
    }).catch(error => {
        console.log(error);
    }); 
}
fetchSensorData();

// Define global map marker
var mazeMarker;


/**
 * Map options and initial state
 */
var mapOptions = {
    // container id specified in the HTML
    container: 'map',
    //	sharepoitype:'poi',
    //  sharepoi:'773314',
    campusid: 289,

    // initial position in lngLat format
    center: {lng: 20.30770244572698, lat: 63.81948724118865},
    zoom: 17,
    zLevel: 1,
    scrollZoom: true,
    doubleClickZoom: false,
    touchZoomRotate: false
}


/**
 * Initialize the MazeMap container 
 */
var myMap = new Mazemap.Map(mapOptions);


/**
 * Add zoom and rotation controls to the map. 
 */ 
myMap.addControl(new Mazemap.mapboxgl.NavigationControl());


/**
 * Initialize onClick handler and highlighter for POI:s (Point of interest)
 */
myMap.on('load', function(){
    myMap.on('click', onMapClick);

    // Storing the object on the map just makes it easy to access for other things
    myMap.highlighter = new Mazemap.Highlighter( myMap, {
        showOutline: true,
        showFill: true,
        outlineColor: Mazemap.Util.Colors.MazeColors.MazeBlue,
        fillColor: Mazemap.Util.Colors.MazeColors.MazeBlue
    } );
});


/**
 * Map onclick handler. 
 * Clear any existing marker and set a new marker 
 * for the point of interest. 
 * 
 * @param {*} e = the event
 */
function onMapClick(e){
    clearPOIMarker();

    var lngLat = e.lngLat;
    var zLevel = myMap.zLevel;

    // Fetching via Data API
    Mazemap.Data.getPoiAt(lngLat, zLevel)
        .then(poi => {
            console.log('Found poi', poi);
            // printPOIData(poi);
            placePOIMarker(poi);
        }).catch(() => false);
}


/**
 * Removes existing map marker from map view
 */
function clearPOIMarker(){
    if(mazeMarker){
        mazeMarker.remove();
    }
    myMap.highlighter.clear();
};


/**
 * Place a new marker-icon on the map
 * @param {*} poi = point of interest (click location)
 */
function placePOIMarker(poi){

    // Get a center point for the POI, because the data can 
    //return a polygon instead of just a point sometimes
    var lngLat = Mazemap.Util.getPoiLngLat(poi);

    mazeMarker = new Mazemap.MazeMarker({
        color: '#ff00cc',
        innerCircle: true,
        innerCircleColor: '#FFF',
        size: 34,
        innerCircleScale: 0.5,
        zLevel: poi.properties.zLevel
    })
    .setLngLat(lngLat)
    .addTo(myMap);

    // If we have a polygon, use the default 'highlight' function to 
    // draw a marked outline around the POI.
    if(poi.geometry.type === "Polygon"){
        myMap.highlighter.highlight(poi);
    }
    myMap.flyTo({center: lngLat, zoom: 19, speed: 0.5});
}

function placeSensorMarker(data){
    var lngLat = {lng: data.LAT, lat: data.LONG}; // TODO: Kom ihåg att byta plats
    var color;
    
    switch(data.heatValue) {
        case 0: 
            color = 'white';
            break;
        case 1:
            color = 'blue';
            break;
        case 2:
            color = 'coral';
            break;
        case 3:
            color = 'hotpink';
            break;
        case 4:
            color = 'orange';
            break;
        case 5:
            color = 'red';
            break;
        default:
            color = 'white';   
    }

    new Mazemap.MazeMarker( {
        shape: 'circle',
        color: color,
        size: 36,
        zLevel: data.floor - 1
    })
    .setLngLat( lngLat ).addTo(myMap);
}
