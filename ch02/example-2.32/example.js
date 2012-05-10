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

var context = document.getElementById('canvas').getContext('2d'),
    selectElement = document.getElementById('compositingSelect');

// Functions.....................................................

function drawText() {
   context.save();

   context.shadowColor   = 'rgba(100, 100, 150, 0.8)';
   context.shadowOffsetX = 5;
   context.shadowOffsetY = 5;
   context.shadowBlur    = 10;

   context.fillStyle = 'cornflowerblue';
   context.fillText('HTML5', 20, 250); 

   context.strokeStyle = 'yellow';
   context.strokeText('HTML5', 20, 250);

   context.restore();
}

// Event handlers...............................................

function windowToCanvas(canvas, x, y) {
   var bbox = canvas.getBoundingClientRect();
   return { x: x - bbox.left * (canvas.width  / bbox.width),
            y: y - bbox.top  * (canvas.height / bbox.height)
          };
}

context.canvas.onmousemove = function(e) {
   var loc = windowToCanvas(context.canvas, e.clientX, e.clientY);
   context.clearRect(0, 0, context.canvas.width, context.canvas.height);
   drawText();

   context.save();

   context.globalCompositeOperation = selectElement.value;
   context.beginPath();
   context.arc(loc.x, loc.y, 100, 0, Math.PI*2, false);
   context.fillStyle = 'orange';
   context.stroke();
   context.fill();

   context.restore();
}

// Initialization................................................

selectElement.selectedIndex = 3;
context.lineWidth = 0.5;
context.font = '128pt Comic-sans';
drawText();
