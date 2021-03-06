var g_balls = [];
var g_ctx = null;
var g_time;
var C_HEIGHT;
var C_WIDTH;

window.requestAnimFrame = (function(){
   return  window.requestAnimationFrame       ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame    ||
           window.oRequestAnimationFrame      ||
           window.msRequestAnimationFrame     ||
           function( callback ){
             window.setTimeout(callback, 1000 / 60);
           };
   })();

function init() {
  var canvas = document.getElementById('sandbox');
  if (canvas.getContext) {
    g_ctx = canvas.getContext('2d');
    C_HEIGHT = canvas.height;
    C_WIDTH = canvas.width;
   
    // create some balls with random initial co-ordinates and random velocities
    for (var i = 0; i < 500; i++) {
      var x = Math.floor((Math.random() * C_WIDTH));
      var y = Math.floor((Math.random() * C_HEIGHT));
      var vx = Math.floor((Math.random() * 50) + 10) * (Math.random() < 0.5 ? -1 : 1);
      var vy = Math.floor((Math.random() * 50) + 10) * (Math.random() < 0.5 ? -1 : 1);
      g_balls.push(new Ball(x, y, 4, vx, vy));
    }
  
    // start the animation loop
    draw();
  } else {
    document.getElementById('message').style.display = 'block';
  }
}

function draw() {
  g_ctx.fillStyle = "#535353";
  g_ctx.globalAlpha = 0.2;
  g_ctx.fillRect(0, 0, C_WIDTH, C_HEIGHT);
  var now = new Date().getTime();
  var dt = now - (g_time || now);
  g_time = now;

  // requestAnimFrame stalls the animation if the browser tab is not visible. This may
  // result in dt to grow quite large as the last call to draw could have been quite a
  // while ago. We don't want the balls to wander off the canvas due to large dt values.
  // Therefore we cap the dt value at 100 ms.
  // The 100ms limit is quite arbitrary, but it should at least be greater than 32ms ~
  // 30 FPS
  if (dt >= 100) {
    dt = 100;
  }

  g_ctx.fillStyle = '#FFFFDA';
  g_ctx.globalAlpha = 1;
  // update the state of each ball and draw it
  for (var i = 0; i < g_balls.length; i++) {
    g_balls[i].updateState(dt);
    g_balls[i].draw(g_ctx);
  }
  requestAnimFrame(draw);
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
  this.updateState = updateBallState;
 
  /**
   * Draw this ball
   *
   * ctx - the 2d context to draw to
   */
  this.draw = drawBall;
}

function updateBallState(dt) {
  this.x += this.vx * (dt / 1000);
  this.y += this.vy * (dt / 1000);

  // reverse the x-velocity if the ball has hit either the right wall or the left wall
  if ((this.x + this.radius) >= C_WIDTH && this.vx > 0 || (this.x <= this.radius) && this.vx < 0) {
    this.vx *= -1;
  }
 
  // reverse the y-velocity if the ball has hit either the bottom wall or the top wall
  if ((this.y + this.radius) >= C_HEIGHT && this.vy > 0 || (this.y <= this.radius) && this.vy < 0) {
    this.vy *= -1;
  }
}

function drawBall(ctx) {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.closePath();
}