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
    ARROW_MARGIN = 30,
    POINT_RADIUS = 7,
    points = [
       { x: canvas.width - ARROW_MARGIN,
         y: canvas.height - ARROW_MARGIN },

       { x: canvas.width - ARROW_MARGIN*2,
         y: canvas.height - ARROW_MARGIN },

       { x: POINT_RADIUS,
         y: canvas.height/2 },

       { x: ARROW_MARGIN, 
         y: canvas.height/2 - ARROW_MARGIN },

       { x: canvas.width - ARROW_MARGIN, 
         y: ARROW_MARGIN },

       { x: canvas.width - ARROW_MARGIN, 
         y: ARROW_MARGIN*2 },
    ];

// Functions..........................................................

function drawPoint(x, y, strokeStyle, fillStyle) {
   context.beginPath();
   context.fillStyle = fillStyle;
   context.strokeStyle = strokeStyle;
   context.lineWidth = 0.5;
   context.arc(x, y, POINT_RADIUS, 0, Math.PI*2, false);
   context.fill();
   context.stroke();
}

function drawBezierPoints() {
   var i,
       strokeStyle,
       fillStyle;
   
   for (i=0; i < points.length; ++i) {
      fillStyle   = i % 2 === 0 ? 'white' : 'blue',
      strokeStyle = i % 2 === 0 ? 'blue' : 'white';

      drawPoint(points[i].x, points[i].y,
                strokeStyle, fillStyle);
   }
}

function drawArrow() {
   context.strokeStyle = 'white';
   context.fillStyle = 'cornflowerblue';

   context.moveTo(canvas.width - ARROW_MARGIN,
                  ARROW_MARGIN*2);

   context.lineTo(canvas.width - ARROW_MARGIN,
                  canvas.height - ARROW_MARGIN*2);

   context.quadraticCurveTo(points[0].x, points[0].y,
                            points[1].x, points[1].y);

   context.lineTo(ARROW_MARGIN,
                  canvas.height/2 + ARROW_MARGIN);

   context.quadraticCurveTo(points[2].x, points[2].y,
                            points[3].x, points[3].y);

   context.lineTo(canvas.width - ARROW_MARGIN*2,
                  ARROW_MARGIN);

   context.quadraticCurveTo(points[4].x, points[4].y,
                            points[5].x, points[5].y);
   context.fill();
   context.stroke();
}

// Initialization.....................................................

context.clearRect(0,0,canvas.width,canvas.height);
drawArrow();
drawBezierPoints();
