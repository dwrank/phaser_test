(function (window, document) {
  "use strict";

  var level1 = {
    images: [
      {
        key: "sky",
        url: "/images/sky.png"
      },
      {
        key: "ground",
        url: "/images/platform.png"
      },
      {
        key: "star",
        url: "/images/star.png"
      },
      {
        key: "bomb",
        url: "/images/bomb.png"
      }
    ],
    background: {
      key: "sky",
      x: 400,
      y: 300
    },
    platforms: [
      { 
        key: "ground",
        x: 400,
        y: 568,
        scale: 2
      },
      { 
        key: "ground",
        x: 600,
        y: 400
      },
      { 
        key: "ground",
        x: 50,
        y: 250
      },
      { 
        key: "ground",
        x: 750,
        y: 220
      }
    ],
    player: {
      key: "dude",
      url: "/images/dude.png",
      x: 100,
      y: 450,
      frameWidth: 32,
      frameHeight: 48,
      frameStart: 4,
      bodySize: {
        scaleWidth: 0.7,
        scaleHeight: 1.0
      },
      bounce: 0.2,
      anims: [
        {
          key: "left",
          frames: { start: 0, end: 3 },
          frameRate: 10,
          repeat: -1
        },
        {
          key: "turn",
          frames: { frame: 4 },
          frameRate: 20,
        },
        {
          key: "right",
          frames: { start: 5, end: 8 },
          frameRate: 10,
          repeat: -1
        },
      ]
    },
    stars: {
      group: {
        key: "star",
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
      }
    },
    bombs: {
      group: {
        key: 'bomb',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
      },
      bounce: 1,
      scaleCircle: 0.8
    }
  };

  module.exports = level1;
}.call(this, window, document));