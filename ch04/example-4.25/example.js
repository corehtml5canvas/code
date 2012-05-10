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
    offscreenCanvas = document.createElement('canvas'),
    offscreenContext = offscreenCanvas.getContext('2d'),
    context = canvas.getContext('2d'),
    video = document.getElementById('video'),
    controlButton = document.getElementById('controlButton'),
    flipCheckbox = document.getElementById('flipCheckbox'),
    colorCheckbox = document.getElementById('colorCheckbox'),
    imageData,
    poster = new Image();

// Functions.....................................................

function removeColor() {
   var data,
      width,
      average;

   imageData = offscreenContext.getImageData(0, 0,
                  offscreenCanvas.width, offscreenCanvas.height);

   data = imageData.data;
   width = data.width;

   for (i=0; i < data.length-4; i += 4) {
      average = (data[i] + data[i+1] + data[i+2]) / 3;
      data[i]   = average;
      data[i+1] = average;
      data[i+2] = average;
   }

   offscreenContext.putImageData(imageData, 0, 0);
}

function drawFlipped() {
   context.save();

   context.translate(canvas.width/2, canvas.height/2);
   context.rotate(Math.PI);
   context.translate(-canvas.width/2, -canvas.height/2);
   context.drawImage(offscreenCanvas, 0, 0);

   context.restore();
}

function nextVideoFrame() {
   if (video.ended) {
      controlButton.value = 'Play';
   }
   else {
     offscreenContext.drawImage(video, 0, 0);

     if (!colorCheckbox.checked)
        removeColor();

     if (flipCheckbox.checked)
        drawFlipped();
     else
       context.drawImage(offscreenCanvas, 0, 0);

     requestNextAnimationFrame(nextVideoFrame);
   }
}

function startPlaying() {
   requestNextAnimationFrame(nextVideoFrame);
   video.play();
}

function stopPlaying() {
   video.pause();
}

// Event handlers...............................................

controlButton.onclick = function(e) {
   if (controlButton.value === 'Play') {
      startPlaying();
      controlButton.value = 'Pause';
   }
   else {
      stopPlaying();
      controlButton.value = 'Play';
   }
}

poster.onload = function() { 
   context.drawImage(poster, 0, 0);
};

// Initialization................................................

poster.src = '../../shared/images/smurfposter.png';

offscreenCanvas.width = canvas.width;
offscreenCanvas.height = canvas.height;

alert('This example plays a video, but due to copyright restrictions and size limitations, the video is not included in the code for this example. To make this example work, download a video, and replace the two source elements in example.html to refer to your video.');
