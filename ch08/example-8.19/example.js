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
    shapes = [],
    polygonPoints = [
      [ new Point(250, 150), new Point(250, 200),
        new Point(300, 200) ],

      [ new Point(100, 100), new Point(100, 125),
        new Point(125, 125), new Point(125, 100) ],

      [ new Point(400, 100), new Point(380, 150),
        new Point(500, 150), new Point(520, 100) ],
    ],

    polygonStrokeStyles = [ 'blue', 'yellow', 'red'],
    polygonFillStyles   = [ 'rgba(255,255,0,0.7)',
                            'rgba(100,140,230,0.6)',
                            'rgba(255,255,255,0.8)' ],
    shapeMoving = undefined,
    c1 = new Circle(150, 275, 20),
    c2 = new Circle(350, 350, 30),

    lastTime = undefined,
    velocity = { x: 350, y: 190 },
    lastVelocity = { x: 350, y: 190 },
    STICK_DELAY = 500,
    stuck = false;
    showInstructions = true;

// Functions.....................................................

function windowToCanvas(e) {
   var x = e.x || e.clientX,
       y = e.y || e.clientY,
       bbox = canvas.getBoundingClientRect();

   return { x: x - bbox.left * (canvas.width  / bbox.width),
            y: y - bbox.top  * (canvas.height / bbox.height)
          };
};

function drawShapes() {
   shapes.forEach( function (shape) {
      shape.stroke(context);
      shape.fill(context);
   });
}

function stick(mtv) {
   var dx,
       dy,
       velocityMagnitude,
       point;

   if (mtv.axis === undefined) { // The object that's moving is a circle. 
      point = new Point();
      velocityMagnitude = Math.sqrt(Math.pow(velocity.x, 2) +
                                    Math.pow(velocity.y, 2));

      // Point the mtv axis in the direction of the circle's velocity.

      point.x = velocity.x / velocityMagnitude;
      point.y = velocity.y / velocityMagnitude;

      mtv.axis = new Vector(point);
   }

   // Calclulate delta X and delta Y. The mtv.axis is a unit vector
   // indicating direction, and the overlap is the magnitude of
   // the translation vector.
   
   dx = mtv.axis.x * mtv.overlap;
   dy = mtv.axis.y * mtv.overlap;

   // If deltas and velocity are in the same direction,
   // turn deltas around.

   if ((dx < 0 && velocity.x < 0) || (dx > 0 && velocity.x > 0))
      dx = -dx;

   if ((dy < 0 && velocity.y < 0) || (dy > 0 && velocity.y > 0))
      dy = -dy;

   // In STICK_DELAY (500) ms, move the moving shape out of collision
   
   setTimeout(function () {
      shapeMoving.move(dx, dy);
   }, STICK_DELAY);

   // Reset pertinent variables

   lastVelocity.x = velocity.x;
   lastVelocity.y = velocity.y;
   velocity.x = velocity.y = 0;

   // Don't stick again before STICK_DELAY expires
   stuck = true;
}

function collisionDetected(mtv) {
   return mtv.axis != undefined || mtv.overlap !== 0;
}

function detectCollisions() {
   var textY = 30, bbox, mtv;
   
   if (shapeMoving) {
      shapes.forEach( function (shape) {
         if (shape !== shapeMoving) {
            mtv = shapeMoving.collidesWith(shape);

            if (collisionDetected(mtv)) {
               if (!stuck)
                  stick(mtv);
            }
         }
      });

      bbox = shapeMoving.boundingBox();
      if (bbox.left + bbox.width > canvas.width || bbox.left < 0) {
         velocity.x = -velocity.x;
      }
      if (bbox.top + bbox.height > canvas.height || bbox.top < 0) {
         velocity.y = -velocity.y;
      }
   }
};

// Event Handlers................................................

canvas.onmousedown = function (e) {
   var location = windowToCanvas(e);

   if (showInstructions)
      showInstructions = false;
   
   velocity.x = lastVelocity.x;
   velocity.y = lastVelocity.y;

   shapeMoving = undefined;
   stuck = false;
   
   shapes.forEach( function (shape) {
      if (shape.isPointInPath(context, location.x, location.y)) {
         shapeMoving = shape;
      }   
   });
};

// Animation.....................................................

function animate(time) {
   var elapsedTime, deltaX;

   if (lastTime === 0) {
      if (time !== undefined)
         lastTime = time;

      window.requestNextAnimationFrame(animate);
      return;
   }

   context.clearRect(0,0,canvas.width,canvas.height);
   
   if (shapeMoving !== undefined) {
      elapsedTime = parseFloat(time - lastTime) / 1000;
      shapeMoving.move(velocity.x * elapsedTime,
                       velocity.y * elapsedTime);
   }
      
   detectCollisions();
   drawShapes();
   lastTime = time;

   if (showInstructions) {
      context.fillStyle = 'cornflowerblue';
      context.font = '24px Arial';
      context.fillText('Click on a shape to animate it', 20, 40);
   }
   window.requestNextAnimationFrame(animate);
};

// Initialization................................................

for (var i=0; i < polygonPoints.length; ++i) {
   var polygon = new Polygon(),
       points = polygonPoints[i];

   polygon.strokeStyle = polygonStrokeStyles[i];
   polygon.fillStyle = polygonFillStyles[i];

   points.forEach( function (point) {
      polygon.addPoint(point.x, point.y);
   });

   shapes.push(polygon);
}

c1.fillStyle = 'rgba(200, 50, 50, 0.5)';

shapes.push(c1);
shapes.push(c2);

context.shadowColor = 'rgba(100,140,255,0.5)';
context.shadowBlur = 4;
context.shadowOffsetX = 2;
context.shadowOffsetY = 2;
context.font = '38px Arial';

window.requestNextAnimationFrame(animate);
