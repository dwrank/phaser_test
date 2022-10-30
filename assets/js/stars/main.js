import MainScene from './main_scene'

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
  scene: [MainScene]
};

var game = new Phaser.Game(config);
