PhaserGame.Preload = function(){};
PhaserGame.Preload.prototype = {
  preload: function() {
    //show logo in loading screen
    this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    this.splash.anchor.setTo(0.5);

    //load game assets
    this.load.json('game_data', 'game_data.json');
    this.load.physics('physics_data', 'physics.json');
    this.load.image('space', '/assets/images/space-tile.jpg');
    this.load.image('healthbar', '/assets/images/healthbar.png');
    this.load.image('fighter1', '/assets/images/fighter_1.png');
    //this.load.image('fighter2', '/assets/images/fighter_2.png');
    //this.load.image('fighter3', '/assets/images/fighter_3.png');
    this.load.image('enemy1', '/assets/images/enemy_1.png');
    this.load.image('enemy2', '/assets/images/enemy_2.png');
    //this.load.image('enemy3', '/assets/images/enemy_3.png');
    //this.load.image('enemy4', '/assets/images/enemy_4.png');
    //this.load.image('enemy5', '/assets/images/enemy_5.png');
    //this.load.image('boss1', '/assets/images/boss_1.png');
    //this.load.image('boss2', '/assets/images/boss_2.png');
    this.load.image('bullet1', '/assets/images/bullet_1.png');
    //this.load.image('bullet2', '/assets/images/bullet_2.png');
    this.load.image('missile1', '/assets/images/missile_1.png');
    //this.load.image('missile2', '/assets/images/missile_2.png');
    //this.load.image('missile3', '/assets/images/missile_3.png');
  },
  create: function() {
    var that = this;
    cahceCheck = setInterval(function(){
      if (PhaserGame.cacheReady === true) {
        clearInterval(cahceCheck);
        that.state.start('MainMenu');
      }
    }, 200);
  }
};