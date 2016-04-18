//loading the game assets
SideScroller.Preload = function(){};
SideScroller.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);
    this.load.setPreloadSprite(this.preloadBar);
    //load game assets
    this.load.json('game_data', 'game_data.json');
    this.load.image('toon', '/assets/images/toon.png');
  },
  create: function() {
    this.state.start('Game');
  }
};