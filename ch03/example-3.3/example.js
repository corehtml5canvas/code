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

    LEFT_COLUMN_FONTS = [
       '2em palatino',                     'bolder 2em palatino',
       'lighter 2em palatino',             'italic 2em palatino',
       'oblique small-caps 24px palatino', 'bold 14pt palatino',
       'xx-large palatino',                'italic xx-large palatino'
    ],

    RIGHT_COLUMN_FONTS = [
       'oblique 1.5em lucida console',     'x-large fantasy',
       'italic 28px monaco',               'italic large copperplate',
       '36px century',                     '28px tahoma',
       '28px impact',                      '1.7em verdana'
    ],

    LEFT_COLUMN_X = 50,
    RIGHT_COLUMN_X = 500,
    DELTA_Y = 50,
    TOP_Y = 50,
    y = 0;

function drawBackground() {
   var STEP_Y = 12,
       i = context.canvas.height;
   
   context.strokeStyle = 'rgba(0,0,200,0.225)';
   context.lineWidth = 0.5;

   context.save();
   context.restore();

   while(i > STEP_Y*4) {
      context.beginPath();
      context.moveTo(0, i);
      context.lineTo(context.canvas.width, i);
      context.stroke();
      i -= STEP_Y;
   }

   context.save();

   context.strokeStyle = 'rgba(100,0,0,0.3)';
   context.lineWidth = 1;

   context.beginPath();

   context.moveTo(35,0);
   context.lineTo(35,context.canvas.height);
   context.stroke();

   context.restore();
}

drawBackground();

context.fillStyle = 'blue',

LEFT_COLUMN_FONTS.forEach( function (font) {
   context.font = font;
   context.fillText(font, LEFT_COLUMN_X, y += DELTA_Y);
});

y = 0;

RIGHT_COLUMN_FONTS.forEach( function (font) {
   context.font = font;
   context.fillText(font, RIGHT_COLUMN_X, y += DELTA_Y);
});

