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
    endPoints = [
       { x: 130, y: 70 },
       { x: 430, y: 270 },
    ],
    controlPoints = [
       { x: 130, y: 250 },
       { x: 450, y: 70 },
    ];

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

function drawBezierCurve() {
   context.strokeStyle = 'blue';
   context.fillStyle = 'yellow';

   context.beginPath();
   context.moveTo(endPoints[0].x, endPoints[0].y);
   context.bezierCurveTo(controlPoints[0].x, controlPoints[0].y,
                         controlPoints[1].x, controlPoints[1].y,
                         endPoints[1].x, endPoints[1].y);
   context.stroke();
}

function drawEndPoints() {
   context.strokeStyle = 'blue';
   context.fillStyle = 'red';

   endPoints.forEach( function (point) {
      context.beginPath();
      context.arc(point.x, point.y, 5, 0, Math.PI*2, false);
      context.stroke();
      context.fill();
   });
}

function drawControlPoints() {
   context.strokeStyle = 'yellow';
   context.fillStyle = 'blue';

   controlPoints.forEach( function (point) {
      context.beginPath();
      context.arc(point.x, point.y, 5, 0, Math.PI*2, false);
      context.stroke();
      context.fill();
   });
}

drawGrid('lightgray', 10, 10);

drawControlPoints();
drawEndPoints();
drawBezierCurve();
