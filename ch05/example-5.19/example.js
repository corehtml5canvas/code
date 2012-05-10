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
    startStopButton = document.getElementById('startStopButton'),
    secondsInput = document.getElementById('seconds'),

    CENTROID_RADIUS = 10,
    CENTROID_STROKE_STYLE = 'rgba(0, 0, 0, 0.5)',
    CENTROID_FILL_STYLE ='rgba(80, 190, 240, 0.6)',

    DEGREE_DIAL_MARGIN = 55,
    TRACKING_DIAL_MARGIN = 80,
    DEGREE_ANNOTATIONS_FILL_STYLE = 'rgba(0, 0, 230, 0.9)',
    GUIDEWIRE_FILL_STYLE = 'rgba(85, 190, 240, 0.8)',
    DEGREE_ANNOTATIONS_TEXT_SIZE = 18,
    DEGREE_OUTER_DIAL_MARGIN = DEGREE_DIAL_MARGIN,

    TICK_WIDTH = 15,
    TICK_LONG_STROKE_STYLE = 'rgba(100, 140, 230, 0.9)',
    TICK_SHORT_STROKE_STYLE = 'rgba(100, 140, 230, 0.7)',

    TEXT_MARGIN = 135,
   
    TRACKING_DIAL_STROKING_STYLE = 'rgba(100, 140, 230, 0.5)',

    GUIDEWIRE_STROKE_STYLE = 'goldenrod',
    GUIDEWIRE_FILL_STYLE = 'rgba(0, 0, 230, 0.9)',
    circle = { x: canvas.width/2,
               y: canvas.height/2,
               radius: 150
             },

    timerSetting = 10,
    stopwatch = new Stopwatch();

// Functions.....................................................

function windowToCanvas(canvas, x, y) {
   var bbox = canvas.getBoundingClientRect();
   return { x: x - bbox.left * (canvas.width  / bbox.width),
            y: y - bbox.top  * (canvas.height / bbox.height)
          };
}

function drawGrid(color, stepx, stepy) {
   context.save()

   context.shadowColor = undefined;
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

// Drawing functions.............................................

function drawCentroid() {
   context.beginPath();
   context.save();
   context.strokeStyle = CENTROID_STROKE_STYLE;
   context.fillStyle = CENTROID_FILL_STYLE;
   context.arc(circle.x, circle.y, CENTROID_RADIUS, 0, Math.PI*2, false);
   context.stroke();
   context.fill();
   context.restore();
}

function drawHand(loc) {
   var initialAngle = -Math.PI/2 - (Math.PI / 180) * (timerSetting / 60 * 360),
       angle = initialAngle,
       stopwatchElapsed = stopwatch.getElapsedTime(),
       seconds,
       radius,
       endpt;

  if (stopwatchElapsed) {
     angle = -Math.PI/2 - (Math.PI / 180) * ((timerSetting - stopwatchElapsed/1000) / 60 * 360),
     seconds = parseFloat(timerSetting - stopwatchElapsed/1000).toFixed(2);
     if (seconds > 0) {
         secondsInput.value = seconds;
     }
   }

   radius = circle.radius + TRACKING_DIAL_MARGIN;

  if (loc.x >= circle.x) {
      endpt = { x: circle.x + radius * Math.cos(angle),
                y: circle.y + radius * Math.sin(angle)
      };
   }
   else {
      endpt = { x: circle.x - radius * Math.cos(angle),
                y: circle.y - radius * Math.sin(angle)
      };
   }
   
   context.save();

   context.strokeStyle = GUIDEWIRE_STROKE_STYLE;
   context.fillStyle = GUIDEWIRE_FILL_STYLE;
   context.lineWidth = 1.5;

   context.beginPath();
   context.moveTo(circle.x, circle.y);
   context.lineTo(endpt.x, endpt.y);
   context.stroke();

   context.beginPath();
   context.fillStyle = 'yellow';
   context.arc(endpt.x, endpt.y, 7, 0, Math.PI*2, false);
   context.stroke();
   context.fill();

   context.restore();
}

function drawDegreeOuterDial() {
   context.strokeStyle = 'rgba(0, 0, 0, 0.1)';
   context.arc(circle.x, circle.y,
               circle.radius + DEGREE_OUTER_DIAL_MARGIN,
               0, Math.PI*2, false);
}

function drawDegreeAnnotations() {
   var radius = circle.radius + TEXT_MARGIN;

   context.save();
   context.fillStyle = DEGREE_ANNOTATIONS_FILL_STYLE;
   context.font = DEGREE_ANNOTATIONS_TEXT_SIZE + 'px Arial'; 
   
   for (var angle=Math.PI/2, i=0; i < 60; angle += Math.PI/6, i+=5) {
      context.beginPath();
      context.fillText(i,
         circle.x + Math.cos(angle) * (radius - TICK_WIDTH*2),
         circle.y - Math.sin(angle) * (radius - TICK_WIDTH*2));
   }
   context.restore();
}
   
function drawDegreeDialTicks() {
   var radius = circle.radius + DEGREE_DIAL_MARGIN,
       ANGLE_MAX = 2*Math.PI,
       ANGLE_DELTA = Math.PI/64;

   context.save();
   
   for (var angle = 0, cnt = 0; angle < ANGLE_MAX; angle += ANGLE_DELTA, ++cnt) {
      context.beginPath();

      if (cnt % 4 === 0) {
         context.moveTo(circle.x + Math.cos(angle) * (radius - TICK_WIDTH),
                        circle.y + Math.sin(angle) * (radius - TICK_WIDTH));
         context.lineTo(circle.x + Math.cos(angle) * (radius),
                        circle.y + Math.sin(angle) * (radius));
         context.strokeStyle = TICK_LONG_STROKE_STYLE;
         context.stroke();
      }
      else {
         context.moveTo(circle.x + Math.cos(angle) * (radius - TICK_WIDTH/2),
                        circle.y + Math.sin(angle) * (radius - TICK_WIDTH/2));
         context.lineTo(circle.x + Math.cos(angle) * (radius),
                        circle.y + Math.sin(angle) * (radius));
         context.strokeStyle = TICK_SHORT_STROKE_STYLE;
         context.stroke();
      }

      context.restore();
   }
}

function drawDegreeTickDial() {
   context.save();
   context.strokeStyle = 'rgba(0, 0, 0, 0.1)';
   context.arc(circle.x, circle.y,
               circle.radius + DEGREE_DIAL_MARGIN - TICK_WIDTH, 0, Math.PI*2, false);
   context.stroke();
   context.restore();
}

function drawTrackingDial() {
   context.save();
   context.shadowColor = 'rgba(0, 0, 0, 0.7)';
   context.shadowOffsetX = 3,
   context.shadowOffsetY = 3,
   context.shadowBlur = 6,
   context.strokeStyle = TRACKING_DIAL_STROKING_STYLE;
   context.beginPath();
   context.arc(circle.x, circle.y, circle.radius +
               TRACKING_DIAL_MARGIN, 0, Math.PI*2, true);
   context.stroke();
   context.restore();
}

function drawDial() {
   var loc = {x: circle.x, y: circle.y};
   
   drawCentroid();
   drawHand(loc);

   drawTrackingDial();
   drawDegreeOuterDial();

   context.fillStyle = 'rgba(218, 165, 35, 0.2)';
   context.fill();

   context.beginPath();
   drawDegreeOuterDial();
   context.stroke();

   drawDegreeTickDial();
   drawDegreeDialTicks();
   drawDegreeAnnotations();
}

function redraw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid('lightgray', 10, 10);
  drawDial(); 
}

function animate() {
   if (stopwatch.isRunning() &&
       stopwatch.getElapsedTime() > timerSetting*1000) { // animation is over
      stopwatch.stop();
      startStopButton.value = 'Start';
      secondsInput.disabled = false;
      secondsInput.value = 0;
   }
   else if (stopwatch.isRunning()) { // animation is running
     redraw();
     requestNextAnimationFrame(animate);
   }
}

startStopButton.onclick = function (e) {
   var value = startStopButton.value;
   if (value === 'Start') {
      stopwatch.start();
      startStopButton.value = 'Stop';
      requestNextAnimationFrame(animate);
      secondsInput.disabled = true;
   }
   else {
      stopwatch.stop();
      timerSetting = parseFloat(secondsInput.value);
      startStopButton.value = 'Start';
      secondsInput.disabled = false;
   }
   stopwatch.reset();
};

secondsInput.onchange = function (e) {
   timerSetting = parseFloat(secondsInput.value);
   redraw();
};

// Initialization................................................

drawGrid('lightgray', 10, 10);

if (navigator.userAgent.indexOf('Opera') === -1)
   context.shadowColor = 'rgba(0, 0, 0, 0.4)';

context.shadowOffsetX = 2;
context.shadowOffsetY = 2;
context.shadowBlur = 4;

context.textAlign = 'center';
context.textBaseline = 'middle';

drawDial();
