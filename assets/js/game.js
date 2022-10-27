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
var player_init_x = 100;
var player_init_y = 450;
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

function preload ()
{
  this.load.image('sky', '/images/sky.png');
  this.load.image('ground', '/images/platform.png');
  this.load.image('star', '/images/star.png');
  this.load.image('bomb', '/images/bomb.png');
  this.load.spritesheet('dude',
    '/images/dude.png',
    { frameWidth: 32, frameHeight: 48 }
  );
}

function create ()
{
  physics = this.physics;
  physics.pause();

  // Background
  this.add.image(400, 300, 'sky');

  // Platforms and Ground
  platforms = this.physics.add.staticGroup();

  platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  // Player
  player = this.physics.add.sprite(player_init_x, player_init_y, 'dude', 4);
  player.anims.play('turn');
  player.setBodySize(player.width * 0.7, player.height, true);

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [ { key: 'dude', frame: 4 } ],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  // Keyboard Controls
  cursors = this.input.keyboard.createCursorKeys();

  // Stars
  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  // Bombs
  bombs = this.physics.add.group({
    key: 'bomb',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  bombs.children.iterate(function (child) {
    child.setBounce(1);
    child.setCollideWorldBounds(true);
    child.disableBody(true, false);
    child.setCircle(child.width*0.8/2);
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
  player.setPosition(player_init_x, player_init_y);

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
