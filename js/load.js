var loadState = {

	 preload: function(){
	 	game.load.image('sky', 'assets/bgmenu.png');
	 	game.load.image('balloon', 'assets/balloon.png');
	 	//game.load.image('balloonbad', 'assets/balloonbad.png');
	 	game.load.image('balloongreen', 'assets/balloongreen.png');
	 	game.load.image('balloonyellow', 'assets/balloonyellow.png');
	 	game.load.image('balloonblue', 'assets/balloonblue.png');
	 	game.load.image('balloonpurple', 'assets/balloonpurple.png');
	 	game.load.image('heart', 'assets/heart.png');
	 	game.load.image('cats', 'assets/cats.gif');
	 	game.load.image('reload', 'assets/reload.png');

	 	game.load.image('scoreboard', 'assets/scoreboard.png');
	 	game.load.image('scoreboardwin', 'assets/scoreboardwin.png');
	 	game.load.audio('explode', 'assets/explode.mp3');
	 	game.load.audio('music', 'assets/music.ogg');
	 	game.load.bitmapFont('desyrel', 'assets/desyrel.png', 'assets/desyrel.xml');
	 	game.load.image('play', 'assets/play.png');
	 },

	 create: function(){
	 	if(!game.device.desktop){
			game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

			document.body.style.backgroundColor = '#3498db';

			game.scale.minWidth = 250;
			game.scale.minHeight = 170;
			game.scale.maxWidth = 1000;
			game.scale.maxHeight = 680;

			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVertically = true;

			game.scale.setScreenSize(true)

		}

		game.state.start('level1');
	 }
}