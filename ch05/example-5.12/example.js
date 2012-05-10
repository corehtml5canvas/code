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

var canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    paused = true,
    discs = [
      { 
         x: 150,
         y: 50,
         lastX: 150,
         lastY: 50,
         velocityX: 3.2,
         velocityY: 3.5,
         radius: 25,
         innerColor: 'rgba(0,255,255,0.3)',
         middleColor: 'rgba(0,255,255,0.9)',
         outerColor: 'rgba(0,255,255,0.3)',
         strokeStyle: 'slateblue',
      },

      { 
         x: 75,
         y: 200,
         lastX: 75,
         lastY: 200,
         velocityX: 2.2,
         velocityY: 2.5,
         radius: 25,
         innerColor: 'rgba(225,225,225,0.1)',
         middleColor: 'rgba(225,225,225,0.9)',
         outerColor: 'rgba(225,225,225,0.3)',
         strokeStyle: 'gray'
      },

      { 
         x: 100,
         y: 300,
         lastX: 150,
         lastY: 50,
         velocityX: 1.2,
         velocityY: 1.5,
         radius: 25,
         innerColor: 'orange',
         middleColor: 'yellow',
         outerColor: 'gold',
         shadowColor: 'rgba(255,0,0,0.7)',
         strokeStyle: 'orange'
      },
   ],
   numDiscs = discs.length,
   lastTime = 0,
   lastFpsUpdateTime = 0,
   frameCount = 0,
   animateButton = document.querySelector('#animateButton');

function eraseBackground() {
   context.clearRect(0,0,canvas.width,canvas.height);
}

function drawBackground() {
   var STEP_Y = 12,
       i = context.canvas.height;
   
   context.strokeStyle = 'lightgray';
   context.lineWidth = 0.5;

   context.save();
   context.restore();

   while(i > STEP_Y*4) {
      context.beginPath();
      context.moveTo(0, i);
      context.lineTo(context.canvas.width, i);
      context.stroke();
      i -= STEP_Y;
   }

   context.save();

   context.strokeStyle = 'rgba(100,0,0,0.3)';
   context.lineWidth = 1;

   context.beginPath();

   context.moveTo(35,0);
   context.lineTo(35,context.canvas.height);
   context.stroke();

   context.restore();
}

function update() {
   var i = numDiscs,
       disc = null;

   while(i--) {
      disc = discs[i];

      if (disc.x + disc.velocityX + disc.radius > context.canvas.width ||
          disc.x + disc.velocityX - disc.radius < 0) 
         disc.velocityX = -disc.velocityX;

      if (disc.y + disc.velocityY + disc.radius > context.canvas.height ||
          disc.y + disc.velocityY - disc.radius  < 0) 
         disc.velocityY= -disc.velocityY;

      disc.x += disc.velocityX;
      disc.y += disc.velocityY;
   }
}

function drawDisc(disc) {
   var gradient = context.createRadialGradient(disc.x, disc.y, 0,
                         disc.x, disc.y, disc.radius);

   gradient.addColorStop(0.3, disc.innerColor);
   gradient.addColorStop(0.7, disc.middleColor);
   gradient.addColorStop(1.0, disc.outerColor);

   context.save();
   context.beginPath();
   context.arc(disc.x, disc.y, disc.radius, 0, Math.PI*2, false);
   context.clip();

   context.fillStyle = gradient;
   context.strokeStyle = disc.strokeStyle;
   context.lineWidth = 2;
   context.fill();
   context.stroke();

   context.restore();
}

function draw() {
   var i = numDiscs, disc;

   i = numDiscs;
   while(i--) {
      disc = discs[i];
      drawDisc(disc);
      disc.lastX = disc.x;
      disc.lastY = disc.y;
   }

   if (frameCount === 100) {
      frameCount = -1;    
   }

   if (frameCount !== -1 && frameCount < 100) {
     frameCount++;
   }
}

function calculateFps() {
   var now = (+new Date),
       fps = 1000 / (now - lastTime);

   lastTime = now;

   return fps;
}

function animate() {
   var now = (+new Date),
       fps = 0;

   if (!paused) {
      eraseBackground();
      drawBackground();
      update();
      draw();

      fps = calculateFps();

      if (now - lastFpsUpdateTime > 1000) {
         lastFpsUpdateTime = now;
         lastFpsUpdate = fps;
      }
      context.fillStyle = 'cornflowerblue';
      context.fillText(lastFpsUpdate.toFixed() + ' fps', 45, 50);
   }
   if (window.webkitRequestAnimationFrame !== undefined) {
      window.webkitRequestAnimationFrame(animate);
   }
   else if (window.mozRequestAnimationFrame !== undefined) {
      window.mozRequestAnimationFrame(animate);
   }
}
   
context.font = '48px Helvetica';

if (window.webkitRequestAnimationFrame !== undefined) {
   window.webkitRequestAnimationFrame(animate);
}
else if (window.mozRequestAnimationFrame !== undefined) {
   window.mozRequestAnimationFrame(animate);
}
else {
  setInterval(animate, 1000/60);
}

canvas.onclick = function(e) {
   paused = paused ? false : true;
};

context.canvas.width = canvas.width;
context.canvas.height = canvas.height;

animateButton.onclick = function (e) {
   paused = paused ? false : true;
   if (paused) {
      animateButton.value = 'Animate';
   }
   else {
      animateButton.value = 'Pause';
   }
};

context.font = '48px Helvetica';
drawBackground();
