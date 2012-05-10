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
    startTime = undefined,

    PIVOT_Y = 20,
    PIVOT_RADIUS = 7,
    WEIGHT_RADIUS = 25,
    INITIAL_ANGLE = Math.PI/5,
    ROD_LENGTH_IN_PIXELS = 300,

    // Pendulum painter...........................................

    pendulumPainter = {
      PIVOT_FILL_STYLE:    'rgba(0,0,0,0.2)',
      WEIGHT_SHADOW_COLOR: 'rgb(0,0,0)',
      PIVOT_SHADOW_COLOR:  'rgb(255,255,0)',
      STROKE_COLOR:        'rgb(100,100,195)',

      paint: function (pendulum, context) { 
         this.drawPivot(pendulum);
         this.drawRod(pendulum);
         this.drawWeight(pendulum, context);
      },
      
      drawWeight: function (pendulum, context) {
         context.save();
         context.beginPath();
         context.arc(pendulum.weightX, pendulum.weightY,
                     pendulum.weightRadius, 0, Math.PI*2, false);
         context.clip();

         context.shadowColor = this.WEIGHT_SHADOW_COLOR;
         context.shadowOffsetX = -4;
         context.shadowOffsetY = -4;
         context.shadowBlur = 8;

         context.lineWidth = 2;
         context.strokeStyle = this.STROKE_COLOR;
         context.stroke();

         context.beginPath();
         context.arc(pendulum.weightX, pendulum.weightY,
                     pendulum.weightRadius/2, 0, Math.PI*2, false);
         context.clip();

         context.shadowColor = this.PIVOT_SHADOW_COLOR;
         context.shadowOffsetX = -4;
         context.shadowOffsetY = -4;
         context.shadowBlur = 8;
         context.stroke();

         context.restore();
      },

      drawPivot: function (pendulum) {
         context.save();
         context.beginPath();
         context.shadowColor = undefined;
         context.shadowBlur = undefined;
         context.shadowOffsetX = 0;
         context.shadowOffsetY = 0;
         context.fillStyle = 'white';
         context.arc(pendulum.x + pendulum.pivotRadius,
                     pendulum.y, pendulum.pivotRadius/2, 0, Math.PI*2, false);
         context.fill();
         context.stroke();
      
         context.beginPath();
         context.fillStyle = this.PIVOT_FILL_STYLE;
         context.arc(pendulum.x + pendulum.pivotRadius,
                     pendulum.y, pendulum.pivotRadius, 0, Math.PI*2, false);
         context.fill();
         context.stroke();
         context.restore();
      },
      
      drawRod: function (pendulum) {
         context.beginPath();

         context.moveTo(
            pendulum.x + pendulum.pivotRadius +
            pendulum.pivotRadius*Math.sin(pendulum.angle),

            pendulum.y + pendulum.pivotRadius*Math.cos(pendulum.angle));

         context.lineTo(
            pendulum.weightX - pendulum.weightRadius*Math.sin(pendulum.angle),
            pendulum.weightY - pendulum.weightRadius*Math.cos(pendulum.angle));

         context.stroke();
      }
    },

    // Swing behavior.............................................

    swing = {
       GRAVITY_FORCE: 32, // 32 ft/s/s,
       ROD_LENGTH: 0.8,   // 0.8 ft

       execute: function(pendulum, context, time) {
          var elapsedTime = (time - startTime) / 1000;
          
          pendulum.angle = pendulum.initialAngle * Math.cos(
             Math.sqrt(this.GRAVITY_FORCE/this.ROD_LENGTH) * elapsedTime);

          pendulum.weightX = pendulum.x +
                             Math.sin(pendulum.angle) * pendulum.rodLength;

          pendulum.weightY = pendulum.y +
                             Math.cos(pendulum.angle) * pendulum.rodLength;
       }
    },

    // Pendulum...................................................

    pendulum = new Sprite('pendulum', pendulumPainter, [ swing ]);

// Animation Loop................................................

function animate(time) {
   context.clearRect(0,0,canvas.width,canvas.height);
   drawGrid('lightgray', 10, 10);
   pendulum.update(context, time);
   pendulum.paint(context);
   window.requestNextAnimationFrame(animate);
}

function drawGrid(color, stepx, stepy) {
   context.save()

   context.shadowColor = undefined;
   context.shadowBlur = 0;
   context.shadowOffsetX = 0;
   context.shadowOffsetY = 0;

   context.strokeStyle = color;
   context.fillStyle = '#ffffff';
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

// Initialization................................................

pendulum.x = canvas.width/2; 
pendulum.y = PIVOT_Y;
pendulum.weightRadius = WEIGHT_RADIUS;
pendulum.pivotRadius  = PIVOT_RADIUS;
pendulum.initialAngle = INITIAL_ANGLE;
pendulum.angle        = INITIAL_ANGLE;
pendulum.rodLength    = ROD_LENGTH_IN_PIXELS;
 
context.lineWidth = 0.5;
context.strokeStyle = 'rgba(0,0,0,0.5)';

if (navigator.userAgent.indexOf('Opera') === -1)
   context.shadowColor = 'rgba(0,0,0,0.5)';

context.shadowOffsetX = 2;
context.shadowOffsetY = 2;
context.shadowBlur = 4; 
context.stroke();

startTime = + new Date();
animate(startTime);

drawGrid('lightgray', 10, 10);
