function Blip(color) {
  this.x = random(windowWidth);
  this.y = random(windowHeight);
  // Initialize to starting radius of 10
  this.rad = 10;
  this.r = random(255);
  this.b = random(255);
  this.g = random(255);
  this.a = 100;
  // temp for now. should map to hex value passed in
  this.color = random(100);
  
  this.display = function() {
    stroke(255, this.a);
    fill(this.r, this.b, this.g, this.a);
    ellipse(this.x, this.y, this.rad * 2, this.rad * 2);
  }
  
  this.update = function() {
    this.rad += 1;
    this.a -= 1;
    
    if(this.a <= 0) {
      return false;
    }
  }
}