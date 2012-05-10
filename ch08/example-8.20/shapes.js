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

// Functions.....................................................

// ..............................................................
// Check to see if a polygon collides with another polygon
// ..............................................................

function polygonCollidesWithPolygon (p1, p2, displacement) { // displacement for p1
   var mtv1 = p1.minimumTranslationVector(p1.getAxes(), p2, displacement),
       mtv2 = p1.minimumTranslationVector(p2.getAxes(), p2, displacement);

   if (mtv1.overlap === 0 || mtv2.overlap === 0)
      return { axis: undefined, overlap: 0 };
   else
      return mtv1.overlap < mtv2.overlap ? mtv1 : mtv2;
};

// ..............................................................
// Check to see if a circle collides with another circle
// ..............................................................

function circleCollidesWithCircle (c1, c2) {
   var distance = Math.sqrt( Math.pow(c2.x - c1.x, 2) +
                             Math.pow(c2.y - c1.y, 2)),
       overlap = Math.abs(c1.radius + c2.radius) - distance;

   return overlap < 0 ?
      new MinimumTranslationVector(undefined, 0) :
      new MinimumTranslationVector(undefined, overlap);
};

// ..............................................................
// Get the polygon's point that's closest to the circle
// ..............................................................

function getPolygonPointClosestToCircle(polygon, circle) {
   var min = BIG_NUMBER,
       length,
       testPoint,
       closestPoint;
   
   for (var i=0; i < polygon.points.length; ++i) {
      testPoint = polygon.points[i];
      length = Math.sqrt(Math.pow(testPoint.x - circle.x, 2), 
                         Math.pow(testPoint.y - circle.y, 2));
      if (length < min) {
         min = length;
         closestPoint = testPoint;
      }
   }

   return closestPoint;
};

// ..............................................................
// Get the circle's axis (circle's don't have an axis, so this
// method manufactures one)
// ..............................................................

function getCircleAxis(circle, polygon, closestPoint) {
   var v1 = new Vector(new Point(circle.x, circle.y)),
       v2 = new Vector(new Point(closestPoint.x, closestPoint.y)),
       surfaceVector = v1.subtract(v2);

   return surfaceVector.normalize();
};

// ..............................................................
// Tests to see if a polygon collides with a circle
// ..............................................................

function polygonCollidesWithCircle (polygon, circle, displacement) {
   var axes = polygon.getAxes(),
       closestPoint = getPolygonPointClosestToCircle(polygon, circle);

   axes.push(getCircleAxis(circle, polygon, closestPoint));

   return polygon.minimumTranslationVector(axes, circle, displacement);
};

// ..............................................................
// Given two shapes, and a set of axes, returns the minimum
// translation vector.
// ..............................................................


function getMTV(shape1, shape2, displacement, axes) {
   var minimumOverlap = BIG_NUMBER,
       overlap,
       axisWithSmallestOverlap,
       mtv;

   for (var i=0; i < axes.length; ++i) {
      axis = axes[i];
      projection1 = shape1.project(axis);
      projection2 = shape2.project(axis);
      overlap = projection1.getOverlap(projection2);

      if (overlap === 0) {
         return new MinimumTranslationVector(undefined, 0);
      }
      else {
         if (overlap < minimumOverlap) {
            minimumOverlap = overlap;
            axisWithSmallestOverlap = axis;    
         }
      }
   }
   mtv = new MinimumTranslationVector(axisWithSmallestOverlap,
                                     minimumOverlap);
   return mtv;
};


// Constants.....................................................

var BIG_NUMBER = 1000000;


// Points........................................................

var Point = function (x, y) {
   this.x = x;
   this.y = y;
};

Point.prototype = {
   rotate: function (rotationPoint, angle) {
      var tx, ty, rx, ry;
   
      tx = this.x - rotationPoint.x; // tx = translated X
      ty = this.y - rotationPoint.y; // ty = translated Y

      rx = tx * Math.cos(-angle) - // rx = rotated X
           ty * Math.sin(-angle);

      ry = tx * Math.sin(-angle) + // ry = rotated Y
           ty * Math.cos(-angle);

      return new Point(rx + rotationPoint.x, ry + rotationPoint.y); 
   }
};

// Lines.........................................................

var Line = function(p1, p2) {
   this.p1 = p1;  // point 1
   this.p2 = p2;  // point 2
}

Line.prototype.intersectionPoint = function (line) {
   var m1, m2, b1, b2, ip = new Point();

   if (this.p1.x === this.p2.x) {
      m2 = (line.p2.y - line.p1.y) / (line.p2.x - line.p1.x);
      b2 = line.p1.y - m2 * line.p1.x;
      ip.x = this.p1.x;
      ip.y = m2 * ip.x + b2;
   }
   else if(line.p1.x === line.p2.x) {
      m1 = (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x);
      b1 = this.p1.y - m1 * this.p1.x;
      ip.x = line.p1.x;
      ip.y = m1 * ip.x + b1;
   }
   else {
     m1 = (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x);
      m2 = (line.p2.y - line.p1.y) / (line.p2.x - line.p1.x);
      b1 = this.p1.y - m1 * this.p1.x;
      b2 = line.p1.y - m2 * line.p1.x;
      ip.x = (b2 - b1) / (m1 - m2);
      ip.y = m1 * ip.x + b1;
   }
   return ip;
};
   
// Bounding boxes................................................

var BoundingBox = function(left, top, width, height) {
   this.left = left;
   this.top = top;
   this.width = width;
   this.height = height;
};


// Vectors.......................................................

var Vector = function(point) {
   if (point === undefined) {
      this.x = 0;
      this.y = 0;
   }
   else {
      this.x = point.x;
      this.y = point.y;
   }
};

Vector.prototype = {
   getMagnitude: function () {
      return Math.sqrt(Math.pow(this.x, 2) +
                       Math.pow(this.y, 2));
   },

   setMagnitude: function (m) {
      var uv = this.normalize();
      this.x = uv.x * m;
      this.y = uv.y * m;
   },
   
   dotProduct: function (vector) {
      return this.x * vector.x +
             this.y * vector.y;
   },

   add: function (vector) {
      var v = new Vector();
      v.x = this.x + vector.x;
      v.y = this.y + vector.y;
      return v;
   },

   subtract: function (vector) {
      var v = new Vector();
      v.x = this.x - vector.x;
      v.y = this.y - vector.y;
      return v;
   },

   normalize: function () {
      var v = new Vector(),
          m = this.getMagnitude();
      v.x = this.x / m;
      v.y = this.y / m;
      return v;
   },

   perpendicular: function () {
      var v = new Vector();
      v.x = this.y;
      v.y = 0-this.x;
      return v;
   },

   reflect: function (axis) {
      var dotProductRatio, vdotl, ldotl, v = new Vector(),
           vdotl = this.dotProduct(axis),
           ldotl = axis.dotProduct(axis),
           dotProductRatio = vdotl / ldotl;

      v.x = 2 * dotProductRatio * axis.x - this.x;
      v.y = 2 * dotProductRatio * axis.y - this.y;

      return v;
   }
};


// Shapes........................................................

var Shape = function () {
   this.fillStyle = 'rgba(255, 255, 0, 0.8)';
   this.strokeStyle = 'white';
};

Shape.prototype = {
   move: function (dx, dy) {
      throw 'move(dx, dy) not implemented';
   },

   createPath: function (context) {
      throw 'createPath(context) not implemented';
   },

   boundingBox: function () {
      throw 'boundingBox() not implemented';
   },

   fill: function (context) {
      context.save();
      context.fillStyle = this.fillStyle;
      this.createPath(context);
      context.fill();
      context.restore();
   },

   stroke: function (context) {
      context.save();
      context.strokeStyle = this.strokeStyle;
      this.createPath(context);
      context.stroke();
      context.restore();
   },

   collidesWith: function (shape, displacement) {
      throw 'collidesWith(shape, displacement) not implemented';
   },
   
   isPointInPath: function (context, x, y) {
      this.createPath(context);
      return context.isPointInPath(x, y);
   },

   project: function (axis) {
      throw 'project(axis) not implemented';
   },

   minimumTranslationVector: function (axes, shape, displacement) {
      return getMTV(this, shape, displacement, axes);
   }
};


// Circles.......................................................

var Circle = function (x, y, radius) {
   this.x = x;
   this.y = y;
   this.radius = radius;
   this.strokeStyle = 'blue';
   this.fillStyle = 'yellow';
}

Circle.prototype = new Shape();

Circle.prototype.centroid = function () {
   return new Point(this.x,this.y);
};

Circle.prototype.move = function (dx, dy) {
   this.x += dx;
   this.y += dy;
};

Circle.prototype.boundingBox = function (dx, dy) {
   return new BoundingBox(this.x - this.radius,
                          this.y - this.radius,
                          2*this.radius,
                          2*this.radius);
};

Circle.prototype.createPath = function (context) {
   context.beginPath();
   context.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
};
   
Circle.prototype.project = function (axis) {
   var scalars = [],
       point = new Point(this.x, this.y);
       dotProduct = new Vector(point).dotProduct(axis);

   scalars.push(dotProduct);
   scalars.push(dotProduct + this.radius);
   scalars.push(dotProduct - this.radius);

   return new Projection(Math.min.apply(Math, scalars),
                         Math.max.apply(Math, scalars));
};

Circle.prototype.collidesWith = function (shape, displacement) {
   if (shape.radius === undefined) {
      return polygonCollidesWithCircle(shape, this, displacement);
   }
   else {
      return circleCollidesWithCircle(this, shape, displacement);
   }
};
   

// Polygons......................................................

var Polygon = function () {
   this.points = [];
   this.strokeStyle = 'blue';
   this.fillStyle = 'white';
};

Polygon.prototype = new Shape();

Polygon.prototype.getAxes = function () {
   var v1, v2, surfaceVector, axes = [], pushAxis = true;
      
   for (var i=0; i < this.points.length-1; i++) {
      v1 = new Vector(this.points[i]);
      v2 = new Vector(this.points[i+1]);

      surfaceVector = v2.subtract(v1);
      axes.push(surfaceVector.perpendicular().normalize());
   }

   return axes;
};

Polygon.prototype.project = function (axis) {
   var scalars = [];

   this.points.forEach( function (point) {
      scalars.push(new Vector(point).dotProduct(axis));
   });

   return new Projection(Math.min.apply(Math, scalars),
                         Math.max.apply(Math, scalars));
};

Polygon.prototype.addPoint = function (x, y) {
   this.points.push(new Point(x,y));
};

Polygon.prototype.createPath = function (context) {
   if (this.points.length === 0)
      return;
      
   context.beginPath();
   context.moveTo(this.points[0].x,
                  this.points[0].y);
         
   for (var i=0; i < this.points.length; ++i) {
      context.lineTo(this.points[i].x,
                     this.points[i].y);
   }

   context.closePath();
};
   
Polygon.prototype.move = function (dx, dy) {
   var point, x;
   for(var i=0; i < this.points.length; ++i) {
      point = this.points[i];
     x += dx;
     y += dy;
   }
};

Polygon.prototype.collidesWith = function (shape, displacement) {
   if (shape.radius !== undefined) {
      return polygonCollidesWithCircle(this, shape, displacement);
   }
   else {
      return polygonCollidesWithPolygon(this, shape, displacement);
   }
};

Polygon.prototype.move = function (dx, dy) {
   for (var i=0, point; i < this.points.length; ++i) {
      point = this.points[i];
      point.x += dx;
      point.y += dy;
   }
};

Polygon.prototype.boundingBox = function (dx, dy) {
   var minx = BIG_NUMBER,
       miny = BIG_NUMBER,
       maxx = -BIG_NUMBER,
       maxy = -BIG_NUMBER,
       point;

   for (var i=0; i < this.points.length; ++i) {
      point = this.points[i];
      minx = Math.min(minx,point.x);
      miny = Math.min(miny,point.y);
      maxx = Math.max(maxx,point.x);
      maxy = Math.max(maxy,point.y);
   }

   return new BoundingBox(minx, miny,
                          parseFloat(maxx - minx),
                          parseFloat(maxy - miny));
};

Polygon.prototype.centroid = function () {
   var pointSum = new Point(0,0);
   
   for (var i=0, point; i < this.points.length; ++i) {
      point = this.points[i];
      pointSum.x += point.x;
      pointSum.y += point.y;
   }
   return new Point(pointSum.x / this.points.length,
                    pointSum.y / this.points.length);
}

// Projections...................................................

var Projection = function (min, max) {
   this.min = min;
   this.max = max;
};

Projection.prototype = {
   overlaps: function (projection) {
      return this.max > projection.min && projection.max > this.min;
   },

   getOverlap: function (projection) {
      var overlap;

      if (!this.overlaps(projection))
         return 0;
      
      if (this.max > projection.max) {
         overlap = projection.max - this.min;
      }
      else {
        overlap = this.max - projection.min;
      }
      return overlap;
   }
};


// MinimumTranslationVector.........................................

var MinimumTranslationVector = function (axis, overlap) {
   this.axis = axis;
   this.overlap = overlap;
};

var ImageShape = function(imageSource, x, y, w, h) {
   var self = this;

   this.image = new Image();
   this.imageLoaded = false;
   this.points = [ new Point(x,y) ];
   this.x = x;
   this.y = y;

   this.image.src = imageSource;

   this.image.addEventListener('load', function (e) {
      self.setPolygonPoints();
      self.imageLoaded = true;
   }, false);
}

ImageShape.prototype = new Polygon();

ImageShape.prototype.fill = function (context) {
};

ImageShape.prototype.setPolygonPoints = function() {
   this.points.push(new Point(this.x + this.image.width, this.y));
   this.points.push(new Point(this.x + this.image.width, this.y + this.image.height));
   this.points.push(new Point(this.x, this.y + this.image.height));
   this.points.push(new Point(this.x, this.y));
   this.points.push(new Point(this.x + this.image.width, this.y));
};

ImageShape.prototype.drawImage = function (context) {
   context.drawImage(this.image, this.points[0].x, this.points[0].y);
};

ImageShape.prototype.stroke = function (context) {
   var self = this;
   
   if (this.imageLoaded) {
      context.drawImage(this.image, this.points[0].x, this.points[0].y);
   }
   else {
      this.image.addEventListener('load', function (e) {
         self.drawImage(context);
      }, false);
   }
};


var SpriteShape = function (sprite, x, y) {
   this.sprite = sprite;
   this.x = x;
   this.y = y;
   sprite.left = x;
   sprite.top = y;
   this.setPolygonPoints();
};

SpriteShape.prototype = new Polygon();

SpriteShape.prototype.move = function (dx, dy) {
   var point, x;
   for(var i=0; i < this.points.length; ++i) {
      point = this.points[i];
      point.x += dx;
      point.y += dy;
   }
   this.sprite.left = this.points[0].x;
   this.sprite.top = this.points[0].y;
};

SpriteShape.prototype.fill = function (context) {
};

SpriteShape.prototype.setPolygonPoints = function() {
   this.points.push(new Point(this.x, this.y));
   this.points.push(new Point(this.x, this.y + this.sprite.height));
   this.points.push(new Point(this.x + this.sprite.width, this.y + this.sprite.height));
   this.points.push(new Point(this.x + this.sprite.width, this.y));
   this.points.push(new Point(this.x, this.y));
};
/*
SpriteShape.prototype.stroke = function (context) {
   this.sprite.paint(context);
};
*/

