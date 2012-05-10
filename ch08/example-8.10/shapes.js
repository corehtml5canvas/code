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

function getPolygonPointClosestToCircle(polygon, circle) {
   var min = 10000,
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

function polygonCollidesWithCircle (polygon, circle) {
   var min=10000, v1, v2,
       edge, perpendicular,
       axes = polygon.getAxes(),
       closestPoint = getPolygonPointClosestToCircle(polygon, circle);
      
   v1 = new Vector(new Point(circle.x, circle.y));
   v2 = new Vector(new Point(closestPoint.x, closestPoint.y));

   axes.push(v1.subtract(v2).normalize());

   return !polygon.separationOnAxes(axes, circle);
};

var Point = function (x, y) {
   this.x = x;
   this.y = y;
};

var Shape = function () {
   this.x = undefined;
   this.y = undefined;
   this.strokeStyle = 'rgba(255, 253, 208, 0.9)';
   this.fillStyle = 'rgba(147, 197, 114, 0.8)';
};

Shape.prototype = {
   
   collidesWith: function (shape) {
      var axes = this.getAxes().concat(shape.getAxes());
      return !this.separationOnAxes(axes, shape);
   },

   separationOnAxes: function (axes, shape) {
      for (var i=0; i < axes.length; ++i) {
         axis = axes[i];
         projection1 = shape.project(axis);
         projection2 = this.project(axis);

         if (! projection1.overlaps(projection2)) {
            return true; // don't have to test remaining axes
         }
      }
      return false;
   },

   move: function (dx, dy) {
      throw 'move(dx, dy) not implemented';
   },

   createPath: function (context) {
      throw 'createPath(context) not implemented';
   },

   getAxes: function () {
      throw 'getAxes() not implemented';
   },

   project: function (axis) {
      throw 'project(axis) not implemented';
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
   
   isPointInPath: function (context, x, y) {
      this.createPath(context);
      return context.isPointInPath(x, y);
   },
};

var Projection = function (min, max) {
   this.min = min;
   this.max = max;
};

Projection.prototype = {
   overlaps: function (projection) {
      return this.max > projection.min && projection.max > this.min;
   }
};

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
      var v = new Vector(0, 0),
          m = this.getMagnitude();

      if (m != 0) {
         v.x = this.x / m;
         v.y = this.y / m;
      }
      return v;
   },

   perpendicular: function () {
      var v = new Vector();
      v.x = this.y;
      v.y = 0-this.x;
      return v;
   },

   edge: function (vector) {
      return this.subtract(vector);
   },

   normal: function () {
      var p = this.perpendicular();
      return p.normalize();
   }
};

var Polygon = function () {
   this.points = [];
   this.strokeStyle = 'blue';
   this.fillStyle = 'white';
};

Polygon.prototype = new Shape();

Polygon.prototype.collidesWith = function (shape) {
   var axes = shape.getAxes();

   if (axes === undefined) {
      return polygonCollidesWithCircle(this, shape);
   }
   else {
      axes.concat(this.getAxes());
      return !this.separationOnAxes(axes, shape);
   }
};

Polygon.prototype.getAxes = function () {
   var v1, v2, edge, perpendicular, normal, axes = [];
      
   for (var i=0; i < this.points.length-1; i++) {
      v1 = new Vector(this.points[i]);
      v2 = new Vector(this.points[i+1]);
      axes.push(v1.edge(v2).normal());
   }

   v1 = new Vector(this.points[this.points.length-1]);
   v2 = new Vector(this.points[0]);
   axes.push(v1.edge(v2).normal());

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
      point.x += dx;
      point.y += dy;
   }
};

Polygon.prototype.move = function (dx, dy) {
   for (var i=0, point; i < this.points.length; ++i) {
      point = this.points[i];
      point.x += dx;
      point.y += dy;
   }
};

var Circle = function (x, y, radius) {
   this.x = x;
   this.y = y;
   this.radius = radius;
   this.strokeStyle = 'rgba(255, 253, 208, 0.9)';
   this.fillStyle = 'rgba(147, 197, 114, 0.8)';
}

Circle.prototype = new Shape();

Circle.prototype.collidesWith = function (shape) {
   var point, length, min=10000, v1, v2,
       edge, perpendicular, normal,
       axes = shape.getAxes(), distance;

   if (axes === undefined) {  // circle
      distance = Math.sqrt(Math.pow(shape.x - this.x, 2) +
                           Math.pow(shape.y - this.y, 2));

      return distance < Math.abs(this.radius + shape.radius);
   }
   else {  // polygon
      return polygonCollidesWithCircle(shape, this);
   }
};

Circle.prototype.getAxes = function () {
   return undefined; // there are an infinite number of axes for circles
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

Circle.prototype.move = function (dx, dy) {
   this.x += dx;
   this.y += dy;
};

Circle.prototype.createPath = function (context) {
   context.beginPath();
   context.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
};
