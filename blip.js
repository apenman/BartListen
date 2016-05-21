
function Blip(fillColor, station) {
  this.station = station;
  // Randomize coordinate but keep away from edges of screen
  this.x = random(50, windowWidth - 50);
  this.y = random(50, windowHeight - 50);
  // Initialize to starting radius of 10
  this.rad = 10;
  this.fillColor = fillColor;
  
  this.display = function() {
    stroke(255, this.fillColor.a);
    fill(color(this.fillColor.r, this.fillColor.g, this.fillColor.b, this.fillColor.a));
    ellipse(this.x, this.y, this.rad * 2, this.rad * 2);
    fill(0, 0, 0, this.fillColor.a);
    textAlign(CENTER);
    text(this.station, this.x, this.y)
  }
  
  this.update = function() {
    this.rad += .75;
    this.fillColor.a -= 1;
  }
}