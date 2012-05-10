/*
 * Copyright (C) 2012 David Geary. This code is from the book
 * Core HTML5 Canvas, published by Prentice-Hall in 2012.
 *
 * License:
 *
 * Permission is hereby granted, free of charge, to any person 
 * obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * The Software may not be used to create training material of any sort,
 * including courses, books, instructional videos, presentations, etc.
 * without the express written consent of David Geary.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
*/

var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    scoreboard = document.getElementById('scoreboard'),
    launchVelocityOutput = document.getElementById('launchVelocityOutput'),
    launchAngleOutput = document.getElementById('launchAngleOutput'),

    elapsedTime = undefined,
    launchTime = undefined,

    score = 0,
    lastScore = 0,
    lastMouse = { left: 0, top: 0 },

    threePointer = false,
    needInstructions = true,

    LAUNCHPAD_X = 50,
    LAUNCHPAD_Y = context.canvas.height-50,
    LAUNCHPAD_WIDTH = 50,
    LAUNCHPAD_HEIGHT = 12,
    BALL_RADIUS = 8,
    ARENA_LENGTH_IN_METERS = 10,
    INITIAL_LAUNCH_ANGLE = Math.PI/4,

    launchAngle = INITIAL_LAUNCH_ANGLE,
    pixelsPerMeter = canvas.width / ARENA_LENGTH_IN_METERS,

    // LaunchPad.................................................

    launchPadPainter = {
      LAUNCHPAD_FILL_STYLE: 'rgb(100,140,230)',

      paint: function (ledge, context) { 
         context.save();
         context.fillStyle = this.LAUNCHPAD_FILL_STYLE;
         context.fillRect(LAUNCHPAD_X, LAUNCHPAD_Y,
                          LAUNCHPAD_WIDTH, LAUNCHPAD_HEIGHT);
         context.restore();
      }
    },

    launchPad = new Sprite('launchPad', launchPadPainter),

    // Ball......................................................

    ballPainter = {
      BALL_FILL_STYLE: 'rgb(255,255,0)',
      BALL_STROKE_STYLE: 'rgb(0,0,0,0.4)',
      
      paint: function (ball, context) { 
         context.save();
         context.shadowColor = undefined;
         context.lineWidth = 2;
         context.fillStyle = this.BALL_FILL_STYLE;
         context.strokeStyle = this.BALL_STROKE_STYLE;

         context.beginPath();
         context.arc(ball.left + BALL_RADIUS, ball.top + BALL_RADIUS,
                     ball.radius, 0, Math.PI*2, false);

         context.clip();
         context.fill();
         context.stroke();
         context.restore();
      }
    },

    // Lob behavior..............................................
    
    lob = {
       lastTime: 0,
       GRAVITY_FORCE: 9.81, // m/s/s
       
       applyGravity: function (elapsed) {
          ball.velocityY = (this.GRAVITY_FORCE * elapsed) -
                           (launchVelocity * Math.sin(launchAngle));
       },

       updateBallPosition: function (updateDelta) {
          ball.left += ball.velocityX * (updateDelta) * pixelsPerMeter;
          ball.top += ball.velocityY * (updateDelta) * pixelsPerMeter;
       },

       checkForThreePointer: function () {
          if (ball.top < 0) {
             threePointer = true;
          }
       },

       checkBallBounds: function () {
          if (ball.top > canvas.height || ball.left > canvas.width)  {
            reset();
         }
       },
       
       execute: function (ball, context, time) {
          var updateDelta,
              elapsedFlightTime;

          if (ballInFlight) {
             elapsedFrameTime  = (time - this.lastTime)/1000,
             elapsedFlightTime = (time - launchTime)/1000;

             this.applyGravity(elapsedFlightTime);
             this.updateBallPosition(elapsedFrameTime);
             this.checkForThreePointer();
             this.checkBallBounds();
          }
          this.lastTime = time;
       }
    },
   
    ball = new Sprite('ball', ballPainter, [ lob ]),
    ballInFlight = false,

    // Bucket....................................................

    BUCKET_LEFT = 668,
    BUCKET_TOP = canvas.height - 100,
    BUCKET_WIDTH = 83,
    BUCKET_HEIGHT = 62,
    bucketHitCenter = { x: BUCKET_LEFT + 2*this.BUCKET_WIDTH/3,
                        y: BUCKET_TOP + BUCKET_HEIGHT/8
                      },

    bucketHitRadius = BUCKET_WIDTH/8,
    bucketImage = new Image(),

    catchBall = {
       isBallInBucket: function() {
         var ballCenter = { x: ball.left + BALL_RADIUS,
                            y: ball.top  + BALL_RADIUS
                          },

             distance = Math.sqrt(
                           Math.pow(bucketHitCenter.x - ballCenter.x, 2) +
                           Math.pow(bucketHitCenter.y - ballCenter.y, 2));

             return distance < BALL_RADIUS + bucketHitRadius;
       },

       adjustScore: function() {
           if (threePointer) lastScore = 3;
           else              lastScore = 2;

           score += lastScore;
           scoreboard.innerHTML = score;
       },
       
       execute: function (bucket, context, time) {
          if (ballInFlight && this.isBallInBucket()) {
              reset();
               //freeze();
              this.adjustScore();
          }
       }
    },

    bucket = new Sprite('bucket', {

         paint: function (sprite, context) {
            context.drawImage(bucketImage, BUCKET_LEFT, BUCKET_TOP);
            context.fillStyle = 'white';
            context.beginPath();
            context.arc(bucketHitCenter.x, bucketHitCenter.y,
                        bucketHitRadius, 0, Math.PI*2, false);
            context.fill();
         }
      },

      [ catchBall ]
    );
  
// Functions.....................................................

function freeze() {
   ball.velocityX = 0;
   ball.velocityY = 0;
   ballInFlight = false;
   needInstructions = false;
}

function reset() {
   ball.left = LAUNCHPAD_X + LAUNCHPAD_WIDTH/2 - BALL_RADIUS;
   ball.top = LAUNCHPAD_Y - ball.height/2 - BALL_RADIUS;
   ball.velocityX = 0;
   ball.velocityY = 0;
   ballInFlight = false;
   needInstructions = false;
   lastScore = 0;
}

function showText(text) {
   var metrics;

   metrics = context.measureText(text);

   context.save();
   context.shadowColor = undefined;
   context.strokeStyle = 'navy';
   context.fillStyle = 'goldenrod';

   context.fillText(text,
                    canvas.width/2 - metrics.width/2,
                    canvas.height/2);

   context.strokeText(text,
                      canvas.width/2 - metrics.width/2,
                      canvas.height/2);
   context.restore();
}

function drawRubberband() {
   context.beginPath();
   context.moveTo(ball.left + BALL_RADIUS, ball.top + BALL_RADIUS);
   context.lineTo(bucketHitCenter.x, bucketHitCenter.y);
   context.stroke();
};

function drawGuidewire() {
   context.moveTo(ball.left + BALL_RADIUS, ball.top + BALL_RADIUS);
   context.lineTo(lastMouse.left, lastMouse.top);
   context.stroke();
};

function updateBackgroundText() {
   if (lastScore == 3)        showText('Three pointer!');
   else if (lastScore == 2)   showText('Nice shot!');
   else if (needInstructions) showText('Click to launch ball'); 
};

function resetScoreLater() {
   setTimeout(function () {
      lastScore = 0;
   }, 3000);
};

function updateSprites(time) {
   bucket.update(context, time);
   launchPad.update(context, time);
   ball.update(context, time);
}

function paintSprites() {
   launchPad.paint(context);
   bucket.paint(context);
   ball.paint(context);
}

function mouseToCanvas(e) {
   var rect = canvas.getBoundingClientRect(),
       loc = { x: e.x || e.clientX,
               y: e.y || e.clientY
             };

   loc.x -= rect.left;
   loc.y -= rect.top;

   return loc;
}

// Event handlers................................................

canvas.onmousedown = function(e) {
   var rect;

   e.preventDefault();

   if ( ! ballInFlight) {
     ball.velocityX = launchVelocity * Math.cos(launchAngle);
     ball.velocityY = launchVelocity * Math.sin(launchAngle);
     ballInFlight = true;
     threePointer = false;
     launchTime = +new Date();
   }
};

canvas.onmousemove = function (e) {
   var rect;

   e.preventDefault();

   if ( ! ballInFlight) {
      loc = mouseToCanvas(e);
      lastMouse.left = loc.x;
      lastMouse.top = loc.y;

      deltaX = Math.abs(lastMouse.left - ball.left);
      deltaY = Math.abs(lastMouse.top - ball.top);

      launchAngle = Math.atan(parseFloat(deltaY) / parseFloat(deltaX));
      launchVelocity = 4 * deltaY / Math.sin(launchAngle) / pixelsPerMeter;

      launchVelocityOutput.innerHTML = launchVelocity.toFixed(2);
      launchAngleOutput.innerHTML = (launchAngle * 180/Math.PI).toFixed(2);
   }
};

// Animation Loop................................................

function animate(time) {
   elapsedTime = (time - launchTime) / 1000;
   context.clearRect(0,0,canvas.width,canvas.height);

   if (!ballInFlight) {
      drawGuidewire();
      updateBackgroundText();

      if (lastScore !== 0) { // just scored
         resetScoreLater();      
      }
   }

   updateSprites(time);
   paintSprites();

   drawRubberband();

   window.requestNextAnimationFrame(animate);
}

// Initialization................................................

ball.width = BALL_RADIUS*2;
ball.height = ball.width;
ball.left = LAUNCHPAD_X + LAUNCHPAD_WIDTH/2 - BALL_RADIUS;
ball.top = LAUNCHPAD_Y - ball.height/2 - BALL_RADIUS;
ball.radius = BALL_RADIUS;
 
context.lineWidth = 0.5;
context.strokeStyle = 'rgba(0,0,0,0.5)';
context.shadowColor = 'rgba(0,0,0,0.5)';
context.shadowOffsetX = 2;
context.shadowOffsetY = 2;
context.shadowBlur = 4; 
context.stroke();

context.font = '72px fantasy';

bucketImage.src = '../../shared/images/bucket.png';
bucketImage.onload = function (e) {
   bucket.left = BUCKET_LEFT;
   bucket.top = BUCKET_TOP;
   bucket.width = BUCKET_WIDTH;
   bucket.height = BUCKET_HEIGHT;
};

animate(+new Date());
