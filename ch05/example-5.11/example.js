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

   if (frameCount === 0) {
      console.profile('COREHTML5 Animation, basic');
   }
   else if (frameCount === 100) {
      console.profileEnd();
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
   if (!paused) {
      eraseBackground();
      drawBackground();
      update();
      draw();

      window.requestNextAnimationFrame(animate);
   }
}
   
context.font = '48px Helvetica';

canvas.onclick = function(e) {
   paused = paused ? false : true;
};

context.canvas.width = canvas.width;
context.canvas.height = canvas.height;

animateButton.onclick = function (e) {
   paused = paused ? false : true;
   if (paused) {
      animateButton.value = 'Animate';
      window.requestNextAnimationFrame(animate);
   }
   else {
      animateButton.value = 'Pause';
   }
};

context.font = '48px Helvetica';
drawBackground();




/*
  * Copyright (C) 2011 David Geary
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *      http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *
  */
var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
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
         strokeStyle: 'orange'
      },
   ],
   numDiscs = discs.length,
   animateButton = document.getElementById('animateButton');

// Functions.....................................................

function drawBackground() {
   var STEP_Y = 12,
       i = context.canvas.height;
   
   context.strokeStyle = 'lightgray';
   context.lineWidth = 0.5;

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
   var disc = null;

   for(var i=0; i < numDiscs; ++i) {
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

function draw() {
   var disc = discs[i];

   for(var i=0; i < numDiscs; ++i) {
      disc = discs[i];

      gradient = context.createRadialGradient(disc.x, disc.y, 0,
                         disc.x, disc.y, disc.radius);

      gradient.addColorStop(0.3, disc.innerColor);
      gradient.addColorStop(0.5, disc.middleColor);
      gradient.addColorStop(1.0, disc.outerColor);

      context.save();
      context.beginPath();
      context.arc(disc.x, disc.y, disc.radius, 0, Math.PI*2, false);
      context.fillStyle = gradient;
      context.strokeStyle = disc.strokeStyle;
      context.fill();
      context.stroke();
      context.restore();
   }
}

// Animation.....................................................

function animate(time) {
   if (!paused) {
      context.clearRect(0,0,canvas.width,canvas.height);
      drawBackground();
      update();
      draw();

      context.fillStyle = 'cornflowerblue';
      context.fillText(calculateFps().toFixed() + ' fps', 45, 50);

      window.requestNextAnimationFrame(animate);
   }
}
   
// Initialization................................................

context.font = '48px Helvetica';

animateButton.onclick = function (e) {
   paused = paused ? false : true;
   if (paused) {
      animateButton.value = 'Animate';
   }
   else {
     window.requestNextAnimationFrame(animate);
      animateButton.value = 'Pause';
   }
};
