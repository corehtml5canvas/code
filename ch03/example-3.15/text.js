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

// Cursor.........................................................

TextCursor = function (fillStyle, width) {
   this.fillStyle   = fillStyle || 'rgba(0, 0, 0, 0.7)';
   this.width       = width || 2;
   this.left        = 0;
   this.top         = 0;
};

TextCursor.prototype = {
   getHeight: function (context) {
      var h = context.measureText('M').width;
      return h + h/6;
   },
      
   createPath: function (context) {
      context.beginPath();
      context.rect(this.left, this.top,
                   this.width, this.getHeight(context));
   },
   
   draw: function (context, left, bottom) {
      context.save();

      this.left = left;
      this.top = bottom - this.getHeight(context);

      this.createPath(context);

      context.fillStyle = this.fillStyle;
      context.fill();
         
      context.restore();
   },

   erase: function (context, imageData) {
      context.putImageData(imageData, 0, 0,
         this.left, this.top,
         this.width, this.getHeight(context));
   }
};

// Text lines.....................................................

TextLine = function (x, y) {
   this.text = '';
   this.left = x;
   this.bottom = y;
   this.caret = 0;
};

TextLine.prototype = {
   insert: function (text) {
      this.text = this.text.substr(0, this.caret) + text +
                  this.text.substr(this.caret);
      this.caret += text.length;
   },

   removeCharacterBeforeCaret: function () {
      if (this.caret === 0)
         return;

      this.text = this.text.substring(0, this.caret-1) +
                  this.text.substring(this.caret); 

      this.caret--;
   },

   getWidth: function(context) {
      return context.measureText(this.text).width;
   },

   getHeight: function (context) {
      var h = context.measureText('W').width;
      return h + h/6;
   },

   draw: function(context) {
      context.save();
      context.textAlign = 'start';
      context.textBaseline = 'bottom';
       
      context.strokeText(this.text, this.left, this.bottom);
      context.fillText(this.text, this.left, this.bottom);

      context.restore();
   },

   erase: function (context, imageData) {
      context.putImageData(imageData, 0, 0);
   }
};
