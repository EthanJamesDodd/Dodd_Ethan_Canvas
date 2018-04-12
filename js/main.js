(() => {
  //Stub
  console.log('game shit');

  //Variable Stack
  const theCanvas = document.querySelector('canvas'),
        ctx = theCanvas.getContext('2d'),
        playerImg = document.querySelector('.ship'),
        player = { x: 275, y: 550, width: 50, height: 50, speed: 8, lives: 3}
        bulletArray = [],
        squares = [
          {x: 30, y: 30, width: 30, height: 30, color: 'rgba(0, 200, 0, 0.8)', xspeed: 8, yspeed: 6},
          {x: 123, y: 30, width: 40, height: 40, color: 'rgba(200, 0, 0, 0.8)', xspeed: 6, yspeed: 12},
          {x: 251, y: 30, width: 35, height: 35, color: 'rgba(0, 0, 200, 0.8)', xspeed: 4, yspeed: 8}
        ],
        playButton = document.querySelector('.play'),
        pauseButton = document.querySelector('.pause');

  let  playState = true;

  function draw() {
    ctx.clearRect(0, 0, theCanvas.width, theCanvas.height)
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    bulletArray.forEach((bullet, index) => {
      ctx.fillStyle = 'rgba(200, 0, 0, 0.85)';
      ctx.fillRect(bullet.x, bullet.y, bullet.x2, bullet.y2);

      let bulletIndex = index;

      squares.forEach((square, index) => {
        //Check for collision of bullet and square
        if(bullet.y <= (square.y + square.height) && bullet.y > square.y && bullet.x > square.x&& bullet.x < (square.x + square.width)) {
          delete squares[index];
          delete bulletArray[bulletIndex];

          //Play explosion sound
          let explode = document.createElement('audio');
          explode.src = "audio/explosion.mp3";
          document.body.appendChild(explode);

          explode.addEventListener('ended', () =>{
            document.body.removeChild(explode);
          });

          explode.play();
        }
      });

      bullet.y -= bullet.speed;

      //Remove bullets that are off Canvas
      if(bullet.y < 0) {
        delete bulletArray[index];
      }
    })

    squares.forEach( square => {
      ctx.fillStyle = square.color
      ctx.fillRect(square.x, square.y, square.width, square.height);

      if(square.x + square.width > theCanvas.width) {
        square.xspeed *= -1;
      } else if (square.x < 0) {
        square.xspeed *= -1;
      }

      if(square.y + square.height > theCanvas.height){
        square.yspeed *= -1;
      } else if (square.y < 0) {
        square.yspeed *= -1;
      }

      square.x += square.xspeed;
      square.y += square.yspeed;
    })

    if(playState === false){
      window.cancelAnimationFrame(draw);
      return;
    }

    window.requestAnimationFrame(draw);
  }// End Draw

/*  function moveShip(e) {
    //Check the keycode of the key you're pressing
    switch(e.keyCode) {
      //Left arrow key
      case 37:
        console.log('move ship left');
        if(player.x > 0){
          player.x -= player.speed;
        }
        break;

      //Right arrow key
      case 39:
        console.log('move ship right');
        if(player.x + player.width < theCanvas.width){
          player.x += player.speed;
        }
        break;

        default:
        //Do nothing
    }
  }*/

  function createBullet() {
    //Create a bullet fro the ship, push it into bulletArray
    let newBullet = {
      x: player.x + player.width / 2 - 2.5,
      y: theCanvas.height - player.height - 10,
      x2: 5,
      y2: 5,
      speed: 8,
    };

    bulletArray.push(newBullet);

    let laser = document.createElement('audio');
    laser.src = "audio/laser.mp3";
    document.body.appendChild(laser);

    laser.addEventListener('ended', () => {
      document.body.removeChild(laser);
    });

    laser.play();
  }

  function movePlayer(e) {
    player.x = e.clientX - theCanvas.offsetLeft;
  }

  function playGame() {
    playState = true;
    window.requestAnimationFrame(draw);
  }

  function pauseGame() {
    playState = false;

  }

  window.requestAnimationFrame(draw);

  //window.addEventListener('keydown', moveShip);
  // move the player with the mouse instead
  theCanvas.addEventListener('mousemove', movePlayer);
  theCanvas.addEventListener('click', createBullet);
  playButton.addEventListener('click', playGame);
  pauseButton.addEventListener('click', pauseGame);
})();
