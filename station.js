function Station(departureTime, lineColor, direction) {
  this.departureTime = departureTime;
  this.lineColor = lineColor;
  this.direction = direction;

  // Update the time until departure
  this.updateDepartureTime = function(timeSinceLastUpdate) {
    this.departureTime -= timeSinceLastUpdate;
    //console.log("Updated to " + this.departureTime);
  }
  
  // Check if the train is departing
  // If true, need to update the time
  this.isDeparting = function() {
    if(this.departureTime <= 0) {
      return true;
    }
    
    return false;
  }
  
  // We probably don't want to make the api call to update the departure time after departing in here
  // That contains outside logic, we don't care how the app pulls the departure time info
}