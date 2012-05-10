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
    directionCheckbox = document.getElementById('directionCheckbox'),
    annotationCheckbox = document.getElementById('annotationCheckbox'),
    CLOCKWISE = 1,
    COUNTER_CLOCKWISE = 2;

// Functions.....................................................

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

function drawText() {
   context.save();
   context.font = '18px Arial';
   context.fillStyle = 'rgb(0, 0, 200)';
   context.fillText('Two arcs, one path', 10, 30);

   context.font = '16px Lucida Sans';
   context.fillStyle = 'navy';
   context.fillText('context.arc(300, 200, 150, 0, Math.PI*2, false)', 10, 360);
   context.fillText('context.arc(300, 200, 100, 0, Math.PI*2, !sameDirection)', 10, 380);
   context.restore();
}

function drawArcAnnotations(sameDirection) {
   context.save();
   context.font = '16px Lucida Sans';
   context.fillStyle = 'blue';
   context.fillText('CW', 345, 145);
   context.fillText(sameDirection ? 'CW' : 'CCW', 425, 75);
   context.restore();
}

function drawOuterCircleAnnotations(sameDirection) {
   context.save();
   context.beginPath();
   context.moveTo(410, 210);
   context.lineTo(500, 250);
   context.stroke();

   context.beginPath();
   context.arc(500, 250, 3, 0, Math.PI*2, false);
   context.fillStyle = 'navy';
   context.fill();

   context.font = '16px Lucida Sans';
   context.fillText(sameDirection ? '+1' : '-1', 455, 225);
   context.fillText(sameDirection ? '1' : '-1', 515, 255);
   context.restore();
}

function drawInnerCircleAnnotations(sameDirection) {
   context.save();
   context.beginPath();
   context.moveTo(300, 175);
   context.lineTo(100, 250);
   context.stroke();

   context.beginPath();
   context.arc(100, 250, 3, 0, Math.PI*2, false);
   context.fillStyle = 'navy';
   context.fill();

   context.font = '16px Lucida Sans';
   context.fillText('+1', 125, 225);
   context.fillText(sameDirection ? '+1' : '-1', 215, 185);
   context.fillText(sameDirection ? '2' : '0', 75, 255);
   context.restore();
}

function drawAnnotations(sameDirection) {
   context.save();
   context.strokeStyle = 'blue';
   drawInnerCircleAnnotations(sameDirection);
   drawOuterCircleAnnotations(sameDirection);
   drawArcAnnotations(sameDirection);
   context.restore();
}

function drawTwoArcs(sameDirection) {
   context.beginPath();
   context.arc(300, 170, 150, 0, Math.PI*2, false); // outer: CW
   context.arc(300, 170, 100, 0, Math.PI*2, !sameDirection); // innner

   context.fill();
   context.shadowColor = undefined;
   context.shadowOffsetX = 0;
   context.shadowOffsetY = 0;
   context.stroke();
}

function draw(sameDirection) {
   context.clearRect(0, 0, context.canvas.width,
                           context.canvas.height);
   drawGrid('lightgray', 10, 10);

   context.save();

   context.shadowColor = 'rgba(0, 0, 0, 0.8)';
   context.shadowOffsetX = 12;
   context.shadowOffsetY = 12;
   context.shadowBlur = 15;

   drawTwoArcs(directionCheckbox.checked);

   context.restore();

   drawText();

   if (annotationCheckbox.checked) {
      drawAnnotations(directionCheckbox.checked);
   }
}

// Event handlers................................................

annotationCheckbox.onclick = function (e) {
   draw(directionCheckbox.checked);
};
   
directionCheckbox.onclick = function (e) {
   draw(directionCheckbox.checked);
};
    
// Initialization................................................

context.fillStyle = 'rgba(100, 140, 230, 0.5)';
context.strokeStyle = context.fillStyle;//'rgba(20, 60, 150, 0.5)';

draw(directionCheckbox.checked);
