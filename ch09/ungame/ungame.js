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

var game = new Game('ungame', 'gameCanvas'),

// Loading....................................................

loading = false,  // not yet, see the end of this file
loadingToast = document.getElementById('loadingToast'),
loadingMessage = document.getElementById('loadingMessage'),
loadingToastTitle = document.getElementById('loadingToastTitle'),
loadingToastBlurb = document.getElementById('loadingToastBlurb'),
loadButton = document.getElementById('loadButton'),
progressDiv = document.getElementById('progressDiv'),
progressbar = new COREHTML5.Progressbar(300, 25, 'rgba(0,0,0,0.5)', 100, 130, 250),
   
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

livesCanvas = document.getElementById('livesCanvas'),
livesContext = livesCanvas.getContext('2d'),
livesLeft = 3,
life = 100,

// Paused.....................................................

pausedToast = document.getElementById('pausedToast'),

// Game Over..................................................

gameOverToast = document.getElementById('gameOverToast'),
gameOver = false,

// Sun Constants..............................................

SUN_TOP = 110,
SUN_LEFT = 450,
SUN_RADIUS = 80,

// Key Listeners..............................................

lastKeyListenerTime = 0,  // For throttling arrow keys, see below

// Lose life..................................................

loseLifeToast = document.getElementById('loseLifeToast'),
loseLifeButton = document.getElementById('loseLifeButton'),
   
// Scrolling the background...................................

translateDelta = 0.025,
translateOffset = 0,

scrollBackground = function () {
   translateOffset =
      (translateOffset + translateDelta) % game.context.canvas.width;
   game.context.translate(-translateOffset,0);  
},

// Paint Methods..............................................

paintSun = function (context) {
   context.save();

   context.strokeStyle = 'orange';
   context.fillStyle = 'yellow';
   context.strokeStyle = 'orange';
   context.lineWidth = 1;

   context.beginPath();
   context.arc(SUN_LEFT, SUN_TOP, SUN_RADIUS, 0, Math.PI*2, true);
   context.fill();
   context.stroke();

   context.stroke();
   context.restore();
},

paintFarCloud = function (context, x, y) {
   context.save();
   scrollBackground();
   context.lineWidth=0.5;
   context.strokeStyle='rgba(100, 140, 230, 0, 0.8)';
   context.fillStyle='rgba(255,255,255,0.4)';
   context.beginPath();

   context.moveTo(x+102, y+91);
   context.quadraticCurveTo(x+180, y+110, x+250, y+90);
   context.quadraticCurveTo(x+312, y+87, x+279, y+60);
   context.quadraticCurveTo(x+321, y+20, x+265, y+20);
   context.quadraticCurveTo(x+219, y+4, x+171, y+23);
   context.quadraticCurveTo(x+137, y+5, x+104, y+18);
   context.quadraticCurveTo(x+57, y+23, x+79, y+48);
   context.quadraticCurveTo(x+57, y+74, x+104, y+92);
   context.closePath();
   context.stroke();
   context.fill();
   context.restore();
},

paintNearCloud = function (context, x, y) {
   context.save();
   scrollBackground();
   scrollBackground();
   context.lineWidth=0.5;
   context.strokeStyle='rgba(100, 140, 230, 0, 0.8)';
   context.fillStyle='rgba(255,255,255,0.4)';
   context.beginPath();

   context.fillStyle='rgba(255,255,255,0.7)';

   context.moveTo(x+364, y+37);
   context.quadraticCurveTo(x+426, y+28, x+418, y+72);
   context.quadraticCurveTo(x+450, y+123, x+388, y+114);
   context.quadraticCurveTo(x+357, y+144, x+303,y+ 115);
   context.quadraticCurveTo(x+251, y+118, x+278, y+83);
   context.quadraticCurveTo(x+254, y+46, x+320, y+46);
   context.quadraticCurveTo(x+326, y+12, x+362, y+37);
   context.closePath();
   context.stroke();
   context.fill();
   context.restore();
},

// Game over..................................................

over = function () {
   var highScore;
   highScores = game.getHighScores();

   if (highScores.length == 0 || score > highScores[0].score) {
      showHighScores();
   }
   else {
     gameOverToast.style.display = 'inline';
   }

   gameOver = true;
   lastScore = score;
   score = 0;
};

   
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
   if (!loading && !gameOver && !game.paused) {
      togglePaused();
      pausedToast.style.display = game.paused ? 'inline' : 'none';
   }
};

window.onfocus = function windowOnFocus() {
   if (game.paused) {
      togglePaused();
      pausedToast.style.display = game.paused ? 'inline' : 'none';
   }
};


// New game ..................................................

newGameButton.onclick = function (e) {
   gameOverToast.style.display = 'none';
   loseLifeToast.style.display = 'inline';
   startNewGame();
};

function startNewGame() {
   highScoreParagraph.style.display = 'none';
   gameOver = false;
   livesLeft = 3;
   score = 0;
   loseLifeButton.focus();
};

// High Scores................................................

// Change game display to show high scores when
// player bests the high score.
   
showHighScores = function () {
   highScoreParagraph.style.display = 'inline';
   highScoreParagraph.innerHTML = score;
   highScoreToast.style.display = 'inline';
   updateHighScoreList();
   nameInput.focus();
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
         el.innerHTML = highScore.score +
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
   loseLifeToast.style.display = 'inline';
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

// Score Display..............................................

updateScore = function () {
   if ( !loading && game.lastScoreUpdate !== undefined) {
      if (game.gameTime - game.lastScoreUpdate > 1000) {
         scoreToast.style.display = 'inline';
         score += 10;
         scoreToast.innerHTML = score.toFixed(0);
         game.lastScoreUpdate = game.gameTime;
      }
   }
   else {
      game.lastScoreUpdate = game.gameTime;
   }
};

// Lives Display..............................................

updateLivesDisplay = function () {
   var x, y, RADIUS = 10;
      
   livesContext.clearRect(0,0,livesCanvas.width,livesCanvas.height);

   for (var i=0; i < livesLeft; ++i) {
      x = 20 + i*25;
      y = 20;
         
      livesContext.beginPath();
      livesContext.arc(x, y, RADIUS, 0, Math.PI*2, false);
      livesContext.fill();
      livesContext.strokeText(parseInt(i+1), x-RADIUS/3, y+RADIUS/3);
      livesContext.stroke();
   }
};

// Game Paint Methods.........................................
   
game.paintOverSprites = function () {
   paintNearCloud(game.context, 120, 20);
   paintNearCloud(game.context, game.context.canvas.width+120, 20);
}
   
game.paintUnderSprites = function () { // Draw things other than sprites
   if (!gameOver && livesLeft === 0) {
         over();
   }
   else {
      paintSun(game.context);
      paintFarCloud(game.context, 20, 20);
      paintFarCloud(game.context, game.context.canvas.width+20, 20);

      if (!gameOver) {
         updateScore();
      }
      updateLivesDisplay();
   }
};

// Key Listeners..............................................

game.addKeyListener(
   {
      key: 'p',
      listener: function () {
         game.togglePaused();
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

// Initialization.............................................

livesContext.strokeStyle = 'slateblue';
livesContext.fillStyle = 'yellow';

// End game button............................................

loseLifeButton.onclick = function (e) {
   livesLeft--;
   game.playSound('whoosh');

   if (livesLeft === 0) {
      loseLifeToast.style.display = 'none';      
   }
};

clearHighScoresCheckbox.onclick = function (e) {
   if (clearHighScoresCheckbox.checked) {
      game.clearHighScores();
   }
};

// Load game..................................................

loading = true;

loadButton.onclick = function (e) {
   var interval,
       loadingPercentComplete = 0;

   e.preventDefault();

   loadButton.style.display = 'none';

   loadingMessage.style.display = 'block';
   progressDiv.style.display = 'block';
  
   progressDiv.appendChild(progressbar.domElement);

   game.queueImage('images/image1.png');
   game.queueImage('images/image2.png');
   game.queueImage('images/image3.png');
   game.queueImage('images/image4.png');
   game.queueImage('images/image5.png');
   game.queueImage('images/image6.png');
   game.queueImage('images/image7.png');
   game.queueImage('images/image8.png');
   game.queueImage('images/image9.png');
   game.queueImage('images/image10.png');
   game.queueImage('images/image11.png');
   game.queueImage('images/image12.png');
   
   interval = setInterval( function (e) {
      loadingPercentComplete = game.loadImages();

      if (loadingPercentComplete === 100) {
         clearInterval(interval);

         setTimeout( function (e) {
            loadingMessage.style.display = 'none';
            progressDiv.style.display = 'none';

            setTimeout( function (e) {
               loadingToastBlurb.style.display = 'none';   
               loadingToastTitle.style.display = 'none';   

               setTimeout( function (e) {
                  loadingToast.style.display = 'none';   
                  loseLifeToast.style.display = 'block';   
                  game.playSound('pop');

                  setTimeout( function (e) {
                     loading = false;
                     score = 10;
                     scoreToast.innerText = '10'; // won't get set till later, otherwise
                     scoreToast.style.display = 'inline';
                     game.playSound('pop');
                     loseLifeButton.focus();
                  }, 1000);
               }, 500);
            }, 500);
         }, 500);
      }
      progressbar.draw(loadingPercentComplete);
   }, 16);
};

// Start game.................................................

game.start();
