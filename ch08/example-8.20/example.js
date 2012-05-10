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

      [ new Point(150, 100), new Point(150, 150),
        new Point(200, 150) ],

      [ new Point(150, 250), new Point(150, 200),
        new Point(200, 200) ],

      [ new Point(100, 75), new Point(100, 100),
        new Point(125, 100), new Point(125, 75) ],

      [ new Point(300, 75), new Point(280, 125),
        new Point(350, 125) ]
    ],

    polygonStrokeStyles = [ 'blue', 'yellow', 'red', 'red', 'black'],
    polygonFillStyles   = [ 'rgba(255,255,0,0.7)',
                            'rgba(100,140,230,0.6)',
                            'rgba(255,255,255,0.6)',
                            'aqua',
                            'rgba(255,0,255,0.8)' ],
    shapeMoving = undefined,
    c1 = new Circle(150, 275, 10),
    c2 = new Circle(350, 200, 15),

    lastTime = undefined,
    velocity = new Vector(new Point(350, 190)),
    lastVelocity = { x: 350, y: 190 },
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

function separate(mtv) {
   var dx, dy, velocityMagnitude, point;

   if (mtv.axis === undefined) {
      point = new Point();
      velocityMagnitude = Math.sqrt(Math.pow(velocity.x, 2) +
                                    Math.pow(velocity.y, 2));

      point.x = velocity.x / velocityMagnitude;
      point.y = velocity.y / velocityMagnitude;

      mtv.axis = new Vector(point);
   }
   
   dy = mtv.axis.y * mtv.overlap;
   dx = mtv.axis.x * mtv.overlap 

   if ((dx < 0 && velocity.x < 0) ||
       (dx > 0 && velocity.x > 0)) {
      dx = -dx;
   }

   if ((dy < 0 && velocity.y < 0) ||
       (dy > 0 && velocity.y > 0)) {
      dy = -dy;
   }
      
   shapeMoving.move(dx, dy);
}

function checkMTVAxisDirection(mtv, collider, collidee) {
   var centroid1, centroid2, centroidVector, centroidUnitVector;

   if (mtv.axis === undefined)
      return;
   
   centroid1 = new Vector(collider.centroid()),
   centroid2 = new Vector(collidee.centroid()),
   centroidVector = centroid2.subtract(centroid1),
   centroidUnitVector = (new Vector(centroidVector)).normalize();

   if (centroidUnitVector.dotProduct(mtv.axis) > 0) {
      mtv.axis.x = -mtv.axis.x;
      mtv.axis.y = -mtv.axis.y;
   }

};

function bounce(mtv, collider, collidee) {
   var dotProductRatio, vdotl, ldotl, point,
       velocityVector = new Vector(new Point(velocity.x, velocity.y)),
       velocityUnitVector = velocityVector.normalize(),
       velocityVectorMagnitude = velocityVector.getMagnitude(),
       perpendicular;
       
   if (shapeMoving) {
      checkMTVAxisDirection(mtv, collider, collidee)

      point = new Point();

      if (mtv.axis !== undefined) {
         perpendicular = mtv.axis.perpendicular();
      }
      else {
         perpendicular = new Vector(new Point(-velocityUnitVector.y,
                                        velocityUnitVector.x));
      }

      vdotl = velocityUnitVector.dotProduct(perpendicular);
      ldotl = perpendicular.dotProduct(perpendicular);
      dotProductRatio = vdotl / ldotl;

      point.x = 2 * dotProductRatio * perpendicular.x - velocityUnitVector.x;
      point.y = 2 * dotProductRatio * perpendicular.y - velocityUnitVector.y;

      separate(mtv);

      velocity.x = point.x * velocityVectorMagnitude;
      velocity.y = point.y * velocityVectorMagnitude;
   }
}

function collisionDetected(mtv) {
   return mtv.axis != undefined || mtv.overlap !== 0;
};

function handleEdgeCollisions() {
   var bbox = shapeMoving.boundingBox(),
       right = bbox.left + bbox.width,
       bottom = bbox.top + bbox.height;
      
   if (right > canvas.width || bbox.left < 0) {
      velocity.x = -velocity.x;

      if (right > canvas.width)
         shapeMoving.move(0-(right-canvas.width), 0);

      if (bbox.left < 0)
         shapeMoving.move(-bbox.left, 0);
   }
   if (bottom > canvas.height || bbox.top < 0) {
      velocity.y = -velocity.y;

      if (bottom > canvas.height)
         shapeMoving.move(0, 0-(bottom-canvas.height));
      if (bbox.top < 0)
         shapeMoving.move(0, -bbox.top);
   }
};

function handleShapeCollisions() {
   var mtv;
   
   shapes.forEach( function (shape) {
      if (shape !== shapeMoving) {
         mtv = shapeMoving.collidesWith(shape);
         if (collisionDetected(mtv)) {
            bounce(mtv, shapeMoving, shape);
         }
      }
   });
};

function detectCollisions() {
   if (shapeMoving) {
      handleShapeCollisions();
      handleEdgeCollisions();
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
   
   shapes.forEach( function (shape) {
      if (shape.isPointInPath(context, location.x, location.y)) {
         shapeMoving = shape;
      }   
   });
};

canvas.onmouseup = function (e) {
   lastVelocity.x = velocity.x;
   lastVelocity.y = velocity.y;
};

// Animation.....................................................

function animate(time) {
   var elapsedTime;

   if (lastTime === 0) {
         lastTime = time;
   }
   else {
     context.clearRect(0,0,canvas.width,canvas.height);
     drawGrid('lightgray', 10, 10);
   
     if (shapeMoving !== undefined) {
        elapsedTime = parseFloat(time - lastTime) / 1000;
        shapeMoving.move(velocity.x * elapsedTime,
                         velocity.y * elapsedTime);

        detectCollisions();
     }
      
     drawShapes();
     lastTime = time;

     if (showInstructions) {
        context.fillStyle = 'cornflowerblue';
        context.font = '24px Arial';
        context.fillText('Click on a shape to animate it', 20, 40);
        context.fillText('Click on the background to stop animating', 20, 65);
     }
   }
   window.requestNextAnimationFrame(animate);
};

function drawGrid(color, stepx, stepy) {
   context.save()

   context.shadowColor = undefined;
   context.shadowBlur = 0;;
   context.shadowOffsetX = 0;
   context.shadowOffsetY = 0;
   
   context.strokeStyle = color;
   context.fillStyle = '#ffffff';
   context.lineWidth = 0.5;
   context.fillRect(0, 0, context.canvas.width, context.canvas.height);

   context.beginPath();

   for (var i = stepx + 0.5; i < context.canvas.width; i += stepx) {
     context.moveTo(i, 0);
     context.lineTo(i, context.canvas.height);
   }
   context.stroke();

   context.beginPath();

   for (var i = stepy + 0.5; i < context.canvas.height; i += stepy) {
     context.moveTo(0, i);
     context.lineTo(context.canvas.width, i);
   }
   context.stroke();

   context.restore();
}

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

c1.fillStyle = 'rgba(255,255,0,1.0)';
c2.strokeStyle = 'rgba(255,255,0,1.0)';
c2.fillStyle = 'rgba(0,0,255,0.6)';
shapes.push(c1);
shapes.push(c2);

if (navigator.userAgent.indexOf('Opera') === -1)
   context.shadowColor = 'rgba(100,140,255,0.5)';

context.shadowBlur = 4;
context.shadowOffsetX = 2;
context.shadowOffsetY = 2;
context.font = '38px Arial';

drawGrid('lightgray', 10, 10);
window.requestNextAnimationFrame(animate);
