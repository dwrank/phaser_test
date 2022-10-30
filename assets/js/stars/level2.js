import level1 from './level1';

(function (window, document) {
  "use strict";

  var level2 = JSON.parse(JSON.stringify((level1)));
  level2.stars.group.repeat = 11;
  level2.stars.red = 12;

  module.exports = level2;
}.call(this, window, document));
