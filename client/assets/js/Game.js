PhaserGame.Game = function(){};
PhaserGame.Game.prototype = {
  preload: function() {
    this.game.time.advancedTiming = true;
    this.gameOver = false;
    this.playerVisible = true;
  },
  create: function() {
    var playerId = this.cache.getJSON('game_data').player;

    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');
    this.background.autoScroll(-20, 0);

    //move player with cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.createPlayer(playerId);
    //stats
    var t1 = this.game.add.text(10, 20, "Points:", { font: "20px Arial", fill: "#ff0"});
    t1.fixedToCamera = true;
    this.pointsText = this.game.add.text(80, 18, "-", { font: "26px Arial", fill: "#00ff00"});
    this.pointsText.fixedToCamera = true;
  },
  createPlayer: function(playerId) {
    this.playerData = this.cache.getJSON('game_data')[playerId];
    var w = this.playerData.width,
        x = w,
        y = this.game.height/2;
    if (this.gameOver) {
      this.player.destroy();
    } else if (typeof this.player !== 'undefined') {
      x = this.player.body.x || w;
      y = this.player.body.y || this.game.height/2;
      this.player.destroy();
    }
    this.player = this.game.add.sprite(x, y, playerId);
    //enable physics on the player
    this.game.physics.arcade.enable(this.player);
    this.player.standDimensions = {width: this.player.width, height: this.player.height};
    this.player.anchor.setTo(0.5, 1);
    this.game.world.bringToTop(this.player);
    this.playerVisible = true;
    this.points = 0;
    this.shield = this.playerData.shield;
    this.healthbar = this.game.add.sprite(this.game.width-400-10,10,'healthbar');
    this.healthbar.cropEnabled = true;
    var barWidth = 400;
    var barHeight = 30;
    var cropRect = new Phaser.Rectangle(0, 0, barWidth, barHeight);
    this.healthbar.crop(cropRect);
  },
  playerHit: function(player, obstacle) {
    if (this.playerVisible && this.shield > 0) {
      this.shield -= obstacle.damage;
      this.refreshDeflector();
    }
    if (this.playerVisible && this.shield > 0) {
      this.playerDied(player.key + ' killed by ' + obstacle.key);
    }
  },
  enemyHit: function(enemy, projectile) {
    this.points += enemy.worth*this.playerData.multiplier;
    this.refreshStats();
  },
  refreshStats: function() {
    var maxHealth = this.playerData.shield,
        diff = this.shield/maxHealth,
        barWidth = 400,
        barHeight = 30,
        barRemaining = (barWidth - (barWidth - (barWidth * diff))).toFixed(0);
    this.pointsText.text = this.points;
    var cropRect = new Phaser.Rectangle(0, 0, barRemaining, barHeight);
    this.healthbar.crop(cropRect);
  },
  playerDied: function(txt) {
    this.gameOver = true;
    this.gameOverLabel = this.game.add.text(this.game.width / 2 , this.game.height / 2, txt + "\n Your Score: " + this.points,
      { font: '24px Lucida Console', fill: '#fff', align: 'center'});
    this.gameOverLabel.anchor.setTo(0.5, 0.5);
    //this.restartButton = this.game.add.button(this.game.world.centerX - 95, this.game.world.centerY - 150, 'button', this.restart, this);
    //this.restartButton.onInputUp.add(this.restart, this);
  },
  togglePause: function() {
    this.game.physics.arcade.isPaused = (this.game.physics.arcade.isPaused) ? false : true;
  },
  playerMove: function(dir) {
    var w = this.playerData.width;
    var h = this.playerData.height;
    if (this.player.body.x >= 0 && dir === 'R') {
      this.player.body.velocity.x = this.playerData.move;
    } else if (this.player.body.x <= (this.game.width-w) && dir === "L") {
      this.player.body.velocity.x = parseInt('-' + this.playerData.move);
    } else if (this.player.body.y >= 0 && dir === 'U') {
      this.player.body.velocity.y = parseInt('-' + this.playerData.move);
    } else if (this.player.body.y <= (this.game.height-h) && dir === "D") {
      this.player.body.velocity.y = this.playerData.move;
    } else {
      this.stopPlayer();
    }
  },
  stopPlayer: function() {
    if ( !(Phaser.Point.equals(this.player.body.velocity,new Phaser.Point(0,0))) ) {
      this.player.body.velocity.setTo(0,0);
    }
  },
  update: function() {
    if (this.gameOver) {
      return;
    }
    if (this.shield <= 0) {
      this.gameOver = true;
      this.stopPlayer();
      this.playerDied('shield depleated');
      return;
    }
    var w = this.playerData.width;
    var h = this.playerData.height;
    // this.game.world.bringToTop(this.enemies);
    // this.game.physics.arcade.overlap(this.player, this.enemies, this.playerHit, null, this);

    // this.enemies.filter(function(v) { return v.body.x < -200; }).callAll('destroy');
    this.shield -= 1;
    this.points += 1;
    this.refreshStats();
    if (this.player.body.x === (this.game.width-w)) {
      this.stopPlayer();
    } else if (this.player.body.x === 0) {
      this.stopPlayer();
    } else if (this.player.body.y === (this.game.height-h)) {
      this.stopPlayer();
    } else if (this.player.body.y === 0) {
      this.stopPlayer();
    }
  
    if (this.cursors.up.isDown) {
      this.playerMove('U');
    } else if (this.cursors.down.isDown) {
      this.playerMove('D');
    } else if (this.cursors.right.isDown) {
      this.playerMove('R');
    } else if (this.cursors.left.isDown) {
      this.playerMove('L');
    }
    
    // if (this.game.rnd.integerInRange(0, 1000) >= 995) {
    //   var key = this.cache.getJSON('game_data').obstacles[this.game.rnd.integerInRange(0, this.cache.getJSON('game_data').obstacles.length-1)]
    //   var data = this.cache.getJSON('game_data')[key];
    //   var x = (this.game.width) + this.game.rnd.integerInRange(0, this.game.width*2);
    //   var y = this.game.rnd.integerInRange(0, this.game.height);
    //   var item = this[key+'s'].create(x, y, key);
    //   item.body.velocity.x = parseInt('-'+data.velocity);
    //   item.body.immovable = true;
    //   item.body.collideWorldBounds = false;
    //   item.worth = data.points;
    // }    
  },
  render: function() {
    this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");  
  }
};