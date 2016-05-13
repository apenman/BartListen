// TODO: clean up the blip logic
        // This can be refactored, probably will once more UI changes come along anyways



function Blip(fillColor) {
  this.x = random(windowWidth);
  this.y = random(windowHeight);
  // Initialize to starting radius of 10
  this.rad = 10;
  // this.r = random(255);
  // this.b = random(255);
  // this.g = random(255);
  // this.a = 100;
  // temp for now. should map to hex value passed in
  console.log("BLIP COLOR");
  console.log(fillColor);
  // Store fillColor as a string because we need to modify hex value to add transparency
  this.fillColor = fillColor;
  this.transparency = 0;
  
  this.display = function() {
    stroke(255, this.a);
    fill(color(fillColor));
    ellipse(this.x, this.y, this.rad * 2, this.rad * 2);
  }
  
  this.update = function() {
    this.rad += 5;
  // NOTE: Handling opacity with Hex http://stackoverflow.com/questions/15852122/hex-transparency-in-colors
  // TODO: Write function to make blip transparent as it grows -> prepend proper value  
    var splitColor = this.fillColor.split("#");
    var newColor = splitColor[0];
    this.transparency += 25;
    switch(this.transparency) {
      case 25:
        newColor += "40";
        break;
      case 50:
        newColor += "80";
        break;
      case 75:
        newColor += "BF";
      case 100:
        newColor += "FF";
      default:
    }
    
    newColor += splitColor[1];
  }

}