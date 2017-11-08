var Splash = function () {};

Splash.prototype = {

  loadScripts: function () {
    game.load.script('mainmenu',  'states/MainMenu.js');
    game.load.script('game',      'states/Game.js');
    game.load.script('style',     'lib/style.js');
    game.load.script('mixins',    'lib/mixins.js');
    game.load.script('WebFont',   'lib/webfontloader.js');
  },

  loadBgm: function () {
    //example of how to load music
    //game.load.audio('dangerous', 'assets/bgm/Dangerous.mp3');
  },

  loadImages: function () {
    game.load.image('bgImageTitle', "img/ecoSphereGameTitleBackground.png");
    game.load.image('bgImage', "img/ecoSphereGameBackground.png");
    game.load.image('playImage', "img/play.png");
    game.load.image('creditsImage', "img/credits.png");
  },
  
  loadFonts: function () {
    //How to add a font
    //WebFontConfig = {
    //  custom: {
    //    families: ['TheMinion'],
    //    urls: ['assets/style/theminion.css']
    //  }
    //}
  },

  init: function () {
    this.loadingBar = game.make.sprite(game.world.centerX-(387/2), 400, "loading");
    this.status     = game.make.text(game.world.centerX, 380, 'Loading...', {fill: 'white'});
    utils.centerGameObjects([this.status]);
  },

  preload: function () {
    //how to make a logo
    //game.add.existing(this.logo).scale.setTo(0.5);
    game.add.existing(this.loadingBar);
    game.add.existing(this.status);
    this.load.setPreloadSprite(this.loadingBar);

    this.loadScripts();
    this.loadImages();
    this.loadFonts();
    this.loadBgm();



  },

  addGameStates: function () {
    game.state.add("GameMenu",  GameMenu);
    game.state.add("Game",      Game);
  },

  
  addGameMusic: function () {
    //How to add music
    //music = game.add.audio('dangerous');
    //music.loop = true;
    //music.play();
  },
  

  create: function() {
    this.status.setText('Ready!');
    this.addGameStates();
    this.addGameMusic();

    setTimeout(function () {
      game.state.start("GameMenu");
    }, 1000);
  }
};