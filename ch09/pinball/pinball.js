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

var game = new Game('pinball', 'gameCanvas'),
   applyGravityAndFriction = false;

   TRY_AGAIN_X = 255,
   TRY_AGAIN_Y = 865,
   TRY_AGAIN_RADIUS = 35,
   showTryAgain = false,

   showingHighScores = true,

   // Flippers...................................................

   LEFT_FLIPPER = 1,
   RIGHT_FLIPPER = 2,

   LEFT_FLIPPER_PIVOT_X = 143,
   LEFT_FLIPPER_PIVOT_Y = 774,

   LEFT_FLIPPER_PIVOT_OFFSET_X = 28,
   LEFT_FLIPPER_PIVOT_OFFSET_Y = 29,

   FLIPPER_RISE_DURATION = 25,
   FLIPPER_FALL_DURATION = 175,

   MAX_FLIPPER_ANGLE = Math.PI/4,

   LEFT_FLIPPER_STRIKE_ZONE_LEFT = 175,
   LEFT_FLIPPER_STRIKE_ZONE_RIGHT = 260,

   FLIPPER_BOTTOM = 870,
   
   leftFlipperRiseTimer =
      new AnimationTimer(FLIPPER_RISE_DURATION,
                         AnimationTimer.makeEaseOut(3)),
   leftFlipperFallTimer =
      new AnimationTimer(FLIPPER_FALL_DURATION,
                         AnimationTimer.makeEaseIn(3)),

   rightFlipperRiseTimer =
      new AnimationTimer(FLIPPER_RISE_DURATION,
                         AnimationTimer.makeEaseOut(3)),
   rightFlipperFallTimer =
      new AnimationTimer(FLIPPER_FALL_DURATION,
                         AnimationTimer.makeEaseIn(3)),

   leftFlipperAngle = 0,
   rightFlipperAngle = 0,

   // Actuator...................................................

   ACTUATOR_LEFT = 468,
   ACTUATOR_TOP = 839,
   ACTUATOR_PLATFORM_WIDTH = 45,
   ACTUATOR_PLATFORM_HEIGHT = 10,

   actuatorSprite = new Sprite('actuator',
                     new ImagePainter('images/actuator-0.png')),

   // Ball.......................................................

   BALL_LAUNCH_LEFT = ACTUATOR_LEFT + 3,
   BALL_LAUNCH_TOP = ACTUATOR_TOP - 30,
   LAUNCH_VELOCITY_Y = 200,
   MAX_BALL_VELOCITY = 400,
   MIN_BALL_VELOCITY = 3,
   MIN_BALL_VELOCITY_OFF_FLIPPERS = 75,
   GAME_HEIGHT_IN_METERS = 2,
   GRAVITY = 9.8; // m/s/s

   lastBallPosition = new Point(),

   ballOutOfPlay = false,

   prepareForLaunch = function() {
      ballSprite.left = BALL_LAUNCH_LEFT;
      ballSprite.top = BALL_LAUNCH_TOP;

      ballSprite.velocityX = 0;
      ballSprite.velocityY = 0;

      applyGravityAndFriction = false;
      adjustRightBoundaryAfterLostBall();

      launching = true;
   },

   brieflyShowTryAgainImage = function (milliseconds) {
      showTryAgain = true;

      setTimeout( function (e) {
         showTryAgain = false;
      }, 2000);
   },

   applyFrictionAndGravity = function (time) {
      var lastElapsedTime = time / 1000,
          metersPerSecond = GRAVITY * lastElapsedTime * 0.1;

      if (Math.abs(ballSprite.velocityX) > MIN_BALL_VELOCITY) {
         ballSprite.velocityX *= Math.pow(0.5, lastElapsedTime);
      }

      if (Math.abs(ballSprite.velocityY) > MIN_BALL_VELOCITY) {
         ballSprite.velocityY *= Math.pow(0.5, lastElapsedTime);
      }

      ballSprite.velocityY += metersPerSecond *
         parseFloat(game.context.canvas.height / GAME_HEIGHT_IN_METERS);
   },
      
   ballMover = {
      execute: function (sprite, context, time) {
         if (!game.paused && !loading) {
            lastBallPosition.x = sprite.left;
            lastBallPosition.y = sprite.top;
            
            if ( !launching && sprite.left < ACTUATOR_LEFT &&
                 (sprite.top > FLIPPER_BOTTOM || sprite.top < 0)) {
               ballOutOfPlay = true;
            }
            
            sprite.left += game.pixelsPerFrame(time, sprite.velocityX);
            sprite.top  += game.pixelsPerFrame(time, sprite.velocityY);
         }
      },
   },

   ballSprite = new Sprite('ball',
                     new ImagePainter('images/ball.png'),
                     [ ballMover ]),

   ballShape = new SpriteShape(ballSprite, ballSprite.width, ballSprite.height),
         
   // Extra balls................................................

   EXTRA_BALLS_RIGHT = 430,
   EXTRA_BALL_WIDTH = 36,
   EXTRA_BALLS_BOTTOM = game.context.canvas.height - 55,
         
   // Launching..................................................

   launching = false,
   launchStep = 1,
   LAUNCH_STEPS = 8,
   launchImages = [], // filled in with images below
      
   // Loading....................................................

   loading = false,  // not yet, see the end of this file
   loadingToast = document.getElementById('loadingToast'),
   loadingToastTitle = document.getElementById('loadingToastTitle'),
   loadMessage = document.getElementById('loadMessage'),
   progressDiv = document.getElementById('progressDiv'),
   progressbar = new COREHTML5.Progressbar(300, 23, 'rgba(0,0,0,0.5)', 100, 130, 250),
   
   // Score......................................................
   
   scoreToast = document.getElementById('scoreToast'),
   scoreReadout = document.getElementById('score'),
   score = 0,
   lastScore = 0,
   lastScoreUpdate = undefined,

   // High Score.................................................
   
   HIGH_SCORES_DISPLAYED = 10,

   highScoreToast = document.getElementById('highScoreToast'),
   highScoreParagraph = document.getElementById('highScoreParagraph'),
   highScoreList = document.getElementById('highScoreList'),
   previousHighScoresTitle = document.getElementById('previousHighScoresTitle'),
   nameInput = document.getElementById('nameInput'),
   addMyScoreButton = document.getElementById('addMyScoreButton'),
   newGameButton = document.getElementById('newGameButton'),
   newGameFromHighScoresButton =
         document.getElementById('newGameFromHighScoresButton'),
   clearHighScoresCheckbox = document.getElementById('clearHighScoresCheckbox'),

   // Lives......................................................
   
   livesLeft = 3,
   life = 100,

   // Paused.....................................................
   
   pausedToast = document.getElementById('pausedToast'),

   // Game Over..................................................
   
   gameOverToast = document.getElementById('gameOverToast'),
   gameOver = false,

   // Collision Detection........................................

   shapes = [],

   flipperCollisionDetected = false,

   showPolygonsOnlyToast = document.getElementById('showPolygonsOnlyToast'),
   showPolygonsOnlyCheckbox = document.getElementById('showPolygonsOnlyCheckbox'),
   showPolygonsOnly = showPolygonsOnlyCheckbox.checked,

   fiveHundredBumper = new Circle(256, 187, 40),
   oneHundredBumperRight = new Circle(395, 328, 40),
   oneHundredBumperLeft = new Circle(116, 328, 40),
   fiftyBumper = new Circle(255, 474, 40),
   fiveXBumperLeft = new Polygon(),
   fiveXBumperRight = new Polygon(),
   twoXBumperLeft = new Polygon(),
   twoXBumperRight = new Polygon(),
   oneXBumperLeft = new Polygon(),
   oneXBumperRight = new Polygon(),
   upperLeftBarLeft = new Polygon(),
   upperLeftBarRight = new Polygon(),
   upperRightBarLeft = new Polygon(),
   upperRightBarRight = new Polygon(),
   lowerLeftBarLeft = new Polygon(),
   lowerLeftBarRight = new Polygon(),
   lowerRightBarLeft = new Polygon(),
   lowerRightBarRight = new Polygon(),
   leftFlipperShape = new Polygon(),
   leftFlipperBaselineShape = new Polygon(),
   rightFlipperShape = new Polygon(),
   rightFlipperBaselineShape = new Polygon(),
   actuatorPlatformShape = new Polygon(),
   leftBoundary = new Polygon(),
   rightBoundary = new Polygon();
   
// Pause and Auto-pause.......................................

togglePaused = function () {
   game.togglePaused();
   pausedToast.style.display = game.paused ? 'inline' : 'none';
};

pausedToast.onclick = function (e) {
   pausedToast.style.display = 'none';
   togglePaused();
};

window.onblur = function windowOnBlur() { 
   if (!launching && !loading && !gameOver && !game.paused) {
      game.togglePaused();
      pausedToast.style.display = game.paused ? 'inline' : 'none';
   }
};

window.onfocus = function windowOnFocus() {
   if (game.paused) {
      game.togglePaused();
      pausedToast.style.display = game.paused ? 'inline' : 'none';
   }
};

// New game ..................................................

newGameButton.onclick = function (e) {
   gameOverToast.style.display = 'none';
   startNewGame();
};

function startNewGame() {
   showPolygonsOnlyToast.style.display = 'block';
   highScoreParagraph.style.display = 'none';
   gameOver = false;
   livesLeft = 3;
   score = 0;
   showingHighScores = false;
   loading = false;
   actuatorSprite.visible = true;
   ballSprite.visible = true;
};

// High Scores................................................

// Change game display to show high scores when
// player bests the high score.
   
showHighScores = function () {
   highScoreParagraph.style.display = 'inline';
   highScoreParagraph.innerText = score;
   highScoreToast.style.display = 'inline';
   updateHighScoreList();
};

// The game shows the list of high scores in
// an ordered list. This method creates that
// list element, and populates it with the
// current high scores.
   
updateHighScoreList = function () {
   var el,
       highScores = game.getHighScores(),
       length = highScores.length,
       highScore,
       listParent = highScoreList.parentNode;

   listParent.removeChild(highScoreList);
   highScoreList = document.createElement('ol');
   highScoreList.id = 'highScoreList'; // So CSS takes effect
   listParent.appendChild(highScoreList);
      
   if (length > 0) {
      previousHighScoresTitle.style.display = 'block';
         
      length = length > 10 ? 10 : length;

      for (var i=0; i < length; ++i) {
            
         highScore = highScores[i];
         el = document.createElement('li');
         el.innerText = highScore.score +
                                    ' by ' + highScore.name;  
         highScoreList.appendChild(el);
      }
   }
   else {
      previousHighScoresTitle.style.display = 'none';
   }
}

// The browser invokes this method when the user clicks on the
// Add My Score button.
   
addMyScoreButton.onclick = function (e) {
   game.setHighScore({ name: nameInput.value, score: lastScore });
   updateHighScoreList();
   addMyScoreButton.disabled = 'true';
   nameInput.value = '';
};


// The browser invokes this method when the user clicks on the
// new game button.
   
newGameFromHighScoresButton.onclick = function (e) {
   highScoreToast.style.display = 'none';
   startNewGame();
};

// The Add My Score button is only enabled when there
// is something in the nameInput field.
   
nameInput.onkeyup = function (e) {
   if (nameInput.value.length > 0) {
      addMyScoreButton.disabled = false; 
   }
   else {
      addMyScoreButton.disabled = true; 
   }
};


var bumperLit = undefined;
var interval = undefined;

// Score Display..............................................

updateScore = function (shape) {
   if (shape && !loading && game.lastScoreUpdate !== undefined) {
      //if (game.gameTime - game.lastScoreUpdate > 500) {
         if (shape === fiveHundredBumper) score += 500;
         else if (shape === oneHundredBumperLeft) score += 100;
         else if (shape === oneHundredBumperRight) score += 100;
         else if (shape === fiftyBumper) score += 50;
   
         scoreToast.style.display = 'inline';
         scoreToast.innerHTML = score.toFixed(0);
         game.lastScoreUpdate = game.gameTime;
      //}
   }
   else {
      game.lastScoreUpdate = game.gameTime;
   }
};

// Collision Detection........................................

function drawCollisionShapes() {
   var centroid;
   
   shapes.forEach( function (shape) {
      shape.stroke(game.context);
      game.context.beginPath();
      centroid = shape.centroid();
      game.context.arc(centroid.x, centroid.y, 1.5, 0, Math.PI*2, false);
      game.context.stroke();
   });
}

function clampBallVelocity() {
   if (ballSprite.velocityX > MAX_BALL_VELOCITY)
      ballSprite.velocityX = MAX_BALL_VELOCITY;
   else if (ballSprite.velocityX < -MAX_BALL_VELOCITY)
      ballSprite.velocityX = -MAX_BALL_VELOCITY;
         
   if(ballSprite.velocityY > MAX_BALL_VELOCITY)
      ballSprite.velocityY = MAX_BALL_VELOCITY;
   else if (ballSprite.velocityY < -MAX_BALL_VELOCITY)
      ballSprite.velocityY = -MAX_BALL_VELOCITY;
};

function separate(mtv) {
   var dx, dy, velocityMagnitude, point, theta=0,
       velocityVector = new Vector(new Point(ballSprite.velocityX, ballSprite.velocityY)),
       velocityUnitVector = velocityVector.normalize();

   if (mtv.axis.x === 0) {
      theta = Math.PI/2;
   }
   else {
     theta = Math.atan(mtv.axis.y / mtv.axis.x);
   }

   dy = mtv.overlap * Math.sin(theta);
   dx = mtv.overlap * Math.cos(theta); 

   if (mtv.axis.x < 0 && dx > 0 || mtv.axis.x > 0 && dx < 0) dx = -dx; // account for negative angle
   if (mtv.axis.y < 0 && dy > 0 || mtv.axis.y > 0 && dy < 0) dy = -dy;

   ballSprite.left += dx;
   ballSprite.top  += dy;
}

function checkMTVAxisDirection(mtv, shape) {
   var centroid1, centroid2, centroidVector, centroidUnitVector, flipOrNot;
   centroid1 = new Vector(ballShape.centroid());
   centroid2 = new Vector(shape.centroid()),
   centroidVector = centroid2.subtract(centroid1),
   centroidUnitVector = (new Vector(centroidVector)).normalize();

   if (mtv.axis === undefined)
      return;
   
   if (centroidUnitVector.dotProduct(mtv.axis) > 0) {
      mtv.axis.x = -mtv.axis.x;
      mtv.axis.y = -mtv.axis.y;
   }
};

function bounce(mtv, shape, bounceCoefficient) {
   var velocityVector = new Vector(new Point(ballSprite.velocityX, ballSprite.velocityY)),
       velocityUnitVector = velocityVector.normalize(),
       velocityVectorMagnitude = velocityVector.getMagnitude(),
       reflectAxis, point;

   checkMTVAxisDirection(mtv, shape);
   
   if (!loading && !game.paused) {
      if (mtv.axis !== undefined) {
         reflectAxis = mtv.axis.perpendicular();
      }

      separate(mtv);

      point = velocityUnitVector.reflect(reflectAxis);

      if (shape === leftFlipperShape || shape === rightFlipperShape) {
         if (velocityVectorMagnitude < MIN_BALL_VELOCITY_OFF_FLIPPERS) 
            velocityVectorMagnitude = MIN_BALL_VELOCITY_OFF_FLIPPERS;
      }
   
      ballSprite.velocityX = point.x * velocityVectorMagnitude * bounceCoefficient;
      ballSprite.velocityY = point.y * velocityVectorMagnitude * bounceCoefficient;

      clampBallVelocity();
   }
}


function collisionDetected(mtv) {
   return mtv.axis !== undefined && mtv.overlap !== 0;
};

function detectCollisions() {
   var mtv, shape, displacement, position, lastPosition;

   if (!launching && !loading && !game.paused) {
      ballShape.x = ballSprite.left;
      ballShape.y = ballSprite.top;
      ballShape.points = [];
      ballShape.setPolygonPoints();

      position = new Vector(new Point(ballSprite.left, ballSprite.top));
      lastPosition = new Vector(new Point(lastBallPosition.x, lastBallPosition.y));
      displacement = position.subtract(lastPosition);
          
      for (var i=0; i < shapes.length; ++i) {
         shape = shapes[i];
         
         if (shape !== ballShape) {
            mtv = ballShape.collidesWith(shape, displacement);
            if (collisionDetected(mtv)) {
               updateScore(shape);

               setTimeout ( function (e) {
                  bumperLit = undefined;
               }, 100);

               if (shape === twoXBumperLeft        ||
                   shape === twoXBumperRight       ||
                   shape === fiveXBumperRight      ||
                   shape === fiveXBumperLeft       ||
                   shape === fiftyBumper           ||
                   shape === oneHundredBumperLeft  ||
                   shape === oneHundredBumperRight ||
                   shape === fiveHundredBumper) {
                  game.playSound('bumper');
                  bounce(mtv, shape, 4.5);
                  bumperLit = shape;
                  return true;

               }
               else if (shape === rightFlipperShape) {
                  if (rightFlipperAngle === 0) {
                     bounce(mtv, shape, 1 + rightFlipperAngle);
                     return true;
                  }
               }
               else if (shape === leftFlipperShape) {
                  if (leftFlipperAngle === 0) {
                     bounce(mtv, shape, 1 + leftFlipperAngle);
                     return true;
                  }
               }
               else if (shape === actuatorPlatformShape) {
                  bounce(mtv, shape, 0.2);
                  return true;
               }
               else {
                  bounce(mtv, shape, 0.96);
                  return true;
               }
            }
         }
      }

      flipperCollisionDetected = false;
      
      detectFlipperCollision(LEFT_FLIPPER);
      detectFlipperCollision(RIGHT_FLIPPER);

      return flipperCollisionDetected;
   }
   return false;
}

function detectFlipperCollision(flipper) {
   var v1, v2, l1, l2, surface, ip, bbox = {}, riseTimer;

   bbox.top  = 725;
   bbox.bottom = 850;

   if (flipper === LEFT_FLIPPER) {
      v1 = new Vector(leftFlipperBaselineShape.points[0].rotate(
                       LEFT_FLIPPER_ROTATION_POINT,
                       leftFlipperAngle));

      v2 = new Vector(leftFlipperBaselineShape.points[1].rotate(
                       LEFT_FLIPPER_ROTATION_POINT,
                       leftFlipperAngle));

      bbox.left = 170;
      bbox.right = 265;
      riseTimer = leftFlipperRiseTimer;
   }
   else if (flipper === RIGHT_FLIPPER) {
      v1 = new Vector(rightFlipperBaselineShape.points[0].rotate(
                       RIGHT_FLIPPER_ROTATION_POINT,
                       rightFlipperAngle));

      v2 = new Vector(rightFlipperBaselineShape.points[1].rotate(
                       RIGHT_FLIPPER_ROTATION_POINT,
                       rightFlipperAngle));

      bbox.left = 245;
      bbox.right = 400;
      riseTimer = rightFlipperRiseTimer;
   }

   if ( ! flipperCollisionDetected && riseTimer.isRunning() &&
        ballSprite.top + ballSprite.height > bbox.top && ballSprite.left < bbox.right) {

      surface = v2.subtract(v1);
      l1 = new Line(new Point(ballSprite.left, ballSprite.top), lastBallPosition),
      l2 = new Line(new Point(v2.x, v2.y), new Point(v1.x, v1.y)),
      ip = l1.intersectionPoint(l2);

      if (ip.x > bbox.left && ip.x < bbox.right) {
         reflectVelocityAroundVector(surface.perpendicular());

         ballSprite.velocityX = ballSprite.velocityX * 3.5;
         ballSprite.velocityY = ballSprite.velocityY * 3.5;

         if (ballSprite.velocityY > 0)
            ballSprite.velocityY = -ballSprite.velocityY;

         if (flipper === LEFT_FLIPPER && ballSprite.velocityX < 0)
            ballSprite.velocityX = -ballSprite.velocityX;

         else if (flipper === RIGHT_FLIPPER && ballSprite.velocityX > 0)
            ballSprite.velocityX = -ballSprite.velocityX;
      }
   }
}

function reflectVelocityAroundVector(v) {
   var velocityVector = new Vector(new Point(ballSprite.velocityX, ballSprite.velocityY)),
       velocityUnitVector = velocityVector.normalize(),
       velocityVectorMagnitude = velocityVector.getMagnitude(),
       point = velocityUnitVector.reflect(v);

   ballSprite.velocityX = point.x * velocityVectorMagnitude;
   ballSprite.velocityY = point.y * velocityVectorMagnitude;
}

// Game Loop..................................................

function showTryAgainImage() {
   game.context.save();
   game.context.arc(TRY_AGAIN_X, TRY_AGAIN_Y, TRY_AGAIN_RADIUS,
                    0, Math.PI*2, false);

   game.context.clip();

   game.context.drawImage(game.getImage('images/tryAgain.png'), 0,
                          game.context.canvas.height-200);
   game.context.restore();
};

function drawExtraBall(index) {
   game.context.drawImage(game.getImage('images/ball.png'),
      EXTRA_BALLS_RIGHT - EXTRA_BALL_WIDTH*index,
                          EXTRA_BALLS_BOTTOM);
};

function over() {
   var highScore;
   highScores = game.getHighScores();
   
   if (highScores.length == 0 || score > highScores[0].score) {
      showingHighScores = true;
      actuatorSprite.visible = false;
      ballSprite.visible = false;
      showHighScores();
   }
   else {
     gameOverToast.style.display = 'inline';
   }
   
   gameOver = true;
   lastScore = score;
   score = 0;
};

var FIVE_HUNDRED_BUMPER_LEFT = 216,
    FIVE_HUNDRED_BUMPER_RIGHT = 147,
    ONE_HUNDRED_BUMPER_LEFT = 77,
    ONE_HUNDRED_BUMPER_RIGHT = 288;

function drawLitBumper() {
   if (bumperLit === fiveHundredBumper) {
      game.context.drawImage(game.getImage('images/fiveHundredBumperBright.png'),
                             FIVE_HUNDRED_BUMPER_LEFT,
                             FIVE_HUNDRED_BUMPER_RIGHT);
   }
   else if (bumperLit === oneHundredBumperLeft) {
      game.context.drawImage(game.getImage('images/oneHundredBumperBright.png'),
                             ONE_HUNDRED_BUMPER_LEFT,
                             ONE_HUNDRED_BUMPER_RIGHT);
   }
   else if (bumperLit === oneHundredBumperRight) {
      game.context.drawImage(game.getImage('images/oneHundredBumperBright.png'),355,288);
   }
   else if (bumperLit === fiftyBumper) {
      game.context.drawImage(game.getImage('images/fiftyBumperBright.png'),215,434);
   }
   else if (bumperLit === oneXBumperLeft) {
      game.context.drawImage(game.getImage('images/oneXBumperLeftBright.png'),71,776);
   }
   else if (bumperLit === oneXBumperRight) {
      game.context.drawImage(game.getImage('images/oneXBumperRightBright.png'),305,775);
   }
   else if (bumperLit === twoXBumperLeft) {
      game.context.drawImage(game.getImage('images/twoXBumperLeftBright.png'), 93, 632);
   }
   else if (bumperLit === twoXBumperRight) {
      game.context.drawImage(game.getImage('images/twoXBumperRightBright.png'),333,631);
   }
   else if (bumperLit === fiveXBumperLeft) {
      game.context.drawImage(game.getImage('images/fiveXBumperLeftBright.png'),95,450);
   }
   else if (bumperLit === fiveXBumperRight) {
      game.context.drawImage(game.getImage('images/fiveXBumperRightBright.png'),350,450);
   }
}

game.startAnimate = function (time) {
   var collisionOccurred;

   if (loading || game.paused || launching)
      return;


   if (ballOutOfPlay) {
      ballOutOfPlay = false;
      prepareForLaunch();
      brieflyShowTryAgainImage(2000);
      livesLeft--;

      if (!gameOver && livesLeft === 0) {
         over();
      }
      return;
   }

   adjustRightFlipperCollisionPolygon();
   adjustLeftFlipperCollisionPolygon();

   collisionOccurred = detectCollisions();

   if (!collisionOccurred && applyGravityAndFriction) {
      applyFrictionAndGravity(parseFloat(time - game.lastTime)); // modifies ball velocity
   }
};

game.paintUnderSprites = function () {
   if (loading)
      return;
   
   updateLeftFlipper();
   updateRightFlipper();

   if (showPolygonsOnly) {
      drawCollisionShapes();
   }
   else {
      if (!showingHighScores) {
         game.context.drawImage(game.getImage('images/background.png'),0,0);

         drawLitBumper();

         if (showTryAgain) {
            showTryAgainImage();
         }

         paintLeftFlipper();
         paintRightFlipper();

         for (var i=0; i < livesLeft-1; ++i) {
            drawExtraBall(i);
         }
      }
   }
};


var fiveHundredBumper = new Circle(256, 187, 40);
var oneHundredBumperRight = new Circle(395, 328, 40);
var oneHundredBumperLeft = new Circle(116, 328, 40);
var fiftyBumper = new Circle(255, 474, 40);

//rightFlipperImage.src = 'images/rightFlipper.png';
//leftFlipperImage.src = 'images/leftFlipper.png';
//fiveHundredBumperBrightImage.src = 'images/fiveHundredBumper-bright.png';
//oneHundredBumperBrightImage.src = 'images/oneHundredBumper-bright.png';
//fiftyBumperBrightImage.src = 'images/fiftyBumper-bright.png';
//oneXBumperLeftBrightImage.src = 'images/oneXBumperLeft-bright.png';
//oneXBumperRightBrightImage.src = 'images/oneXBumperRight-bright.png';
//twoXBumperRightBrightImage.src = 'images/twoXBumperRight-bright.png';
//twoXBumperLeftBrightImage.src = 'images/twoXBumperLeft-bright.png';
//fiveXBumperRightBrightImage.src = 'images/fiveXBumperRight-bright.png';
//fiveXBumperLeftBrightImage.src = 'images/fiveXBumperLeft-bright.png';

var LEFT_FLIPPER_ROTATION_POINT = new Point(145, 775),
    RIGHT_FLIPPER_ROTATION_POINT = new Point(370, 775);

function adjustLeftFlipperCollisionPolygon() {
   if(leftFlipperRiseTimer.isRunning() || leftFlipperFallTimer.isRunning()) {
      for (var i=0; i < leftFlipperShape.points.length; ++i) {
         var rp = leftFlipperBaselineShape.points[i].rotate(
                              LEFT_FLIPPER_ROTATION_POINT,
                              leftFlipperAngle);

         leftFlipperShape.points[i].x = rp.x;
         leftFlipperShape.points[i].y = rp.y;
      }
   }
}

function adjustRightFlipperCollisionPolygon() {
   if(rightFlipperRiseTimer.isRunning() || rightFlipperFallTimer.isRunning()) {
      for (var i=0; i < rightFlipperShape.points.length; ++i) {
         var rp = rightFlipperBaselineShape.points[i].rotate(
                              RIGHT_FLIPPER_ROTATION_POINT,
                              -rightFlipperAngle);

         rightFlipperShape.points[i].x = rp.x;
         rightFlipperShape.points[i].y = rp.y;
       }
   }
}

function resetLeftFlipperCollisionPolygon() {
   for (var i=0; i < leftFlipperShape.points.length; ++i) {
      var point = leftFlipperBaselineShape.points[i];

      leftFlipperShape.points[i].x = leftFlipperBaselineShape.points[i].x;
      leftFlipperShape.points[i].y = leftFlipperBaselineShape.points[i].y;
  } 
}

function resetRightFlipperCollisionPolygon() {
   for (var i=0; i < rightFlipperShape.points.length; ++i) {
      var point = rightFlipperBaselineShape.points[i];

      rightFlipperShape.points[i].x = rightFlipperBaselineShape.points[i].x;
      rightFlipperShape.points[i].y = rightFlipperBaselineShape.points[i].y;
  } 
}

function updateLeftFlipper() {
   if (leftFlipperRiseTimer.isRunning()) {    // Flipper is rising
     if (leftFlipperRiseTimer.isOver()) {     // Finished rising
        leftFlipperRiseTimer.stop();          // Stop rise timer
        leftFlipperAngle = MAX_FLIPPER_ANGLE; // Set flipper angle
        leftFlipperFallTimer.start();         // Start falling
     }
     else {                                   // Flipper is still rising
       leftFlipperAngle =
          MAX_FLIPPER_ANGLE/FLIPPER_RISE_DURATION *
          leftFlipperRiseTimer.getElapsedTime();
       }
   }
   else if (leftFlipperFallTimer.isRunning()) { // Left flipper is falling
     if (leftFlipperFallTimer.isOver()) {       // Finished falling
         leftFlipperFallTimer.stop();           // Stop fall timer
         leftFlipperAngle = 0;                  // Set flipper angle
         resetLeftFlipperCollisionPolygon();    // Reset collision polygon
     }
     else {                                     // Flipper is still falling
       leftFlipperAngle = MAX_FLIPPER_ANGLE -
          MAX_FLIPPER_ANGLE/FLIPPER_FALL_DURATION *
          leftFlipperFallTimer.getElapsedTime();
     }
   }
}
         
function paintLeftFlipper() {
   if (leftFlipperRiseTimer.isRunning() || leftFlipperFallTimer.isRunning()) {
      game.context.save();
      game.context.translate(LEFT_FLIPPER_PIVOT_X, LEFT_FLIPPER_PIVOT_Y);
      game.context.rotate(-leftFlipperAngle);
      game.context.drawImage(game.getImage('images/leftFlipper.png'),
                             -LEFT_FLIPPER_PIVOT_OFFSET_X,
                             -LEFT_FLIPPER_PIVOT_OFFSET_Y);
      game.context.restore();
   }
   else {
      game.context.drawImage(game.getImage('images/leftFlipper.png'),
            LEFT_FLIPPER_PIVOT_X - LEFT_FLIPPER_PIVOT_OFFSET_X,
            LEFT_FLIPPER_PIVOT_Y - LEFT_FLIPPER_PIVOT_OFFSET_Y);
   }
}
function paintRightFlipper() {
   if (rightFlipperRiseTimer.isRunning() || rightFlipperFallTimer.isRunning()) {
      game.context.save();
      game.context.translate(370,776);
      game.context.rotate(rightFlipperAngle);
      game.context.drawImage(game.getImage('images/rightFlipper.png'),-99,-29);
      game.context.restore();
   }
   else {
      game.context.drawImage(game.getImage('images/rightFlipper.png'),272,745);
   }
}

function updateRightFlipper() {
   if (rightFlipperRiseTimer.isRunning()) {
     if (rightFlipperRiseTimer.isOver()) {
        rightFlipperRiseTimer.stop();
        flipperCollisionDetected = false;  // reset

        rightFlipperFallTimer.start();
        rightFlipperAngle = MAX_FLIPPER_ANGLE;
     }
     else {
        rightFlipperAngle =
           MAX_FLIPPER_ANGLE/FLIPPER_RISE_DURATION *
           rightFlipperRiseTimer.getElapsedTime();
        }
     }
     else if (rightFlipperFallTimer.isRunning()) {
        rightFlipperAngle = MAX_FLIPPER_ANGLE -
           MAX_FLIPPER_ANGLE/FLIPPER_FALL_DURATION *
           rightFlipperFallTimer.getElapsedTime();

        if (rightFlipperFallTimer.isOver()) {
            rightFlipperFallTimer.stop();
            rightFlipperAngle = 0;
            resetRightFlipperCollisionPolygon();
        }
    }
}

function adjustActuatorPlatformShape() {
   var i, point;

   for (i=0; i < actuatorPlatformShape.points.length; ++i) {
      point = actuatorPlatformShape.points[i];
      if ( i < 2 || i === actuatorPlatformShape.points.length-1) 
         point.y = ACTUATOR_TOP + launchStep*10;
      else
         point.y = ACTUATOR_TOP + launchStep*10 + 10;
   }
}

// Key Listeners..............................................

lastKeyListenerTime = 0,  // For throttling arrow keys

game.addKeyListener(
   {
      key: 'k',
      listener: function () {
         if ( !launching && !gameOver) {
            rightFlipperRiseTimer.start();
            rightFlipperAngle = 0;
            game.playSound('flipper');
         }
      }
   }
);
                    
game.addKeyListener(
   {
      key: 'd',
      listener: function () {
         if ( !launching && !gameOver) {
            leftFlipperRiseTimer.start();
            leftFlipperAngle = 0;
            game.playSound('flipper');
         }
      }
   }
);
                    
game.addKeyListener(
   {
      key: 'p',
      listener: function () {
         togglePaused();
      }
   }
);

game.addKeyListener(
   {
      key: 'up arrow',
      listener: function () {
         var now;

         if (!launching || launchStep === 1)
            return;

         now = +new Date();
         if (now - lastKeyListenerTime > 80) { // throttle
            lastKeyListenerTime = now;
            launchStep--;
            actuatorSprite.painter.image = launchImages[launchStep-1]; 
            ballSprite.top = BALL_LAUNCH_TOP + (launchStep-1) * 9;
            adjustActuatorPlatformShape();
         }
      }
   }
);

game.addKeyListener(
   {
      key: 'down arrow',
      listener: function () {
         var now;

         if (!launching || launchStep === LAUNCH_STEPS)
            return;

         now = +new Date();
         if (now - lastKeyListenerTime > 80) { // throttle
            lastKeyListenerTime = now;
            launchStep++;
            actuatorSprite.painter.image = launchImages[launchStep-1]; 
            ballSprite.top = BALL_LAUNCH_TOP + (launchStep-1) * 9;
            adjustActuatorPlatformShape();
         }
      }
   }
);

function adjustRightBoundaryAfterLostBall() {
   rightBoundary.points[1].x = 508;
}

function adjustRightBoundaryAfterLaunch() {
   rightBoundary.points[1].x = 460;
}

game.addKeyListener(
   {
      key: 'space',
      listener: function () {
         if (!launching && ballSprite.left === BALL_LAUNCH_LEFT &&
             ballSprite.velocityY === 0) {
            launching = true;
            ballSprite.velocityY = 0;
            applyGravityAndFriction = false;
            launchStep = 1;
         }
         if (launching) {
            ballSprite.velocityY = -300 * launchStep;
            launching = false;
            launchStep = 1;

            setTimeout( function (e) {
               actuatorSprite.painter.image = launchImages[0];
               adjustActuatorPlatformShape();
            }, 50);

            setTimeout( function (e) {
               applyGravityAndFriction = true;
               adjustRightBoundaryAfterLaunch();
            }, 2000);
         }
      }
   }
);

game.addKeyListener(
   {
      key: 'right arrow',
      listener: function () {
         var now = +new Date();
         if (now - lastKeyListenerTime > 200) { // throttle
            lastKeyListenerTime = now;
         }
      }
   }
);

game.addKeyListener(
   {
      key: 'left arrow',
      listener: function () {
         var now = +new Date();
         if (now - lastKeyListenerTime > 200) { // throttle
            lastKeyListenerTime = now;
         }
      }
   }
);

// Clear high scores checkbox.................................

clearHighScoresCheckbox.onclick = function (e) {
   if (clearHighScoresCheckbox.checked) {
      game.clearHighScores();
   }
};

// Load game..................................................

loading = true;
   var interval,
       percentComplete = 0;

   progressDiv.style.display = 'block';
   progressDiv.appendChild(progressbar.domElement);

// Start game.................................................

//progressDiv.style.display = 'none';
//loadingToast.style.display = 'none';   

ballSprite.top = BALL_LAUNCH_TOP;
ballSprite.left = BALL_LAUNCH_LEFT;
ballSprite.width = 33;
ballSprite.height = ballSprite.width;


leftBoundary.points.push(new Point(45, 235));
leftBoundary.points.push(new Point(45, game.context.canvas.height));
leftBoundary.points.push(new Point(-450, game.context.canvas.height));
leftBoundary.points.push(new Point(-450, 235));
leftBoundary.points.push(new Point(45, 235));

rightBoundary.points.push(new Point(508, 235));
rightBoundary.points.push(new Point(508, game.context.canvas.height));
rightBoundary.points.push(new Point(508*2, game.context.canvas.height));
rightBoundary.points.push(new Point(508*2, 235))
rightBoundary.points.push(new Point(508, 235));

actuatorPlatformShape.points.push(new Point(ACTUATOR_LEFT-5, ACTUATOR_TOP));
actuatorPlatformShape.points.push(new Point(ACTUATOR_LEFT-5 + ACTUATOR_PLATFORM_WIDTH,
                                            ACTUATOR_TOP));

actuatorPlatformShape.points.push(new Point(ACTUATOR_LEFT-5 + ACTUATOR_PLATFORM_WIDTH,
                                ACTUATOR_TOP + ACTUATOR_PLATFORM_HEIGHT));

actuatorPlatformShape.points.push(new Point(ACTUATOR_LEFT-5,
                                ACTUATOR_TOP + ACTUATOR_PLATFORM_HEIGHT));

actuatorPlatformShape.points.push(new Point(ACTUATOR_LEFT-5, ACTUATOR_TOP));

rightFlipperShape.points.push(new Point(365, 745));
rightFlipperShape.points.push(new Point(272, 836));
rightFlipperShape.points.push(new Point(293, 857));
rightFlipperShape.points.push(new Point(398, 781));
rightFlipperShape.points.push(new Point(365, 745));

leftFlipperShape.points.push(new Point(142, 743));
leftFlipperShape.points.push(new Point(239, 837));
leftFlipperShape.points.push(new Point(218, 855));
leftFlipperShape.points.push(new Point(116, 783));
leftFlipperShape.points.push(new Point(142, 743));

rightFlipperBaselineShape.points.push(new Point(365, 745));
rightFlipperBaselineShape.points.push(new Point(272, 836));
rightFlipperBaselineShape.points.push(new Point(293, 857));
rightFlipperBaselineShape.points.push(new Point(398, 781));
rightFlipperBaselineShape.points.push(new Point(365, 745));

leftFlipperBaselineShape.points.push(new Point(142, 743));
leftFlipperBaselineShape.points.push(new Point(239, 837));
leftFlipperBaselineShape.points.push(new Point(218, 855));
leftFlipperBaselineShape.points.push(new Point(116, 783));
leftFlipperBaselineShape.points.push(new Point(142, 743));

lowerRightBarLeft.points.push(new Point(294,525));
lowerRightBarLeft.points.push(new Point(306,525));
lowerRightBarLeft.points.push(new Point(306,590));
lowerRightBarLeft.points.push(new Point(294,590));
lowerRightBarLeft.points.push(new Point(294,525));

lowerRightBarRight.points.push(new Point(342,525));
lowerRightBarRight.points.push(new Point(354,525));
lowerRightBarRight.points.push(new Point(354,590));
lowerRightBarRight.points.push(new Point(342,590));
lowerRightBarRight.points.push(new Point(342,525));

lowerLeftBarLeft.points.push(new Point(156,525));
lowerLeftBarLeft.points.push(new Point(168,525));
lowerLeftBarLeft.points.push(new Point(168,590));
lowerLeftBarLeft.points.push(new Point(156,590));
lowerLeftBarLeft.points.push(new Point(156,525));

lowerLeftBarRight.points.push(new Point(204,525));
lowerLeftBarRight.points.push(new Point(216,525));
lowerLeftBarRight.points.push(new Point(216,590));
lowerLeftBarRight.points.push(new Point(204,590));
lowerLeftBarRight.points.push(new Point(204,525));

upperLeftBarLeft.points.push(new Point(86,185));
upperLeftBarLeft.points.push(new Point(86,263));
upperLeftBarLeft.points.push(new Point(98,263));
upperLeftBarLeft.points.push(new Point(98,185));
upperLeftBarLeft.points.push(new Point(86,185));

upperLeftBarRight.points.push(new Point(134,185));
upperLeftBarRight.points.push(new Point(136,263));
upperLeftBarRight.points.push(new Point(146,263));
upperLeftBarRight.points.push(new Point(146,185));
upperLeftBarRight.points.push(new Point(134,185));

upperRightBarLeft.points.push(new Point(368,185));
upperRightBarLeft.points.push(new Point(368,263));
upperRightBarLeft.points.push(new Point(380,263));
upperRightBarLeft.points.push(new Point(380,185));
upperRightBarLeft.points.push(new Point(368,185));

upperRightBarRight.points.push(new Point(417,185));
upperRightBarRight.points.push(new Point(417,263));
upperRightBarRight.points.push(new Point(427,263));
upperRightBarRight.points.push(new Point(427,185));
upperRightBarRight.points.push(new Point(417,185));

oneXBumperLeft.points.push(new Point(80,780));
oneXBumperLeft.points.push(new Point(215,875));
oneXBumperLeft.points.push(new Point(80,875));
oneXBumperLeft.points.push(new Point(80,780));

oneXBumperRight.points.push(new Point(300,875));
oneXBumperRight.points.push(new Point(435,775));
oneXBumperRight.points.push(new Point(435,875));
oneXBumperRight.points.push(new Point(300,875));

twoXBumperLeft.points.push(new Point(98,635));
twoXBumperLeft.points.push(new Point(180,715));
twoXBumperLeft.points.push(new Point(98,715));
twoXBumperLeft.points.push(new Point(98,635));

twoXBumperRight.points.push(new Point(420,630));
twoXBumperRight.points.push(new Point(420,715));
twoXBumperRight.points.push(new Point(330,715));
twoXBumperRight.points.push(new Point(420,630));

fiveXBumperLeft.points.push(new Point(98,450));
fiveXBumperLeft.points.push(new Point(163,450));
fiveXBumperLeft.points.push(new Point(98,505));
fiveXBumperLeft.points.push(new Point(98,450));

fiveXBumperRight.points.push(new Point(350,450));
fiveXBumperRight.points.push(new Point(415,450));
fiveXBumperRight.points.push(new Point(415,505));
fiveXBumperRight.points.push(new Point(350,450));

shapes.push(ballShape);
shapes.push(leftBoundary);
shapes.push(rightBoundary);

shapes.push(fiveHundredBumper);
shapes.push(oneHundredBumperLeft);
shapes.push(oneHundredBumperRight);
shapes.push(fiftyBumper);
shapes.push(fiveXBumperLeft);
shapes.push(fiveXBumperRight);
shapes.push(twoXBumperLeft);
shapes.push(twoXBumperRight);
shapes.push(upperLeftBarLeft);
shapes.push(upperLeftBarRight);
shapes.push(upperRightBarLeft);
shapes.push(upperRightBarRight);
//shapes.push(oneXBumperLeft);
//shapes.push(oneXBumperRight);
shapes.push(lowerLeftBarLeft);
shapes.push(lowerLeftBarRight);
shapes.push(lowerRightBarLeft);
shapes.push(lowerRightBarRight);

shapes.push(rightFlipperShape);
shapes.push(leftFlipperShape);

shapes.push(actuatorPlatformShape);

ballSprite.velocityX = 0;
ballSprite.velocityY = 0;
ballSprite.visible = false;

actuatorSprite.velocityX = 0;
actuatorSprite.velocityY = 0;
actuatorSprite.width = 60;
actuatorSprite.height = 100;
actuatorSprite.visible = true;

game.addSprite(actuatorSprite);
game.addSprite(ballSprite);

function windowToCanvas(e) {
   var x = e.x || e.clientX,
       y = e.y || e.clientY,
       bbox = game.context.canvas.getBoundingClientRect();

   return { x: x - bbox.left * (game.context.canvas.width  / bbox.width),
            y: y - bbox.top  * (game.context.canvas.height / bbox.height)
          };
}

function drawHorizontalLine (y) {
   game.context.moveTo(0,y+0.5);
   game.context.lineTo(game.context.canvas.width,y+0.5);
   game.context.stroke();
}

function drawVerticalLine (x) {
   game.context.moveTo(x+0.5,0);
   game.context.lineTo(x+0.5,game.context.canvas.height);
   game.context.stroke();
}

showPolygonsOnlyCheckbox.onclick = function (e) {
   showPolygonsOnly = showPolygonsOnlyCheckbox.checked;
   if (showPolygonsOnly) {
      ballSprite.visible = false;
      actuatorSprite.visible = false;
   }
   else {
      ballSprite.visible = true;
      actuatorSprite.visible = true;
   }
};

actuatorSprite.top = ACTUATOR_TOP,
actuatorSprite.left = ACTUATOR_LEFT,
actuatorSprite.visible = false;

function createDomePolygons(centerX, centerY, radius, sides) {
   var polygon,
       polygons = [],
       startTheta = 0,
       endTheta,
       midPointTheta,
       thetaDelta = Math.PI/sides,
       midPointRadius = radius*1.5;

   for (var i=0; i < sides; ++i) {
      polygon = new Polygon();

      endTheta = startTheta + thetaDelta;
      midPointTheta = startTheta + (endTheta - startTheta)/2;
      
      polygon.points.push(
        new Point(centerX + radius * Math.cos(startTheta),
                  centerY - radius * Math.sin(startTheta)));

      polygon.points.push(
        new Point(centerX + midPointRadius * Math.cos(midPointTheta),
                  centerY - midPointRadius * Math.sin(midPointTheta)));

      polygon.points.push(
        new Point(centerX + radius * Math.cos(endTheta),
                  centerY - radius * Math.sin(endTheta)));

      polygon.points.push(
        new Point(centerX + radius * Math.cos(startTheta),
                  centerY - radius * Math.sin(startTheta)));

      polygons.push(polygon);
      
      startTheta += thetaDelta;
   }
   return polygons;
}

var DOME_SIDES = 15,
    DOME_X = 275,
    DOME_Y = 235,
    DOME_RADIUS = 232,
    domePolygons = createDomePolygons(DOME_X, DOME_Y, DOME_RADIUS, DOME_SIDES);

domePolygons.forEach( function (polygon) {
  shapes.push(polygon); 
});

if (showPolygonsOnly)
   actuatorSprite.visible = false;

rightFlipperShape.centroid = function () {
   return new Point(450, 930);
};

leftFlipperShape.centroid = function () {
   return new Point(60, 930);
};

showingHighScores = false;

game.queueImage('images/rightFlipper.png');
game.queueImage('images/leftFlipper.png');
game.queueImage('images/ball.png');
game.queueImage('images/tryAgain.png');

game.queueImage('images/fiftyBumperBright.png');
game.queueImage('images/oneHundredBumperBright.png');
game.queueImage('images/fiveHundredBumperBright.png');

game.queueImage('images/oneXBumperLeftBright.png');
game.queueImage('images/oneXBumperRightBright.png');

game.queueImage('images/twoXBumperRightBright.png');
game.queueImage('images/twoXBumperLeftBright.png');

game.queueImage('images/fiveXBumperRightBright.png');
game.queueImage('images/fiveXBumperLeftBright.png');
game.queueImage('images/tryAgain.png');
game.queueImage('images/background.png');

for (var i=0; i < LAUNCH_STEPS; ++i) {
   game.queueImage('images/actuator-' + i + '.png');
}


var interval = setInterval( function (e) {
   var percentComplete = game.loadImages();

   progressbar.draw(percentComplete);

   if (percentComplete >= 100) {
      clearInterval(interval);

      progressDiv.style.display = 'none';
      loadingToast.style.display = 'none';   

      showPolygonsOnlyToast.style.display = 'block';
      showPolygonsOnlyToast.style.left = '290px';
      scoreToast.style.display = 'inline';

      launching = true;
      loading = false;

      score = 0;
      scoreToast.innerText = '0'; // won't get set till later, otherwise

      ballSprite.visible = true;
      actuatorSprite.visible = true;
      //game.playSound('pinball');

      for (var i=0; i < LAUNCH_STEPS; ++i) {
         launchImages[i] = new Image();
         launchImages[i].src = 'images/actuator-' + i + '.png';
      }
      game.start();
   }
}, 16);
