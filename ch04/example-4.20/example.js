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
    offscreenCanvas = document.createElement('canvas'),
    offscreenContext = offscreenCanvas.getContext('2d'),
    fadeButton = document.getElementById('fadeButton'),
    imagedata,
    imagedataOffscreen,
    interval = null;

// Functions.....................................................

function increaseTransparency(imagedata, steps) {
   var alpha,
       currentAlpha,
       step,
       length = imagedata.data.length;

   for (var i=3; i < length; i+=4) { // For every alpha component
      alpha = imagedataOffscreen.data[i];

      if (alpha > 0) {
         currentAlpha = imagedata.data[i];
         step = Math.ceil(alpha/steps);

         if (currentAlpha + step <= alpha) { // Not at original alpha setting yet
            imagedata.data[i] += step; // increase transparency
         }
         else {
            imagedata.data[i] = alpha; // end: original transparency
         }
      }
   }
}
                      
function fadeIn(context, imagedata, steps, millisecondsPerStep) { 
   var frame = 0;

   for (var i=3; i < imagedata.data.length; i+=4) { // For every alpha component
      imagedata.data[i] = 0;
   }
   
   interval = setInterval(function () { // Every millisecondsPerStep
      frame++;

      if (frame > steps) {
         clearInterval(interval);
         //animationComplete();
      }
      else {
        increaseTransparency(imagedata, steps);
         context.putImageData(imagedata, 0, 0);
      }
   }, millisecondsPerStep);

};

// Animation.....................................................

function animationComplete() {
   setTimeout(function() {
      context.clearRect(0,0,canvas.width,canvas.height);
   }, 1000);
}

fadeButton.onclick = function() {
   imagedataOffscreen = offscreenContext.getImageData(0, 0,
                           canvas.width, canvas.height);

   fadeIn(context,
          offscreenContext.getImageData(0, 0,
                           canvas.width, canvas.height),
          50,
          1000 / 60);
};

// Initialization................................................

image.src = '../../shared/images/log-crossing.png';
image.onload = function() {
   offscreenCanvas.width = canvas.width;
   offscreenCanvas.height = canvas.height;
   offscreenContext.drawImage(image,0,0);
};
