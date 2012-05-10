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

    thrustersCanvas = document.getElementById('thrustersCanvas'),
    thrustersContext = thrustersCanvas.getContext('2d'),

    RIGHT = 1,
    LEFT = 2,
    ARROW_MARGIN = 10,
    BALL_RADIUS  = 15,
    LEDGE_LEFT   = 150,
    LEDGE_TOP    = 90,
    LEDGE_WIDTH  = 44,
    LEDGE_HEIGHT = 12,
    ANIMATION_DURATION = 200,

    THRUSTER_FILL_STYLE = 'rgba(100,140,230,0.8)',
    THRUSTER_FIRING_FILL_STYLE = 'rgba(255,255,0,0.8)',

    lastTime = 0,
    arrow = LEFT,

    // Push animation............................................

    pushTimer = new AnimationTimer(ANIMATION_DURATION),

    // Move ball behavior........................................

    moveBall = {
      lastTime: undefined,
       
      resetBall: function () {
         ball.left = LEDGE_LEFT + LEDGE_WIDTH/2 - BALL_RADIUS;
         ball.top  = LEDGE_TOP - BALL_RADIUS*2;
      },

      execute: function (sprite, context, time) {
         var timerElapsed = pushTimer.getElapsedTime(),
             frameElapsed;
         
         if (pushTimer.isRunning() && this.lastTime !== undefined) {
            frameElapsed = timerElapsed - this.lastTime;
            
            if (arrow === LEFT) ball.left -= ball.velocityX * (frameElapsed/1000);
            else                ball.left += ball.velocityX * (frameElapsed/1000);

            if ((isBallOnLedge() && pushTimer.isOver()) || ! isBallOnLedge()) 
                  pushTimer.stop();

            if ( ! isBallOnLedge())
               this.resetBall();
         }
         this.lastTime = timerElapsed;
      }
    },
   
    // Ball sprite...............................................

    ball = new Sprite('ball',
       {
          paint: function (sprite, context) {
             context.save();
             context.beginPath();
             context.arc(sprite.left + sprite.width/2, sprite.top + sprite.height/2,
                           BALL_RADIUS, 0, Math.PI*2, false);
             context.clip();

             context.shadowColor = 'rgb(0,0,255)';
             context.shadowOffsetX = -4;
             context.shadowOffsetY = -4;
             context.shadowBlur = 8;

             context.lineWidth = 2;
             context.strokeStyle = 'rgb(100,100,195)';
             context.stroke();

             context.beginPath();
             context.arc(sprite.left + sprite.width/2, sprite.top + sprite.height/2,
                           BALL_RADIUS/2, 0, Math.PI*2, false);
             context.clip();

             context.shadowColor = 'rgb(255,255,0)';
             context.shadowOffsetX = -4;
             context.shadowOffsetY = -4;
             context.shadowBlur = 8;
             context.stroke();

             context.restore();
          }
       },

       [ moveBall ]
    ),

    ledge = new Sprite('ledge',
       {
          paint: function (sprite, context) {
             context.save();
             context.shadowColor = 'rgba(0,0,0,0.8)';
             context.shadowBlur = 8;
             context.shadowOffsetX = 4;
             context.shadowOffsetY = 4;

             context.fillStyle = 'rgba(255,255,0,0.6)';
             context.fillRect(sprite.left,sprite.top,
                              sprite.width,sprite.height);
             context.restore();
          }
       }
    );

// Behavior functions............................................

function restartAnimation() {
   if (pushTimer.isRunning()) {
      pushTimer.stop();
   }
   pushTimer.start();
}

function pushBallLeft() {
   arrow = LEFT;
   restartAnimation();
}

function pushBallRight() {
   arrow = RIGHT;
   restartAnimation();
}

function isBallOnLedge() {
   return ball.left + 2*BALL_RADIUS > LEDGE_LEFT &&
          ball.left < LEDGE_LEFT + LEDGE_WIDTH;
}

// Paint functions...............................................

function paintThrusters() {
   thrustersContext.clearRect(0,0,
      thrustersCanvas.width,thrustersCanvas.height);

   if (arrow === LEFT) {
      thrustersContext.fillStyle =
         pushTimer.isRunning() ? THRUSTER_FIRING_FILL_STYLE :
                                 THRUSTER_FILL_STYLE;
      paintLeftArrow(thrustersContext);
      thrustersContext.fillStyle = THRUSTER_FILL_STYLE;
      paintRightArrow(thrustersContext);
   }
   else {
      thrustersContext.fillStyle =
         pushTimer.isRunning() ? THRUSTER_FIRING_FILL_STYLE :
                                 THRUSTER_FILL_STYLE;
      paintRightArrow(thrustersContext);
      thrustersContext.fillStyle = THRUSTER_FILL_STYLE;
      paintLeftArrow(thrustersContext);
   }
}

function paintRightArrow(context) {
   thrustersContext.save();
   thrustersContext.translate(thrustersCanvas.width, 0);
   thrustersContext.scale(-1,1);
   paintArrow(context);
   thrustersContext.restore();
}

function paintLeftArrow(context) {
   paintArrow(context);
}
   
function paintArrow(context) {
   context.beginPath();
      
   context.moveTo( thrustersCanvas.width/2 - ARROW_MARGIN/2,
                   ARROW_MARGIN/2);

   context.lineTo( thrustersCanvas.width/2 - ARROW_MARGIN/2,
                   thrustersCanvas.height - ARROW_MARGIN);

   context.quadraticCurveTo(thrustersCanvas.width/2 - ARROW_MARGIN/2,
                            thrustersCanvas.height - ARROW_MARGIN/2,
                            thrustersCanvas.width/2 - ARROW_MARGIN,
                            thrustersCanvas.height - ARROW_MARGIN/2);

   context.lineTo( ARROW_MARGIN,
                   thrustersCanvas.height/2 + ARROW_MARGIN/2);

   context.quadraticCurveTo(ARROW_MARGIN - 3,
                            thrustersCanvas.height/2,
                            ARROW_MARGIN, thrustersCanvas.height/2 - ARROW_MARGIN/2);

   context.lineTo( thrustersCanvas.width/2 - ARROW_MARGIN,
                   ARROW_MARGIN/2);

   context.quadraticCurveTo(thrustersCanvas.width/2 - ARROW_MARGIN,
                            ARROW_MARGIN/2, thrustersCanvas.width/2 - ARROW_MARGIN/2,
                            ARROW_MARGIN/2);
   context.fill();
   context.stroke();
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

// Animation functions...........................................

function calculateFps(time) {
   var fps = 1000 / (time - lastTime);
   lastTime = time;
   return fps; 
}

function animate(time) {
   fps = calculateFps(time);

   context.clearRect(0,0,canvas.width,canvas.height);

   ball.update(context, time);
   ball.paint(context);

   ledge.update(context, time);
   ledge.paint(context);

   paintThrusters();

   window.requestNextAnimationFrame(animate);
}

// Initialization................................................

thrustersContext.strokeStyle = 'rgba(100,140,230,0.6)';
thrustersContext.shadowColor = 'rgba(0,0,0,0.3)';
thrustersContext.shadowBlur = 6;
thrustersContext.shadowX = 4;
thrustersContext.shadowY = 4;

window.requestNextAnimationFrame(animate);

ball.left = LEDGE_LEFT + LEDGE_WIDTH/2 - BALL_RADIUS;
ball.top = LEDGE_TOP - BALL_RADIUS*2;
ball.width = BALL_RADIUS*2;
ball.height = BALL_RADIUS*2;
ball.velocityX = 110;
ball.velocityY = 0;

ledge.left = LEDGE_LEFT;
ledge.top = LEDGE_TOP;
ledge.width = LEDGE_WIDTH;
