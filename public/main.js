// Global Variables
var game = new Phaser.Game(900, 500, Phaser.AUTO, 'game'), 
    Main = function () {},
    gameOptions = {
      playSound: true,
      playMusic: true
    },
    musicPlayer;

Main.prototype = {

  preload: function () {
    game.load.image('loading',    'img/loading.png');
    //game.load.image('brand',    'assets/images/logo.png'); Make my own Logo
    game.load.script('polyfill',  'lib/polyfill.js');
    game.load.script('utils',     'lib/utils.js');
    game.load.script('splash',    'states/Splash.js');
    game.load.image('bgImageTitle', "img/ecoSphereGameTitleBackground.png");
  },

  create: function () {
    game.state.add('Splash', Splash);
    game.state.start('Splash');
  }

};

game.state.add('Main', Main);
game.state.start('Main');