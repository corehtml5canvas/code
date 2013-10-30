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
    animateButton = document.getElementById('animateButton'),
    spritesheet = new Image(),
    runnerCells = [
      { left: 0,   top: 0, width: 47, height: 64 },
      { left: 55,  top: 0, width: 44, height: 64 },
      { left: 107, top: 0, width: 39, height: 64 },
      { left: 150, top: 0, width: 46, height: 64 },
      { left: 208, top: 0, width: 49, height: 64 },
      { left: 265, top: 0, width: 46, height: 64 },
      { left: 320, top: 0, width: 42, height: 64 },
      { left: 380, top: 0, width: 35, height: 64 },
      { left: 425, top: 0, width: 35, height: 64 },
    ],
    sprite = new Sprite('runner', new SpriteSheetPainter(runnerCells)),
    interval,
    lastAdvance = 0,
    paused = false,
    PAGEFLIP_INTERVAL = 100;

// Functions.....................................................

function drawBackground() {
   var STEP_Y = 12,
       i = context.canvas.height;
   
   while(i > STEP_Y*4) {
      context.beginPath();
      context.moveTo(0, i);
      context.lineTo(context.canvas.width, i);
      context.stroke();
      i -= STEP_Y;
   }
}

function pauseAnimation() {
   animateButton.value = 'Animate';
   paused = true;
}

function startAnimation() {
   animateButton.value = 'Pause';
   paused = false;
   lastAdvance = 0;
   window.requestNextAnimationFrame(animate);
}

// Event handlers................................................

animateButton.onclick = function (e) {
   if (animateButton.value === 'Animate') startAnimation();
   else                                   pauseAnimation();
};

// Animation.....................................................

function animate(time) {
   if ( ! paused) {
      context.clearRect(0,0,canvas.width,canvas.height);
      drawBackground();
      context.drawImage(spritesheet, 0, 0);

      sprite.paint(context); 

      if (time - lastAdvance > PAGEFLIP_INTERVAL) {
         sprite.painter.advance();
         lastAdvance = time;
      }
      window.requestNextAnimationFrame(animate);
   }
}

// Initialization................................................

spritesheet.src = '../../shared/images/running-sprite-sheet.png';
spritesheet.onload = function(e) {
   context.drawImage(spritesheet, 0, 0);
};

sprite.left = 200;
sprite.top = 100;

context.strokeStyle = 'lightgray';
context.lineWidth = 0.5;

drawBackground();
