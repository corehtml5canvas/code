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

var COREHTML5 = COREHTML5 || {}

// Constructor....................................................

COREHTML5.Progressbar = function(strokeStyle, fillStyle,
                                 horizontalSizePercent,
                                 verticalSizePercent) {
   this.trough = new COREHTML5.RoundedRectangle(strokeStyle,
                                                fillStyle,
                                                horizontalSizePercent,
                                                verticalSizePercent);
   this.SHADOW_COLOR = 'rgba(255,255,255,0.5)';
   this.SHADOW_BLUR = 3;
   this.SHADOW_OFFSET_X = 2;
   this.SHADOW_OFFSET_Y = 2;

   this.percentComplete = 0;
   this.createCanvases();
   this.createDOMElement();

   return this;
}

// Prototype......................................................

   COREHTML5.Progressbar.prototype = {
      createDOMElement: function () {
         this.domElement = document.createElement('div');
         this.domElement.appendChild(this.context.canvas);
      },

      createCanvases: function () {
         this.context = document.createElement('canvas').
                           getContext('2d');

         this.offscreen = document.createElement('canvas').
                           getContext('2d');
      },

      appendTo: function (element) {
         element.appendChild(this.domElement);

         this.domElement.style.width  =
            element.offsetWidth  + 'px';

         this.domElement.style.height =
            element.offsetHeight + 'px';

         this.resize(); // obliterates everything in the canvases

         this.trough.resize(element.offsetWidth,
                            element.offsetHeight);
         this.trough.draw(this.offscreen);
      },

      setCanvasSize: function () {
         var domElementParent = this.domElement.parentNode;

         this.context.canvas.width = domElementParent.offsetWidth;
         this.context.canvas.height = domElementParent.offsetHeight;
      },
   
      resize: function () {
         var domElementParent = this.domElement.parentNode,
         w = domElementParent.offsetWidth,
         h = domElementParent.offsetHeight;

         this.setCanvasSize();

         this.context.canvas.width = w;
         this.context.canvas.height = h;

         this.offscreen.canvas.width = w;
         this.offscreen.canvas.height = h;
      },
   
      draw: function (percentComplete) {
         if (percentComplete > 0) {
            // Copy the appropriate region of the foreground canvas
            // to the same region of the onscreen canvas

            this.context.drawImage(
               this.offscreen.canvas, 0, 0,
               this.offscreen.canvas.width*(percentComplete/100),
               this.offscreen.canvas.height,
               0, 0,
               this.offscreen.canvas.width*(percentComplete/100),
               this.offscreen.canvas.height);
         }
      },

      erase: function() {
         this.context.clearRect(0, 0,
                                this.context.canvas.width,
                                this.context.canvas.height);
      },
};
