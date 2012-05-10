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
    offscreenCanvas = document.createElement('canvas');
    offscreenContext = offscreenCanvas.getContext('2d'),
    image = new Image(),

    scaleOutput = document.getElementById('scaleOutput');
    scaleSlider = document.getElementById('scaleSlider');
    canvasRadio = document.getElementById('canvasRadio'),
    imageRadio = document.getElementById('imageRadio'),
    scale = scaleSlider.value,
    scale = 1.0,
    MINIMUM_SCALE = 1.0,
    MAXIMUM_SCALE = 3.0;

// Functions.....................................................

function drawScaled() {
   var w = canvas.width,
       h = canvas.height,
       sw = w * scale,
       sh = h * scale;

   context.drawImage(offscreenCanvas, 0, 0,
      offscreenCanvas.width, offscreenCanvas.height,
      -sw/2 + w/2, -sh/2 + h/2, sw, sh);
}

function drawScaleText(value) { 
   var text = parseFloat(value).toFixed(2);
   var percent = parseFloat(value - MINIMUM_SCALE) /
                 parseFloat(MAXIMUM_SCALE - MINIMUM_SCALE);

   scaleOutput.innerText = text;
   percent = percent < 0.35 ? 0.35 : percent;
   scaleOutput.style.fontSize = percent*MAXIMUM_SCALE/1.5 + 'em';
}

function drawWatermark(context) {
   var lineOne = 'Copyright',
       lineTwo = 'Acme, Inc.',
       textMetrics = null,
       FONT_HEIGHT = 128;

   context.save();
   context.fillStyle = 'rgba(100,140,230,0.5);';
   context.strokeStyle = 'yellow';
   context.shadowColor = 'rgba(50, 50, 50, 1.0)';
   context.shadowOffsetX = 5;
   context.shadowOffsetY = 5;
   context.shadowBlur = 10;

   context.font = FONT_HEIGHT + 'px Arial';
   textMetrics = context.measureText(lineOne);
   context.translate(canvas.width/2, canvas.height/2);
   context.fillText(lineOne, -textMetrics.width/2, 0);
   context.strokeText(lineOne, -textMetrics.width/2, 0);

   textMetrics = context.measureText(lineTwo);
   context.fillText(lineTwo, -textMetrics.width/2, FONT_HEIGHT);
   context.strokeText(lineTwo, -textMetrics.width/2, FONT_HEIGHT);
  context.restore();
}

// Event Handlers................................................

scaleSlider.onchange = function(e) {
   scale = e.target.value;

   if (scale < MINIMUM_SCALE) scale = MINIMUM_SCALE;
   else if (scale > MAXIMUM_SCALE) scale = MAXIMUM_SCALE;

   drawScaled();
   drawScaleText(scale);
}

// Initialization................................................

offscreenCanvas.width = canvas.width;
offscreenCanvas.height = canvas.height;

image.src = '../../shared/images/lonelybeach.png';
image.onload = function(e) {
   context.drawImage(image, 0, 0, canvas.width, canvas.height);
   offscreenContext.drawImage(image, 0, 0,
                              canvas.width, canvas.height);
   drawWatermark(context);
   drawWatermark(offscreenContext);
   drawScaleText(scaleSlider.value);
};
