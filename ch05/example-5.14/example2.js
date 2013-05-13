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

var COREHTML5 = COREHTML5 || {};

COREHTML5.topLeftTimeBasedMotion = function () {
var topCanvas = document.querySelector('#topCanvas'),
    topContext = topCanvas.getContext('2d'),
    paused = true,
    discs = [
      { 
         x: 150,
         y: 250,
         lastX: 150,
         lastY: 250,
         velocityX: -3.2,
         velocityY: 3.5,
         radius: 25,
         innerColor: 'rgba(255,255,0,1)',
         middleColor: 'rgba(255,255,0,0.7)',
         outerColor: 'rgba(255,255,0,0.5)',
         shadowColor: 'rgba(175,175,175,0.7)',
         strokeStyle: 'gray',
      },

      { 
         x: 50,
         y: 150,
         lastX: 50,
         lastY: 150,
         velocityX: 2.2,
         velocityY: 2.5,
         radius: 25,
         innerColor: 'rgba(100,145,230,1.0)',
         middleColor: 'rgba(100,145,230,0.7)',
         outerColor: 'rgba(100,145,230,0.5)',
         shadowColor: 'rgba(100,145,230,0.8)',
         strokeStyle: 'blue'
      },

      { 
         x: 150,
         y: 75,
         lastX: 150,
         lastY: 75,
         velocityX: 1.2,
         velocityY: 1.5,
         radius: 25,
         innerColor: 'rgba(255,0,0,1.0)',
         middleColor: 'rgba(255,0,0,0.7)',
         outerColor: 'rgba(255,0,0,0.5)',
         shadowColor: 'rgba(255,0,0,0.7)',
         strokeStyle: 'orange'
      },
      { 
         x: 50,
         y: 150,
         lastX: 150,
         lastY: 250,
         velocityX: -3.2,
         velocityY: -3.5,
         radius: 25,
         innerColor: 'rgba(255,255,0,1)',
         middleColor: 'rgba(255,255,0,0.7)',
         outerColor: 'rgba(255,255,0,0.5)',
         shadowColor: 'rgba(175,175,175,0.7)',
         strokeStyle: 'gray',
      },

      { 
         x: 50,
         y: 75,
         lastX: 50,
         lastY: 150,
         velocityX: 2.2,
         velocityY: -2.5,
         radius: 25,
         innerColor: 'rgba(100,145,230,1.0)',
         middleColor: 'rgba(100,145,230,0.7)',
         outerColor: 'rgba(100,145,230,0.5)',
         shadowColor: 'rgba(100,145,230,0.8)',
         strokeStyle: 'blue'
      },

      { 
         x: 200,
         y: 175,
         lastX: 150,
         lastY: 75,
         velocityX: -1.9,
         velocityY: 1.2,
         radius: 25,
         innerColor: 'rgba(255,0,0,1.0)',
         middleColor: 'rgba(255,0,0,0.7)',
         outerColor: 'rgba(255,0,0,0.5)',
         shadowColor: 'rgba(255,0,0,0.7)',
         strokeStyle: 'orange'
      },
      { 
         x: 250,
         y: 250,
         lastX: 150,
         lastY: 250,
         velocityX: 5.2,
         velocityY: -3.5,
         radius: 25,
         innerColor: 'rgba(255,255,0,1)',
         middleColor: 'rgba(255,255,0,0.7)',
         outerColor: 'rgba(255,255,0,0.5)',
         shadowColor: 'rgba(175,175,175,0.7)',
         strokeStyle: 'gray',
      },

      { 
         x: 150,
         y: 100,
         lastX: 50,
         lastY: 150,
         velocityX: -2.9,
         velocityY: -1.5,
         radius: 25,
         innerColor: 'rgba(100,145,230,1.0)',
         middleColor: 'rgba(100,145,230,0.7)',
         outerColor: 'rgba(100,145,230,0.5)',
         shadowColor: 'rgba(100,145,230,0.8)',
         strokeStyle: 'blue'
      },

      { 
         x: 215,
         y: 175,
         lastX: 150,
         lastY: 75,
         velocityX: -2.2,
         velocityY: 2.5,
         radius: 25,
         innerColor: 'rgba(255,0,0,1.0)',
         middleColor: 'rgba(255,0,0,0.7)',
         outerColor: 'rgba(255,0,0,0.5)',
         shadowColor: 'rgba(255,0,0,0.7)',
         strokeStyle: 'orange'
      },
      { 
         x: 250,
         y: 150,
         lastX: 150,
         lastY: 250,
         velocityX: 4.2,
         velocityY: -5.5,
         radius: 25,
         innerColor: 'rgba(255,255,0,1)',
         middleColor: 'rgba(255,255,0,0.7)',
         outerColor: 'rgba(255,255,0,0.5)',
         shadowColor: 'rgba(175,175,175,0.7)',
         strokeStyle: 'gray',
      },

      { 
         x: 150,
         y: 75,
         lastX: 50,
         lastY: 150,
         velocityX: 3.2,
         velocityY: -3.5,
         radius: 25,
         innerColor: 'rgba(100,145,230,1.0)',
         middleColor: 'rgba(100,145,230,0.7)',
         outerColor: 'rgba(100,145,230,0.5)',
         shadowColor: 'rgba(100,145,230,0.8)',
         strokeStyle: 'blue'
      },

      { 
         x: 100,
         y: 100,
         lastX: 150,
         lastY: 75,
         velocityX: -2.9,
         velocityY: -2.2,
         radius: 25,
         innerColor: 'rgba(255,0,0,1.0)',
         middleColor: 'rgba(255,0,0,0.7)',
         outerColor: 'rgba(255,0,0,0.5)',
         shadowColor: 'rgba(255,0,0,0.7)',
         strokeStyle: 'orange'
      },
      { 
         x: 150,
         y: 250,
         lastX: 150,
         lastY: 250,
         velocityX: -5.2,
         velocityY: 5.5,
         radius: 25,
         innerColor: 'rgba(255,255,0,1)',
         middleColor: 'rgba(255,255,0,0.7)',
         outerColor: 'rgba(255,255,0,0.5)',
         shadowColor: 'rgba(175,175,175,0.7)',
         strokeStyle: 'gray',
      },

      { 
         x: 50,
         y: 150,
         lastX: 50,
         lastY: 150,
         velocityX: 4.2,
         velocityY: 4.5,
         radius: 25,
         innerColor: 'rgba(100,145,230,1.0)',
         middleColor: 'rgba(100,145,230,0.7)',
         outerColor: 'rgba(100,145,230,0.5)',
         shadowColor: 'rgba(100,145,230,0.8)',
         strokeStyle: 'blue'
      },

      { 
         x: 150,
         y: 75,
         lastX: 150,
         lastY: 75,
         velocityX: 2.2,
         velocityY: 2.5,
         radius: 25,
         innerColor: 'rgba(255,0,0,1.0)',
         middleColor: 'rgba(255,0,0,0.7)',
         outerColor: 'rgba(255,0,0,0.5)',
         shadowColor: 'rgba(255,0,0,0.7)',
         strokeStyle: 'orange'
      },
      { 
         x: 50,
         y: 150,
         lastX: 150,
         lastY: 250,
         velocityX: -0.2,
         velocityY: -1.5,
         radius: 25,
         innerColor: 'rgba(255,255,0,1)',
         middleColor: 'rgba(255,255,0,0.7)',
         outerColor: 'rgba(255,255,0,0.5)',
         shadowColor: 'rgba(175,175,175,0.7)',
         strokeStyle: 'gray',
      },

      { 
         x: 50,
         y: 75,
         lastX: 50,
         lastY: 150,
         velocityX: 1.2,
         velocityY: -2.5,
         radius: 25,
         innerColor: 'rgba(100,145,230,1.0)',
         middleColor: 'rgba(100,145,230,0.7)',
         outerColor: 'rgba(100,145,230,0.5)',
         shadowColor: 'rgba(100,145,230,0.8)',
         strokeStyle: 'blue'
      },

      { 
         x: 200,
         y: 175,
         lastX: 150,
         lastY: 75,
         velocityX: 1.9,
         velocityY: -1.2,
         radius: 25,
         innerColor: 'rgba(255,0,0,1.0)',
         middleColor: 'rgba(255,0,0,0.7)',
         outerColor: 'rgba(255,0,0,0.5)',
         shadowColor: 'rgba(255,0,0,0.7)',
         strokeStyle: 'orange'
      },
      { 
         x: 250,
         y: 250,
         lastX: 150,
         lastY: 250,
         velocityX: 3.2,
         velocityY: -5.5,
         radius: 25,
         innerColor: 'rgba(255,255,0,1)',
         middleColor: 'rgba(255,255,0,0.7)',
         outerColor: 'rgba(255,255,0,0.5)',
         shadowColor: 'rgba(175,175,175,0.7)',
         strokeStyle: 'gray',
      },

      { 
         x: 150,
         y: 100,
         lastX: 50,
         lastY: 150,
         velocityX: -1.9,
         velocityY: -2.5,
         radius: 25,
         innerColor: 'rgba(100,145,230,1.0)',
         middleColor: 'rgba(100,145,230,0.7)',
         outerColor: 'rgba(100,145,230,0.5)',
         shadowColor: 'rgba(100,145,230,0.8)',
         strokeStyle: 'blue'
      },

      { 
         x: 215,
         y: 175,
         lastX: 150,
         lastY: 75,
         velocityX: -3.2,
         velocityY: 4.5,
         radius: 25,
         innerColor: 'rgba(255,0,0,1.0)',
         middleColor: 'rgba(255,0,0,0.7)',
         outerColor: 'rgba(255,0,0,0.5)',
         shadowColor: 'rgba(255,0,0,0.7)',
         strokeStyle: 'orange'
      },
      { 
         x: 250,
         y: 150,
         lastX: 150,
         lastY: 250,
         velocityX: 2.2,
         velocityY: -4.5,
         radius: 25,
         innerColor: 'rgba(255,255,0,1)',
         middleColor: 'rgba(255,255,0,0.7)',
         outerColor: 'rgba(255,255,0,0.5)',
         shadowColor: 'rgba(175,175,175,0.7)',
         strokeStyle: 'gray',
      },

      { 
         x: 150,
         y: 75,
         lastX: 50,
         lastY: 150,
         velocityX: 2.2,
         velocityY: -1.5,
         radius: 25,
         innerColor: 'rgba(100,145,230,1.0)',
         middleColor: 'rgba(100,145,230,0.7)',
         outerColor: 'rgba(100,145,230,0.5)',
         shadowColor: 'rgba(100,145,230,0.8)',
         strokeStyle: 'blue'
      },

      { 
         x: 100,
         y: 100,
         lastX: 150,
         lastY: 75,
         velocityX: -5.9,
         velocityY: -0.2,
         radius: 25,
         innerColor: 'rgba(255,0,0,1.0)',
         middleColor: 'rgba(255,0,0,0.7)',
         outerColor: 'rgba(255,0,0,0.5)',
         shadowColor: 'rgba(255,0,0,0.7)',
         strokeStyle: 'orange'
      },
   ],
   numDiscs = discs.length,
   startTime = 0,
   lastTime = 0,
   elapsedTime = 0,
   fps = 0,
   lastFpsUpdate = { time: 0, value: 0 },
   animateButton = document.querySelector('#topAnimateButton'),
   timeBasedMotionCheckbox = document.querySelector('#timeBasedMotionCheckbox'),
   timeBasedMotion = timeBasedMotionCheckbox.checked;

function eraseBackground() {
   topContext.clearRect(0,0,topCanvas.width,topCanvas.height);
}

function drawBackground() {
   var STEP_Y = 12,
       i = topContext.canvas.height;
   
   topContext.strokeStyle = 'lightgray';
   topContext.lineWidth = 0.5;

   topContext.save();
   topContext.restore();

   while(i > STEP_Y*4) {
      topContext.beginPath();
      topContext.moveTo(0, i);
      topContext.lineTo(topContext.canvas.width, i);
      topContext.stroke();
      i -= STEP_Y;
   }

   topContext.save();

   topContext.strokeStyle = 'rgba(100,0,0,0.3)';
   topContext.lineWidth = 1;

   topContext.beginPath();

   topContext.moveTo(35,0);
   topContext.lineTo(35,topContext.canvas.height);
   topContext.stroke();

   topContext.restore();
}

function update() {
   var i = numDiscs,
       disc = null;

   while(i--) {
      disc = discs[i];

      if (disc.x + disc.velocityX + disc.radius > topContext.canvas.width ||
          disc.x + disc.velocityX - disc.radius < 0) 
         disc.velocityX = -disc.velocityX;

      if (disc.y + disc.velocityY + disc.radius > topContext.canvas.height ||
          disc.y + disc.velocityY - disc.radius  < 0) 
         disc.velocityY= -disc.velocityY;

      disc.x += disc.velocityX;
      disc.y += disc.velocityY;
   }
}

function updateTimeBased(time) {
   var i = numDiscs,
       disc = null;

   if (fps == 0)
      return;
   
   while(i--) {
      disc = discs[i];
      deltaX = disc.velocityX 

      deltaX = disc.velocityX * (elapsedTime / 1000);
      deltaY = disc.velocityY * (elapsedTime / 1000);

      if (disc.x + deltaX + disc.radius > topContext.canvas.width ||
         disc.x + deltaX - disc.radius < 0) {
         disc.velocityX = -disc.velocityX;
         deltaX = -deltaX;
      }

      if (disc.y + deltaY + disc.radius > topContext.canvas.height ||
         disc.y + deltaY - disc.radius < 0) {
         disc.velocityY= -disc.velocityY;
         deltaY = -deltaY;
      }

      disc.x = disc.x + deltaX;
      disc.y = disc.y + deltaY;
   }
}

function draw() {
   var i = numDiscs,
       disc = discs[i];

   while(i--) {
      disc = discs[i];

      gradient = topContext.createRadialGradient(disc.x, disc.y, 0,
                         disc.x, disc.y, disc.radius);

      gradient.addColorStop(0.3, disc.innerColor);
      gradient.addColorStop(0.5, disc.middleColor);
      gradient.addColorStop(1.0, disc.outerColor);

      topContext.beginPath();
      topContext.arc(disc.x, disc.y, disc.radius, 0, Math.PI*2, false);

      topContext.save();

      topContext.fillStyle = gradient;
      topContext.strokeStyle = disc.strokeStyle;
      topContext.fill();
      topContext.stroke();
      topContext.restore();
   }
}

function calculateFps(now) {
   elapsedTime = now - lastTime;
   fps = 1000 / elapsedTime;
   lastTime = now;
}

function updateFps() {
   var now = (+new Date);

   calculateFps(now);
   
   if (now - startTime < 2000) {
      return;
   }

   if (now - lastFpsUpdate.time > 1000) {
      lastFpsUpdate.time = now;
      lastFpsUpdate.value = fps;
   }
   if (!paused) {
      topContext.fillStyle = 'cornflowerblue';
      topContext.fillText(lastFpsUpdate.value.toFixed() + ' fps', 50, 48);
   }
}

function animateTopLeft(time) {
   if (time === undefined) {
      time = +new Date;
   }

   if (!paused) {
      eraseBackground();
      drawBackground();
      if (timeBasedMotion) {
         updateTimeBased(time);
      }
      else {
        update();
      }
      draw();
   }

   updateFps();
}

animateButton.addEventListener('click', function (e) {
   paused = paused ? false : true;
   if (paused) {
      animateButton.value = 'Animate';
   }
   else {
      animateButton.value = 'Pause';
   }
});

timeBasedMotionCheckbox.addEventListener('click', function (e) {
   if (timeBasedMotionCheckbox.checked) {
      timeBasedMotion = true;
      for (var i=0; i < discs.length; ++i) {
         discs[i].velocityX *= 50;
         discs[i].velocityY *= 50;
      }
   }
   else {
      timeBasedMotion = false;
      for (var i=0; i < discs.length; ++i) {
         discs[i].velocityX /= 50;
         discs[i].velocityY /= 50;
      }
   }
});

topContext.font = '36px Helvetica';
drawBackground();
startTime = +new Date;
setInterval(animateTopLeft, 1000/120);
}();
