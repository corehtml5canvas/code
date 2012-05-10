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
    controls = document.getElementById('controls'),
    animateButton = document.getElementById('animateButton'),

    tree = new Image(),
    nearTree = new Image(),
    grass = new Image(),
    grass2 = new Image(),
    sky = new Image(),

    paused = true,
    lastTime = 0,
    lastFpsUpdate = { time: 0, value: 0 },
    fps=60,

    skyOffset = 0,
    grassOffset = 0,
    treeOffset = 0,
    nearTreeOffset = 0,

    TREE_VELOCITY = 20,
    FAST_TREE_VELOCITY = 40,
    SKY_VELOCITY = 8,
    GRASS_VELOCITY = 75;

// Functions.....................................................

function erase() {
   context.clearRect(0,0,canvas.width,canvas.height);
}

function draw() {
   context.save();

   skyOffset = skyOffset < canvas.width ?
               skyOffset + SKY_VELOCITY/fps : 0;

   grassOffset = grassOffset < canvas.width ?
                 grassOffset +  GRASS_VELOCITY/fps : 0;

   treeOffset = treeOffset < canvas.width ?
                treeOffset + TREE_VELOCITY/fps : 0;

   nearTreeOffset = nearTreeOffset < canvas.width ?
                    nearTreeOffset + FAST_TREE_VELOCITY/fps : 0;

   context.save();
   context.translate(-skyOffset, 0);
   context.drawImage(sky, 0, 0);
   context.drawImage(sky, sky.width-2, 0);
   context.restore();

   context.save();
   context.translate(-treeOffset, 0);
   context.drawImage(tree, 100, 240);
   context.drawImage(tree, 1100, 240);
   context.drawImage(tree, 400, 240);
   context.drawImage(tree, 1400, 240);
   context.drawImage(tree, 700, 240);
   context.drawImage(tree, 1700, 240);
   context.restore();

   context.save();
   context.translate(-nearTreeOffset, 0);
   context.drawImage(nearTree, 250, 220);
   context.drawImage(nearTree, 1250, 220);
   context.drawImage(nearTree, 800, 220);
   context.drawImage(nearTree, 1800, 220);
   context.restore();

   context.save();
   context.translate(-grassOffset, 0);

   context.drawImage(grass, 0, canvas.height-grass.height);

   context.drawImage(grass, grass.width-5,
                     canvas.height-grass.height);

   context.drawImage(grass2, 0, canvas.height-grass2.height);

   context.drawImage(grass2, grass2.width,
                     canvas.height-grass2.height);
   context.restore();

}

function calculateFps(now) {
   var fps = 1000 / (now - lastTime);
   lastTime = now;
   return fps; 
}

function animate(now) {
   if (now === undefined) {
      now = +new Date;
   }

   fps = calculateFps(now);

   if (!paused) {
      erase();
	   draw();
   }

   requestNextAnimationFrame(animate);
}

// Event handlers................................................

animateButton.onclick = function (e) {
   paused = paused ? false : true;
   if (paused) {
      animateButton.value = 'Animate';
   }
   else {
      animateButton.value = 'Pause';
   }
};

// Initialization................................................

context.font = '48px Helvetica';

tree.src = '../../shared/images/smalltree.png';
nearTree.src = '../../shared/images/tree-twotrunks.png';
grass.src = '../../shared/images/grass.png';
grass2.src = '../../shared/images/grass2.png';
sky.src = '../../shared/images/sky.png';

sky.onload = function (e) {
   draw();
};

requestNextAnimationFrame(animate);
