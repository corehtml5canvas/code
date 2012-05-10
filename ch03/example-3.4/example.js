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
    fontHeight = 24,
    alignValues = ['start', 'center', 'end'],
    baselineValues = ['top', 'middle', 'bottom',
                      'alphabetic', 'ideographic', 'hanging'],
    x, y;

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

function drawTextMarker() {
   context.fillStyle = 'yellow';
   context.fillRect  (x, y, 7, 7);
   context.strokeRect(x, y, 7, 7);
}

function drawText(text, textAlign, textBaseline) {
   if(textAlign) context.textAlign = textAlign;
   if(textBaseline) context.textBaseline = textBaseline;

   context.fillStyle = 'cornflowerblue';
   context.fillText(text, x, y);
}

function drawTextLine() {
   context.strokeStyle = 'gray';

   context.beginPath();
   context.moveTo(x, y);
   context.lineTo(x + 738, y);
   context.stroke();
}

// Initialization.....................................................

context.font = 'oblique normal bold 24px palatino';

drawGrid('lightgray', 10, 10);

for (var align=0; align < alignValues.length; ++align) {
   for (var baseline=0; baseline < baselineValues.length; ++baseline) {
      x = 20 + align*fontHeight*15;
      y = 20 + baseline*fontHeight*3;
      
      drawText(alignValues[align] + '/' + baselineValues[baseline],
               alignValues[align], baselineValues[baseline]);

      drawTextMarker();
      drawTextLine();
    }
}
