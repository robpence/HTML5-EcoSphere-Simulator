//The old way, all of the flora and fauna in a tilemap



var Game = function() {};

var map, bgGroup, layer;
var day = 0;
var dayText, OxygenText, CO2Text, MoneyText, ResourcesText;
var CO2 = 10000;
var O2 = 10000;
var gold = 500;
var shrimpCounter = 3;

Game.prototype = {
	
	preload() {
		slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
		slickUI.load('/kenney-theme/kenney.json');

		game.load.tilemap('tank', 'img/ecoSphereGameTileMap.json', null, Phaser.Tilemap.TILED_JSON);
    	game.load.image('tiles', 'img/ecoSphereGameTiles.png');
	},

	create() {
		game.add.sprite(0, 0, 'bgImage');

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
		panelRight.add(pauseButton = new SlickUI.Element.Button(0,430, 60, 40));
		pauseButton.events.onInputUp.add(function () {
			pauseGame();
		});
		pauseButton.add(new SlickUI.Element.Text(0,0, "Pause")).center();
		panelRight.add(resumeButton = new SlickUI.Element.Button(70,430, 60, 40));
		resumeButton.events.onInputUp.add(function () {
			resumeGame();
		});
		resumeButton.add(new SlickUI.Element.Text(0,0, "Play")).center();

		game.time.events.loop(Phaser.Timer.SECOND * 5, UpdateDay, this);
		game.time.events.loop(Phaser.Timer.SECOND * 2, UpdateBrineShrimpMovement, this);
		//maybe add a second loop thats on a 1 or 2 second timer that lets the animals move around?

	},

	update() {
	}, 

	render() {
	},
};

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

function UpdateAlgaeGrowth(){
	//loop through entire map
	var algaeCounter = 0;

	for(var y = 0; y < map.height; ++y){
		for(var x = 0; x < map.width; ++x){      
			
			var tile = map.getTile(x, y, layer);
			//console.log(tile);
			if(tile != null){
				if(tile.index == 2){
					CO2 += 1;
					map.putTile(5, x, y, layer);
				}
				if(tile.index == 1){
					algaeCounter += 1;

					if(CO2 > 0){
						CO2 -= 1;
						O2 += 1;
						if(algaeCounter < 6384){
							//get random number to choose direction?
							n = Math.floor(Math.random()*(4-1+1)+1);
							if(n == 1){
								if(map.getTile(x-1,y,layer).index == 5 && map.getTile(x-1,y,layer).index != 1){
									map.putTile(1, x-1, y, layer);
								}
							}else if(n == 2){
								if(map.getTile(x+1,y,layer).index == 5 && map.getTile(x+1,y,layer).index != 1){
									map.putTile(1, x+1, y, layer);
									x+=1;
								}
							}else if(n == 3){
								if(map.getTile(x,y-1,layer).index == 5 && map.getTile(x,y-1,layer).index != 1){
									map.putTile(1, x, y-1, layer);
								}
							}else{
								if(map.getTile(x,y+1,layer).index == 5 && map.getTile(x,y+1,layer).index != 1){
									map.putTile(1, x, y+1, layer);
								}
							}
						}
					}else if(CO2 <= 0){
						map.putTile(2, x, y, layer);
					}
				}
			}

		}
	}
}

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
		}
	}
	//console.log("Added some algae");
}

function AddBrineShrimp(){
	maxHeight = map.height;
	maxWidth = map.width;
	minHeight = 1;
	minWidth = 1;
	isBrineShrimpAdded = false;
	while(isBrineShrimpAdded == false){
		y = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
		x = Math.floor(Math.random()*(maxWidth-minWidth+1)+minWidth);

		var tile = map.getTile(x, y, layer);

		if(tile.index == 5 && gold >= 10){
			map.putTile(3, x, y, layer);
			isBrineShrimpAdded = true;
			gold -= 10;
			MoneyText.value = "Gold: " + gold + "g";
		}
	}
	//console.log("Added some brine shrimp");
}

function UpdateBrineShrimpGrowth(){
	//loop through entire map
	var brineShrimpCounter = 0;

	for(var y = 0; y < map.height; ++y){
		for(var x = 0; x < map.width; ++x){      
			
			var tile = map.getTile(x, y, layer);
			//console.log(tile);
			if(tile != null){
				if(tile.index == 4){
					map.putTile(5, x, y, layer);
					CO2 += 1;
				}
				if(tile.index == 3){
					if(O2 > 0){
						CO2 += 1;
						O2 -= 1;
						//reproduce
						if(brineShrimpCounter < 3192 && day % shrimpCounter == 0){
								n = Math.floor(Math.random()*(4-1+1)+1);
								if(n == 1){
									if(map.getTile(x-1,y,layer).index == 5){
										map.putTile(3, x-1, y, layer);
									}
								}else if(n == 2){
									if(map.getTile(x+1,y,layer).index == 5){
										map.putTile(3, x+1, y, layer);
										x+=1;
									}
								}else if(n == 3){
									if(map.getTile(x,y-1,layer).index == 5){
										map.putTile(3, x, y-1, layer);
									}
								}else{
									if(map.getTile(x,y+1,layer).index == 5){
										map.putTile(3, x, y+1, layer);
										//need way to skip this tile but so far idk
									}
								}
						}
					}else if(O2 == 0){
						map.putTile(4, x, y, layer);
					}
				}
			}

		}
	}
}

function UpdateBrineShrimpMovement(){
	//console.log("shrimp are moving");

	for(var y = 0; y < map.height; ++y){
		for(var x = 0; x < map.width; ++x){ 

			var tile = map.getTile(x, y, layer);
			//console.log(tile);

			if(tile != null){
				if(tile.index == 3){
					//movement
					n = Math.floor(Math.random()*(4-1+1)+1);
					//console.log(n);
					if(n == 1){
						x2 = Math.max(x-2, 3);
						//console.log(x);
						if(map.getTile(x2-2,y,layer).index == 5){
							map.putTile(3, x2-2, y, layer);
							map.putTile(5, x, y, layer);
						}
					}else if(n == 2){
						x2 = Math.min(x+2, 110);
						//console.log(x);
						if(map.getTile(x2+2,y,layer).index == 5){
							map.putTile(3, x2+2, y, layer);
							map.putTile(5, x, y, layer);
							x+=1;
						}
					}else if(n == 3){
						y2 = Math.max(y-2, 3);
						//console.log(y);
						if(map.getTile(x,y2-2,layer).index == 5){
							map.putTile(3, x, y2-2, layer);
							map.putTile(5, x, y, layer);
						}
					}else{
						y2 = Math.min(y+2, 110);
						//console.log(y);
						if(map.getTile(x,y2+2,layer).index == 5){
							map.putTile(3, x, y2+2, layer);
							map.putTile(5, x, y, layer);
						}
					}
				}
			}
		}
	}
}

function pauseGame(){
	console.log("TODO pause game");
}

function resumeGame(){
	console.log("TODO resume game")
}