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

var context = document.getElementById('canvas').getContext('2d');

// Functions..........................................................

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

function draw() {
   context.clearRect(0, 0, context.canvas.width,
                           context.canvas.height);
   drawGrid('lightgray', 10, 10);

   context.save();

   context.shadowColor = 'rgba(200, 200, 0, 0.5)';
   context.shadowOffsetX = 12;
   context.shadowOffsetY = 12;
   context.shadowBlur = 15;

   drawCutouts();
   strokeCutoutShapes();
   context.restore();
}

function drawCutouts() {
   context.beginPath();
   addOuterRectanglePath(); // CW

   addCirclePath();      // CCW
   addRectanglePath();   // CCW
   addTrianglePath();    // CCW
   
   context.fill(); // Cut out shapes
}

function strokeCutoutShapes() {
   context.save();

   context.strokeStyle = 'rgba(0,0,0,0.7)';

   context.beginPath();
   addOuterRectanglePath(); // CW
   context.stroke();

   context.beginPath();
   addCirclePath();
   addRectanglePath();
   addTrianglePath();
   context.stroke();

   context.restore();
}

function rect(x, y, w, h, direction) {
  if (direction) { // CCW
      context.moveTo(x, y);
      context.lineTo(x, y + h);
      context.lineTo(x + w, y + h);
      context.lineTo(x + w, y);
      context.closePath(); 
  }
  else {
      context.moveTo(x, y);
      context.lineTo(x + w, y);
      context.lineTo(x + w, y + h);
      context.lineTo(x, y + h);
      context.closePath(); 
  }
}

function addOuterRectanglePath() {
   context.rect(110, 25, 370, 335); 
}

function addCirclePath() {
   context.arc(300, 300, 40, 0, Math.PI*2, true);
}

function addRectanglePath() {
   rect(310, 55, 70, 35, true); 
}

function addTrianglePath() {
   context.moveTo(400, 200);
   context.lineTo(250, 115);
   context.lineTo(200, 200);
   context.closePath();
}

// Initialization.....................................................

context.fillStyle = 'goldenrod';
draw();
