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

var COREHTML5 = COREHTML5 || {};

// Key Constructor....................................................................

COREHTML5.Key = function (text) { 
   this.text = text;
   this.selected = false;
   this.translucent = false;
}

COREHTML5.Key.prototype = {
   createPath: function (context) {
      context.beginPath();

      if (this.width > 0) context.moveTo(this.left + this.cornerRadius, this.top);
      else                context.moveTo(this.left - this.cornerRadius, this.top);

      context.arcTo(this.left + this.width, this.top,
                    this.left + this.width, this.top + this.height,
                    this.cornerRadius);

      context.arcTo(this.left + this.width, this.top + this.height,
                    this.left, this.top + this.height,
                    this.cornerRadius);

      context.arcTo(this.left, this.top + this.height,
                    this.left, this.top,
                    this.cornerRadius);

      if (this.width > 0) {
         context.arcTo(this.left, this.top,
                       this.left + this.cornerRadius, this.top,
                       this.cornerRadius);
      }
      else {
            context.arcTo(this.left, this.top,
                       this.left - this.cornerRadius, this.top,
                       this.cornerRadius);
      }
   },

   createKeyGradient: function (context) {
      var keyGradient = context.createLinearGradient(
                           this.left, this.top,
                           this.left, this.top + this.height);
      if (this.selected) {
         keyGradient.addColorStop(0,   'rgb(208, 208, 210)');
         keyGradient.addColorStop(1.0, 'rgb(162, 162, 166)');
      }
      else if (this.translucent) {
         keyGradient.addColorStop(0,   'rgba(298, 298, 300, 0.20)');
         keyGradient.addColorStop(1.0, 'rgba(255, 255, 255, 0.20)');
      }
      else {
         keyGradient.addColorStop(0,   'rgb(238, 238, 240)');
         keyGradient.addColorStop(1.0, 'rgb(192, 192, 196)');
      }

      return keyGradient;
   },
   
   setKeyProperties: function (context, keyGradient) {
	   context.shadowColor = 'rgba(0, 0, 0, 0.8)';
	   context.shadowOffsetX = 1;
	   context.shadowOffsetY = 1;
      context.shadowBlur = 1;

      context.lineWidth = 0.5;

      context.strokeStyle = 'rgba(0, 0, 0, 0.7)';
      context.fillStyle = keyGradient;
   },
      
   setTextProperties: function (context) {
	   context.shadowColor = undefined;
	   context.shadowOffsetX = 0;

      context.font = '100 ' + this.height/3 + 'px Helvetica';
      context.fillStyle = 'rgba(0,0,0,0.4)';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
   },
      
   draw: function (context) {
      var keyGradient = this.createKeyGradient(context);
      
      context.save();

      this.createPath(context);

      this.setKeyProperties(context, keyGradient);
      context.stroke();
      context.fill();

      this.setTextProperties(context);
      context.fillText(this.text, this.left + this.width/2,
                                       this.top + this.height/2);

      context.restore();
   },

   erase: function(context) {
      context.clearRect(this.left-2, this.top-2,
                        this.width+6, this.height+6);
   },

   redraw: function (context) {
      this.erase(context);
      this.draw(context);
   },

   toggleSelection: function (context) {
      this.selected = !this.selected;
   },
   
   isPointInKey: function (context, x, y) {
      this.createPath(context);
      return context.isPointInPath(x, y);
   },

   select: function (key) {
      this.selected = true;
   },

   deselect: function (key) {
      this.selected = false;
   },
}
   
// Keyboard Constructor...............................................................

COREHTML5.Keyboard = function() {
   var keyboard = this;
   
   this.keys = [
       [ new COREHTML5.Key('Q'), new COREHTML5.Key('W'), new COREHTML5.Key('E'),
         new COREHTML5.Key('R'), new COREHTML5.Key('T'), new COREHTML5.Key('Y'),
         new COREHTML5.Key('U'), new COREHTML5.Key('I'), new COREHTML5.Key('O'),
         new COREHTML5.Key('P'), new COREHTML5.Key('<') ],

       [ new COREHTML5.Key('A'), new COREHTML5.Key('S'), new COREHTML5.Key('D'),
         new COREHTML5.Key('F'), new COREHTML5.Key('G'), new COREHTML5.Key('H'),
         new COREHTML5.Key('J'), new COREHTML5.Key('K'), new COREHTML5.Key('L'),
         new COREHTML5.Key('Enter') ],

       [ new COREHTML5.Key('^'), new COREHTML5.Key('Z'), new COREHTML5.Key('X'),
         new COREHTML5.Key('C'), new COREHTML5.Key('V'), new COREHTML5.Key('B'),
         new COREHTML5.Key('N'), new COREHTML5.Key('M'), new COREHTML5.Key(','),
         new COREHTML5.Key('.'), new COREHTML5.Key('^') ],

       [ new COREHTML5.Key(';'), new COREHTML5.Key(':'), new COREHTML5.Key(' '),
         new COREHTML5.Key('?'), new COREHTML5.Key('!') ]
   ];

   this.KEYBOARD_HEIGHT = 360,
   this.KEY_COLUMNS = 11,
   this.KEY_ROWS = 4,
   
   this.createCanvas();
   this.createDOMElement();

   this.translucent = false;
   this.shifted = false;
   this.keyListenerFunctions = [];

   this.context.canvas.onmousedown = function (e) {
      keyboard.mouseDownOrTouchStart(keyboard.context,
         keyboard.windowToCanvas(keyboard.context.canvas, e.clientX, e.clientY));

      e.preventDefault(); // prevents inadvertent selections on desktop
   };

   this.context.canvas.ontouchstart = function (e) {
      keyboard.mouseDownOrTouchStart(keyboard.context,
         keyboard.windowToCanvas(keyboard.context.canvas,
                                 e.touches[0].clientX, e.touches[0].clientY));

      e.preventDefault(); // prevents flashing on iPad
   };
   
   return this;
}

// Keyboard Constructor...............................................................

COREHTML5.Keyboard.prototype = {

   // General functions ..............................................................

   windowToCanvas: function (canvas, x, y) {
      var bbox = canvas.getBoundingClientRect();
      return { x: x - bbox.left * (canvas.width  / bbox.width),
               y: y - bbox.top  * (canvas.height / bbox.height)
             };
   },
   
   createCanvas: function () {
      var canvas = document.createElement('canvas');
      this.context = canvas.getContext('2d');
   },
   
   createDOMElement: function () {
      this.domElement = document.createElement('div');
      this.domElement.appendChild(this.context.canvas);
   },

   appendTo: function (elementName) {
      var element = document.getElementById(elementName);

      element.appendChild(this.domElement);
      this.domElement.style.width = element.offsetWidth + 'px';
      this.domElement.style.height = element.offsetHeight + 'px';
      this.resize(element.offsetWidth, element.offsetHeight);
      this.createKeys();
   },

   resize: function (width, height) {
      this.domElement.style.width = width + 'px';
      this.domElement.style.height = height + 'px';

      this.context.canvas.width = width;
      this.context.canvas.height = height;
   },

   // Drawing Functions.................................................................

   drawRoundedRect: function (context, cornerX, cornerY, width, height, cornerRadius) {
      if (width > 0) this.context.moveTo(cornerX + cornerRadius, cornerY);
      else           this.context.moveTo(cornerX - cornerRadius, cornerY);

      context.arcTo(cornerX + width, cornerY,
                    cornerX + width, cornerY + height,
                    cornerRadius);

      context.arcTo(cornerX + width, cornerY + height,
                    cornerX, cornerY + height,
                    cornerRadius);

      context.arcTo(cornerX, cornerY + height,
                    cornerX, cornerY,
                    cornerRadius);

      if (width > 0) {
         context.arcTo(cornerX, cornerY,
                       cornerX + cornerRadius, cornerY,
                       cornerRadius);
      }
      else {
            context.arcTo(cornerX, cornerY,
                       cornerX - cornerRadius, cornerY,
                       cornerRadius);
      }

      context.stroke();
      context.fill();
   },

   drawKeys: function () {
      for (var row=0; row < this.keys.length; ++row) {
         for (var col=0; col < this.keys[row].length; ++col) {
            key = this.keys[row][col];

            key.translucent = this.translucent;
            key.draw(this.context);
         }
      }
   },
   
   draw: function (context) {
      var originalContext, key;

      if (context) {
         originalContext = this.context;
         this.context = context;
      }

      this.context.save();
      this.drawKeys();
      
      if (context) {
         this.context = originalContext;
      }

      this.context.restore();
   },

   erase: function() {
      // Erase the entire canvas
      this.context.clearRect(0, 0, this.context.canvas.width,
                             this.context.canvas.height);
   },

   // Keys..............................................................................

   adjustKeyPosition: function (key, keyTop, keyMargin, keyWidth, spacebarPadding) {
      var key = this.keys[row][col],
          keyMargin = this.domElement.clientWidth / (this.KEY_COLUMNS*8),
          keyWidth =
          ((this.domElement.clientWidth - 2*keyMargin) / this.KEY_COLUMNS) - keyMargin,
          keyLeft = keyMargin + col * keyWidth + col * keyMargin;

      if (row === 1) keyLeft += keyWidth/2;
      if (row === 3) keyLeft += keyWidth/3;

      key.left = keyLeft + spacebarPadding;
      key.top = keyTop;
   },

   adjustKeySize: function (key, keyMargin, keyWidth, keyHeight) {
      if (key.text === 'Enter')  key.width = keyWidth * 1.5;
      else if (key.text === ' ') key.width = keyWidth * 7;
      else                       key.width = keyWidth;

      key.height = keyHeight;
      key.cornerRadius = 5;
   },
   
   createKeys: function() {
      var key,
          keyMargin,
          keyWidth,
          keyHeight,
          spacebarPadding = 0;

      for (row=0; row < this.keys.length; ++row) {
         for (col=0; col < this.keys[row].length; ++col) {
            key = this.keys[row][col];
            keyMargin = this.domElement.clientWidth / (this.KEY_COLUMNS*8);
            keyWidth =
            ((this.domElement.clientWidth - 2*keyMargin) / this.KEY_COLUMNS) - keyMargin;
            keyHeight = ((this.KEYBOARD_HEIGHT - 2*keyMargin) / this.KEY_ROWS) - keyMargin;
            keyTop = keyMargin + row * keyHeight + row * keyMargin;

            this.adjustKeyPosition(key, keyTop, keyMargin, keyWidth, spacebarPadding);
            this.adjustKeySize(key, keyMargin, keyWidth, keyHeight);

            if (this.keys[row][col].text === ' ') {
               spacebarPadding = keyWidth*6; // pad from now on
            }
         }
      }
   },

   getKeyForLocation: function (context, loc) {
      var key;
      
      for (var row=0; row < this.keys.length; ++row) {
         for (var col=0; col < this.keys[row].length; ++col) {
            key = this.keys[row][col];

            if (key.isPointInKey(context, loc.x, loc.y)) {
              return key;
            }
         }
      }
      return null;
   },

   shiftKeyPressed: function (context) {
      for (var row=0; row < this.keys.length; ++row) {
         for (var col=0; col < this.keys[row].length; ++col) {
            nextKey = this.keys[row][col]; 

            if (nextKey.text === '^') {
               nextKey.toggleSelection();
               nextKey.redraw(context);
               this.shifted = nextKey.selected;
            }
         }
      }
   },

   activateKey: function (key, context) {
      key.select();
      setTimeout( function (e) {
                     key.deselect();
                     key.redraw(context);
                  }, 200);

      key.redraw(context);

      this.fireKeyEvent(key);
   },
   
   // Key listeners.....................................................................

   addKeyListener: function (listenerFunction) {
      this.keyListenerFunctions.push(listenerFunction);
   },
   
   fireKeyEvent: function (key) {
      for (var i=0; i < this.keyListenerFunctions.length; ++i) {
         this.keyListenerFunctions[i](this.shifted ? key.text : key.text.toLowerCase());
      }
   },

   // Event handlers....................................................................

   mouseDownOrTouchStart: function (context, loc) {
      var key = this.getKeyForLocation(context, loc);

      if (key) {
         if (key.text === '^') {
            this.shiftKeyPressed(context);
         }
         else {
           if (this.shifted) this.activateKey(key, context);
           else              this.activateKey(key, context);
         }
      }
   }
};
