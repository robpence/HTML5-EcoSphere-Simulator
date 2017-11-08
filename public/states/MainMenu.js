var GameMenu = function() {};

var buttonX = [292,210,249,260];
var buttonY = [100,140,180,220];

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
		var playButton = game.add.sprite(buttonX[0], buttonY[0], 'playImage');

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