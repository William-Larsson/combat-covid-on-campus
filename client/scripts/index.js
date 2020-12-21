/**
 * Axios test -- make sure it works when Daresay API is running again
 */
function TestAxios() {
    axios.get('https://daresay-dev.eu-gb.cf.appdomain.cloud/innovativa/A81758FFFE03BC34/2020-11-01/2020-11-10/1/139kTnm10ksR')
    .then(response => {
        console.log("Axios get success!! ");
    }).catch(error => {
        console.log(error);
    }); 
}
TestAxios();

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

// Ev. fixa så det går att slå på och av?
myMap.on('load', function(){
    var lngLat = myMap.getCenter();
    var marker = new Mazemap.MazeMarker( {
        shape: 'circle',
        color: 'red',
        size: 36,
        zLevel: 1
    })
    .setLngLat( lngLat ).addTo(myMap);
});
