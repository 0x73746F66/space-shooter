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
    //Turn on impact events for the world, without this we get no collision callbacks
    this.game.physics.p2.setImpactEvents(true);
    this.game.physics.p2.restitution = 0.8;
    
    this.healthbar = this.game.add.sprite(this.game.width-400-10,10,'healthbar');
    this.healthbar.cropEnabled = true;

    //  Create our collision groups. One for the player, one for the enemies
    this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.enemyCollisionGroup = this.game.physics.p2.createCollisionGroup();

    this.createPlayer(playerId);
    //this.generateObstacles();
    this.generateEnemies();

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
    //this.game.physics.arcade.enable(this.player);
    this.game.physics.p2.enable(this.player, true);
    this.player.body.clearShapes();
    this.player.body.loadPolygon('physics_data', playerId);
    this.player.body.sprite.alpha = 0.5;
    this.player.anchor.setTo(0.5, 0.5);
    this.player.body.setCollisionGroup(this.playerCollisionGroup);
    this.player.body.collides(this.enemyCollisionGroup, this.playerHit, this);
    this.game.world.bringToTop(this.player);
    this.playerVisible = true;
    this.points = 0;
    this.shield = this.playerData.shield;

    var barWidth = 400;
    var barHeight = 30;
    var cropRect = new Phaser.Rectangle(0, 0, barWidth, barHeight);
    this.healthbar.crop(cropRect);
  },
  generateEnemies: function() {
    var num1 = this.game.rnd.integerInRange(2, 4);
    var num2 = this.game.rnd.integerInRange(0, 2);
    var enemy1, enemy2;
    var enemy1Data = this.cache.getJSON('game_data').enemy1;
    var enemy2Data = this.cache.getJSON('game_data').enemy2;
    var x, y, i;

    this.enemies = this.game.add.group();
    //enable physics in them
    this.enemies.enableBody = true;
    this.enemies.physicsBodyType = Phaser.Physics.P2JS;
    
    for (i = 0; i < num1; i++) {
      x = (this.game.width) + this.game.rnd.integerInRange(0, this.game.width);
      y = this.game.rnd.integerInRange(0, this.game.height-enemy1Data.height);
      enemy1 = this.enemies.create(x, y, 'enemy1');
      enemy1.body.clearShapes();
      enemy1.body.immovable = true;
      enemy1.body.setZeroDamping();
      enemy1.body.loadPolygon('physics_data', 'enemy1');
      enemy1.worth = enemy1Data.worth;
      enemy1.damange = enemy1Data.damage;
      enemy1.body.setCollisionGroup(this.enemyCollisionGroup);
      enemy1.body.collides([this.playerCollisionGroup, this.enemyCollisionGroup]);
      enemy1.body.velocity.x = parseInt('-'+enemy1Data.velocity);
    }
    // for (i = 0; i < num2; i++) {
    //   x = (this.game.width) + this.game.rnd.integerInRange(0, this.game.width);
    //   y = this.game.rnd.integerInRange(0, this.game.height-enemy2Data.height);
    //   enemy2 = this.enemies.create(x, y, 'enemy2');
    //   enemy2.body.velocity.x = parseInt('-'+enemy1Data.velocity);
    //   enemy2.body.immovable = true;
    //   enemy2.body.collideWorldBounds = false;
    //   enemy2.body.setCollisionGroup(this.enemyCollisionGroup);
    //   enemy2.worth = enemy1Data.worth;
    //   enemy2.damange = enemy1Data.damage;
    //   enemy2.body.collides(this.playerCollisionGroup, this.playerHit, this);
    // }
  },
  playerHit: function(player, obstacle) {
    if (this.playerVisible && this.shield > 0) {
      this.shield -= obstacle.damage;
      this.refreshStats();
    }
    if (this.shield <= 0) {
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
    var w = this.playerData.width/2;
    var h = this.playerData.height/2;
    var xBound = [w,this.game.width-w];
    var yBound = [h,this.game.height-h];
    var isMoving = !(Phaser.Point.equals(this.player.body.velocity,new Phaser.Point(0,0)));
    var isOOBU = this.player.body.y <= xBound[0];
    var isOOBR = this.player.body.x >= xBound[1];
    var isOOBD = this.player.body.y >= yBound[1];
    var isOOBL = this.player.body.x <= xBound[0];
    var isOOB = (isOOBU || isOOBR || isOOBD || isOOBL);
    var x = 0, y = 0;
    
    if (isMoving && isOOB) {
      this.player.body.setZeroVelocity();
    }
    if (this.cursors.right.isDown && (isOOBL || !isOOBR)) {
      x = this.playerData.move;
    } else if (this.cursors.left.isDown && (isOOBR || !isOOBL)) {
      x = parseInt('-' + this.playerData.move);
    }
    if (this.cursors.up.isDown && (isOOBD || !isOOBU)) {
      y = parseInt('-' + this.playerData.move);
    } else if (this.cursors.down.isDown && (isOOBU || !isOOBD)) {
      y = this.playerData.move;
    }
    if (x !== 0 || y !== 0) {
      this.player.body.velocity.x = x;
      this.player.body.velocity.y = y;
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
    this.enemies.filter(function(v) { return v.body.x < -70; }).callAll('destroy');

    var enemyId = this.cache.getJSON('game_data').enemies[this.game.rnd.integerInRange(0, this.cache.getJSON('game_data').enemies.length - 1)];
    var enemyData = this.cache.getJSON('game_data')[enemyId];
    var x, y, i;
    if (this.game.rnd.integerInRange(0, 1000) >= 995) {
      x = (this.game.width) + this.game.rnd.integerInRange(0, this.game.width);
      y = this.game.rnd.integerInRange(0, this.game.height-enemyData.height);
      var enemy = this.enemies.create(x, y, enemyId);
      enemy.body.clearShapes();
      enemy.body.immovable = true;
      enemy.body.setZeroDamping();
      enemy.body.loadPolygon('physics_data', enemyId);
      enemy.worth = enemyData.worth;
      enemy.damange = enemyData.damage;
      enemy.body.setCollisionGroup(this.enemyCollisionGroup);
      enemy.body.collides([this.playerCollisionGroup, this.enemyCollisionGroup]);
      enemy.body.velocity.x = parseInt('-'+enemyData.velocity);
    }
  },
  render: function() {
    this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");  
  }
};