// TODO: clean up the blip logic
        // This can be refactored, probably will once more UI changes come along anyways



function Blip(fillColor) {
  this.x = random(windowWidth);
  this.y = random(windowHeight);
  // Initialize to starting radius of 10
  this.rad = 10;
  this.fillColor = fillColor;
  
  this.display = function() {
    stroke(255, this.fillColor.a);
    fill(color(this.fillColor.r, this.fillColor.g, this.fillColor.b, this.fillColor.a));
    ellipse(this.x, this.y, this.rad * 2, this.rad * 2);
  }
  
  this.update = function() {
    this.rad += 1;
    this.fillColor.a -= 1;
  }
}