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

var context = document.querySelector('#canvas').getContext('2d');

function drawDashedLine(context, x1, y1, x2, y2, dashLength) {
   dashLength = dashLength === undefined ? 5 : dashLength;

   var deltaX = x2 - x1;
   var deltaY = y2 - y1;
   var numDashes = Math.floor(
       Math.sqrt(deltaX * deltaX + deltaY * deltaY) / dashLength);

   for (var i=0; i < numDashes; ++i) {
      context[ i % 2 === 0 ? 'moveTo' : 'lineTo' ]
         (x1 + (deltaX / numDashes) * i, y1 + (deltaY / numDashes) * i);
   }

   context.stroke();
};

context.lineWidth = 3;
context.strokeStyle = 'blue';

drawDashedLine(context, 20, 20, context.canvas.width-20, 20);
drawDashedLine(context, context.canvas.width-20, 20, context.canvas.width-20, context.canvas.height-20, 10);
drawDashedLine(context, context.canvas.width-20, context.canvas.height-20, 20, context.canvas.height-20, 15);
drawDashedLine(context, 20, context.canvas.height-20, 20, 20, 2);
