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

    image = new Image(),
    imageData = null, 
    dragging = false,

    glassSizeCanvas = document.getElementById('glassSizeCanvas'),
    glassSizeContext = glassSizeCanvas.getContext('2d'),

    MAXIMUM_SCALE = 4.0,
    scaleOutput = document.getElementById('scaleOutput'),

    magnifyingGlassRadius = 120,
    magnificationScale = scaleOutput.innerHTML,
    magnifyRectangle = {},

    MAX_GLASS_RADIUS = 350,

    magnifyingGlassX = 512,
    magnifyingGlassY = 340,

    magnifyZoomSlider  = new COREHTML5.Slider('rgb(72,92,55)', // stroke
                                              'rgb(246, 201, 204)', // filjl
                                              0.25, // knob percent
                                              90,   // take up % of width
                                              55),  // take up % of height

    glassSlider = new COREHTML5.Slider('rgb(72,92,55)',
                                       'rgb(246, 201, 204)',
                                       0.50, 90, 55),
    animating = false,
    animationLoop = null,

    mousedown = null,
    mouseup = null,

    canvasRatio = canvas.height / canvas.width,
    pinchRatio;

// Functions...................................................

function windowToCanvas(x, y) {
   var bbox = canvas.getBoundingClientRect();
   return { x: x - bbox.left * (canvas.width  / bbox.width),
            y: y - bbox.top  * (canvas.height / bbox.height)
          };
};

function calculateMagnifyRectangle(mouse) { 
   var top,
       left,
       bottom,
       right;
   
   magnifyRectangle.x = mouse.x - magnifyingGlassRadius;
   magnifyRectangle.y = mouse.y - magnifyingGlassRadius;
   magnifyRectangle.width = magnifyingGlassRadius*2 + 2*context.lineWidth;
   magnifyRectangle.height = magnifyingGlassRadius*2 + 2*context.lineWidth;

   top = magnifyRectangle.y;
   left = magnifyRectangle.x;
   bottom = magnifyRectangle.y + magnifyRectangle.height;
   right = magnifyRectangle.x + magnifyRectangle.width;
   
   if (left < 0) {
      magnifyRectangle.width += left;
      magnifyRectangle.x = 0;
   }
   else if (right > canvas.width) {
      magnifyRectangle.width -= right - canvas.width;
   }

   if (top < 0) {
      magnifyRectangle.height += magnifyRectangle.y;
      magnifyRectangle.y = 0;
   }
   else if (bottom > canvas.height) {
      magnifyRectangle.height -= bottom - canvas.height;
   }
}

function setClip() {
   context.beginPath();
   context.arc(magnifyingGlassX, magnifyingGlassY,
               magnifyingGlassRadius, 0, Math.PI*2, false);
   context.clip();
}

function drawMagnifyingGlassCircle(mouse) {
   var gradientThickness = this.magnifyingGlassRadius / 7;

   gradientThickness = gradientThickness < 10 ? 10 : gradientThickness;
   gradientThickness = gradientThickness > 40 ? 40 : gradientThickness;

   gradientThickness = 10;
   this.context.save();
   this.context.lineWidth = gradientThickness;
   this.context.strokeStyle = 'rgb(0, 0, 255, 0.3)';

   this.context.beginPath();
   this.context.arc(mouse.x, mouse.y,
               this.magnifyingGlassRadius, 0, Math.PI*2, false);
   this.context.clip();

   var gradient = this.context.createRadialGradient(
                     mouse.x, mouse.y, this.magnifyingGlassRadius-gradientThickness,
                     mouse.x, mouse.y, this.magnifyingGlassRadius);
   gradient.addColorStop(0,   'rgba(0,0,0,0.2)');
   gradient.addColorStop(0.80, 'rgb(235,237,255)');
   gradient.addColorStop(0.90, 'rgb(235,237,255)');
   gradient.addColorStop(1.0, 'rgba(150,150,150,0.9)');

   this.context.shadowColor = 'rgba(52, 72, 35, 1.0)';
   this.context.shadowOffsetX = 2;
   this.context.shadowOffsetY = 2;
   this.context.shadowBlur = 20;

   this.context.strokeStyle = gradient;
   this.context.stroke();

   this.context.beginPath();
   this.context.arc(mouse.x, mouse.y,
               this.magnifyingGlassRadius-gradientThickness/2, 0, Math.PI*2, false);
   this.context.clip();

   this.context.lineWidth = gradientThickness;
   this.context.strokeStyle = 'rgba(0,0,0,0.06)';
   this.context.stroke();
   
   this.context.restore();
};

function drawMagnifyingGlass(mouse) { 
   var scaledMagnifyRectangle;
   
   magnifyingGlassX = mouse.x;
   magnifyingGlassY = mouse.y;
   
   calculateMagnifyRectangle(mouse);

   imageData = context.getImageData(magnifyRectangle.x,
                                    magnifyRectangle.y,
                                    magnifyRectangle.width,
                                    magnifyRectangle.height);
   context.save();

   scaledMagnifyRectangle = {
      width:  magnifyRectangle.width  * magnificationScale,
      height: magnifyRectangle.height * magnificationScale
   };

   setClip();

   context.drawImage(canvas,
      magnifyRectangle.x, magnifyRectangle.y,
      magnifyRectangle.width, magnifyRectangle.height,

      magnifyRectangle.x + magnifyRectangle.width/2 -
      scaledMagnifyRectangle.width/2,

      magnifyRectangle.y + magnifyRectangle.height/2 -
      scaledMagnifyRectangle.height/2,

      scaledMagnifyRectangle.width,
      scaledMagnifyRectangle.height);

   context.restore();

   drawMagnifyingGlassCircle(mouse);
}

function eraseMagnifyingGlass() { // Called when the mouse moves
   if (imageData != null) {
      context.putImageData(imageData,
         magnifyRectangle.x,
         magnifyRectangle.y);
   }
}

function drawGlassIcon(context, radius) {
   context.save();
   context.clearRect(0,0,context.canvas.width,
                         context.canvas.height);
   
   context.shadowColor = 'rgba(52, 72, 35, 0.5)';
   context.shadowOffsetX = 1;
   context.shadowOffsetY = 1;
   context.shadowBlur = 2;
  
   context.beginPath();

   context.translate(context.canvas.width/2, 
                         context.canvas.height/2);
 
   context.beginPath();
   context.lineWidth = 1.5;
   context.arc(0, 0, radius+3, 0, Math.PI*2, false);
   context.strokeStyle = 'rgb(52, 72, 35)';
   context.stroke();

   context.beginPath();
   context.lineWidth = 0.5;
   context.strokeStyle = 'rgba(255,255,255,0.6)';
   context.arc(0, 0, radius+6, 0, Math.PI*2, false);
   context.stroke();

   context.restore();
};

function drawMagnificationText(value, percent) { 
   scaleOutput.innerHTML = value;
   percent = percent < 0.35 ? 0.35 : percent;
   scaleOutput.style.fontSize = percent*MAXIMUM_SCALE/2 + 'em';
}

function updateMagnifyingGlass() {
   eraseMagnifyingGlass();
   drawMagnifyingGlass({ x: magnifyingGlassX, y: magnifyingGlassY });
}

function step(time, lastTime, mouse, speed) {
   var elapsedTime = time - lastTime,
       nextLeft = mouse.x - magnifyingGlassRadius + speed.vx*(elapsedTime/10), 
       nextTop = mouse.y - magnifyingGlassRadius + speed.vy*(elapsedTime/10),
       nextRight = nextLeft + magnifyingGlassRadius*2,
       nextBottom = nextTop + magnifyingGlassRadius*2;
        
   eraseMagnifyingGlass();

   if (nextLeft < 0) {
      speed.vx = -speed.vx;
      mouse.x = magnifyingGlassRadius;
   }
   else if (nextRight > canvas.width) {
      speed.vx = -speed.vx;
      mouse.x = canvas.width - magnifyingGlassRadius;
   }

   if (nextTop < 0) {
      speed.vy = -speed.vy;
      mouse.y = magnifyingGlassRadius;
   }
   else if (nextBottom > canvas.height) {
      speed.vy = -speed.vy;
      mouse.y = canvas.height - magnifyingGlassRadius;
   }

   mouse.x += speed.vx*(elapsedTime/10);
   mouse.y += speed.vy*(elapsedTime/10);

   drawMagnifyingGlass(mouse);
}
function animate(mouse, speed) {
   var time, lastTime = 0, elapsedTime;
   animating = true;

   if (lastTime === 0) {
      lastTime = +new Date;
   }

   animationLoop = setInterval(function() {
      var time = + new Date;
      step(time, lastTime, mouse, speed);
      lastTime = time;
   }, 1000/60);
}

function didThrow() {
   var elapsedTime = mouseup.time - mousedown.time;
   var elapsedMotion = Math.abs(mouseup.x - mousedown.x) +
                       Math.abs(mouseup.y - mousedown.y);
   return (elapsedMotion / elapsedTime * 10) > 3;
}

// Touch Event Handlers........................................

function isPinching (e) {
   var changed = e.changedTouches.length,
       touching = e.touches.length;

   return changed === 1 || changed === 2 && touching === 2;
}

function isDragging (e) {
   var changed = e.changedTouches.length,
       touching = e.touches.length;

   return changed === 1 && touching === 1;
}

canvas.ontouchstart = function (e) { 
   var changed = e.changedTouches.length,
       touching = e.touches.length;

   e.preventDefault(e);

   if (isDragging(e)) {
      mouseDownOrTouchStart(windowToCanvas(e.pageX, e.pageY));
   }
   else if (isPinching(e)) {
      var touch1 = e.touches.item(0),
          touch2 = e.touches.item(1),
          point1 = windowToCanvas(touch1.pageX, touch1.pageY),
          point2 = windowToCanvas(touch2.pageX, touch2.pageY);

      distance = Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.x - point1.x, 2));
      pinchRatio = magnificationScale / distance;
   }
};

canvas.ontouchmove = function (e) { 
   var changed = e.changedTouches.length,
       touching = e.touches.length,
       distance, touch1, touch2;

   e.preventDefault(e);

   if (isDragging(e)) {
      mouseMoveOrTouchMove(windowToCanvas(e.pageX, e.pageY));
   }
   else if (isPinching(e)) {
      var touch1 = e.touches.item(0),
          touch2 = e.touches.item(1),
          point1 = windowToCanvas(touch1.pageX, touch1.pageY),
          point2 = windowToCanvas(touch2.pageX, touch2.pageY),
          scale;

      distance = Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.x - point1.x, 2));
      scale = pinchRatio * distance;

      if (scale > 1 && scale < 3) {
         magnificationScale = parseFloat(pinchRatio * distance).toFixed(2);
         draw();
      }
   }
};

canvas.ontouchend = function (e) { 
   e.preventDefault(e);
   mouseUpOrTouchEnd(windowToCanvas(e.pageX, e.pageY));
};

// Mouse Event Handlers........................................

canvas.onmousedown = function (e) { 
   e.preventDefault(e);
   mouseDownOrTouchStart(windowToCanvas(e.clientX, e.clientY));
};

canvas.onmousemove = function (e) { 
   e.preventDefault(e);
   mouseMoveOrTouchMove(windowToCanvas(e.clientX, e.clientY));
};

canvas.onmouseup = function (e) { 
   e.preventDefault(e);
   mouseUpOrTouchEnd(windowToCanvas(e.clientX, e.clientY));
};

function mouseDownOrTouchStart(mouse) {
   mousedown = { x: mouse.x, y: mouse.y, time: (new Date).getTime() }; 

   if (animating) {
      animating = false;
      clearInterval(animationLoop);
      eraseMagnifyingGlass();
   }
   else {
     dragging = true;
     context.save();
   }
};

function mouseMoveOrTouchMove(mouse) {
   if (dragging) {
      eraseMagnifyingGlass();
      drawMagnifyingGlass(mouse);
   }
};

function mouseUpOrTouchEnd(mouse) {
   mouseup = { x: mouse.x, y: mouse.y, time: (new Date).getTime() }; 

   if (dragging) {
      if (didThrow()) {
         velocityX = (mouseup.x-mousedown.x)/100;
         velocityY = (mouseup.y-mousedown.y)/100;
         animate(mouse, { vx: velocityX, vy: velocityY });
      }
      else {
        //eraseMagnifyingGlass();
      }
   }
   dragging = false;
};

// Slider Event Handlers.......................................

magnifyZoomSlider.addChangeListener( function(e) {
   var maxRadius = (glassSizeCanvas.width/2-7);
       percent = magnifyZoomSlider.knobPercent,
       value = parseFloat(1 + percent * 2).toFixed(2);

   drawMagnificationText(value, percent);
   magnificationScale = value;
   updateMagnifyingGlass();
});

glassSlider.addChangeListener( function(e) {
   var maxRadius = glassSizeCanvas.width/2-5,
       percent = parseFloat(glassSlider.knobPercent),
       value = 25 + new Number((percent * 175).toFixed(0));

   magnifyingGlassRadius = value
   drawGlassIcon(glassSizeContext, maxRadius * percent);
   updateMagnifyingGlass();
});

// Initialization..............................................

context.fillStyle     = 'cornflowerblue';
context.strokeStyle   = 'rgba(250, 250, 0, 0.5)';
context.shadowColor   = 'rgba(0, 0, 0, 0.5)';
context.shadowOffsetX = 10;
context.shadowOffsetY = 10;
context.shadowBlur    = 20;

function draw() {
   var maxRadius = (glassSizeCanvas.width/2-7),
       percent = parseFloat(glassSlider.knobPercent);

   context.drawImage(image, 0, 0, canvas.width, canvas.height);
   drawGlassIcon(glassSizeContext, maxRadius * 0.5);
   drawMagnificationText(magnificationScale, percent);
   drawMagnifyingGlass({ x: magnifyingGlassX, y: magnifyingGlassY });
}

image.src = '../../shared/images/canyon.png';
image.onload = function(e) {
   draw();
};

drawGlassIcon(glassSizeContext, (glassSizeCanvas.width/2-7)/2 );

canvas.addEventListener('dragenter', function (e) {
   e.preventDefault();
   e.dataTransfer.effectAllowed = 'copy';
}, false);

canvas.addEventListener('dragover', function (e) {
   e.preventDefault();
}, false);

window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

canvas.addEventListener('drop', function (e) {
   var file = e.dataTransfer.files[0];

   window.requestFileSystem(window.TEMPORARY, 5*1024*1024,
      function (fs) {
         fs.root.getFile(file.name, {create: true},
            function (fileEntry) {
               fileEntry.createWriter( function (writer) {
                  writer.write(file);
               });
               image.src = fileEntry.toURL();
            },

            function (e) {
               alert(e.code);
            }
         );
      },

      function (e) {
         alert(e.code);
      }
   );
}, false);

magnifyZoomSlider.appendTo('magnificationSliderDiv');
glassSlider.appendTo('glassSizeSliderDiv');

magnifyZoomSlider.draw();
glassSlider.draw();

if (window.matchMedia && screen.width <= 1024) {
   var m = window.matchMedia("(orientation:portrait)"),
       lw = 0, lh = 0, lr = 0;

   function listener (mql) {
      var cr = canvas.getBoundingClientRect();

      if (mql.matches) {  // portrait
         // Save landscape size to reset later
         lw = canvas.width;
         lh = canvas.height;
         lr = magnifyingGlassRadius;

         // Resize for portrait
         canvas.width = screen.width - 2*cr.left;
         canvas.height = canvas.width*canvasRatio;

         magnifyingGlassRadius *= (canvas.width + canvas.height) / (lw + lh);
      }
      else if (lw !== 0 && lh !== 0) { // landscape
         // Reset landscape size
         canvas.width = lw;
         canvas.height = lh;

         magnifyingGlassRadius = lr;
      }

      // Setting canvas width and height resets and
      // erases the canvas, making a redraw necessary

      draw();
   }

   m.addListener( listener ); 
}
