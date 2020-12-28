// Define global map marker
var mazeMarker;
var userPosition;
var routeController;
var start = { lngLat: {lng: 20.30770244572698, lat: 63.81948724118865}, zLevel: 0};
var dest = { lngLat: {lng: 20.307079, lat: 63.819508}, zLevel: 2};


/**
 * Fetch LoRa sensor data from server and place data-points for 
 * each sensor on screen
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


/**
 * MazeMap options and initial state
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
    var lngLat = e.lngLat;
    var zLevel = myMap.zLevel;

    // Fetching via Data API
    Mazemap.Data.getPoiAt(lngLat, zLevel)
        .then(poi => {
            // console.log(poi)
            // printPOIData(poi);
            placePOIMarker(poi);
            document.getElementById('btn_search').style.display = "block";
        }).catch(error => {
            document.getElementById('btn_search').style.display = "none";
        })
}


/**
 * Removes existing map marker and 
 * clears the highlighted "room" from map view  
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
    clearPOIMarker();
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


/**
 * Place the "heat-map" circles on the map
 * @param {LAT: float, LNG: float, heatValue: int} data 
 */
function placeSensorMarker(data){
    var lngLat = {lng: data.LAT, lat: data.LONG}; // TODO: Change lat and lng when database is fixed.
    var color;
    
    switch(data.heatValue) {
        case 0: 
            color = '#FFF8DE';
            break;
        case 1:
            color = '#FFF33B';
            break;
        case 2:
            color = '#FDC70C';
            break;
        case 3:
            color = '#F3903F';
            break;
        case 4:
            color = '#ED683C';
            break;
        case 5:
            color = '#E93E3A';
            break;
        default:
            color = '#FFF8DE';   
    }

    new Mazemap.MazeMarker( {
        shape: 'circle',
        color: color,
        size: 36,
        zLevel: data.floor - 1
    })
    .setLngLat( lngLat ).addTo(myMap);
}


/**
 * When the map has loaded, instantiate a route controller 
 * that can be used to paint a route between two points on the map
 */
myMap.on('load', function(){
    routeController = new Mazemap.RouteController(myMap, {
        routeLineColorPrimary: '#0099EA',
        routeLineColorSecondary: '#888888'
    });
});


/**
 * Paint a route on the map between two points on the map
 * Can be either objects with lngLat & z-level or a poiID. 
 * @param {lngLat: {lng: float, lat: float}, zLevel: int} start 
 * @param {lngLat: {lng: float, lat: float}, zLevel: int} dest 
 */
function setRoute( start, dest ){
    routeController.clear(); // Clear existing route, if any

    Mazemap.Data.getRouteJSON(start, dest)
    .then(function(geojson){
        // console.log('@ geojson', geojson);
        routeController.setPath(geojson);
        var bounds = Mazemap.Util.Turf.bbox(geojson);
        myMap.fitBounds( bounds, {padding: 100} );
    })
    .catch((error) => console.log(error));
}


/**
 * Get user GPS location from the browser if the user 
 * gives us permission to access it. 
 */
navigator.geolocation.getCurrentPosition((location) => {
    console.log(`Lat: ${location.coords.latitude} , lng: ${location.coords.longitude}`)
    userPosition = {lngLat: {lng: location.coords.longitude, lat: location.coords.latitude}, zlevel: 0}

    var blueDot = new Mazemap.BlueDot({
        zLevel: 1,
        accuracyCircle: true
    })
    .setLngLat(userPosition.lngLat)
    .setAccuracy(10)
    .addTo(myMap);
})


/**
 * Route button from HTML onclick func. 
 */
document.getElementById('btn_search').onclick = () => {
    if (mazeMarker) {
        const destPosition = {lngLat: mazeMarker._lngLat, zLevel: mazeMarker.options.zLevel};
        //console.log(`User pos: ${userPosition} \nDest pos: ${destPosition}`);
        setRoute(userPosition, destPosition);
        document.getElementById('btn_search').style.display = "none";
    }
}