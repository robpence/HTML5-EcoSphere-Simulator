//the new way everything is a sprite.

var Game = function(game) {};

var map, bgGroup, layer;
var day = 0;
var dayText, OxygenText, CO2Text, MoneyText, ResourcesText;
var CO2 = 10000;
var O2 = 10;
var gold = 500;
var shrimpCounter = 7;
var BrineShrimpsGroup, DeadBrineShrimpsGroup;
var DeadAlgaeGroup, AlgaeGroup;
var SnailGroup;
var FishGroup, DeadFishGroup;
var JavaFernGroup;
var JavaMossGroup;
var MossBallGroup, DeadMossBallGroup;
var MainMenuGroup, SettingsMenuGroup, beastMenuGroup;
var numAlgae = 0;
var numShrimp = 0;
var numSnails = 0;
var numFish = 0;
var numSmallShrimp = 0;
var numJavaMoss = 0;
var numJavaFern = 0;
var numMossBalls = 0;
var gamePaused = false;
var graphics;
var soundMuted = false;
var musicMuted = false;
var tooltipSprite;
var tooltipText;
var tooltipX, tooltipY;

Game.prototype = {
	
	preload() {
		game.load.script('Phasetips',  'lib/Phasetips.js');
		slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
		slickUI.load('/kenney-theme/kenney.json');

		game.load.tilemap('tank', 'img/ecoSphereGameTileMap.json', null, Phaser.Tilemap.TILED_JSON);
    	game.load.image('tiles', 'img/ecoSphereGameTiles.png');
    	game.load.image('brineShrimp', 'img/brineShrimpSprite.png');
    	game.load.image('deadBrineShrimp', 'img/deadBrineShrimpSprite.png');
    	game.load.image('smallShrimp', 'img/smallshrimp.png');
    	game.load.image('algaeSprite', 'img/algaeSprite.png');
    	game.load.image('smallSnail', 'img/smallSnailSprite.png');
    	game.load.image('smallSnailRight', 'img/smallSnailSpriteRight.png');
    	game.load.image('smallFish', 'img/smallFishSprite.png');
    	game.load.image('smallFishLeft', 'img/smallFishSpriteLeft.png');
    	game.load.image('smallFishDead', 'img/smallFishSpriteDead.png');
    	game.load.image('javaFern', 'img/javaFernSprite.png');
    	game.load.image('javaMoss', 'img/JavaMossSprite.png');
    	game.load.image('mossBall', 'img/mossBallSprite.png');
    	game.load.image('deadMossBall', 'img/deadMossBall.png');
    	game.load.image('menuPanel', 'img/menuPanel1.png');
    	game.load.image('menuPanel2', 'img/menuPanel2.png');
    	game.load.image('menuButton', 'img/menuButton1.png');
    	game.load.image('checkBoxEmpty', 'img/checkBox.png');
    	game.load.image('checkBoxFilled', 'img/checkBoxFilled.png');
    	game.load.image('tooltipBox', 'img/toolTipBox.png');
	},

	create() {

		var bg = game.add.sprite(0, 0, 'bgImage');
		BrineShrimpsGroup = game.add.group();
		DeadBrineShrimpsGroup = game.add.group();
		AlgaeGroup = game.add.group();
		DeadAlgaeGroup = game.add.group();
		SnailGroup = game.add.group();
		SmallShrimpGroup = game.add.group();
		FishGroup = game.add.group();
		DeadFishGroup = game.add.group();
		JavaFernGroup = game.add.group();
		JavaMossGroup = game.add.group();
		MossBallGroup = game.add.group();
		DeadMossBallGroup = game.add.group();
		MainMenuGroup = game.add.group();
		SettingsMenuGroup = game.add.group();
		graphics = game.add.graphics(0, 0);


		/* Create the map that is used for the fish tank */
		map = game.add.tilemap('tank');
		map.addTilesetImage('TankTiles', 'tiles');
		layer = map.createLayer('jar');
    	layer.resizeWorld();
    	layer.fixedToCamera = false;
    	layer.position.set(this.world.centerX, 30);
    	
		//create menus
		/* THE MENU ON THE LEFT SIDE, buttons to add things*/
		var tooltipStyle = { font: "12px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: 150, align: "center", backgroundColor: "#ffffff" };

		var panelLeft;
		slickUI.add(panelLeft = new SlickUI.Element.Panel(8, 8, 150, game.height - 16));

		var AddThingsText = new SlickUI.Element.Text(0,0, "Flora And Fauna", 12);
		var FloraText = new SlickUI.Element.Text(0,40, "Flora", 14);
		var FaunaText = new SlickUI.Element.Text(0,250, "Fauna", 14);
		var addAlgaeButton, addBrineShrimpButton, resumeButton, pauseButton;
		
		panelLeft.add(AddThingsText);
		panelLeft.add(FloraText);
		panelLeft.add(FaunaText);

		panelLeft.add(addAlgaeButton = new SlickUI.Element.Button(0,70, 120, 40));
		addAlgaeButton.events.onInputUp.add(function () {
			AddAlgae();
		});
		addAlgaeButton.events.onInputOver.add(function (){
			createTooltipPosition(game.input.mousePointer.x, game.input.mousePointer.y);
			tooltipSprite = game.add.sprite(tooltipX, tooltipY, 'tooltipBox');
		    tooltipText = game.add.text(0, 0, "Adds some algae\nCosts: 5 Gold", tooltipStyle);
		    tooltipText.anchor.set(0.5);
		});
		addAlgaeButton.events.onInputOut.add(function (){
			tooltipSprite.destroy();
			tooltipText.destroy();
		});
		addAlgaeButton.add(new SlickUI.Element.Text(0,0, "Add Algae")).center();

		panelLeft.add(addJavaMossButton = new SlickUI.Element.Button(0,115, 120, 40));
		addJavaMossButton.events.onInputUp.add(function () {
			addJavaMoss();
		});
		addJavaMossButton.events.onInputOver.add(function (){
			createTooltipPosition(game.input.mousePointer.x, game.input.mousePointer.y);
			tooltipSprite = game.add.sprite(tooltipX, tooltipY, 'tooltipBox');
		    tooltipText = game.add.text(0, 0, "Adds some java moss\nCosts: 10 Gold", tooltipStyle);
		    tooltipText.anchor.set(0.5);
		});
		addJavaMossButton.events.onInputOut.add(function (){
			tooltipSprite.destroy();
			tooltipText.destroy();
		});
		addJavaMossButton.add(new SlickUI.Element.Text(0,0, "Add Java Moss", 10)).center();

		panelLeft.add(addJavaFernButton = new SlickUI.Element.Button(0,160, 120, 40));
		addJavaFernButton.events.onInputUp.add(function () {
			addJavaFern();
		});
		addJavaFernButton.events.onInputOver.add(function (){
			createTooltipPosition(game.input.mousePointer.x, game.input.mousePointer.y);
			tooltipSprite = game.add.sprite(tooltipX, tooltipY, 'tooltipBox');
		    tooltipText = game.add.text(0, 0, "Adds some java fern\nCosts: 10 Gold", tooltipStyle);
		    tooltipText.anchor.set(0.5);
		});
		addJavaFernButton.events.onInputOut.add(function (){
			tooltipSprite.destroy();
			tooltipText.destroy();
		});
		addJavaFernButton.add(new SlickUI.Element.Text(0,0, "Add Java Fern", 10)).center();

		panelLeft.add(addMossBallButton = new SlickUI.Element.Button(0,205, 120, 40));
		addMossBallButton.events.onInputUp.add(function () {
			addMossBall();
		});
		addMossBallButton.events.onInputOver.add(function (){
			createTooltipPosition(game.input.mousePointer.x, game.input.mousePointer.y);
			tooltipSprite = game.add.sprite(tooltipX, tooltipY, 'tooltipBox');
		    tooltipText = game.add.text(0, 0, "Add a moss ball\nCosts: 50 Gold", tooltipStyle);
		    tooltipText.anchor.set(0.5);
		});
		addMossBallButton.events.onInputOut.add(function (){
			tooltipSprite.destroy();
			tooltipText.destroy();
		});
		addMossBallButton.add(new SlickUI.Element.Text(0,0, "Add Moss Ball", 10)).center();

		panelLeft.add(addBrineShrimpButton = new SlickUI.Element.Button(0,270, 120, 40));
		addBrineShrimpButton.events.onInputUp.add(function () {
			AddBrineShrimp();
		});
		addBrineShrimpButton.events.onInputOver.add(function (){
			createTooltipPosition(game.input.mousePointer.x, game.input.mousePointer.y);
			tooltipSprite = game.add.sprite(tooltipX, tooltipY, 'tooltipBox');
		    tooltipText = game.add.text(0, 0, "Add a brine shrimp\nCosts: 5 Gold", tooltipStyle);
		    tooltipText.anchor.set(0.5);
		});
		addBrineShrimpButton.events.onInputOut.add(function (){
			tooltipSprite.destroy();
			tooltipText.destroy();
		});
		addBrineShrimpButton.add(new SlickUI.Element.Text(0,0, "Add Brine Shrimp", 10)).center();

		panelLeft.add(addSmallShrimpButton = new SlickUI.Element.Button(0,315, 120, 40));
		addSmallShrimpButton.events.onInputUp.add(function () {
			addShrimp();
		});
		addSmallShrimpButton.events.onInputOver.add(function (){
			createTooltipPosition(game.input.mousePointer.x, game.input.mousePointer.y);
			tooltipSprite = game.add.sprite(tooltipX, tooltipY, 'tooltipBox');
		    tooltipText = game.add.text(0, 0, "Add a small shrimp\nCosts: 10 Gold", tooltipStyle);
		    tooltipText.anchor.set(0.5);
		});
		addSmallShrimpButton.events.onInputOut.add(function (){
			tooltipSprite.destroy();
			tooltipText.destroy();
		});
		addSmallShrimpButton.add(new SlickUI.Element.Text(0,0, "Add Shrimp", 10)).center();

		panelLeft.add(addSnailButton = new SlickUI.Element.Button(0,360, 120, 40));
		addSnailButton.events.onInputUp.add(function () {
			addSnail();
		});
		addSnailButton.events.onInputOver.add(function (){
			createTooltipPosition(game.input.mousePointer.x, game.input.mousePointer.y);
			tooltipSprite = game.add.sprite(tooltipX, tooltipY, 'tooltipBox');
		    tooltipText = game.add.text(0, 0, "Add a snail\nCosts: 20 Gold", tooltipStyle);
		    tooltipText.anchor.set(0.5);
		});
		addSnailButton.events.onInputOut.add(function (){
			tooltipSprite.destroy();
			tooltipText.destroy();
		});
		addSnailButton.add(new SlickUI.Element.Text(0,0, "Add snail", 10)).center();

		panelLeft.add(addFishButton = new SlickUI.Element.Button(0,405, 120, 40));
		addFishButton.events.onInputUp.add(function () {
			addFish();
		});
		addFishButton.events.onInputOver.add(function (){
			createTooltipPosition(game.input.mousePointer.x, game.input.mousePointer.y);
			tooltipSprite = game.add.sprite(tooltipX, tooltipY, 'tooltipBox');
		    tooltipText = game.add.text(0, 0, "Add a small fish\nCosts: 50 Gold", tooltipStyle);
		    tooltipText.anchor.set(0.5);
		});
		addFishButton.events.onInputOut.add(function (){
			tooltipSprite.destroy();
			tooltipText.destroy();
		});
		addFishButton.add(new SlickUI.Element.Text(0,0, "Add Fish", 10)).center();


		/* THE MENU ON THE RIGHT SIDE, resources and stuff*/
		var panelRight;
		slickUI.add(panelRight = new SlickUI.Element.Panel(740, 8, 150, game.height - 16));

		ResourcesText = new SlickUI.Element.Text(0,0, "Resources", 16);
		OxygenText = new SlickUI.Element.Text(0,40, "Oxygen: 1000", 14);
		CO2Text = new SlickUI.Element.Text(0,70, "CO2: 1000", 14);
		MoneyText = new SlickUI.Element.Text(0,100, "Money: 500", 14);
		dayText = new SlickUI.Element.Text(0, 130, "Day: 0", 14);
		panelRight.add(ResourcesText);
		panelRight.add(OxygenText);
		panelRight.add(CO2Text);
		panelRight.add(MoneyText);
		panelRight.add(dayText);

		panelRight.add(XButton = new SlickUI.Element.Button(0,430, 40, 40));
		XButton.events.onInputUp.add(function () {
			ModifyLoopTimerX();
		});
		XButton.add(new SlickUI.Element.Text(0,0, ">")).center();

		panelRight.add(XXButton = new SlickUI.Element.Button(50,430, 40, 40));
		XXButton.events.onInputUp.add(function () {
			ModifyLoopTimerXX();
		});
		XXButton.add(new SlickUI.Element.Text(0,0, ">>")).center();

		panelRight.add(XXXButton = new SlickUI.Element.Button(100,430, 40, 40));
		XXXButton.events.onInputUp.add(function () {
			ModifyLoopTimerXXX();
		});
		XXXButton.add(new SlickUI.Element.Text(0,0, ">>>")).center();

		panelRight.add(menuButton = new SlickUI.Element.Button(10,380, 80, 40));
		menuButton.events.onInputUp.add(function () {
			openMenu();
		});
		menuButton.add(new SlickUI.Element.Text(0,0, "Menu")).center();

		panelRight.add(pauseButton = new SlickUI.Element.Button(100,380, 40, 40));
		pauseButton.events.onInputUp.add(function () {
			pauseGame();
		});
		pauseButton.events.onInputOver.add(function (){
			console.log('hovering over pause');
			createTooltipPosition(game.input.mousePointer.x, game.input.mousePointer.y);
			tooltipSprite = game.add.sprite(tooltipX, tooltipY, 'tooltipBox');
		    tooltipText = game.add.text(0, 0, "pauses time", tooltipStyle);
		    tooltipText.anchor.set(0.5);
		});
		pauseButton.events.onInputOut.add(function (){
			console.log('not hovering over pause');
			tooltipSprite.destroy();
			tooltipText.destroy();
		});
		pauseButton.add(new SlickUI.Element.Text(0,0, "||")).center();

		game.time.events.loop(Phaser.Timer.SECOND * 10, UpdateDay, this);
		game.time.events.loop(Phaser.Timer.SECOND * 0.5, UpdateBrineShrimpMovement, this);
		game.time.events.loop(Phaser.Timer.SECOND * 0.1, updateFishMovement, this);
		game.time.events.loop(Phaser.Timer.SECOND * 0.1, updateSnailMovement, this);
		game.time.events.loop(Phaser.Timer.SECOND * 0.5, updateSmallShrimpMovement, this);

		
		window.onkeydown = function() {
            if (game.input.keyboard.event.keyCode == 80){
                if(game.paused === false){
                	openMenu();
                }else{
                	closeMenu();
                }
            }
        }

	},

	update() {
		if(tooltipSprite !== undefined){
			tooltipText.x = Math.floor(tooltipSprite.x + tooltipSprite.width / 2);
    		tooltipText.y = Math.floor(tooltipSprite.y + tooltipSprite.height / 2);
    	}
	}, 

	render() {
		//Debugging statements
		//game.debug.inputInfo(32, 32);
    	//game.debug.spriteInputInfo(sprite, 32, 130);
    	//game.debug.pointer( game.input.activePointer );
	},
};

function createTooltipPosition(mouseX, mouseY){
	//Make sure the tooltips stay within the game bounds
	if(mouseX > 800){
		mouseX = 800;
	}//maybe add one for 0
	if(mouseY > 450){
		mouseY = 450;
	}
	tooltipX = mouseX;
	tooltipY = mouseY;
}

function ModifyLoopTimerX(){
	game.time.events.events[1].delay = 10000;
	console.log('10');
}
function ModifyLoopTimerXX(){
	game.time.events.events[1].delay = 5000;
	console.log('5');
}
function ModifyLoopTimerXXX(){
	game.time.events.events[1].delay = 2500;
	console.log('2.5');
}

function UpdateDay(){
	day = day + 1;
	dayText.value = "Day: " + day;
	//console.log("Day Updated");

	UpdateAlgaeGrowth();
	UpdateBrineShrimpGrowth();
	UpdateMossBallGrowth();
	updateSnailGrowth();
	updateFishGrowth();
	updateJavaMossGrowth();
	updateJavaFernGrowth();
	updateSmallShrimpGrowth();
	OxygenText.value = "Oxygen: " + O2;
	CO2Text.value = "CO2: " + CO2;
	//console.log(O2);
	//console.log(CO2);
}

function AlgaeIncreased(){
	CO2 -= 1;
	numAlgae += 1;
}

function UpdateAlgaeGrowth(){
	//remove dead algae bodies from map
	CO2 = CO2 + DeadAlgaeGroup.total;
	DeadAlgaeGroup.removeChildren();
	//console.log(DeadAlgaeGroup.total); //should be 0 every time


	var tempAlgaeGroup = game.add.group();
	//console.log(AlgaeGroup);
	//console.log(AlgaeGroup.total);
	//console.log(AlgaeGroup.children[0]);
	AlgaeGroup.forEach( function(item){
		if(item != null){
			if(CO2 > 0){
				O2 += 1;
				CO2 -= 1;

				//reproduce if there is oxygen, place new shrimp in temp for reasons
				if(CO2 > 0){
					n = Math.floor(Math.random()*(4-1+1)+1);
					//console.log("tempalgae added");
					if(n == 1){
						if(item.x > 234){ //230 + 4?
							tempAlgaeGroup.create(item.x - 4, item.y, 'algaeSprite');
							AlgaeIncreased();
						}
					}
					else if(n == 2){
						if(item.x < 665){ //673 - 8?
							tempAlgaeGroup.create(item.x + 4, item.y, 'algaeSprite');
							AlgaeIncreased();
						}
					}
					else if(n == 3){
						if(item.y > 38){ //34 + 4?
							tempAlgaeGroup.create(item.x, item.y - 4, 'algaeSprite');
							AlgaeIncreased();
						}
					}
					else{
						if(item.y < 469){ //477 - 8?
							tempAlgaeGroup.create(item.x, item.y + 4, 'algaeSprite');
							AlgaeIncreased();
						}
					}
				}
			}
			//kill off the algae and replace with dead bodies
			else if(CO2 <= 0){
				//console.log("deadbs create");
				//console.log("bsg removed");
				DeadAlgaeGroup.create(item.x, item.y, 'deadBrineShrimp');
				AlgaeGroup.remove(item);
				numAlgae -= 1;
			}
		}

	});

	tempAlgaeGroup.forEach( function(item){
		if(item != null){
			//console.log("bsg create, tempshrimp remove");
			AlgaeGroup.create(item.x, item.y, 'algaeSprite');
			//tempShrimpGroup.remove(item);
		}
	});
	tempAlgaeGroup.removeChildren();
	//console.log(tempShrimpGroup.total); //should be 0
	//console.log(numAlgae);
}

function AddAlgae(){
	gold -= 5;
	MoneyText.value = "Gold: " + gold + "g";
	AlgaeGroup.create(230 + Math.random() * 440, 36 + Math.random() * 440, 'algaeSprite');
	console.log("Added a algae");
	numAlgae += 1;
}


function BrineShrimpIncreased(){
	O2 -= 1;
	numShrimp += 1;
}

function AddBrineShrimp(){
	gold -= 10;
	MoneyText.value = "Gold: " + gold + "g";
	BrineShrimpsGroup.create(230 + Math.random() * 440, 36 + Math.random() * 440, 'brineShrimp');
	console.log("Added a brine shrimp");
	numShrimp += 1;
}

function UpdateBrineShrimpGrowth(){
	//console.log("updatedbrineshrimpgrowth");
	/*	THE WRONG WAY TO DELETE ALL ITEMS IN A GROUP
	DeadBrineShrimpsGroup.forEach( function(item){
		if(item != null){
			console.log("removed from deadbrineshrimpgroup");
			CO2 += 1;
			DeadBrineShrimpsGroup.remove(item);
		}
	}); 
	*/
	//remove dead brineshrimp bodies from map
	CO2 = CO2 + DeadBrineShrimpsGroup.total;
	DeadBrineShrimpsGroup.removeChildren();
	//console.log(DeadBrineShrimpsGroup.total); //should be 0 every time


	var tempShrimpGroup = game.add.group();
	//console.log(BrineShrimpsGroup);
	//console.log(BrineShrimpsGroup.total);
	//console.log(BrineShrimpsGroup.children[0]);
	BrineShrimpsGroup.forEach( function(item){
		if(item != null){
			if(O2 > 0){
				CO2 += 1;
				O2 -= 1;

				//reproduce if there is oxygen, place new shrimp in temp for reasons
				if(day % shrimpCounter == 0 && O2 > 0){
					n = Math.floor(Math.random()*(4-1+1)+1);
					//console.log("tempshrimp added");
					if(n == 1){
						if(item.x > 234){ //230 + 4?
							tempShrimpGroup.create(item.x - 4, item.y, 'brineShrimp');
							BrineShrimpIncreased();
						}
					}
					else if(n == 2){
						if(item.x < 665){ //673 - 8?
							tempShrimpGroup.create(item.x + 4, item.y, 'brineShrimp');
							BrineShrimpIncreased();
						}
					}
					else if(n == 3){
						if(item.y > 38){ //34 + 4?
							tempShrimpGroup.create(item.x, item.y - 4, 'brineShrimp');
							BrineShrimpIncreased();
						}
					}
					else{
						if(item.y < 469){ //477 - 8?
							tempShrimpGroup.create(item.x, item.y + 4, 'brineShrimp');
							BrineShrimpIncreased();
						}
					}
				}
			}
			//kill off the shrimp and replace with dead bodies
			else if(O2 <= 0){
				//console.log("deadbs create");
				//console.log("bsg removed");
				DeadBrineShrimpsGroup.create(item.x, item.y, 'deadBrineShrimp');
				BrineShrimpsGroup.remove(item);
				numShrimp -= 1;
			}
		}

	});

	tempShrimpGroup.forEach( function(item){
		if(item != null){
			//console.log("bsg create, tempshrimp remove");
			BrineShrimpsGroup.create(item.x, item.y, 'brineShrimp');
			//tempShrimpGroup.remove(item);
		}
	});
	tempShrimpGroup.removeChildren();
	//console.log(tempShrimpGroup.total); //should be 0
	//console.log(numShrimp);
}

function UpdateBrineShrimpMovement(){
	//console.log("shrimp are moving");
	console.log("updatedbrineshrimpmovement");

	BrineShrimpsGroup.forEach( function(item){
		//console.log(item);
		if(item != null){
			n = Math.floor(Math.random()*(4-1+1)+1);
			if(n == 1){
				item.x -= 6;
				if(item.x < 230){ //230 - 0?
					item.x = 230;
				}
			}
			else if(n == 2){
				item.x += 6;
				if(item.x > 669){ //673 - 4?
					item.x = 669;
				}
			}
			else if(n == 3){
				item.y -= 6;
				if(item.y < 34){ //34 - 0?
					item.y = 34;
				}
			}
			else{
				item.y += 6;
				if(item.y > 473){ //477 - 4?
					item.y = 473;
				}
			}
		}

	});

}

/* ---------- TODO Functions ----------*/
//they need work still

//TODO add function for snails
function addSnail(){
	gold -= 20;
	MoneyText.value = "Gold: " + gold + "g";
	SnailGroup.create(430, 460, 'smallSnail');
	console.log("Added a small snail");
	numSnails += 1;
}

function updateSnailMovement(){
	var snailsNum = 0;
	SnailGroup.forEach( function(item){

		snailsNum += 1;

		if(snailsNum % 2 == 0){
			//Go around the tank moving left
			if(item.y >= 460){
				item.rotation = 0;
				item.x -= 1;
			}
			if(item.x <= 249){
				item.rotation = 1.57;
				item.y -= 1;
			}
			if(item.y <= 53){
				item.rotation = 3.14;
				item.x += 1;
			}
			if(item.x >= 655){
				item.rotation = 4.71;
				item.y += 1;
			}
		}else{
			//move around the tank moving right
			//switch the sprite so that its rotated correctly, I think I could also do this with scale but
			//for now I don't want to deal with negative scale values
			if(item.key == 'smallSnail'){
				SnailGroup.create(item.x, item.y, 'smallSnailRight');
				SnailGroup.remove(item);
			}
			if(item.y >= 460){
				item.rotation = 0;
				item.x += 1;
			}
			if(item.x >= 655){
				item.rotation = 4.71;
				item.y -= 1;
			}
			if(item.y <= 53){
				item.rotation = 3.14;
				item.x -= 1;
			}
			if(item.x <= 249){
				item.rotation = 1.57;
				item.y += 1;
			}
		}

	});
}
//TODO write a function so that the snails can grow and get bigger.
function updateSnailGrowth(){
	SnailGroup.forEach(function (snail){
		if(O2 >= 10){
			O2 -= 10;
			CO2 += 10;
		}else{
			//dead snail;
			SnailGroup.remove(snail);
		}
	});

}

//TODO add function for small fish
function addFish(){
	gold -= 50;
	MoneyText.value = "Gold: " + gold + "g";
	FishGroup.create(230 + Math.random() * 380, 40 + Math.random() * 420, 'smallFish');
	console.log("Added a small fish");
	numFish += 1;
}
function updateFishMovement(){

	//Fish are kinda dumb but I think I like it like this.
	//TODO fix this later
	FishGroup.forEach( function(item){
		//console.log(item);
		if(O2 <= 0){
			//Fish dies from lack of O2
			DeadFishGroup.create(item.x, item.y, 'smallFishDead');
			FishGroup.remove(item);
		}

		if(item != null){
			n = Math.floor(Math.random()*(4-1+1)+1);
			if(n == 1){
				item.x -= 10;
				if(item.x <= 230){
					item.x = 230;
				}
				if(item.key == 'smallFish'){
					FishGroup.create(item.x, item.y, 'smallFishLeft');
					FishGroup.remove(item);
				}
			}
			else if(n == 2){
				item.x += 10;
				if(item.x >= 610){
					item.x = 610;
				}
				if(item.key == 'smallFishLeft'){
					FishGroup.create(item.x, item.y, 'smallFish');
					FishGroup.remove(item);
				}
			}
			else if(n == 3){
				item.y -= 10;
				if(item.y <= 40){
					item.y = 40;
				}
			}
			else{
				item.y += 10;
				if(item.y >= 460){
					item.y = 460;
				}
			}
		}

	});

	//when a fish is dead, make the body float to the top of the tank.
	DeadFishGroup.forEach( function(item){
		if(item.y >= 34){
			item.y -= 1;
		}
	});

}
//TODO let fish get bigger.
function updateFishGrowth(){
	FishGroup.forEach( function(fish){
		//if(O2 >= 20){
			O2 -= 20;
			CO2 += 20;
			if(O2 < 0){
				O2 = 0;
			}
		//}else if(O2 <= 0){
		//	FishGroup.remove(fish);
		//}
	});
}

//TODO add functions for small shrimp
function addShrimp(){
	gold -= 10;
	MoneyText.value = "Gold: " + gold + "g";
	SmallShrimpGroup.create(230 + Math.random() * 440, 36 + Math.random() * 440, 'smallShrimp');
	console.log("Added a small shrimp");
	numSmallShrimp += 1;
}
function updateSmallShrimpMovement(){
	SmallShrimpGroup.forEach( function(item){
		if(item != null){
			n = Math.floor(Math.random()*(4-1+1)+1);
			if(n == 1){
				item.x -= 6;
				if(item.x <= 230){
					item.x = 230;
				}
			}
			else if(n == 2){
				item.x += 6;
				if(item.x >= 660){
					item.x = 660;
				}
			}
			else if(n == 3){
				item.y -= 6;
				if(item.y <= 38){
					item.y = 38;
				}
			}
			else{
				item.y += 6;
				if(item.y >= 470){
					item.y = 470;
				}
			}
		}

	});
}
function updateSmallShrimpGrowth(){
	SmallShrimpGroup.forEach( function(shrimp){
		if(O2 >= 2){
			O2 -= 2;
			CO2 += 2;
		}else if(O2 <= 0){
			SmallShrimpGroup.remove(shrimp);
		}
	});
}


//TODO add function for JavaMoss
function addJavaMoss(){
	gold -= 10;
	MoneyText.value = "Gold: " + gold + "g";
	JavaMossGroup.create(240 + Math.random() * 390, 439, 'javaMoss');
	console.log("Added some javaMoss");
	numJavaMoss += 1;
}
function updateJavaMossGrowth(){
	JavaMossGroup.forEach( function(item){
		if(item != null){
			if(CO2 >= 10){
				CO2 -= 10;
				O2 += 10;
			}
			else{
				console.log("java moss died");
				numJavaMoss -= 1;
				JavaMossGroup.remove(item);
			}
		}
	});
}

//TODO add functions for JavaFerns
function addJavaFern(){
	gold -= 10;
	MoneyText.value = "Gold: " + gold + "g";
	JavaFernGroup.create(240 + Math.random() * 390, 419, 'javaFern');
	console.log("Added some java fern");
	numJavaFern += 1;
}
function updateJavaFernGrowth(){
	JavaFernGroup.forEach( function(item){
		if(item != null){
			if(CO2 >= 10){
				CO2 -= 10;
				O2 += 10;
			}
			else{
				console.log("java fern died");
				numJavaFern -= 1;
				JavaFernGroup.remove(item);
			}
		}
	});
}

//TODO add function for MossBalls
function addMossBall(){
	gold -= 50;
	MoneyText.value = "Gold: " + gold + "g";
	MossBallGroup.create(240 + Math.random() * 390, 440, 'mossBall');
	console.log("Added a moss ball");
	numMossBalls += 1;
}
function UpdateMossBallGrowth(){
	MossBallGroup.forEach( function(item){
		if(item != null){
			if(CO2 >= 20){
				CO2 -= 20;
				O2 += 20;
			}
			else if( CO2 > 0 && CO2 < 20){
				console.log("mossball does nothing");
			}
			else{
				console.log("mossball died");
				DeadMossBallGroup.create(item.x, item.y, 'deadMossBall');
				MossBallGroup.remove(item);
				numMossBalls -= 1;
			}
		}
	});
}

//TODO add functions for pause and resume
function pauseGame(){
	console.log("TODO pause game");
	if(!gamePaused){
		game.time.events.events.forEach( function(item){
			item.timer.paused = true;
		});
		gamePaused = true;
	}else{
		game.time.events.events.forEach( function(item){
			item.timer.paused = false;
		});
		gamePaused = false;
	}
}

/**
*
*
*
*	All of the below functions are for in game menus.
*	
*
*
*
**/

function openMenu(){

    game.paused = true;

    menu = game.add.sprite(game.width/2, game.height/2, 'menuPanel2');
    menu.anchor.setTo(0.5, 0.5);
    MainMenuGroup.add(menu);


    button1 = game.add.sprite(350, 70, 'menuButton');
    button1.inputEnabled = true;
    button1Label = game.add.text(button1.position.x + 10, button1.position.y + 10, 'Resume Game', { font: '24px Arial', fill: '#fff' });
    button1.events.onInputUp.add(function () {
        closeMenu();
    });
    MainMenuGroup.add(button1);
    MainMenuGroup.add(button1Label);

    button2 = game.add.sprite(350, 130, 'menuButton');
    button2.inputEnabled = true;
    button2Label = game.add.text(button2.position.x + 10, button2.position.y + 10, 'Beastiary', { font: '24px Arial', fill: '#fff' });
    button2.events.onInputUp.add(function () {
        closeMenu();
        openBeastiary();
        console.log('beastiary clicked');
    });
    MainMenuGroup.add(button2);
    MainMenuGroup.add(button2Label);

    button3 = game.add.sprite(350, 190, 'menuButton');
    button3.inputEnabled = true;
    button3Label = game.add.text(button3.position.x + 10, button3.position.y + 10, 'Settings', { font: '24px Arial', fill: '#fff' });
    button3.events.onInputUp.add(function () {
        closeMenuOnly();
        openSettings();
    });
    MainMenuGroup.add(button3);
    MainMenuGroup.add(button3Label);

    button4 = game.add.sprite(350, 250, 'menuButton');
    button4.inputEnabled = true;
    button4Label = game.add.text(button4.position.x + 10, button4.position.y + 10, 'Save Game', { font: '24px Arial', fill: '#fff' });
    button4.events.onInputUp.add(function () {
        closeMenu();
        openSaveMenu();
    });
    MainMenuGroup.add(button4);
    MainMenuGroup.add(button4Label);

    button5 = game.add.sprite(350, 310, 'menuButton');
    button5.inputEnabled = true;
    button5Label = game.add.text(button5.position.x + 10, button5.position.y + 10, 'Load Game', { font: '24px Arial', fill: '#fff' });
    button5.events.onInputUp.add(function () {
        closeMenu();
        openLoadMenu();
    });
    MainMenuGroup.add(button5);
    MainMenuGroup.add(button5Label);

    button6 = game.add.sprite(350, 370, 'menuButton');
    button6.inputEnabled = true;
    button6Label = game.add.text(button6.position.x + 10, button6.position.y + 10, 'Quit to Title', { font: '24px Arial', fill: '#fff' });
    button6.events.onInputUp.add(function () {
        closeMenu();
        goToTitle();
    });
    MainMenuGroup.add(button6);
    MainMenuGroup.add(button6Label);

    game.world.bringToTop(MainMenuGroup);

}

function closeMenu(){
	game.paused = false;
	MainMenuGroup.removeAll();
	SettingsMenuGroup.removeAll();
}
function closeMenuOnly(){
	MainMenuGroup.removeAll();
}

function goToTitle(){
	//quit and go to title screen
	console.log('TODO add a thing that says are you sure');
	game.state.start("GameMenu");
}

//TODO add sound and music functions
function muteSound(){
	//TODO mute sound
	soundMuted = true;
	muteSoundBox.visible = false;
	muteSoundBox2.visible = true;
}
function unmuteSound(){
	//TODO unmute sound
	soundMuted = false;
	muteSoundBox.visible = true;
	muteSoundBox2.visible = false;
}
function muteMusic(){
	//TODO mute sound
	musicMuted = true;
	muteMusicBox.visible = false;
	muteMusicBox2.visible = true;
}
function unmuteMusic(){
	//TODO unmute sound
	musicMuted = false;
	muteMusicBox.visible = true;
	muteMusicBox2.visible = false;
}

function openSettings(){
	//TODO make settings menu
	settingsMenu = game.add.sprite(game.width/2, game.height/2, 'menuPanel');
    settingsMenu.anchor.setTo(0.5, 0.5);
    SettingsMenuGroup.add(settingsMenu);

    settingsLabel = game.add.text(settingsMenu.position.x - 50, settingsMenu._bounds.y + 60, 'Settings', { font: '30px Arial', fill: '#fff' });
  	SettingsMenuGroup.add(settingsLabel);

  	backLabel = game.add.text(settingsMenu.position.x - 60, settingsMenu._bounds.y + 400, 'back', { font: '28px Arial', fill: '#fff' });
  	backLabel.inputEnabled = true;
  	backLabel.events.onInputUp.add(function(){
  		closeSettingsMenu();
  	});
  	SettingsMenuGroup.add(backLabel);

  	muteSoundBox = game.add.sprite(settingsMenu._bounds.x + 160, settingsMenu._bounds.y + 120, 'checkBoxEmpty');
  	muteSoundBox.inputEnabled = true;
  	muteSoundBox.events.onInputUp.add(function () {
        muteSound();
        console.log('mute sound clicked');
    });

  	muteMusicBox = game.add.sprite(settingsMenu._bounds.x + 160, settingsMenu._bounds.y + 170, 'checkBoxEmpty');
  	muteMusicBox.inputEnabled = true;
  	muteMusicBox.events.onInputUp.add(function () {
        muteMusic();
        console.log('mute music clicked');
    });

  	muteSoundBox2 = game.add.sprite(settingsMenu._bounds.x + 160, settingsMenu._bounds.y + 120, 'checkBoxFilled');
  	muteSoundBox2.inputEnabled = true;
  	muteSoundBox2.events.onInputUp.add(function () {
        unmuteSound();
        console.log('unmute sound clicked');
    });
    muteSoundBox2.visible = false;

  	muteMusicBox2 = game.add.sprite(settingsMenu._bounds.x + 160, settingsMenu._bounds.y + 170, 'checkBoxFilled');
  	muteMusicBox2.events.onInputUp.add(function () {
        unmuteMusic();
        console.log('unmute music clicked');
    });
    muteMusicBox2.inputEnabled = true;
    muteMusicBox2.visible = false;

  	SettingsMenuGroup.add(muteMusicBox);
  	SettingsMenuGroup.add(muteMusicBox2);
  	SettingsMenuGroup.add(muteSoundBox);
  	SettingsMenuGroup.add(muteSoundBox2);

  	muteSoundBoxLabel = game.add.text(settingsMenu._bounds.x + 200, settingsMenu._bounds.y + 120, 'Mute Sound', { font: '20px Arial', fill: '#fff' });
  	muteMusicLabel = game.add.text(settingsMenu._bounds.x + 200, settingsMenu._bounds.y + 170, 'Mute Music', { font: '20px Arial', fill: '#fff' });
  	SettingsMenuGroup.add(muteMusicLabel);
  	SettingsMenuGroup.add(muteSoundBoxLabel);

  	game.world.bringToTop(SettingsMenuGroup);
}

function closeSettingsMenu(){
	SettingsMenuGroup.removeAll();
	openMenu();
}

function openSaveMenu(){
	//TODO make save menu

}
function openLoadMenu(){
	//TODO make load menu
}

function openBeastiary(){
	//TODO fill this out
	beastMenu = game.add.sprite(game.width/2, game.height/2, 'menuPanel');
    beastMenu.anchor.setTo(0.5, 0.5);
    beastMenuGroup.add(beastMenu);

    beastLabel = game.add.text(beastMenu.position.x - 50, beastMenu._bounds.y + 60, 'Beastiary', { font: '30px Arial', fill: '#fff' });
  	beastMenuGroup.add(beastLabel);

  	backLabel2 = game.add.text(beastMenu.position.x - 60, beastMenu._bounds.y + 400, 'Back', { font: '28px Arial', fill: '#fff' });
  	backLabel2.inputEnabled = true;
  	backLabel2.events.onInputUp.add(function(){
  		closeBeastsMenu();
  	});
  	beastMenuGroup.add(backLabel2);

    game.world.bringToTop(beastMenuGroup);
}
function closeBeastsMenu(){
	beastMenuGroup.removeAll();
	openMenu();
}
function saveGame(){
	//figure out how saves will work
	console.log('TODO Open a save menu to let players save the game');
}
function loadGame(){
	//figure out loading
	console.log('TODO Open a load menu to let players load the game');
}