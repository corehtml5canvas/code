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
    eraseAllButton = document.getElementById('eraseAllButton'),
    strokeStyleSelect = document.getElementById('strokeStyleSelect'),
    fillStyleSelect = document.getElementById('fillStyleSelect'),
    lineWidthSelect = document.getElementById('lineWidthSelect'),
    fillCheckbox = document.getElementById('fillCheckbox'),
    guidewireCheckbox = document.getElementById('guidewireCheckbox'),

    drawingSurfaceImageData,
   
    mousedown = {},
    rubberbandRect = {},
    dragging = false,
    guidewires = true;


// General-purpose functions.....................................

function drawGrid(color, stepx, stepy) {
   context.save()

   context.strokeStyle = color;
   context.fillStyle = '#ffffff';
   context.lineWidth = 0.5;
   context.fillRect(0, 0, context.canvas.width, context.canvas.height);

   for (var i = stepx + 0.5; i < context.canvas.width; i += stepx) {
     context.beginPath();
     context.moveTo(i, 0);
     context.lineTo(i, context.canvas.height);
     context.stroke();
   }

   for (var i = stepy + 0.5; i < context.canvas.height; i += stepy) {
     context.beginPath();
     context.moveTo(0, i);
     context.lineTo(context.canvas.width, i);
     context.stroke();
   }

   context.restore();
}

function windowToCanvas(x, y) {
   var bbox = canvas.getBoundingClientRect();

   return { x: x - bbox.left * (canvas.width  / bbox.width),
            y: y - bbox.top  * (canvas.height / bbox.height)
          };
}

// Save and restore drawing surface..............................

function saveDrawingSurface() {
   drawingSurfaceImageData = context.getImageData(0, 0,
                             canvas.width,
                             canvas.height);
}

function restoreDrawingSurface() {
   context.putImageData(drawingSurfaceImageData, 0, 0);
}

// Rubberbands...................................................

function updateRubberbandRectangle(loc) {
   rubberbandRect.width  = Math.abs(loc.x - mousedown.x);
   rubberbandRect.height = Math.abs(loc.y - mousedown.y);

   if (loc.x > mousedown.x) rubberbandRect.left = mousedown.x;
   else                     rubberbandRect.left = loc.x;

   if (loc.y > mousedown.y) rubberbandRect.top = mousedown.y;
   else                     rubberbandRect.top = loc.y;
} 

function drawRubberbandShape(loc) {
   var angle,
       radius;

   if (mousedown.y === loc.y) { // horizontal line
      // Horizontal lines are a special case. See the else
      // block for an explanation
      
      radius = Math.abs(loc.x - mousedown.x);
   }
   else {
      // For horizontal lines, the angle is 0, and Math.sin(0)
      // is 0, which means we would be dividing by 0 here to get NaN
      // for radius. The if block above catches horizontal lines.

      angle = Math.atan(rubberbandRect.height/rubberbandRect.width),
      radius = rubberbandRect.height / Math.sin(angle);
   }

   context.beginPath();
   context.arc(mousedown.x, mousedown.y, radius, 0, Math.PI*2, false); 
   context.stroke();

   if (fillCheckbox.checked)
      context.fill();
}

function updateRubberband(loc) {
   updateRubberbandRectangle(loc);
   drawRubberbandShape(loc);
}

// Guidewires....................................................

function drawHorizontalLine (y) {
   context.beginPath();
   context.moveTo(0,y+0.5);
   context.lineTo(context.canvas.width,y+0.5);
   context.stroke();
}

function drawVerticalLine (x) {
   context.beginPath();
   context.moveTo(x+0.5,0);
   context.lineTo(x+0.5,context.canvas.height);
   context.stroke();
}

function drawGuidewires(x, y) {
   context.save();
   context.strokeStyle = 'rgba(0,0,230,0.4)';
   context.lineWidth = 0.5;
   drawVerticalLine(x);
   drawHorizontalLine(y);
   context.restore();
}

// Canvas event handlers.........................................

canvas.onmousedown = function (e) {
   var loc = windowToCanvas(e.clientX, e.clientY);
   
   e.preventDefault(); // prevent cursor change

   saveDrawingSurface();
   mousedown.x = loc.x;
   mousedown.y = loc.y;
   dragging = true;
};

canvas.onmousemove = function (e) {
   var loc; 

   if (dragging) {
      e.preventDefault(); // prevent selections

      loc = windowToCanvas(e.clientX, e.clientY);
      restoreDrawingSurface();
      updateRubberband(loc);

      if(guidewires) {
         drawGuidewires(loc.x, loc.y);
      }
   }
};

canvas.onmouseup = function (e) {
   loc = windowToCanvas(e.clientX, e.clientY);

   restoreDrawingSurface();
   updateRubberband(loc);
   dragging = false;
};

// Controls event handlers.......................................

eraseAllButton.onclick = function (e) {
   context.clearRect(0, 0, canvas.width, canvas.height);
   drawGrid('lightgray', 10, 10);
   saveDrawingSurface(); 
};

strokeStyleSelect.onchange = function (e) {
   context.strokeStyle = strokeStyleSelect.value;
};

fillStyleSelect.onchange = function (e) {
   context.fillStyle = fillStyleSelect.value;
};

lineWidthSelect.onchange = function (e) {
    context.lineWidth = lineWidthSelect.value;
};


guidewireCheckbox.onchange = function (e) {
   guidewires = guidewireCheckbox.checked;
};

// Initialization................................................

context.strokeStyle = strokeStyleSelect.value;
context.fillStyle = fillStyleSelect.value;
context.lineWidth = lineWidthSelect.value;
drawGrid('lightgray', 10, 10);
