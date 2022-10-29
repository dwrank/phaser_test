
var config = {
  parent: 'game-container',
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var physics;
var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = true;
var startText;
var scoreText;
var gameOverText;

var game = new Phaser.Game(config);

import level1 from './level1';
var level = level1

function preload ()
{
  level.images.forEach(image => {
    this.load.image(image.key, image.url);
  });

  this.load.spritesheet(level.player.key,
    level.player.url,
    { frameWidth: level.player.frameWidth, frameHeight: level.player.frameHeight }
  );
}

function create ()
{
  physics = this.physics;
  physics.pause();

  // Background
  this.add.image(level.background.x, level.background.y, level.background.key);

  // Platforms and Ground
  platforms = this.physics.add.staticGroup();

  level.platforms.forEach(platform => {
    if (platform.hasOwnProperty("scale")) {
      platforms.create(platform.x, platform.y, platform.key).setScale(platform.scale).refreshBody();
    }
    else {
      platforms.create(platform.x, platform.y, platform.key);
    }
  });

  // Player
  player = this.physics.add.sprite(level.player.x, level.player.y, level.player.key, level.player.frameStart);
  player.setBodySize(player.width * level.player.bodySize.scaleWidth,
                     player.height * level.player.bodySize.scaleHeight, true);

  player.setBounce(level.player.bounce);
  player.setCollideWorldBounds(true);

  // Player Animations
  level.player.anims.forEach(anim => {
    var a = { key: anim.key, frameRate: anim.frameRate };

    if (anim.frames.hasOwnProperty("frame")) {
      a.frames = [ { key: level.player.key, frame: anim.frames.frame } ];
    }
    else if (anim.frames.hasOwnProperty("start") && anim.frames.hasOwnProperty("end")) {
      a.frames = this.anims.generateFrameNumbers(level.player.key, { start: anim.frames.start, end: anim.frames.end });
    }

    if (anim.hasOwnProperty("repeat")) {
      a.repeat = anim.repeat;
    }

    this.anims.create(a);
  });

  // Keyboard Controls
  cursors = this.input.keyboard.createCursorKeys();

  // Stars
  stars = this.physics.add.group(level.stars.group);

  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  // Bombs
  bombs = this.physics.add.group(level.bombs.group);

  bombs.children.iterate(function (child) {
    child.setBounce(level.bombs.bounce);
    child.setCollideWorldBounds(true);
    child.disableBody(true, false);
    child.setCircle(child.width*level.bombs.scaleCircle/2);
  });

  // Score and Game Over Text
  startText = this.add.text(144, 308, 'Press Space Bar to Start', { fontSize: '32px', fill: '#000' });
  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
  gameOverText = this.add.text(224, 236, '', { fontSize: '64px', fill: '#000' });

  // Collisions
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);
  this.physics.add.collider(bombs, platforms);

  this.physics.add.overlap(player, stars, collectStar, null, this);
  this.physics.add.overlap(player, bombs, hitBomb, null, this);
}

function reset()
{
  updateScore(0);
  startText.setText('');
  gameOverText.setText('');

  player.setTint(0xffffff);
  player.setPosition(level.player.x, level.player.y);

  stars.children.iterate(function (child) {
    child.enableBody(true, child.x, 0, true, true);
  });

  var x = 12, y = 0;
  bombs.children.iterate(function (child) {
    child.setPosition(x, y);
    child.disableBody(true, false);
    x += 70;
  });

  physics.resume();
}

function updateScore(pts)
{
  score = pts;
  scoreText.setText('Score: ' + score);
}

function update()
{
  if (gameOver) {
    if (cursors.space.isDown) {
      gameOver = false;
      reset();
    }
    return;
  }

  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('left', true);
  }
  else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('right', true);
  }
  else {
    player.setVelocityX(0);
    player.anims.play('turn');
  }

  if ((cursors.up.isDown || cursors.space.isDown) && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}

function collectStar(player, star)
{
  star.disableBody(true, true);

  updateScore(score + 10);

  var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
  var bomb = bombs.getChildren()[score/10-1];
  bomb.enableBody(true, x, bomb.y, true, true);
  bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
  
  if (stars.countActive(true) === 0){
    this.physics.pause();
    player.anims.play('turn');
    gameOver = true;
    gameOverText.setText('YOU WIN!');
    startText.setText('Press Space Bar to Play Again');
  } 
}

function hitBomb(player, bomb)
{
  this.physics.pause();
  player.setTint(0xff0000);
  player.anims.play('turn');
  gameOver = true;
  gameOverText.setText('YOU LOSE!');
  startText.setText('Press Space Bar to Play Again');
}
