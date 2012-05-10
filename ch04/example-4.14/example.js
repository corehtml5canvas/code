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

var image = new Image(),
    canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    colorToggleCheckbox = document.getElementById('colorToggleCheckbox');

function drawInBlackAndWhite() {
   var data = undefined,
       i = 0;

   imagedata = context.getImageData(0, 0,
                                    canvas.width, canvas.height);
   data = imagedata.data;
   
   for(i=0; i < data.length - 4; i+=4) {
      average = (data[i] + data[i+1] + data[i+2]) / 3;
      data[i]   = average;
      data[i+1] = average;
      data[i+2] = average;
   }
   context.putImageData(imagedata, 0, 0);
}

function drawInColor() {
   context.drawImage(image, 0, 0,
      image.width, image.height, 0, 0, 
      context.canvas.width, context.canvas.height);
}

colorToggleCheckbox.onclick = function() {
   if (colorToggleCheckbox.checked) {
      drawInColor();
   }
   else {
      drawInBlackAndWhite();
   }
};

image.src = '../../shared/images/curved-road.png';
image.onload = function() {
   drawInColor();
};
