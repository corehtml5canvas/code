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

var colorPatchContext = document.getElementById('colorPatchCanvas').
                           getContext('2d'),

    redSlider   = new COREHTML5.Slider('rgb(0,0,0)',
                                       'rgba(255,0,0,0.8)', 0),

    blueSlider  = new COREHTML5.Slider('rgb(0,0,0)', 
                                       'rgba(0,0,255,0.8)', 1.0),

    greenSlider = new COREHTML5.Slider('rgb(0,0,0)', 
                                       'rgba(0,255,0,0.8)', 0.25),

    alphaSlider = new COREHTML5.Slider('rgb(0,0,0)', 
                                       'rgba(255,255,255,0.8)', 0.5);

redSlider.appendTo('redSliderDiv');
blueSlider.appendTo('blueSliderDiv');
greenSlider.appendTo('greenSliderDiv');
alphaSlider.appendTo('alphaSliderDiv');

// Functions..........................................................

function updateColor() {
   var alpha = new Number((alphaSlider.knobPercent).toFixed(2));
   var color = 'rgba('
      + parseInt(redSlider.knobPercent * 255) + ','
      + parseInt(greenSlider.knobPercent * 255) + ','
      + parseInt(blueSlider.knobPercent * 255) + ','
      + alpha + ')';

   colorPatchContext.fillStyle = color;

   colorPatchContext.clearRect(0,0,colorPatchContext.canvas.width,
                               colorPatchContext.canvas.height);

   colorPatchContext.fillRect(0,0,colorPatchContext.canvas.width,
                               colorPatchContext.canvas.height);

   colorPatchContext.font = '18px Arial';
   colorPatchContext.fillStyle = 'white';
   colorPatchContext.fillText(color, 10, 40);

   alpha = (alpha + 0.2 > 1.0) ? 1.0 : alpha + 0.2;
   alphaSlider.opacity = alpha;
}

// Event Handlers.....................................................

redSlider.addChangeListener( function() { 
   updateColor();
   redSlider.fillStyle = 'rgb(' +
      (redSlider.knobPercent * 255).toFixed(0) + ', 0, 0)';
});

greenSlider.addChangeListener( function() { 
   updateColor();
   greenSlider.fillStyle = 'rgb(0, ' + 
      (greenSlider.knobPercent * 255).toFixed(0) + ', 0)';
});

blueSlider.addChangeListener( function () {
   updateColor();
   blueSlider.fillStyle = 'rgb(0, 0, ' + 
      (blueSlider.knobPercent * 255).toFixed(0) + ')';
});

alphaSlider.addChangeListener( function() { 
   updateColor();
   alphaSlider.fillStyle = 'rgba(255, 255, 255, ' + 
      (alphaSlider.knobPercent * 255).toFixed(0) + ')';

   alphaSlider.opacity = alphaSlider.knobPercent;
});

// Initialization.....................................................

redSlider.fillStyle   = 'rgb(' +
   (redSlider.knobPercent * 255).toFixed(0)   + ', 0, 0)';

greenSlider.fillStyle = 'rgb(0, ' +
   (greenSlider.knobPercent * 255).toFixed(0) + ', 0)';

blueSlider.fillStyle  = 'rgb(0, 0, ' +
   (blueSlider.knobPercent * 255).toFixed(0)  + ')';

alphaSlider.fillStyle = 'rgba(255, 255, 255, ' +
   (alphaSlider.knobPercent * 255).toFixed(0) + ')';

alphaSlider.opacity = alphaSlider.knobPercent;

alphaSlider.draw();
redSlider.draw();
greenSlider.draw();
blueSlider.draw();
