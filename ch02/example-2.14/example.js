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

    AXIS_MARGIN = 40,
    AXIS_ORIGIN = { x: AXIS_MARGIN, y: canvas.height-AXIS_MARGIN },

    AXIS_TOP   = AXIS_MARGIN,
    AXIS_RIGHT = canvas.width-AXIS_MARGIN,

    HORIZONTAL_TICK_SPACING = 10,
    VERTICAL_TICK_SPACING = 10,

    AXIS_WIDTH  = AXIS_RIGHT - AXIS_ORIGIN.x,
    AXIS_HEIGHT = AXIS_ORIGIN.y - AXIS_TOP,

    NUM_VERTICAL_TICKS   = AXIS_HEIGHT / VERTICAL_TICK_SPACING,
    NUM_HORIZONTAL_TICKS = AXIS_WIDTH  / HORIZONTAL_TICK_SPACING,

    TICK_WIDTH = 10,
    TICKS_LINEWIDTH = 0.5,
    TICKS_COLOR = 'navy',

    AXIS_LINEWIDTH = 1.0,
    AXIS_COLOR = 'blue';

// Functions..........................................................

function drawGrid(color, stepx, stepy) {
   context.save()

   context.fillStyle = 'white';
   context.fillRect(0, 0, context.canvas.width, context.canvas.height);

   context.lineWidth = 0.5;
   context.strokeStyle = color;

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

function drawAxes() {
   context.save(); 
   context.strokeStyle = AXIS_COLOR;
   context.lineWidth = AXIS_LINEWIDTH;

   drawHorizontalAxis();
   drawVerticalAxis();

   context.lineWidth = 0.5;
   context.lineWidth = TICKS_LINEWIDTH;
   context.strokeStyle = TICKS_COLOR;

   drawVerticalAxisTicks();
   drawHorizontalAxisTicks();

   context.restore();
}

function drawHorizontalAxis() {
   context.beginPath();
   context.moveTo(AXIS_ORIGIN.x, AXIS_ORIGIN.y);
   context.lineTo(AXIS_RIGHT,    AXIS_ORIGIN.y)
   context.stroke();
}

function drawVerticalAxis() {
   context.beginPath();
   context.moveTo(AXIS_ORIGIN.x, AXIS_ORIGIN.y);
   context.lineTo(AXIS_ORIGIN.x, AXIS_TOP);
   context.stroke();
}

function drawVerticalAxisTicks() {
   var deltaY;
   
   for (var i=1; i < NUM_VERTICAL_TICKS; ++i) {
      context.beginPath();

      if (i % 5 === 0) deltaX = TICK_WIDTH;
      else             deltaX = TICK_WIDTH/2;
              
      context.moveTo(AXIS_ORIGIN.x - deltaX,
                     AXIS_ORIGIN.y - i * VERTICAL_TICK_SPACING);

      context.lineTo(AXIS_ORIGIN.x + deltaX,
                     AXIS_ORIGIN.y - i * VERTICAL_TICK_SPACING);

      context.stroke();
   }
}

function drawHorizontalAxisTicks() {
   var deltaY;
   
   for (var i=1; i < NUM_HORIZONTAL_TICKS; ++i) {
      context.beginPath();

      if (i % 5 === 0) deltaY = TICK_WIDTH;
      else             deltaY = TICK_WIDTH/2;
              
      context.moveTo(AXIS_ORIGIN.x + i * HORIZONTAL_TICK_SPACING,
                     AXIS_ORIGIN.y - deltaY);

      context.lineTo(AXIS_ORIGIN.x + i * HORIZONTAL_TICK_SPACING,
                     AXIS_ORIGIN.y + deltaY);

      context.stroke();
   }
}

// Initialization................................................

drawGrid('lightgray', 10, 10);
drawAxes();
