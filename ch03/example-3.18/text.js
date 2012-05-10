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
      var w = context.measureText('W').width;
      return w + w/6;
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
      var first = this.text.slice(0, this.caret),
          last = this.text.slice(this.caret);

      first += text;
      this.text = first;
      this.text += last;
      this.caret += text.length;
   },

   getCaretX: function (context) {
      var s = this.text.substring(0, this.caret),
          w = context.measureText(s).width;

      return this.left + w;
   },
   
   removeCharacterBeforeCaret: function () {
      if (this.caret === 0)
         return;

      this.text = this.text.substring(0, this.caret-1) +
                  this.text.substring(this.caret); 

      this.caret--;
   },

   removeLastCharacter: function () {
      this.text = this.text.slice(0, -1);
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

// Paragraphs.....................................................

Paragraph = function (context, left, top, imageData, cursor) {
   this.context = context;
   this.drawingSurface = imageData;
   this.left = left;
   this.top = top;
   this.lines = [];
   this.activeLine = undefined;
   this.cursor = cursor;
   this.blinkingInterval = undefined;
};

Paragraph.prototype = {
   isPointInside: function (loc) {
      var c = this.context;

      c.beginPath();
      c.rect(this.left, this.top, 
             this.getWidth(), this.getHeight());

      return c.isPointInPath(loc.x, loc.y);
   },
   
   getHeight: function () {
      var h = 0;

      this.lines.forEach( function (line) {
         h += line.getHeight(this.context); 
      });

      return h;
   },
   
   getWidth: function () {
      var w = 0,
          widest = 0;

      this.lines.forEach( function (line) {
         w = line.getWidth(this.context); 
         if (w > widest) {
            widest = w;
         }
      });

      return widest;
   },

   draw: function () {
      this.lines.forEach( function (line) {
         line.draw(this.context);
      });
   },

   erase: function (context, imageData) {
      context.putImageData(imageData, 0, 0);
   },
   
   addLine: function (line) {
      this.lines.push(line);
      this.activeLine = line;
      this.moveCursor(line.left, line.bottom);
   },

   insert: function (text) {
     this.erase(this.context, this.drawingSurface);
     this.activeLine.insert(text);

     var t = this.activeLine.text.substring(0, this.activeLine.caret),
         w = this.context.measureText(t).width;
      
     this.moveCursor(this.activeLine.left + w,
                     this.activeLine.bottom);

     this.draw(this.context);
   },

   blinkCursor: function (x, y) {
      var self = this,
          BLINK_OUT = 200,
          BLINK_INTERVAL = 900;

      this.blinkingInterval = setInterval( function (e) {
         cursor.erase(context, self.drawingSurface);
      
         setTimeout( function (e) {
            cursor.draw(context, cursor.left,
                        cursor.top + cursor.getHeight(context));
         }, BLINK_OUT);
      }, BLINK_INTERVAL);
   },

   moveCursorCloseTo: function (x, y) {
      var line = this.getLine(y);

      if (line) {
         line.caret = this.getColumn(line, x);
         this.activeLine = line;
         this.moveCursor(line.getCaretX(context),
                         line.bottom);
      }
   },
   
   moveCursor: function (x, y) {
      this.cursor.erase(this.context, this.drawingSurface);
      this.cursor.draw(this.context, x, y);

      if ( ! this.blinkingInterval)
         this.blinkCursor(x, y);
   },

   moveLinesDown: function (start) {
      for (var i=start; i < this.lines.length; ++i) {
         line = this.lines[i];
         line.bottom += line.getHeight(this.context);
      }
   },
   
   newline: function () {
      var textBeforeCursor = this.activeLine.text.substring(0, this.activeLine.caret),
          textAfterCursor = this.activeLine.text.substring(this.activeLine.caret),
          height = this.context.measureText('W').width +
                   this.context.measureText('W').width/6,
          bottom  = this.activeLine.bottom + height,
          activeIndex,
          line;

      this.erase(this.context, this.drawingSurface);     // Erase paragraph
      this.activeLine.text = textBeforeCursor;           // Set active line's text

      line = new TextLine(this.activeLine.left, bottom); // Create a new line
      line.insert(textAfterCursor);                      // containing text after cursor

      activeIndex = this.lines.indexOf(this.activeLine); // Splice in new line
      this.lines.splice(activeIndex+1, 0, line);

      this.activeLine = line;                            // New line is active with
      this.activeLine.caret = 0;                         // caret at first character

      activeIndex = this.lines.indexOf(this.activeLine); // Starting at the new line...

      for(var i=activeIndex+1; i < this.lines.length; ++i) { //...loop over remaining lines
         line = this.lines[i];
         line.bottom += height; // move line down one row
      }

      this.draw();
      this.cursor.draw(this.context, this.activeLine.left, this.activeLine.bottom);
   },

   getLine: function (y) {
      var line;
      
      for (i=0; i < this.lines.length; ++i) {
         line = this.lines[i];
         if (y > line.bottom - line.getHeight(context) &&
             y < line.bottom) {
            return line;
         }
      }
      return undefined;
   },

   getColumn: function (line, x) {
      var found = false,
          before,
          after,
          closest,
          tmpLine,
          column;

      tmpLine = new TextLine(line.left, line.bottom);
      tmpLine.insert(line.text);
         
      while ( ! found && tmpLine.text.length > 0) {
         before = tmpLine.left + tmpLine.getWidth(context);
         tmpLine.removeLastCharacter();
         after = tmpLine.left + tmpLine.getWidth(context);
            
         if (after < x) {
            closest = x - after < before - x ? after : before;
            column = closest === before ?
                     tmpLine.text.length + 1 : tmpLine.text.length;
            found = true;
         }
      }
      return column;
   },

   activeLineIsOutOfText: function () {
      return this.activeLine.text.length === 0;
   },

   activeLineIsTopLine: function () {
      return this.lines[0] === this.activeLine;
   },

   moveUpOneLine: function () {
      var lastActiveText, line, before, after;
      
      lastActiveLine = this.activeLine;
      lastActiveText = '' + lastActiveLine.text;
            
      activeIndex = this.lines.indexOf(this.activeLine);
      this.activeLine = this.lines[activeIndex - 1];
      this.activeLine.caret = this.activeLine.text.length;

      this.lines.splice(activeIndex, 1);
            
      this.moveCursor(
         this.activeLine.left + this.activeLine.getWidth(this.context),
         this.activeLine.bottom);

      this.activeLine.text += lastActiveText;

      for (var i=activeIndex; i < this.lines.length; ++i) {
         line = this.lines[i];
         line.bottom -= line.getHeight(this.context);
      }
   },

   backspace: function () {
      var lastActiveLine,
          activeIndex,
          t, w;

      this.context.save();

      if (this.activeLine.caret === 0) {
         if ( ! this.activeLineIsTopLine()) {
            this.erase(this.context, this.drawingSurface);
            this.moveUpOneLine();
            this.draw();
         }
      }
      else {  // active line has text
        this.context.fillStyle = fillStyleSelect.value;
         this.context.strokeStyle = strokeStyleSelect.value;

         this.erase(this.context, this.drawingSurface);
         this.activeLine.removeCharacterBeforeCaret();

         t = this.activeLine.text.slice(0, this.activeLine.caret),
         w = this.context.measureText(t).width;
      
         this.moveCursor(this.activeLine.left + w,
                     this.activeLine.bottom);

         this.draw(this.context);

         context.restore();
      }
   }
};
