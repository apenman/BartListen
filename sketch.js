var go = true;
var stations = {};
var blips = [];
var lastUpdate = 0;
var UPDATE_INTERVAL = 2000; // update every 1000 milliseconds = 1 second; increase later for less checking since api only works on minute basis anyways
var trigger; 
var ding;

// FOR SETTING UP URL FOR BART REQUESTS
// ADD STATION ABBREVIATION OR 'ALL' BETWEEN baseUrl and urlKey
var baseUrl = "http://api.bart.gov/api/etd.aspx?cmd=etd&orig=";
var urlKey = "&key=MW9S-E7SL-26DU-VV8V";

function preload() {
  var url = buildRequestUrlFromStation("ALL");
  loadXML(url, mapStations);
  ding = loadSound('assets/ding.wav');
}

// Return request url for given station abbreviation
// Pass in 'ALL' for all stations
function buildRequestUrlFromStation(abbreviation) {
  return baseUrl + abbreviation + urlKey
}

// Bart API returns us line colors in Hex; Do one time conversion to RGBA to make blip fadeout easier
// Taken from http://stackoverflow.com/a/5624139
// Modified to add default alpha
function hexToRGB(hex){
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 100
    } : null;
}

function mapStations(data) {
  var xmlStations = data.getElementsByTagName("station");
  // TODO: handle case where xml node is missing (null values for firstChild)
            // probably just set each as a variable first
  for(var i = 0; i < xmlStations.length; i++) {
    var station = xmlStations[i];
    var stationName = station.firstChild.firstChild.nodeValue;
    
    // Get time til departure in seconds
        // I THINK DEPARTURE TIME BECOMES NULL WHEN PARSEFLOAT TRIES TO PARSE OUT "LEAVING"
        // If departure time is null -> get the next element in the array? set off a blip first?
    var departureTime = parseFloat(station.getElementsByTagName("minutes")[0].firstChild.nodeValue) * 60;
    
    // Returns null if invalid
    // TODO: handle null
    var lineColor = hexToRGB(station.getElementsByTagName("hexcolor")[0].firstChild.nodeValue);
    
    // Get direction train is going
    var direction = station.getElementsByTagName("direction")[0].firstChild.nodeValue
     
    // "abbr" tag is used for the origin station abbreviation
    // "abbreviation" tag is used for the destination stations
    var abbreviation = station.getElementsByTagName("abbr")[0].firstChild.nodeValue;
    
    // Create new Station object and add to map
    stations[stationName] = new Station(departureTime, lineColor, direction, abbreviation);
  }
}

// Update station after train has left
// Callback from loadXML after train leaves
// TODO: Check that departure time is not "LEAVING" so we don't update to exact same train, due to timing of call
  // Investigate if case exists where trains may be leaving at same time in opposite directions
function updateStation(data) {
  // This is similar to initial load, find overlaps
  var xmlStations = data.getElementsByTagName("station");
    // TODO: handle case where xml node is missing (null values for firstChild)
            // probably just set each as a variable first
  for(var i = 0; i < xmlStations.length; i++) {
    var station = xmlStations[i];
    // update stations map with next departure
    // add error checking to handle cases where train is delayed a bit (??)
    var stationName = station.firstChild.firstChild.nodeValue;
    var departureTime = parseFloat(station.getElementsByTagName("minutes")[0].firstChild.nodeValue) * 60;
    var lineColor = station.getElementsByTagName("hexcolor")[0].firstChild.nodeValue;
    var direction = station.getElementsByTagName("direction")[0].firstChild.nodeValue
  
    stations[stationName].updateStation(departureTime, lineColor, direction);
  }
}

// Train is leaving, get next departure
// TODO: mark that a request is going out and unmark that var in updateStation after done
          // to avoid any simultaneous updates to station and scatter times a bit more???
function trainLeaving(station) {
  // play sound
  ding.setVolume(0.1);
  ding.play();
  // build url to fetch next leaving time
  var url = buildRequestUrlFromStation(station.abbreviation);
  // loadXML with callback updateStation
  loadXML(url, updateStation);
}

// Update the time to leave from the stations
// Should trigger based on UPDATE_INTERVAL
// timeElapsed is in seconds as passed in by draw
function updateStations(timeElapsed) {
  for(var station in stations) {
    // Calculate elapsed time by subtracting current with last known update time
    stations[station].updateDepartureTime(timeElapsed - lastUpdate);
    if(stations[station].isDeparting()) {
      trainLeaving(stations[station]);
      // Add new blip to the list of current blips
      blips.push(new Blip(stations[station]["lineColor"]));
    }
  }

  lastUpdate = timeElapsed;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  trigger = UPDATE_INTERVAL;
}

function draw() {
  background(255);
  if(millis() > trigger) {
    updateStations(millis() / 1000);
    trigger = millis() + UPDATE_INTERVAL;
  }
  
  // May skip over due to splice. Look into reversing for loop?
  // Does it matter much with rate of draw though?
  for(var i = 0; i < blips.length; i++) {
    blips[i].update();
    if(blips[i].a <= 0) {
      blips.splice(i, 1);
    }
    else {
      blips[i].display();
    }
  }
}

// XML help
  // xml.getElementsByTagName("tag")
  // xml.firstChild
  // xmlChild.nodeValue -> extracts the value of a node
  
  // Minutes field gets set to "Leaving" when train is leaving