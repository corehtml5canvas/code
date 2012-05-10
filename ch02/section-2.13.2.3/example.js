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
    text='Spinning',
    angle = Math.PI/50,
    clockwise = true,
    fontHeight = 128,
    origin = { },
    paused = true,
    scale = 1.008;

// Functions......................................................

function drawText() {
   context.fillText(text, 0, 0);
   context.strokeText(text, 0, 0);
}

// Event handlers.................................................

canvas.onclick = function() {
   paused = !paused;
   if (!paused) {
      clockwise = !clockwise;
      scale = 1/scale;
   }
};

// Animation......................................................

setInterval(function() {
   if (!paused) {
      context.clearRect(-origin.x, -origin.y,
                        canvas.width, canvas.height);

      context.rotate(clockwise ? angle : -angle);
      context.scale(scale, scale);

      drawText();
   }
}, 1000/60);

// Initialization.................................................

context.font = fontHeight + 'px Palatino';

context.fillStyle = 'cornflowerblue';
context.strokeStyle = 'yellow';

context.shadowColor = 'rgba(100, 100, 150, 0.8)';
context.shadowOffsetX = 5;
context.shadowOffsetY = 5;
context.shadowBlur = 10;

context.textAlign = 'center';
context.textBaseline = 'middle';

origin.x = canvas.width/2;
origin.y = canvas.height/2;

context.transform(1, 0, 0, 1, origin.x, origin.y);

drawText();
