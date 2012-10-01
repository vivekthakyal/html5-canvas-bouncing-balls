var g_balls = [];
var g_ctx = null;
var g_interval = 16; //16ms ~ 60 FPS 

function init() {
  var canvas = document.getElementById('sandbox');
  if (canvas.getContext) {
    g_ctx = canvas.getContext('2d');
    g_ctx.fillStyle = '#FFFFDA';
    
    // create some balls with random initial co-ordinates and random velocities
    for (var i = 0; i < 100; i++) {
      var x = Math.floor((Math.random() * 150));
      var y = Math.floor((Math.random() * 150));
      var vx = Math.floor((Math.random() * 50) + 10) * (Math.random() < 0.5 ? -1 : 1);
      var vy = Math.floor((Math.random() * 50) + 10) * (Math.random() < 0.5 ? -1 : 1);
      g_balls.push(new Ball(x, y, 4, vx, vy));
    }
    
    // start the animation loop
    setInterval(draw, g_interval);
  }
}

function draw() {
  g_ctx.clearRect(0, 0, 150, 150);
  // update the state of each ball and draw it
  for (var i = 0; i < g_balls.length; i++) {
    g_balls[i].updateState(g_interval);
    g_balls[i].draw(g_ctx);
  }
}

/**
 * A ball class
 * x      - x co-ordinate
 * y      - y co-ordinate
 * radius - radius of the ball
 * vx     - velocity along the x axis
 * vy     - velocity along the y axis
 */
function Ball(x, y, radius, vx, vy) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.vx = vx;
  this.vy = vy;
  
  /**
   * Updates the location of the ball according to velocity and the amount of time passed
   *
   * dt - delta time elapsed since last call to draw (in milliseconds)
   */
  this.updateState = function(dt) {
    this.x += this.vx * (dt / 1000);
    this.y += this.vy * (dt / 1000);
    
    // reverse the x-velocity if the ball has hit either the right wall or the left wall
    if ((this.x + this.radius) >= 150 && this.vx > 0 || (this.x <= this.radius) && this.vx < 0) {
      this.vx *= -1;
    }
    
    // reverse the y-velocity if the ball has hit either the bottom wall or the top wall
    if ((this.y + this.radius) >= 150 && this.vy > 0 || (this.y <= this.radius) && this.vy < 0) {
      this.vy *= -1;
    }
  }
  
  /**
   * Draw this ball
   *
   * ctx - the 2d context to draw to
   */
  this.draw = function(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.closePath();
  }
}
