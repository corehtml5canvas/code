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

    GRAVITY_FORCE = 9.81,  // 9.81 m/s / s
    CANVAS_HEIGHT_IN_METERS = 10, // 10 meters
    pixelsPerMeter = canvas.height / CANVAS_HEIGHT_IN_METERS;

    thrustersCanvas = document.getElementById('thrustersCanvas'),
    thrustersContext = thrustersCanvas.getContext('2d'),

    lastTime = 0,         // Time of last animation frame
    fps = 60,             // Frames/second

    // AnimationTimers....................................................

    PUSH_ANIMATION_DURATION = 800,
    pushAnimationTimer    = new AnimationTimer(PUSH_ANIMATION_DURATION),
    fallingAnimationTimer = new AnimationTimer(),

    // Ledge information..............................................

    ledgeInfos = [
        { left: 40, top: 75,  width: 50, height: 12, color: 'rgb(255,255,0)' },
        { left: 220,  top: 455, width: 50, height: 12, color: 'rgb(100,80,205)' }
    ],

    ledges = [ledgeInfos.length],
   
    // Ball behaviors................................................

    LEFT = 1,
    RIGHT = 2,
    arrow = undefined,

    BALL_RADIUS = 18,
    BALL_INITIAL_LOCATION = {
      top:  ledgeInfos[0].top - BALL_RADIUS*2,
      left: ledgeInfos[0].left +
            ledgeInfos[0].width/2 - BALL_RADIUS
    },

    fallOnLedge = {
       ballWillHitLedge: function (ledge) {
          var ballRight = ball.left + ball.width,
              ledgeRight = ledge.left + ledge.width,
              ballBottom = ball.top + ball.height,
              nextBallBottomEstimate = ballBottom + ball.velocityY / fps;
          
          return ballRight > ledge.left &&
                 ball.left < ledgeRight &&
                 ballBottom < ledge.top &&
                 nextBallBottomEstimate > ledge.top;
      },
       
      execute: function (sprite, context, time) {
         if (isBallFalling()) {
            ledges.forEach(function (ledge) {
               if (fallOnLedge.ballWillHitLedge(ledge)) {  // this var. is DOMWindow
                  fallingAnimationTimer.stop();
                  pushAnimationTimer.stop();
   
                  sprite.top = ledge.top - sprite.height;
                  sprite.velocityY = 0;
               }
            });
         }
      }
    },
   
    moveBall = {
      execute: function (sprite, context, time) {
         if (pushAnimationTimer.isRunning()) {
            if (arrow === LEFT) ball.left -= ball.velocityX / fps;
            else                ball.left += ball.velocityX / fps;

            if (getLedgeUnderBall()) {
               if (pushAnimationTimer.getElapsedTime() > 800) {
                  pushAnimationTimer.stop();
               }
               if (pushAnimationTimer.getElapsedTime() > 200) {
                  pushAnimationTimer.stop();
               }
            }
            else if ( ! isBallFalling()) {
               startFalling();
            }
         }

         if (isBallFalling()) {
            ball.velocityY = GRAVITY_FORCE *
               (fallingAnimationTimer.getElapsedTime()/1000) * pixelsPerMeter;

            ball.top += ball.velocityY / fps;

            if (ball.top > canvas.height) {
               stopFalling();
            }
         }
      }
    },

    // Ball sprite...................................................

    ball = new Sprite('ball',
       {
          paint: function (sprite, context) {
             context.save();
             context.beginPath();
             context.arc(sprite.left + sprite.width/2,
                         sprite.top + sprite.height/2,
                         BALL_RADIUS, 0, Math.PI*2, false);
             context.clip();

             context.shadowColor = 'rgba(0,0,255,0.7)';
             context.shadowOffsetX = -4;
             context.shadowOffsetY = -4;
             context.shadowBlur = 8;

             context.lineWidth = 2;
             context.strokeStyle = 'rgba(100,100,195,0.8)';
             context.stroke();

             context.beginPath();
             context.arc(sprite.left + sprite.width/2,
                         sprite.top + sprite.height/2,
                         BALL_RADIUS/2, 0, Math.PI*2, false);
             context.clip();

             context.shadowColor = 'rgba(255,255,0,1.0)';
             context.shadowOffsetX = -4;
             context.shadowOffsetY = -4;
             context.shadowBlur = 8;
             context.stroke();

             context.restore();
          }
       },

       [ fallOnLedge, moveBall ]
    );

// Functions.....................................................

function paintBall(x, y, w, h, radius, context) {
   context.save();
   context.beginPath();
   context.arc(x + w/2, y + h/2,
               radius, 0, Math.PI*2, false);
   context.clip();

   context.shadowColor = 'rgba(0,0,0,1.0)';
   context.shadowOffsetX = -4;
   context.shadowOffsetY = -4;
   context.shadowBlur = 8;

   context.lineWidth = 2;
   context.strokeStyle = 'rgba(100,100,195,0.8)';
   context.stroke();

   context.beginPath();
   context.arc(x + w/2, y + h/2,
               radius/2, 0, Math.PI*2, false);
   context.clip();

   context.shadowColor = 'rgba(255,255,0,1.0)';
   context.shadowOffsetX = -4;
   context.shadowOffsetY = -4;
   context.shadowBlur = 8;
   context.stroke();

   context.restore();
}

function paintLedge(sprite, context, color) {
   context.save();
   context.shadowColor = 'rgba(0,0,0,0.5)';
   context.shadowBlur = 8;
   context.shadowOffsetX = 2;
   context.shadowOffsetY = 2;
   context.fillStyle = color;

   context.fillRect(sprite.left,sprite.top,sprite.width,sprite.height);
   context.restore();
}

function pushBallLeft() {
   if (pushAnimationTimer.isRunning()) {
      pushAnimationTimer.stop();
      ball.velocityX = ball.velocityX * 1.5;
   }
   arrow = LEFT;
   pushAnimationTimer.start();
}

function pushBallRight() {
   if (pushAnimationTimer.isRunning()) {
      pushAnimationTimer.stop();
      ball.velocityX = ball.velocityX * 1.5;
   }
   arrow = RIGHT;
   pushAnimationTimer.start();
}

function startFalling() {
   fallingAnimationTimer.start();
   ball.velocityX = 110;
   ball.velocityY = 200;
}

function stopFalling() {
   reset();
}

function reset() {
   fallingAnimationTimer.stop();
   pushAnimationTimer.stop();

   ball.left = BALL_INITIAL_LOCATION.left;
   ball.top = BALL_INITIAL_LOCATION.top;
   ball.velocityY = 0;
}

function isBallFalling() {
   return fallingAnimationTimer.isRunning();
}

function getLedgeUnderBall() {
   var ledge;

   for (var i=0; i < ledges.length; i++) {
      ledge = ledges[i]; 
      if (ball.left + 2*BALL_RADIUS > ledge.left &&
          ball.left < ledge.left + ledge.width       &&
          ball.top + ball.height === ledge.top) {
         return ledge;
      }
   }
   return undefined;
}

// Thrusters.....................................................

function paintThrusters() {
   thrustersContext.clearRect(0,0,
      thrustersCanvas.width,thrustersCanvas.height);

   if (pushAnimationTimer.isRunning()) 
      thrustersContext.fillStyle = 'rgb(255,255,0)';
   else  
      thrustersContext.fillStyle = 'rgba(100,140,230,0.3)';

   if (arrow === LEFT) {
      paintLeftArrow(thrustersContext);
      thrustersContext.fillStyle = 'rgba(100,140,230,0.3)';
      paintRightArrow(thrustersContext);
   }
   else {
      paintRightArrow(thrustersContext);
      thrustersContext.fillStyle = 'rgba(100,140,230,0.3)';
      paintLeftArrow(thrustersContext);
   }
}

function paintRightArrow(context) {
   thrustersContext.save();
   thrustersContext.translate(thrustersCanvas.width, 0);
   thrustersContext.scale(-1,1);
   paintLeftArrow(context);
   thrustersContext.restore();
}

function paintLeftArrow(context) {
   var ARROW_MARGIN = 10;

   context.beginPath();
      
   context.moveTo( thrustersCanvas.width/2 - ARROW_MARGIN/2,
                   ARROW_MARGIN/2);

   context.lineTo( thrustersCanvas.width/2 - ARROW_MARGIN/2,
                   thrustersCanvas.height  - ARROW_MARGIN);

   context.quadraticCurveTo(
      thrustersCanvas.width/2 - ARROW_MARGIN/2,
      thrustersCanvas.height  - ARROW_MARGIN/2,
      thrustersCanvas.width/2 - ARROW_MARGIN,
      thrustersCanvas.height  - ARROW_MARGIN/2);

   context.lineTo(ARROW_MARGIN,
      thrustersCanvas.height/2 + ARROW_MARGIN/2);

   context.quadraticCurveTo(
      ARROW_MARGIN - 3,
      thrustersCanvas.height/2,
      ARROW_MARGIN,
      thrustersCanvas.height/2 - ARROW_MARGIN/2);

   context.lineTo(thrustersCanvas.width/2 - ARROW_MARGIN,
                  ARROW_MARGIN/2);

   context.quadraticCurveTo(
      thrustersCanvas.width/2 - ARROW_MARGIN,
      ARROW_MARGIN/2,
      thrustersCanvas.width/2 - ARROW_MARGIN/2,
      ARROW_MARGIN/2);

   context.fill();
   context.stroke();
}

// Animation functions...........................................

function calculateFps(time) {
   var fps = 1000 / (time - lastTime);
   lastTime = time;
   return fps; 
}

function updateSprites(time) {
   ball.update(context, time);
   ledges.forEach(function(ledge) {
      ledge.update(context, time);
   });
}

function paintSprites() {
   ball.paint(context);
   ledges.forEach(function(ledge) {
      ledge.paint(context);
   });
}

function animate(time) {
   fps = calculateFps(time);

   context.clearRect(0,0,canvas.width,canvas.height);
   updateSprites(time);
   paintSprites();
   paintThrusters();

   window.requestNextAnimationFrame(animate);
}

// Event handlers................................................

thrustersCanvas.onmousedown = function canvasMouseDown(e) {
   var rect = thrustersCanvas.getBoundingClientRect(),
   x = e.x || e.clientX,
   y = e.y || e.clientY;

   e.preventDefault();
   e.stopPropagation();

   if (x-rect.left > thrustersCanvas.width/2) {
      pushBallRight();
   }
   else {
      pushBallLeft();
   }
};

// Initialization................................................

var BALL_SLOW_VELOCITY_X = 30,
    BALL_SLOW_VELOCITY_Y = 7,
    BALL_VELOCITY_X = 110,
    BALL_VELOCITY_Y = 200,
    index = 0;
    
thrustersContext.strokeStyle = 'rgba(100,140,230,0.6)';
thrustersContext.shadowColor = 'rgba(0,0,0,0.3)';
thrustersContext.shadowBlur = 6;
thrustersContext.shadowX = 4;
thrustersContext.shadowY = 4;

ball.left = BALL_INITIAL_LOCATION.left;
ball.top = BALL_INITIAL_LOCATION.top;
ball.width = BALL_RADIUS*2;
ball.height = BALL_RADIUS*2;
ball.velocityX = 110;
ball.velocityY = 0;

ledges.forEach(function(ledge) {
   index = 0;
   
   ledgeInfos.forEach(function (ledgeInfo) {
      ledge = new Sprite('ledge', {
             paint: function (sprite, context) {
                paintLedge(sprite, context, ledgeInfo.color);
             }
         });

      ledge.left = ledgeInfo.left; 
      ledge.top = ledgeInfo.top; 
      ledge.width = ledgeInfo.width; 
      ledge.height = ledgeInfo.height; 
   
      ledges[index] = ledge;
      ++index;
   });
});

window.requestNextAnimationFrame(animate);
