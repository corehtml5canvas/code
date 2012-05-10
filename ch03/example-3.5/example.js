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
    text = 'Centered',
    textMetrics,
    SQUARE_WIDTH = 20, 
    FONT_HEIGHT = 128;

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
};

function drawText() {
   context.fillStyle = 'orange';
   context.strokeStyle = 'cornflowerblue';

   context.fillText(text, canvas.width/2,
                          canvas.height/2);

   context.strokeText(text, canvas.width/2,
                            canvas.height/2);
};

function drawCenterSquare() {
   context.fillStyle = 'rgba(255, 0, 0, 0.4)';
   context.strokeStyle = 'black';
   context.fillRect(canvas.width/2 - SQUARE_WIDTH/2,
                    canvas.height/2 - SQUARE_WIDTH/2, 20, 20);

   context.strokeRect(canvas.width/2 - SQUARE_WIDTH/2,
                      canvas.height/2 - SQUARE_WIDTH/2, 20, 20);
};

context.font = '128px Helvetica';
context.textBaseline = 'middle';
context.textAlign = 'center';
textMetrics = context.measureText(text);

drawGrid('lightgray', 10, 10);
drawText();
drawCenterSquare();
