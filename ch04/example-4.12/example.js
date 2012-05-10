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

    resetButton = document.getElementById('resetButton'),

    image = new Image(),
    imageData,
    imageDataCopy = context.createImageData(canvas.width, canvas.height),

    mousedown = {},
    rubberbandRectangle = {},
    dragging = false;

// Functions.....................................................

function windowToCanvas(canvas, x, y) {
   var canvasRectangle = canvas.getBoundingClientRect();
   
   return {
             x: x - canvasRectangle.left,
             y: y - canvasRectangle.top
          };
}

function copyCanvasPixels() {
   var i=0;

   // Copy red, green, and blue components of the first pixel

   for (i=0; i < 3; i++) {
      imageDataCopy.data[i] = imageData.data[i];
   }

   // Starting with the alpha component of the first pixel,
   // copy imageData, and make the copy more transparent

   for (i=3; i < imageData.data.length - 4; i+=4) {
      imageDataCopy.data[i]   = imageData.data[i] / 2; // Alpha: more transparent
      imageDataCopy.data[i+1] = imageData.data[i+1]; // Red
      imageDataCopy.data[i+2] = imageData.data[i+2]; // Green
      imageDataCopy.data[i+3] = imageData.data[i+3]; // Blue
   }
}

function captureCanvasPixels() {
   imageData = context.getImageData(0, 0, canvas.width, canvas.height);
   copyCanvasPixels();
}

function restoreRubberbandPixels() {
   var deviceWidthOverCSSPixels = imageData.width / canvas.width,
       deviceHeightOverCSSPixels = imageData.height / canvas.height;

   // Restore the Canvas to what it looked like when the mouse went down

   context.putImageData(imageData, 0, 0);

   // Put the more transparent image data into the rubberband rectangle
   
   context.putImageData(imageDataCopy, 0, 0,
      (rubberbandRectangle.left + context.lineWidth),
      (rubberbandRectangle.top + context.lineWidth),
      (rubberbandRectangle.width - 2*context.lineWidth) * deviceWidthOverCSSPixels,
      (rubberbandRectangle.height - 2*context.lineWidth) * deviceHeightOverCSSPixels);
}

function setRubberbandRectangle(x, y) {
   rubberbandRectangle.left = Math.min(x, mousedown.x);
   rubberbandRectangle.top = Math.min(y, mousedown.y);
   rubberbandRectangle.width = Math.abs(x - mousedown.x),
   rubberbandRectangle.height = Math.abs(y - mousedown.y);
}

function drawRubberband() {
   var deviceWidthOverCSSPixels = imageData.width / canvas.width,
       deviceHeightOverCSSPixels = imageData.height / canvas.height;

   context.strokeRect(rubberbandRectangle.left + context.lineWidth,
                      rubberbandRectangle.top + context.lineWidth,
                      rubberbandRectangle.width - 2*context.lineWidth,
                      rubberbandRectangle.height - 2*context.lineWidth);
}

function rubberbandStart(x, y) {
   mousedown.x = x;
   mousedown.y = y;

   rubberbandRectangle.left = mousedown.x;
   rubberbandRectangle.top = mousedown.y;
   rubberbandRectangle.width = 0;
   rubberbandRectangle.height = 0;

   dragging = true;

   captureCanvasPixels();
}

function rubberbandStretch(x, y) {
   if (rubberbandRectangle.width > 2*context.lineWidth &&
       rubberbandRectangle.height > 2*context.lineWidth) {
      if (imageData !== undefined) {
         restoreRubberbandPixels();
      }
   }

   setRubberbandRectangle(x, y);

   if (rubberbandRectangle.width > 2*context.lineWidth &&
       rubberbandRectangle.height > 2*context.lineWidth) {
      drawRubberband();
   }
};

function rubberbandEnd() {
   context.putImageData(imageData, 0, 0);

   // Draw the canvas back into itself, scaling along the way
   
   context.drawImage(canvas,
                     rubberbandRectangle.left + context.lineWidth*2,
                     rubberbandRectangle.top + context.lineWidth*2,
                     rubberbandRectangle.width - 4*context.lineWidth,
                     rubberbandRectangle.height - 4*context.lineWidth,
                     0, 0, canvas.width, canvas.height);

   dragging = false;
   imageData = undefined;
}

// Event handlers...............................................

canvas.onmousedown = function (e) { 
   var loc = windowToCanvas(canvas, e.clientX, e.clientY);
   e.preventDefault();
   rubberbandStart(loc.x, loc.y);
};

canvas.onmousemove = function (e) { 
   var loc;
   
   if (dragging) {
      loc = windowToCanvas(canvas, e.clientX, e.clientY);
      rubberbandStretch(loc.x, loc.y);
    }
}

canvas.onmouseup = function (e) { 
   rubberbandEnd();
};

// Initialization..............................................

image.src = '../../shared/images/arch.png';
image.onload = function () { 
   context.drawImage(image, 0, 0, canvas.width, canvas.height); 
};

resetButton.onclick = function(e) {
    context.clearRect(0, 0,
       canvas.width, canvas.height);

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
};

context.strokeStyle = 'navy';
context.lineWidth = 1.0;
