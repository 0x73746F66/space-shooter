PhaserGame.Boot = function(){};
//setting game configuration and loading the assets for the loading screen
PhaserGame.Boot.prototype = {
  preload: function() {
    //assets we'll use in the loading screen
    this.load.image('logo', 'assets/images/rocket.png');
  },
  create: function() {
    //loading screen will have a black background
    this.game.stage.backgroundColor = '#000000';
    //scaling options
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //have the game centered horizontally
    this.scale.pageAlignHorizontally = true;

    //screen size will be set automatically
    //this.scale.setGameSize();    //screen size will be set automatically

    //physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.state.start('Preload');
  }
};