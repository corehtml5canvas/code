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
    explosionButton = document.getElementById('explosionButton'),

    BOMB_LEFT = 100,
    BOMB_TOP = 80,
    BOMB_WIDTH = 180,
    BOMB_HEIGHT = 130,

    NUM_EXPLOSION_PAINTERS = 9,
    NUM_FUSE_PAINTERS = 9,

    // Painters..................................................

    bombPainter = new ImagePainter('../../shared/images/bomb.png'),
    bombNoFusePainter = new ImagePainter('bomb-no-fuse.png'),
    fuseBurningPainters = [],
    explosionPainters = [],

    // Animators.................................................

    fuseBurningAnimator = new SpriteAnimator(
              fuseBurningPainters,
              function () { bomb.painter = bombNoFusePainter; });

    explosionAnimator = new SpriteAnimator(
              explosionPainters,
              function () { bomb.painter = bombNoFusePainter; });

    // Bomb......................................................

    bomb = new Sprite('bomb', bombPainter),

// Event Handlers................................................

explosionButton.onclick = function (e) {
   if (bomb.animating) // not now...
      return;

   // burn fuse for 2 seconds

   fuseBurningAnimator.start(bomb, 2000); 

   // wait for 3 seconds, then explode for 1 second

   setTimeout(function () {
      explosionAnimator.start(bomb, 1000); 

      // wait for 2 seconds, then reset to the
      // original bomb image

      setTimeout(function () {
         bomb.painter = bombPainter;
      }, 2000);

   }, 3000);

};

// Animation.....................................................

function animate(now) {
   context.clearRect(0,0,canvas.width,canvas.height);
   bomb.paint(context);
   window.requestNextAnimationFrame(animate);
}

// Initialization................................................

bomb.left = BOMB_LEFT;
bomb.top = BOMB_TOP;
bomb.width = BOMB_WIDTH;
bomb.height = BOMB_HEIGHT;

for (var i=0; i < NUM_FUSE_PAINTERS; ++i) {
   fuseBurningPainters.push(new ImagePainter('fuse-0' + i + '.png'));
}

for (var i=0; i < NUM_EXPLOSION_PAINTERS; ++i) {
   explosionPainters.push(new ImagePainter('explosion-0' + i + '.png'));
}

window.requestNextAnimationFrame(animate);
