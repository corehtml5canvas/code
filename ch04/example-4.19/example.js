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

var image = new Image(),
    canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    fadeButton = document.getElementById('fadeButton'),
    originalImageData = null,
    interval = null;

// Functions.....................................................

function increaseTransparency(imagedata, steps) {
   var alpha, currentAlpha, step, length = imagedata.data.length;

   for (var i=3; i < length; i+=4) { // For every alpha component
      alpha = originalImageData.data[i];

      if (alpha > 0 && imagedata.data[i] > 0) { // not totally transparent yet
         currentAlpha = imagedata.data[i];
         step = Math.ceil(alpha/steps);

         if (currentAlpha - step > 0) { // not too close to the end
            imagedata.data[i] -= step;  // increase transparency
         }
         else {
            imagedata.data[i] = 0; // end: totally transparent
         }
      }
   }
}

function fadeOut(context, imagedata, x, y,
                 steps, millisecondsPerStep) { 
   var frame = 0,
       length = imagedata.data.length;

   interval = setInterval(function () { // Once every millisecondsPerStep ms
      frame++;

      if (frame > steps) { // animation is over
          clearInterval(interval); // end animation
          animationComplete();     // put picture back in 1s
      }
      else {
        increaseTransparency(imagedata, steps);
         context.putImageData(imagedata, x, y);
      }
   }, millisecondsPerStep);
};

// Animation.....................................................

function animationComplete() {
   setTimeout(function() {
      context.drawImage(image,0,0,canvas.width,canvas.height);
   }, 1000);
}

// Initialization................................................

fadeButton.onclick = function() {
   fadeOut(context,
      context.getImageData(0, 0, canvas.width, canvas.height),
      0, 0, 20, 1000/60);
};

image.src = '../../shared/images/log-crossing.png';
image.onload = function() {
   context.drawImage(image, 0, 0, canvas.width, canvas.height);
   originalImageData = context.getImageData(0, 0, canvas.width, canvas.height);
};

