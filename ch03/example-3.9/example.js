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

    CENTROID_RADIUS = 10,
    CENTROID_STROKE_STYLE = 'rgba(0, 0, 0, 0.5)',
    CENTROID_FILL_STYLE ='rgba(80, 190, 240, 0.6)',

    GUIDEWIRE_STROKE_STYLE = 'goldenrod',
    GUIDEWIRE_FILL_STYLE = 'rgba(85, 190, 240, 0.6)',

    TEXT_FILL_STYLE = 'rgba(100, 130, 240, 0.5)',
    TEXT_STROKE_STYLE = 'rgba(200, 0, 0, 0.7)',
    TEXT_SIZE = 64,

    GUIDEWIRE_STROKE_STYLE = 'goldenrod',
    GUIDEWIRE_FILL_STYLE = 'rgba(85, 190, 240, 0.6)',

    circle = { x: canvas.width/2,
               y: canvas.height/2,
               radius: 200
             };

// Functions.....................................................

function drawGrid(color, stepx, stepy) {
   context.save()

   context.shadowColor = undefined;
   context.shadowOffsetX = 0;
   context.shadowOffsetY = 0;
   
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

// Drawing functions.............................................

function drawCentroid() {
   context.beginPath();
   context.save();
   context.strokeStyle = CENTROID_STROKE_STYLE;
   context.fillStyle = CENTROID_FILL_STYLE;
   context.arc(circle.x, circle.y, CENTROID_RADIUS, 0, Math.PI*2, false);
   context.stroke();
   context.fill();
   context.restore();
}

function drawCircularText(string, startAngle, endAngle) {
   var radius = circle.radius,
       angleDecrement = (startAngle - endAngle)/(string.length-1),
       angle = parseFloat(startAngle),
       index = 0,
       character;

   context.save();
   context.fillStyle = TEXT_FILL_STYLE;
   context.strokeStyle = TEXT_STROKE_STYLE;
   context.font = TEXT_SIZE + 'px Lucida Sans'; 

   while (index < string.length) {
      character = string.charAt(index);

      context.save();
      context.beginPath();

      context.translate(
         circle.x + Math.cos(angle) * radius,
         circle.y - Math.sin(angle) * radius);

      context.rotate(Math.PI/2 - angle);
      
      context.fillText(character, 0, 0);
      context.strokeText(character, 0, 0);

      angle -= angleDecrement;
      index++;

      context.restore();
   }
   context.restore();
}
   
// Initialization................................................

if (navigator.userAgent.indexOf('Opera') === -1)
   context.shadowColor = 'rgba(0, 0, 0, 0.4)';

context.shadowOffsetX = 2;
context.shadowOffsetY = 2;
context.shadowBlur = 5;

context.textAlign = 'center';
context.textBaseline = 'middle';

drawGrid('lightgray', 10, 10);
drawCentroid();

drawCircularText("Clockwise around the circle", Math.PI*2, Math.PI/8);
