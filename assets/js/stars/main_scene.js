import level1 from './level1';
import level2 from './level2';

export default class MainScene extends Phaser.Scene {
  physics;
  player;
  door;
  stars;
  bombs;
  platforms;
  cursors;
  score;
  gameOver = true;
  startText;
  scoreText;
  gameOverText;
  //redStar;
  //redStarCollider;
  level = level1;

  constructor() {
    super({
      key: 'MainScene'
    })
  }

  preload()
  {
    this.level.images.forEach(image => {
      this.load.image(image.key, image.url);
    });

    this.load.spritesheet(this.level.player.key,
      this.level.player.url,
      { frameWidth: this.level.player.frameWidth, frameHeight: this.level.player.frameHeight }
    );
  }

  create()
  {
    var startText = "";
    this.score = 0;

    if (this.gameOver) {
      startText = 'Press Space Bar to Start';
      this.physics.pause();
    }
    else {
      this.physics.resume();
    }

    // Background
    this.add.image(this.level.background.x, this.level.background.y, this.level.background.key);

    // Platforms and Ground
    this.platforms = this.physics.add.staticGroup();

    this.level.platforms.forEach(platform => {
      if (platform.hasOwnProperty("scale")) {
        this.platforms.create(platform.x, platform.y, platform.key).setScale(platform.scale).refreshBody();
      }
      else {
        this.platforms.create(platform.x, platform.y, platform.key);
      }
    });

    // Door
    this.door = this.physics.add.sprite(this.level.door.x, this.level.door.y, this.level.door.key);
    this.door.setImmovable(true);
    this.door.body.setAllowGravity(false);
    this.door.setScale(this.level.door.scale);

    // Player
    this.player = this.physics.add.sprite(this.level.player.x, this.level.player.y, this.level.player.key, this.level.player.frameStart);
    this.player.setBodySize(this.player.width * this.level.player.bodySize.scaleWidth,
                       this.player.height * this.level.player.bodySize.scaleHeight, true);

    this.player.setBounce(this.level.player.bounce);
    this.player.setCollideWorldBounds(true);

    // Player Animations
    this.level.player.anims.forEach(anim => {
      var a = { key: anim.key, frameRate: anim.frameRate };

      if (anim.frames.hasOwnProperty("frame")) {
        a.frames = [ { key: this.level.player.key, frame: anim.frames.frame } ];
      }
      else if (anim.frames.hasOwnProperty("start") && anim.frames.hasOwnProperty("end")) {
        a.frames = this.anims.generateFrameNumbers(this.level.player.key, { start: anim.frames.start, end: anim.frames.end });
      }

      if (anim.hasOwnProperty("repeat")) {
        a.repeat = anim.repeat;
      }

      this.anims.create(a);
    });

    // Keyboard Controls
    this.cursors = this.input.keyboard.createCursorKeys();

    // Bombs
    this.bombs = this.physics.add.group(this.level.bombs.group);

    var id = 1;
    this.bombs.getChildren().forEach((child) => {
      child.id = id++;
      child.setBounce(this.level.bombs.bounce);
      child.setCollideWorldBounds(true);
      child.disableBody(true, false);
      child.setCircle(child.width*this.level.bombs.scaleCircle/2);
    });

    // Stars
    this.stars = this.physics.add.group(this.level.stars.group);

    id = 1;
    this.stars.getChildren().forEach((child) => {
      /*if (id == this.level.stars.red) {
        child.setTint(0xff0000);
        this.redStar = child;
        // don't allow the player to move it
        this.redStar.setPushable(false);
      }*/
      child.id = id++;
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // Score and Game Over Text
    this.startText = this.add.text(144, 308, startText, { fontSize: '32px', fill: '#000' });
    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    this.gameOverText = this.add.text(224, 236, '', { fontSize: '64px', fill: '#000' });

    // Collisions
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);
    //this.redStarCollider = this.physics.add.collider(this.player, this.redStar);

    this.physics.add.overlap(this.player, this.door, this.enterDoor, null, this);
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
    this.physics.add.overlap(this.player, this.bombs, this.hitBomb, null, this);
  }

  updateScore(pts)
  {
    this.score = pts;
    this.scoreText.setText('Score: ' + this.score);
  }

  update()
  {
    if (this.gameOver) {
      if (this.cursors.space.isDown) {
        this.gameOver = false;
        this.scene.restart();
      }
      return;
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    }
    else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if ((this.cursors.up.isDown || this.cursors.space.isDown) && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

  enterDoor(player, door)
  {
    var active = this.stars.countActive(true);
    if (active == 0) {
      this.physics.pause();
      player.anims.play('turn');
      this.gameOver = true;
      this.gameOverText.setText('YOU WIN!');
      this.startText.setText('Press Space Bar to Continue');
      this.level = level2;
    } 
  }

  collectStar(player, star)
  {
    var active = this.stars.countActive(true);
    /*if (star.id == this.level.stars.red && active > 1) {
      return;
    }*/

    star.disableBody(true, true);

    this.updateScore(this.score + 10);

    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    var bomb = this.bombs.getChildren()[this.score/10-1];
    bomb.enableBody(true, x, bomb.y, true, true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    
    /*if (active === 1) {
      this.physics.pause();
      player.anims.play('turn');
      this.gameOver = true;
      this.gameOverText.setText('YOU WIN!');
      this.startText.setText('Press Space Bar to Continue');
      this.level = level2;
    } 
    else if (active <= 2) {
      // allow the player to get it last
      this.physics.world.removeCollider(this.redStarCollider);
    }*/
  }

  hitBomb(player, bomb)
  {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    this.gameOver = true;
    this.gameOverText.setText('YOU LOSE!');
    this.startText.setText('Press Space Bar to Try Again');
  }
}
