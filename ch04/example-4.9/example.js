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

function captureRubberbandPixels() {
   imageData = context.getImageData(rubberbandRectangle.left,
                                    rubberbandRectangle.top,
                                    rubberbandRectangle.width,
                                    rubberbandRectangle.height);
}

function restoreRubberbandPixels() {
   var deviceWidthOverCSSPixels = imageData.width / rubberbandRectangle.width,
       deviceHeightOverCSSPixels = imageData.height / rubberbandRectangle.height;
   
   context.putImageData(imageData,
                        rubberbandRectangle.left * deviceWidthOverCSSPixels,
                        rubberbandRectangle.top * deviceHeightOverCSSPixels);
}

function drawRubberband() {
   context.strokeRect(rubberbandRectangle.left + context.lineWidth,
                      rubberbandRectangle.top + context.lineWidth,
                      rubberbandRectangle.width - 2*context.lineWidth,
                      rubberbandRectangle.height - 2*context.lineWidth);
}

function setRubberbandRectangle(x, y) {
   rubberbandRectangle.left = Math.min(x, mousedown.x);
   rubberbandRectangle.top  = Math.min(y, mousedown.y);
   rubberbandRectangle.width  = Math.abs(x - mousedown.x),
   rubberbandRectangle.height = Math.abs(y - mousedown.y);
}

function updateRubberband() {
   captureRubberbandPixels();
   drawRubberband();
}

function rubberbandStart(x, y) {
   mousedown.x = x;
   mousedown.y = y;

   rubberbandRectangle.left = mousedown.x;
   rubberbandRectangle.top = mousedown.y;

   dragging = true;
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

      updateRubberband();
   }
};

function rubberbandEnd() {
   // Draw and scale image to the on screen canvas. 
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

context.strokeStyle = 'yellow';
context.lineWidth = 2.0;
