//the new way everything is a sprite.

var Game = function() {};

var map, bgGroup, layer;
var day = 0;
var dayText, OxygenText, CO2Text, MoneyText, ResourcesText;
var CO2 = 1000;
var O2 = 1000;
var gold = 500;
var shrimpCounter = 7;
var BrineShrimpsGroup;
var DeadBrineShrimpsGroup;
var DeadAlgaeGroup;
var AlgaeGroup;
var numAlgae = 0;
var numShrimp = 0;

Game.prototype = {
	
	preload() {
		slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
		slickUI.load('/kenney-theme/kenney.json');

		game.load.tilemap('tank', 'img/ecoSphereGameTileMap.json', null, Phaser.Tilemap.TILED_JSON);
    	game.load.image('tiles', 'img/ecoSphereGameTiles.png');
    	game.load.image('brineShrimp', 'img/brineShrimpSprite.png');
    	game.load.image('deadBrineShrimp', 'img/deadBrineShrimpSprite.png');
    	game.load.image('smallShrimp', 'img/smallshrimp.png');
    	game.load.image('algaeSprite', 'img/algaeSprite.png');
	},

	create() {
		game.add.sprite(0, 0, 'bgImage');
		BrineShrimpsGroup = game.add.group();
		DeadBrineShrimpsGroup = game.add.group();
		AlgaeGroup = game.add.group();
		DeadAlgaeGroup = game.add.group();


		/* Create the map that is used for the fish tank */
		map = game.add.tilemap('tank');
		map.addTilesetImage('TankTiles', 'tiles');
		layer = map.createLayer('jar');
    	layer.resizeWorld();
    	layer.fixedToCamera = false;
    	layer.position.set(this.world.centerX, 30);
    	
		//create menus
		/* THE MENU ON THE LEFT SIDE, buttons to add things*/
		var panelLeft;
		slickUI.add(panelLeft = new SlickUI.Element.Panel(8, 8, 150, game.height - 16));

		var AddThingsText = new SlickUI.Element.Text(0,0, "Flora And Fauna", 12);
		var FloraText = new SlickUI.Element.Text(0,40, "Flora", 14);
		var FaunaText = new SlickUI.Element.Text(0,120, "Fauna", 14);
		var addAlgaeButton, addBrineShrimpButton, resumeButton, pauseButton;
		
		panelLeft.add(AddThingsText);
		panelLeft.add(FloraText);
		panelLeft.add(FaunaText);

		panelLeft.add(addAlgaeButton = new SlickUI.Element.Button(0,70, 120, 40));
		addAlgaeButton.events.onInputUp.add(function () {
			AddAlgae();
		});
		addAlgaeButton.add(new SlickUI.Element.Text(0,0, "Add Algae")).center();

		panelLeft.add(addBrineShrimpButton = new SlickUI.Element.Button(0,150, 120, 40));
		addBrineShrimpButton.events.onInputUp.add(function () {
			AddBrineShrimp();
		});
		addBrineShrimpButton.add(new SlickUI.Element.Text(0,0, "Add Brine Shrimp", 10)).center();


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

		game.time.events.loop(Phaser.Timer.SECOND * 10, UpdateDay, this);
		game.time.events.loop(Phaser.Timer.SECOND * 0.5, UpdateBrineShrimpMovement, this);

	},

	update() {
	}, 

	render() {
		//game.debug.inputInfo(32, 32);
    	//game.debug.spriteInputInfo(sprite, 32, 130);
    	//game.debug.pointer( game.input.activePointer );
	},
};

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
	console.log(numAlgae);
}

/*
function UpdateAlgaeGrowth(){
	//loop through entire map

	for(var y = 0; y < map.height; ++y){
		for(var x = 0; x < map.width; ++x){      
			
			var tile = map.getTile(x, y, layer);
			//console.log(tile);
			if(tile != null){	//check if tile exists

				if(tile.index == 2){	//check if tile is deadshrimp
					CO2 += 1;
					map.putTile(5, x, y, layer);
				}

				else if(tile.index == 1){	//check if tile is alive
					if(CO2 > 0){	//if CO2
						CO2 -= 1;
						O2 += 1;
						if(numAlgae < 6384 && CO2 > 0){
							//get random number to choose direction?
							n = Math.floor(Math.random()*(4-1+1)+1);
							if(n == 1){
								//if(map.getTile(x-1,y,layer).index == 5 && map.getTile(x-1,y,layer).index != 1){
								if(map.getTile(x-1,y,layer).index == 5){
									map.putTile(1, x-1, y, layer);
									AlgaeIncreased();
								}
							}else if(n == 2){
								if(map.getTile(x+1,y,layer).index == 5){
									map.putTile(1, x+1, y, layer);
									AlgaeIncreased();
								}
							}else if(n == 3){
								if(map.getTile(x,y-1,layer).index == 5){
									map.putTile(1, x, y-1, layer);
									AlgaeIncreased();
								}
							}else{
								if(map.getTile(x,y+1,layer).index == 5){
									map.putTile(1, x, y+1, layer);
									AlgaeIncreased();
								}
							}
						}
					}
					else if(CO2 <= 0){	//if no CO2
						map.putTile(2, x, y, layer);
						numAlgae -= 1;
					}
				}
			}

		}
	}

	console.log(numAlgae);
}
*/
/*
function AddAlgae(){
	maxHeight = map.height;
	maxWidth = map.width;
	minHeight = 1;
	minWidth = 1;
	isAlgaeAdded = false;
	while(isAlgaeAdded == false){
		y = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
		x = Math.floor(Math.random()*(maxWidth-minWidth+1)+minWidth);

		var tile = map.getTile(x, y, layer);

		if(tile.index == 5 && gold >= 5){
			map.putTile(1, x, y, layer);
			isAlgaeAdded = true;
			gold -= 5;
			MoneyText.value = "Gold: " + gold + "g";
			numAlgae += 1;
		}
	}
	//console.log("Added some algae");
}
*/

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
	BrineShrimpsGroup.create(230 + Math.random() * 440, 36 + Math.random() * 440, 'smallShrimp');
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
							tempShrimpGroup.create(item.x - 4, item.y, 'smallShrimp');
							BrineShrimpIncreased();
						}
					}
					else if(n == 2){
						if(item.x < 665){ //673 - 8?
							tempShrimpGroup.create(item.x + 4, item.y, 'smallShrimp');
							BrineShrimpIncreased();
						}
					}
					else if(n == 3){
						if(item.y > 38){ //34 + 4?
							tempShrimpGroup.create(item.x, item.y - 4, 'smallShrimp');
							BrineShrimpIncreased();
						}
					}
					else{
						if(item.y < 469){ //477 - 8?
							tempShrimpGroup.create(item.x, item.y + 4, 'smallShrimp');
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
			BrineShrimpsGroup.create(item.x, item.y, 'smallShrimp');
			//tempShrimpGroup.remove(item);
		}
	});
	tempShrimpGroup.removeChildren();
	//console.log(tempShrimpGroup.total); //should be 0
	console.log(numShrimp);
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

function pauseGame(){
	console.log("TODO pause game");
}

function resumeGame(){
	console.log("TODO resume game")
}