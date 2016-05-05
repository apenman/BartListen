var mapped;
var go = true;
var stations = {};
var lastUpdate = 0;
var UPDATE_INTERVAL = 10000; // update every 3000 milliseconds = 3 second
var trigger; 
var ding;

function preload() {
  var url = "http://api.bart.gov/api/etd.aspx?cmd=etd&orig=ALL&key=MW9S-E7SL-26DU-VV8V";
  mapped = loadXML(url, mapStations);
  trigger = UPDATE_INTERVAL;
  ding = loadSound('assets/ding.wav');
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
    var lineColor = station.getElementsByTagName("hexcolor")[0].firstChild.nodeValue;
    var direction = station.getElementsByTagName("direction")[0].firstChild.nodeValue
    
    // Create new Station object and add to map
    stations[stationName] = new Station(departureTime, lineColor, direction);
    //console.log(stations[stationName]);
    //console.log(stationName + " leaves in " + stations[stationName]["seconds"] + " seconds, going " + stations[stationName]["direction"]);
  }
}

// Update station after train has left
// Callback from loadXML after train leaves
function updateStation(data) {
  // update stations map with next departure
  // add error checking to handle cases where train is delayed a bit (??)
}

// Train is leaving, get next departure
// TODO: mark that a request is going out and unmark that var in updateStation after done
          // to avoid any simultaneous updates to station and scatter times a bit more???
function trainLeaving(station) {
  console.log(station + " is leaving");
  // play sound
  ding.setVolume(0.1);
  ding.play();
  // build url to fetch next leaving time
  
  // loadXML with callback updateStation
  

  
}

// Update the time to leave from the stations
// Should trigger based on UPDATE_INTERVAL
// timeElapsed is in seconds as passed in by draw
function updateStations(timeElapsed) {
  for(var station in stations) {
    // Calculate elapsed time by subtracting current with last known update time
    //console.log(station + " is at " + stations[station].seconds);
    stations[station].updateDepartureTime(timeElapsed - lastUpdate);
    //console.log("updated " + station + " to " + stations[station].seconds);
    if(stations[station].isDeparting()) {
      trainLeaving(station);
      // Temp reset for now
      stations[station]["seconds"] = 5 * 1000;
    }
  }
  
  //console.log("updated + " + (timeElapsed - lastUpdate));
  //console.log(stations)
  lastUpdate = timeElapsed;
}

function setup() {

}

function draw() {
  if(millis() > trigger) {
    updateStations(millis() / 1000);
    trigger = millis() + UPDATE_INTERVAL;
  }
}

// XML help
  // xml.getElementsByTagName("tag")
  // xml.firstChild
  // xmlChild.nodeValue -> extracts the value of a node
  
  // Minutes field gets set to "Leaving" when train is leaving