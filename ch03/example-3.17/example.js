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

    fontSelect = document.getElementById('fontSelect'),
    sizeSelect = document.getElementById('sizeSelect'),
    strokeStyleSelect = document.getElementById('strokeStyleSelect'),
    fillStyleSelect = document.getElementById('fillStyleSelect'),

    GRID_STROKE_STYLE = 'lightgray',
    GRID_HORIZONTAL_SPACING = 10,
    GRID_VERTICAL_SPACING = 10,

    cursor = new TextCursor(),

    line,

    blinkingInterval,
    BLINK_TIME = 1000,
    BLINK_OFF = 300;

// General-purpose functions.....................................

function drawBackground() { // Ruled paper
   var STEP_Y = 12,
       i = context.canvas.height;
   
   context.strokeStyle = 'rgba(0,0,200,0.225)';
   context.lineWidth = 0.5;

   context.save();

   while(i > STEP_Y*4) {
      context.beginPath();
      context.moveTo(0, i);
      context.lineTo(context.canvas.width, i);
      context.stroke();
      i -= STEP_Y;
   }

   context.strokeStyle = 'rgba(100,0,0,0.3)';
   context.lineWidth = 1;

   context.beginPath();

   context.moveTo(35,0);
   context.lineTo(35,context.canvas.height);
   context.stroke();

   context.restore();
}

function windowToCanvas(x, y) {
   var bbox = canvas.getBoundingClientRect();
   return { x: x - bbox.left * (canvas.width  / bbox.width),
            y: y - bbox.top  * (canvas.height / bbox.height)
          };
}

// Drawing surface...............................................

function saveDrawingSurface() {
   drawingSurfaceImageData = context.getImageData(0, 0,
                             canvas.width,
                             canvas.height);
}

// Text..........................................................

function setFont() {
   context.font = sizeSelect.value + 'px ' + fontSelect.value;
}

function blinkCursor(x, y) {
   clearInterval(blinkingInterval);
   blinkingInterval = setInterval( function (e) {
   cursor.erase(context, drawingSurfaceImageData);
      
      setTimeout( function (e) {
         if (cursor.left == x &&
            cursor.top + cursor.getHeight(context) == y) {
            cursor.draw(context, x, y);
         }
      }, 300);
   }, 1000);
}

function moveCursor(x, y) {
   cursor.erase(context, drawingSurfaceImageData);
   saveDrawingSurface();
   context.putImageData(drawingSurfaceImageData, 0, 0);

   cursor.draw(context, x, y);
   blinkCursor(x, y);
}

// Event handlers................................................

canvas.onmousedown = function (e) {
   var loc = windowToCanvas(e.clientX, e.clientY),
       fontHeight = context.measureText('W').width;

   fontHeight += fontHeight/6;
   line = new TextLine(loc.x, loc.y);
   moveCursor(loc.x, loc.y);
};

fillStyleSelect.onchange = function (e) {
   cursor.fillStyle = fillStyleSelect.value;
   context.fillStyle = fillStyleSelect.value;
}

strokeStyleSelect.onchange = function (e) {
   cursor.strokeStyle = strokeStyleSelect.value;
   context.strokeStyle = strokeStyleSelect.value;
}

// Key event handlers............................................

document.onkeydown = function (e) {
   if (e.keyCode === 8 || e.keyCode === 13) {
      // The call to e.preventDefault() suppresses
      // the browser's subsequent call to document.onkeypress(),
      // so only suppress that call for backspace and enter.
      e.preventDefault();
   }
   
   if (e.keyCode === 8) {  // backspace
      context.save();

      line.erase(context, drawingSurfaceImageData);
      line.removeCharacterBeforeCaret();

      moveCursor(line.left + line.getWidth(context),
                 line.bottom);

      line.draw(context);

      context.restore();
   }
}
   
document.onkeypress = function (e) {
   var key = String.fromCharCode(e.which);

   if (e.keyCode !== 8 && !e.ctrlKey && !e.metaKey) {
     e.preventDefault(); // no further browser processing

     context.save();

     line.erase(context, drawingSurfaceImageData);
     line.insert(key);

     moveCursor(line.left + line.getWidth(context),
                line.bottom);

     context.shadowColor = 'rgba(0, 0, 0, 0.5)';
     context.shadowOffsetX = 1;
     context.shadowOffsetY = 1;
     context.shadowBlur = 2;

     line.draw(context);

     context.restore();
   }
}

// Initialization................................................

fontSelect.onchange = setFont;
sizeSelect.onchange = setFont;

cursor.fillStyle = fillStyleSelect.value;
cursor.strokeStyle = strokeStyleSelect.value;

context.fillStyle = fillStyleSelect.value;
context.strokeStyle = strokeStyleSelect.value;

context.lineWidth = 2.0;

setFont();
drawBackground();
saveDrawingSurface();
