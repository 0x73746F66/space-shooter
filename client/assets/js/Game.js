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
    //this.generateObstacles();
    this.generateEnemies();
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
  generateEnemies: function() {
    var num1 = this.game.rnd.integerInRange(2, 4);
    var num2 = this.game.rnd.integerInRange(0, 2);
    var enemy1, enemy1;
    var enemy1Data = this.cache.getJSON('game_data').enemy1;
    var enemy2Data = this.cache.getJSON('game_data').enemy2;
    var x, i;

    this.enemies = this.game.add.group();
    //enable physics in them
    this.enemies.enableBody = true;
    
    for (i = 0; i < num1; i++) {
      x = (this.game.width) + this.game.rnd.integerInRange(0, this.game.width);
      y = this.game.rnd.integerInRange(0, this.game.height-enemy1Data.height);
      enemy1 = this.enemies.create(x, y, 'enemy1');
 
      //physics properties
      enemy1.body.velocity.x = parseInt('-'+enemy1Data.velocity);
      
      enemy1.body.immovable = true;
      enemy1.body.collideWorldBounds = false;
      enemy1.worth = enemy1Data.worth;
      enemy1.damange = enemy1Data.damage;
    }
    for (i = 0; i < num1; i++) {
      x = (this.game.width) + this.game.rnd.integerInRange(0, this.game.width);
      y = this.game.rnd.integerInRange(0, this.game.height-enemy2Data.height);
      enemy2 = this.enemies.create(x, y, 'enemy2');
 
      //physics properties
      enemy2.body.velocity.x = parseInt('-'+enemy1Data.velocity);
      
      enemy2.body.immovable = true;
      enemy2.body.collideWorldBounds = false;
      enemy2.worth = enemy1Data.worth;
      enemy2.damange = enemy1Data.damage;
    }
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
  playerMove: function() {
    var xBound = [0,this.game.width-this.playerData.width];
    var xVisible = [0,this.game.width+this.playerData.width];
    var yBound = [0,this.game.height-this.playerData.height];
    var yVisible = [0,this.game.height+this.playerData.height];
    var isMoving = !(Phaser.Point.equals(this.player.body.velocity,new Phaser.Point(0,0)));
    var isOOBU = this.player.body.y <= 0;
    var isOOBR = this.player.body.x >= xBound[1];
    var isOOBD = this.player.body.y >= yBound[1];
    var isOOBL = this.player.body.x <= 0;
    var isOOB = (isOOBU || isOOBR || isOOBD || isOOBL);
    
    if (isMoving && isOOB) {
      this.player.body.velocity.setTo(0,0);
    }
    if (this.cursors.right.isDown && (isOOBL || !isOOBR)) {
      this.player.body.velocity.x = this.playerData.move;
    } else if (this.cursors.left.isDown && (isOOBR || !isOOBL)) {
      this.player.body.velocity.x = parseInt('-' + this.playerData.move);
    } else if (this.cursors.up.isDown && (isOOBD || !isOOBU)) {
      this.player.body.velocity.y = parseInt('-' + this.playerData.move);
    } else if (this.cursors.down.isDown && (isOOBU || !isOOBD)) {
      this.player.body.velocity.y = this.playerData.move;
    }
  },
  update: function() {
    if (this.gameOver) {
      return;
    }
    if (this.shield <= 0) {
      this.gameOver = true;
      this.player.body.velocity.setTo(0,0);
      this.playerDied('shield depleated');
      return;
    }
    this.playerMove();
    this.game.world.bringToTop(this.enemies);
    this.game.physics.arcade.overlap(this.player, this.enemies, this.playerHit, null, this);

    this.enemies.filter(function(v) { return v.body.x < -70; }).callAll('destroy');

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