var level2State = {
	create: function(){
		// var bpmText;
		// bmpText = game.add.bitmapText(200, 100, 'desyrel','Phaser & Pixi \nrocking!', 64);
		this.bg = game.add.sprite(0,0,"sky");

		this.bgSound = game.add.audio('music');

		this.cat = game.add.sprite(20, 200, 'cats');
		this.cat.anchor.setTo(0.5, 0.5);
		this.pointsLimit = 5;
		//game.add.tween(this.cat).to({ y: 0 }, 4000, Phaser.Easing.Sinusoidal.InOut, true, 200, 1000, false);
		game.add.tween(this.cat).to( { y: 150 }, 2000, Phaser.Easing.Back.InOut, true, 0, 500, true);
		this.bgSound.play();
		this.bgSound.loop = true;	

		//this.counterKillBalloons = 0;
		this.counterGreenBalloons = 0;
		this.lifes = 3;

		this.minSpeed = -1;
        this.maxSpeed = 2;
        this.vx = Math.random()*(this.maxSpeed - this.minSpeed+1)-this.minSpeed;
        this.vy = Math.random()*(this.maxSpeed - this.minSpeed+1)-this.minSpeed;

        this.messageGameOver = "";
		
		this.balloonGroup = game.add.physicsGroup();


		this.heartsGroup = game.add.group();

		
		this.win = false;
		this.scoreBoardGroup = game.add.group();
		this.gameStop = false;


		for(var i=0; i < this.lifes; i++)
			this.hearts = this.heartsGroup.create(game.world.width / 2  + 220 + (i * 20), 30, "heart"); 
		
		
		game.time.events.loop(1000*2,this.createBalloons, this);
		this.levelLabel = game.add.text(30,10,'Hit Green Balloons! Level 2', {font : '18px Arial', fill: '#000'});
		this.scoreLabel = game.add.text(30,30,'Green Balloons Exploded: 0', {font : '18px Arial', fill: '#000'});
		this.predictedTPLabel = game.add.text(30,50,'Predicted Throughput: ' + (Math.log2(11)/4).toFixed(2), {font : '18px Arial', fill: '#000'});
		//this.actualTPLabel = game.add.text(30,70,'Actual Throughput: 0', {font : '18px Arial', fill: '#000'});
		
		this.lifeLabel = game.add.text(game.world.width / 2  + 150,25,'Cat Life: ', {font : '18px Arial', fill: '#000'});
		this.explodeSound = game.add.audio('explode');
		var d = new Date();
		this.currentHitTime = d.getTime();
		this.previousHitTime = 0;
		this.sumTime = 0;

	},

	update: function(){
		//this.balloonGroup.y-=1

		this.balloonGroup.forEach(this.moveBalloons, this);
		//this.moveBalloons();
		//updateTimer();
	},


	createBalloons: function(){
		var balloonAmount = 10;
		var balloon;
		var x_green;
		var x_others;
		
		for(var i=0; i<balloonAmount; i++){
			if(i ==  0) {
				x_green = Math.floor((Math.random() * 400) + 70);
				console.log("Balloon Green created: x = " + x_green);
				balloon = this.balloonGroup.create(x_green, 480, "balloongreen"); 
			} 
			else 
			{
				x_others = Math.floor((Math.random() * 500) + 10);
				if (x_others<x_green && x_green-x_others < 50) x_others -= 50;
				if (x_others>x_green && x_others-x_green < 50) x_others += 50;
				if(i % 3 ==  1) {
				
					balloon = this.balloonGroup.create(x_others, 480, "balloonblue");
				} 
				else {
			
					balloon = this.balloonGroup.create(x_others, 480, "balloon");
				}
			}
			balloon.events.onOutOfBounds.add(this.balloonOOB, this);
			balloon.checkWorldBounds = true;
		}

	},

	balloonOOB: function(balloon) {
		if (!this.gameStop) {
			//console.log("I'm out of bound");
			if (balloon.key == 'balloongreen') {
				//balloon.kill();
				this.lifes--;
				this.heartsGroup.children[this.lifes].kill();
				console.log("Green balloon missed x=" + balloon.x);
			}
			if(this.lifes == 0){
				this.gameStop = true;
				game.time.events.stop();
				this.killCat();
				this.win = false;
				this.messageGameOver = "You loose!!!"
			}
		}
	},


	moveBalloons: function(balloon){
		
		//console.log(balloon);
		var that = this;
		balloon.inputEnabled = true;
		balloon.checkWorldBounds = true;
		balloon.outOfBoundsKill = true;
		//var minSpeed = -(Math.floor(Math.random() * 3));
        //var maxSpeed = Math.floor(Math.random() * 10);
        // level 1 speed
        var minSpeed = 0.5;
        var maxSpeed = 3;

        //var vx = Math.random()*(maxSpeed - minSpeed+1)-minSpeed;
        var vy = Math.random()*(maxSpeed - minSpeed+1)-minSpeed;

		balloon.body.velocity.y -= vy;

		balloon.events.onInputDown.add(this.killBalloon, this);

	},

	killBalloon: function(sprite, pointer){

		this.explodeSound.play();
		if(!sprite.alive){
			return;
		}

		sprite.kill();

		if(sprite.key == 'balloongreen') {
			this.previousHitTime = this.currentHitTime;
			var date = new Date();
			this.currentHitTime = date.getTime();
			var mt = (this.currentHitTime - this.previousHitTime)/1000;
			this.sumTime += mt;
			this.counterGreenBalloons++;
			console.log("you hit a green balloon!");
		}

		if(this.counterGreenBalloons == this.pointsLimit){
			this.gameStop = true;
			game.time.events.stop();
			this.win = true;
			this.messageGameOver = "Good Job Passing Level 2!";
			this.freeCat();
			//this.gameOver();
		}

		this.scoreLabel.text = "Green Balloons Exploded: "+this.counterGreenBalloons;

		
	},

	killCat: function(){
		
		tween = game.add.tween(this.cat).to( { x: [ 0, 550, 650], y: [ 0, 50, 10], angle: '+620', alpha: 0}, 1000);

		tween.interpolation(Phaser.Math.bezierInterpolation);

		tween.onComplete.add(this.gameOver, this);

		tween.start();

		//game.add.tween(this.cat).to({angle: '+360'});
		//game.add.tween(this.cat.scale).to({x: '-2', y: '-2'});
	},

	freeCat: function(){
		
		tween = game.add.tween(this.cat).to( { x: [ 0, 550 ], y: [ 0, 50]}, 1000);
		tweenScale = game.add.tween(this.cat.scale).to( { x: '2', y: '2'}, 1000);
		tweenScale.start();

		tween.interpolation(Phaser.Math.bezierInterpolation);

		tween.onComplete.add(this.gameOver, this);

		tween.start();

		//game.add.tween(this.cat).to({angle: '+360'});
		//game.add.tween(this.cat.scale).to({x: '-2', y: '-2'});
	},

	showScoreBoardDead: function(){
		this.gameOverLabel = game.add.text(game.world.width / 2,120, this.messageGameOver, {font : '18px Arial', fill: '#ffffff'});
		this.gameOverLabel.anchor.setTo(0.5, 0.5);

		this.lifeFinalScore = game.add.text(300,220,'Cat Life: ', {font : '18px Arial', fill: '#ffffff'});
		this.finalScore = game.add.text(300,180,'Balloons: ', {font : '18px Arial', fill: '#ffffff'})

		this.scoreBoardGroup.create(game.world.width / 2 - 150 , 150, "scoreboard");

		this.buttonReload = game.add.sprite(game.world.width / 2 - 30 , 320, "reload");
		this.buttonReload.inputEnabled = true;
		

		this.buttonReload.events.onInputDown.add(this.restartGame, this);
		this.scoreBoardGroup.add(this.buttonReload);

		this.scoreBoardGroup.add(this.lifeFinalScore);
		this.scoreBoardGroup.add(this.finalScore);
		this.scoreBoardGroup.add(this.gameOverLabel);

		game.world.bringToTop(this.finalScore);
		game.world.bringToTop(this.lifeFinalScore);

		this.lifeFinalScore.text = "Cat Life: "+this.lifes;
		var avg_tp = 0;
		if (this.counterGreenBalloons>0) {
			var avg_time = this.sumTime/this.counterGreenBalloons;
			avg_tp = (Math.log2(6)/avg_time).toFixed(2);
		}
		this.finalScore.text = "Actual TP: " + avg_tp;

		game.add.tween(this.scoreBoardGroup).from( { y: -200 }, 2000, Phaser.Easing.Bounce.Out, true);
	},

	showScoreWin: function(){
		this.gameOverLabel = game.add.text(game.world.width / 2,120, this.messageGameOver, {font : '18px Arial', fill: '#ffffff'});
		this.gameOverLabel.anchor.setTo(0.5, 0.5);

		this.lifeFinalScore = game.add.text(300,220,'Cat Life: ', {font : '18px Arial', fill: '#ffffff'});
		this.finalScore = game.add.text(300,180,'Green Hits: ', {font : '18px Arial', fill: '#ffffff'})

		this.scoreBoardGroup.create(game.world.width / 2 - 150 , 150, "scoreboardwin");

		// this.buttonReload = game.add.sprite(game.world.width / 2 - 30 , 320, "reload");
		// this.buttonReload.inputEnabled = true;
	

		// this.buttonReload.events.onInputDown.add(this.restartGame, this);
		// this.scoreBoardGroup.add(this.buttonReload);

		this.buttonPlay = game.add.sprite(game.world.width / 2 - 30 , 320, "play");
		this.buttonPlay.inputEnabled = true;
	

		this.buttonPlay.events.onInputDown.add(this.levelUp, this);
		this.scoreBoardGroup.add(this.buttonPlay);

		this.scoreBoardGroup.add(this.lifeFinalScore);
		this.scoreBoardGroup.add(this.finalScore);
		this.scoreBoardGroup.add(this.gameOverLabel);

		game.world.bringToTop(this.finalScore);
		game.world.bringToTop(this.lifeFinalScore);

		this.lifeFinalScore.text = "Cat Life: "+this.lifes;
		var avg_tp = 0;
		if (this.counterGreenBalloons>0) {
			var avg_time = this.sumTime/this.counterGreenBalloons;
			avg_tp = (Math.log2(6)/avg_time).toFixed(2);
		}
		this.finalScore.text = "Actual TP: " + avg_tp;
		game.add.tween(this.scoreBoardGroup).from( { y: -200 }, 2000, Phaser.Easing.Bounce.Out, true);
	},

	gameOver: function(){
		if(this.win){
			this.bgSound.stop();
			this.explodeSound.stop();
			game.time.events.stop();
			this.showScoreWin();
		}else{
			this.bgSound.stop();
			this.explodeSound.stop();
			game.time.events.stop();
			this.showScoreBoardDead();
		}
			
	},

	restartGame: function(){
		//alert("test");
		game.time.events.start();
		game.state.start('level1');
	},

	levelUp: function(){
		game.time.events.start();
		game.state.start('level3');
		console.log('play level 3');
	},

	updateTimer: function() {
 
	    bmpText.setText('Phaser & Pixi\nrocking!\n' + Math.round(game.time.now));
	 
	}
}