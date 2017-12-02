var GameMenu = function() {};

GameMenu.prototype = {

	create() {

		/*
		if (music.name !== "dangerous" ){//&& playMusic) {
	    	music.stop();
	    	music = game.add.audio('dangerous');
	    	music.loop = true;
	    	music.play();
	    }*/

	    //order matters, first is in back.
	    game.stage.disableVisibilityChange = true;
		game.add.sprite(0, 0, 'bgImageTitle');
		
		var tempPlayImg = game.cache.getImage('playImage');
		var playButton = game.add.sprite(game.world.centerX - tempPlayImg.width/2, game.world.centerY - tempPlayImg.height/2, 'playImage');


		var titleStyle = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "top" };
		var creditStyle = { font: "bold 16px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "top" };
		var title = game.add.text(0, 0, "EcoSphere Simulator", titleStyle);
		var credit = game.add.text(0, 0, "Created By: Robert Pence", creditStyle);
		title.setTextBounds(0, 0, game.world.width, game.world.height);
		credit.setTextBounds(0, title.height, game.world.width, game.world.height);


		//let the images accept input
		playButton.inputEnabled = true;

		//When the images are clicked do something
		playButton.events.onInputDown.add(playButtonListener, this);
		//instructionsButton.events.onInputDown.add(instructionsButtonListener, this);
		//settingsButton.events.onInputDown.add(settingsButtonListener, this);
		//creditsButton.events.onInputDown.add(creditsButtonListener, this);

		//Listeners for the image buttons
		function playButtonListener(){
			console.log("play button hit");
			game.state.start("Game");
		};
		/*
		function instructionsButtonListener(){
			console.log("instructions button hit");
			game.state.start("Instructions");
		};
		function settingsButtonListener(){
			console.log("settings button hit");
			game.state.start("Options");
		};
		function creditsButtonListener(){
			console.log("creidts button hit");
			game.state.start("Credits");
		};*/
		
	}


};