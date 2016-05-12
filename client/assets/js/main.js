var PhaserGame = {cacheReady: false};
// Check if a new cache is available on page load.
window.addEventListener('load', function(e) {
  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      window.applicationCache.update();
      window.applicationCache.swapCache();
    }
  }, false);
  window.applicationCache.addEventListener('noupdate', function(e){
    PhaserGame.cacheReady = true;
  }, false);
  window.applicationCache.addEventListener('cached', function(e){
    PhaserGame.cacheReady = true;
  }, false);
  window.applicationCache.addEventListener('error', function(e){
    if (e.reason === 'manifest') {
      PhaserGame.cacheReady = true;
    }
  }, false);
}, false);
document.addEventListener("DOMContentLoaded", function(e) {
  PhaserGame.game = new Phaser.Game(746, 420, Phaser.AUTO, '');
  PhaserGame.game.state.add('Boot', PhaserGame.Boot);
  PhaserGame.game.state.add('Preload', PhaserGame.Preload);
  PhaserGame.game.state.add('MainMenu', PhaserGame.MainMenu);
  PhaserGame.game.state.add('Game', PhaserGame.Game);
  PhaserGame.game.state.start('Boot');
}, false);

// if (typeof Worker != 'undefined') {
//     var worker = new Worker('/assets/js/Worker.js');
//     worker.onerror = function(e) {
//         //document.getElementById('log').insertAdjacentHTML('beforeEnd','error encountered'+"\n"); 
//         error('Ops, something bad occurred!', e);
//     };
//     worker.onmessage = function(e) {
//         //document.getElementById('log').insertAdjacentHTML('beforeEnd', JSON.stringify(e.data)+"\n" ); 
//         debug(e.data);
//     };
    
//     worker.postMessage({start:true});
// }