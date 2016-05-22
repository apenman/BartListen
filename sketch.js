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

// Getting lazy, I suppose we can assume it will always have line color
function getLineColorFromXML(xml) {
  var lineColorHex = xml[0].firstChild.nodeValue;
  var lineColor;
  if(lineColorHex) {
    lineColor = hexToRGB(lineColorHex);
  }
  else {
    lineColor = {
      r:0,
      g:0,
      b:0,
      a:100
    }
  }  
  
  return lineColor
}

// Extract the next departure time from XML
// If train is leaving, the departure value is "Leaving" so skip to next scheduled train
// Recursion is unnecessary but implemented for fun
function getDepartureTimeFromXML(xml, index) {
    var departureTimeMins;
    if(index > xml.length - 1) {
      return null;
    }
    else {
      departureTimeMins = parseFloat(xml[index].firstChild.nodeValue);
      return departureTimeMins ? departureTimeMins * 60 : getDepartureTimeFromXML(xml, index + 1);
    }
}

// TODO: Got lazy with null checks in mapStations and updateStation, now just assuming direction and abbreviation are there
function mapStations(data) {
  var xmlStations = data.getElementsByTagName("station");
  
  for(var i = 0; i < xmlStations.length; i++) {
    var station = xmlStations[i];
    var stationName = station.firstChild.firstChild.nodeValue;
    
    if(stationName) {
      var departureTime = 2;//getDepartureTimeFromXML(station.getElementsByTagName("minutes"), 0);
  
      // Get direction train is going
      var direction = station.getElementsByTagName("direction")[0].firstChild.nodeValue
       
      // "abbr" tag is used for the origin station abbreviation
      // "abbreviation" tag is used for the destination stations
      var abbreviation = station.getElementsByTagName("abbr")[0].firstChild.nodeValue;
      
      // Create new Station object and add to map
      stations[stationName] = new Station(
        departureTime,
        getLineColorFromXML(station.getElementsByTagName("hexcolor")),
        direction,
        abbreviation
      );
    }
  }
}

// Update station after train has left
// Callback from loadXML after train leaves
// TODO: Investigate if case exists where trains may be leaving at same time in opposite directions
function updateStation(data) {
  // This is similar to initial load, find overlaps
  var xmlStations = data.getElementsByTagName("station");

  for(var i = 0; i < xmlStations.length; i++) {
    var station = xmlStations[i];
    // update stations map with next departure
    var stationName = station.firstChild.firstChild.nodeValue;
    
    if(stationName) {
      var departureTime = getDepartureTimeFromXML(station.getElementsByTagName("minutes"), 0);

      var direction = station.getElementsByTagName("direction")[0].firstChild.nodeValue
      
      stations[stationName].updateStation(
        departureTime,
        getLineColorFromXML(station.getElementsByTagName("hexcolor")),
        direction
      );
    }
  }
}

// Train is leaving, get next departure
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
      blips.push(new Blip(stations[station]["lineColor"], station));
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
    if(blips[i].rad >= 100) {
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