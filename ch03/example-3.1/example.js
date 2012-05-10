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

    fillCheckbox   = document.getElementById('fillCheckbox'),
    strokeCheckbox = document.getElementById('strokeCheckbox'),
    shadowCheckbox = document.getElementById('shadowCheckbox'),

    text='HTML5';

// Functions..........................................................

function draw() {
   context.clearRect(0, 0, canvas.width, canvas.height);
   drawBackground();

   if (shadowCheckbox.checked) turnShadowsOn();
   else                        turnShadowsOff();

   drawText();
}

function drawBackground() {  // Ruled paper
   var STEP_Y = 12,
       TOP_MARGIN = STEP_Y * 4,
       LEFT_MARGIN = STEP_Y * 3,
       i = context.canvas.height;

   // Horizontal lines
   
   context.strokeStyle = 'lightgray';
   context.lineWidth = 0.5;

   while(i > TOP_MARGIN) { 
      context.beginPath();
      context.moveTo(0, i);
      context.lineTo(context.canvas.width, i);
      context.stroke();
      i -= STEP_Y;
   }

   // Vertical line
   
   context.strokeStyle = 'rgba(100,0,0,0.3)';
   context.lineWidth = 1;

   context.beginPath();

   context.moveTo(LEFT_MARGIN,0);
   context.lineTo(LEFT_MARGIN,context.canvas.height);
   context.stroke();
}

function turnShadowsOn() {
   if (navigator.userAgent.indexOf('Opera') === -1) {
      context.shadowColor = 'rgba(0, 0, 0, 0.8)';
   }
      context.shadowOffsetX = 5;
      context.shadowOffsetY = 5;
      context.shadowBlur    = 10;
}

function turnShadowsOff() {
   if (navigator.userAgent.indexOf('Opera') === -1) {
      context.shadowColor = undefined;
   }
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.shadowBlur    = 0;
}

function drawText() {
   var TEXT_X = 65,
       TEXT_Y = canvas.height/2 + 35;

   context.strokeStyle = 'blue';

   if (fillCheckbox.checked)   context.fillText  (text, TEXT_X, TEXT_Y);
   if (strokeCheckbox.checked) context.strokeText(text, TEXT_X, TEXT_Y);
}

// Event handlers.....................................................

fillCheckbox.onchange   = draw;
strokeCheckbox.onchange = draw;
shadowCheckbox.onchange = draw;

// Initialization.....................................................

context.font = '128px Palatino';
context.lineWidth = 1.0;
context.fillStyle = 'cornflowerblue';

turnShadowsOn();

draw();
