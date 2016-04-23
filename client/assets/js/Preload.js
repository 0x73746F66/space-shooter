PhaserGame.Preload = function(){};
PhaserGame.Preload.prototype = {
  preload: function() {
    //show logo in loading screen
    this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    this.splash.anchor.setTo(0.5);
 
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
 
    this.load.setPreloadSprite(this.preloadBar);
 
    //load game assets
    this.load.json('game_data', 'game_data.json');
    this.load.image('clouds', '/assets/images/cloud-tile.png');
  },
  create: function() {
    this.state.start('MainMenu');
  }
};