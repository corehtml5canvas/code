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
    context = canvas.getContext('2d');

// Functions..........................................................

function drawText() {
   context.save();
   context.shadowColor = 'rgba(100, 100, 150, 0.8)';
   context.shadowOffsetX = 5;
   context.shadowOffsetY = 5;
   context.shadowBlur = 10;

   context.fillStyle = 'cornflowerblue';
   context.fillText('HTML5', 20, 250); 
   context.strokeStyle = 'yellow';
   context.strokeText('HTML5', 20, 250);
   context.restore();
}

function setClippingRegion(radius) {
   context.beginPath();
   context.arc(canvas.width/2, canvas.height/2,
               radius, 0, Math.PI*2, false);
   context.clip();
}

function fillCanvas(color) {
   context.fillStyle = color;
   context.fillRect(0, 0, canvas.width, canvas.height);
}

function endAnimation(loop) {
   clearInterval(loop);

   setTimeout( function (e) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawText();
   }, 1000);
}

function drawAnimationFrame(radius) {
   setClippingRegion(radius);
   fillCanvas('lightgray');
   drawText();
}

function animate() {
   var radius = canvas.width/2,
       loop;

   loop = window.setInterval(function() {
      radius -= canvas.width/100;

      fillCanvas('charcoal');

      if (radius > 0) {
         context.save();
         drawAnimationFrame(radius);
         context.restore();
      }
      else {
         endAnimation(loop);
      }
   }, 16);
};

// Event handlers....................................................

canvas.onmousedown = function (e) {
   animate();
};

// Initialization.....................................................

context.lineWidth = 0.5;
context.font = '128pt Comic-sans';
drawText();
