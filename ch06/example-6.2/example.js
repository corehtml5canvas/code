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

    CLOCK_RADIUS = canvas.width/2 - 15,
    HOUR_HAND_TRUNCATION = 35,

    // Painter...................................................

    ballPainter = {
      paint: function (sprite, context) { 
         var x = sprite.left + sprite.width/2,
             y = sprite.top  + sprite.height/2,
             width = sprite.width,
             height = sprite.height,
             radius = sprite.width/2;

         context.save();
         context.beginPath();
         context.arc(x, y, radius, 0, Math.PI*2, false);
         context.clip();

         context.shadowColor = 'rgb(0,0,0)';
         context.shadowOffsetX = -4;
         context.shadowOffsetY = -4;
         context.shadowBlur = 8;

         context.fillStyle = 'rgba(218, 165, 32, 0.1)';
         context.fill();

         context.lineWidth = 2;
         context.strokeStyle = 'rgb(100,100,195)';
         context.stroke();

         context.restore();
       }
    },

    // Sprite....................................................

    ball = new Sprite('ball', ballPainter);

// Functions.....................................................

function drawGrid(color, stepx, stepy) {
   context.save()

   context.shadowColor = undefined;
   context.shadowBlur = 0;
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

function drawHand(loc, isHour) {
   var angle = (Math.PI*2) * (loc/60) - Math.PI/2,
       handRadius = isHour ? CLOCK_RADIUS - HOUR_HAND_TRUNCATION 
                           : CLOCK_RADIUS,
       lineEnd = {
          x: canvas.width/2 +
             Math.cos(angle)*(handRadius - ball.width/2), 

          y: canvas.height/2 +
             Math.sin(angle)*(handRadius - ball.width/2)
       };

   context.beginPath();
   context.moveTo(canvas.width/2, canvas.height/2);
   context.lineTo(lineEnd.x, lineEnd.y);
   context.stroke();

   ball.left = canvas.width/2  +
               Math.cos(angle)*handRadius - ball.width/2; 

   ball.top  = canvas.height/2 +
               Math.sin(angle)*handRadius - ball.height/2;

   ball.paint(context);
}

function drawClock() {
   drawClockFace();
   drawHands();
}

function drawHands() {
   var date = new Date(),
       hour = date.getHours();

   ball.width = 20;
   ball.height = 20;
   drawHand(date.getSeconds(), false);

   hour = hour > 12 ? hour - 12 : hour;
   ball.width = 35;
   ball.height = 35;
   drawHand(date.getMinutes(), false);

   ball.width = 50;
   ball.height = 50;
   drawHand(hour*5 + (date.getMinutes()/60)*5);

   ball.width = 10;
   ball.height = 10;
   ball.left = canvas.width/2 - ball.width/2;
   ball.top = canvas.height/2 - ball.height/2;
   ballPainter.paint(ball, context);
}

function drawClockFace() {
   context.beginPath();
   context.arc(canvas.width/2, canvas.height/2,
               CLOCK_RADIUS, 0, Math.PI*2, false);

   context.save();
   context.strokeStyle = 'rgba(0,0,0,0.2)';
   context.stroke();
   context.restore();
}

// Animation.....................................................

function animate() {
   context.clearRect(0,0,canvas.width,canvas.height);

   drawGrid('lightgray', 10, 10);
   drawClock();

   window.requestNextAnimationFrame(animate);
}

// Initialization................................................

context.lineWidth = 0.5;
context.strokeStyle = 'rgba(0,0,0,0.2)';

if (navigator.userAgent.indexOf('Opera') === -1)
   context.shadowColor = 'rgba(0,0,0,0.5)';

context.shadowOffsetX = 2;
context.shadowOffsetY = 2;
context.shadowBlur = 4; 
context.stroke();

window.requestNextAnimationFrame(animate);

drawGrid('lightgray', 10, 10);
