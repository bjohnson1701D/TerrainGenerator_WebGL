var edgeValue=10;

/**
* Entry point for terrain generation.
* Calls all subsequent terrain generation functions.
*/
function generateTerrain(scene){
	createTerrain();	
	generateDeserts();
	var lakeX = randomBetween(WORLD.size/edgeValue, WORLD.size-(WORLD.size/edgeValue));//getRandom(Math.floor(WORLD.size/8), WORLD.size/8, 0);
	var lakeY = randomBetween(WORLD.size/edgeValue, WORLD.size-(WORLD.size/edgeValue));
	createLake(lakeX,lakeY,2,5);
	updateTerrain();
	forestArea = largeForests(3);
	generateForests(forestArea);
	mountainArea = largeMountain(1);
	generateMountains(mountainArea);
	generateGround();
	generate(scene);
}

function randomBetween(min, max,val){
	var ret = min + Math.floor(Math.random()*(max-min));
	return ret;
}
/**
* Initial random terrain generation.
*/
function createTerrain(){
	var lastMat = "grass";
	for(var i = 0; i < WORLD.size; i++){
		for(var j = 0; j < WORLD.size; j++){
			//TODO: logic to group mats better!
			var adjmat = "grass";//first row will always use 'grass' as its adjacent material
			try{adjmat = _tiles[i-1+"-"+j].type}catch(e){};
			var mats = [
			 lastMat, lastMat, lastMat, lastMat,lastMat,lastMat,lastMat,lastMat,lastMat,lastMat,lastMat,lastMat,lastMat,lastMat,lastMat,//15 lastmat's
			 adjmat,adjmat,adjmat,adjmat,adjmat,adjmat,adjmat,adjmat,adjmat,adjmat,adjmat,adjmat,adjmat,adjmat,adjmat,//15 adjmat's
			 "grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","water","water","water",];//more likely to use the last material or an adjacent material than a new one
			var r = Math.floor(Math.random()*(mats.length));
			lastMat = mats[r]  || "grass";
			var tileName = i+"-"+j;
			var t = new Tile(i, j, lastMat, tileName);
			WORLD.tiles[tileName] = t;
		}
	}
}
BABYLON.Mesh.Resource = function (parent, x , z, r) {
  if(r==undefined){
	return;
  }
  var size = WORLD.tileSize;
  var resource = new BABYLON.Mesh.CreateBox(r.type, size/3 ,scene);
  resource.scaling = new BABYLON.Vector3(1, 1, 1);
  resource.parent = parent;
  resource.position.x = x;
  resource.position.z = z;  
  resource.position.y = size;//on top of parent.
  resource.material = mats[r.type];
}

function generateForests(largeForests){
	var chance;
	_.each(WORLD.tiles,function(tile){
		if(tile.type=="grass"){
		if(_.contains(largeForests, tile.name)){
			chance = 2;
		}else{
			chance = WORLD.forestChance;
		}
		
		if(Math.floor(Math.random()*chance)==1){
			tile.resources.sw = new Resource("forest");
		}
		if(Math.floor(Math.random()*chance)==1){
			tile.resources.se = new Resource("forest");		
		}
		if(Math.floor(Math.random()*chance)==1){
			tile.resources.nw = new Resource("forest");
		}
		if(Math.floor(Math.random()*chance)==1){
			tile.resources.ne = new Resource("forest");
		}
		if(Math.floor(Math.random()*chance)==1){
			tile.resources.w = new Resource("forest");
		}	
		if(Math.floor(Math.random()*chance)==1){
			tile.resources.e = new Resource("forest");
		}
		if(Math.floor(Math.random()*chance)==1){
			tile.resources.s = new Resource("forest");
		}
		if(Math.floor(Math.random()*chance)==1){
			tile.resources.n = new Resource("forest");
		}
		if(Math.floor(Math.random()*chance)==1){
			tile.resources.c = new Resource("forest");
		}		
		}
	});
}
function generateMountains(largeMountain){
	var chance;
	_.each(WORLD.tiles,function(tile){
		if(tile.type=="grass"){
		if(_.contains(largeMountain, tile.name)){
			chance = 2;
		}else{
			chance = WORLD.mountainChance;
		}
		
		if(Math.floor(Math.random()*chance)==1){
			tile.resources.sw = new Resource("mountain");
		}
		if(Math.floor(Math.random()*chance)==1){
			tile.resources.se = new Resource("mountain");		
		}
		if(Math.floor(Math.random()*chance)==1){
			tile.resources.nw = new Resource("mountain");
		}
		if(Math.floor(Math.random()*chance)==1){
			tile.resources.ne = new Resource("mountain");
		}
		if(Math.floor(Math.random()*chance)==1){
			tile.resources.w = new Resource("mountain");
		}	
		if(Math.floor(Math.random()*chance)==1){
			tile.resources.e = new Resource("mountain");
		}
		if(Math.floor(Math.random()*chance)==1){
			tile.resources.s = new Resource("mountain");
		}
		if(Math.floor(Math.random()*chance)==1){
			tile.resources.n = new Resource("mountain");
		}
		if(Math.floor(Math.random()*chance)==1){
			tile.resources.c = new Resource("mountain");
		}		
		}
	});
}

BABYLON.Mesh.CreateTile = function (name, type, x, z, scene) {  
  var gap = WORLD.gap;
  var tile = new BABYLON.Mesh.CreateBox(name, WORLD.tileSize ,scene);
  tile.scaling = new BABYLON.Vector3(1, .1, 1);
  tile.position.x = (x * WORLD.tileSize) + (x * gap);
  tile.position.z = (z * WORLD.tileSize) + (z * gap);
  tile.loc = {};
  tile.loc.x = x;
  tile.loc.z = z;
  tile.type = type;
  tile.material = mats[type];
  return tile;
}

function waterAnim(tile){
		var waterAnimation = new BABYLON.Animation("waterAnimation", "position.y", 30, 
			BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
		var keys = [];
		var t = 100+Math.round(Math.random()*33);
		keys.push({frame: 0,value: -.5});
		keys.push({frame: t/2,value: .5});
		keys.push({frame: t,value: -.5});
		waterAnimation.setKeys(keys);
		tile.animations.push(waterAnimation);
		scene.beginAnimation(tile, 0, t, true);
}

/**
* For sorting an array of numbers
*/
function sortNumber(a,b) {
    return a - b;
}

function createLake(x,y,min,vari){
	WORLD.landmarks.push(new Landmark(x,y,"Great Lake"));
	_.each(WORLD.tiles, function(tile){
		var a = tile.x;
		var b = tile.z;
		if((a<x+getRandom(min,vari)&&a>x-getRandom(min,vari))&&(b<y+getRandom(min,vari)&&b>y-getRandom(min,vari))||
		(a<x+getRandom(min,vari)&&a>x-getRandom(min,vari))&&(b<y+getRandom(min,vari)&&b>y-getRandom(min,vari))){
			tile.type = "water";
		}
	});
	var angle = Math.random()*Math.PI*2;
	var lmx = Math.round(Math.cos(angle)*20) + x;
	var lmy = Math.round(Math.sin(angle)*20) + y;
	marshLands(lmx,lmy,3,3,"Marsh", "Marsh of the Lake");
}

function updateTerrain(){
	_.each(WORLD.tiles, function(tile){
		var x = tile.x;
		var z = tile.z;
		var northTile = getPropByCoords(x,z+1,"type") || "";
		var southTile = getPropByCoords(x,z-1,"type") || "";
		var eastTile = getPropByCoords(x+1,z,"type") || "";
		var westTile = getPropByCoords(x-1,z,"type") || "";
		var neTile = getPropByCoords(x-1,z+1,"type") || "";
		var nwTile = getPropByCoords(x+1,z+1,"type") || "";
		var seTile = getPropByCoords(x-1,z-1,"type") || "";
		var swTile = getPropByCoords(x+1,z-1,"type") || "";
		if((northTile=="water"||northTile=="deep_water")&&//Make deep water if surrounded by other water
		   (southTile=="water"||southTile=="deep_water")&&
		   (eastTile=="water"||eastTile=="deep_water")&&
		   (neTile=="water"||neTile=="deep_water")&&
		   (nwTile=="water"||nwTile=="deep_water")&&
		   (seTile=="water"||seTile=="deep_water")&&
		   (swTile=="water"||swTile=="deep_water")&&
		   (westTile=="water"||westTile=="deep_water")){
				tile.type="deep_water";
		}
	});
}

function generateDeserts(){
	var size = WORLD.size;
	//var x = Math.floor(Math.random()*size);
	//var y = (size/2) + ((Math.floor(Math.random()*(size/10)) - (size/5)));
	var x = randomBetween(WORLD.size/edgeValue, WORLD.size-(WORLD.size/edgeValue));
	var y = randomBetween(WORLD.size/edgeValue, WORLD.size-(WORLD.size/edgeValue));
	WORLD.landmarks.push(new Landmark(x,y,"The Desert"));
	_.each(WORLD.tiles,function(tile){
		var a = tile.x;
		var b = tile.z;
		if((a<x+getRandom(1,3)&&a>x-getRandom(1,3))&&(b<y+getRandom(1,3)&&b>y-getRandom(1,3))||
		(a<x+getRandom(1,3)&&a>x-getRandom(1,3))&&(b<y+getRandom(1,3)&&b>y-getRandom(1,3))){
			if(tile.type=="water"){
				tile.type="grass";
			}
			if(tile.type=="grass"){
				tile.type="desert";
			}
		}
	});
}

function largeForests(numberForests){	
	var forestArea = [];
	var worldSize = WORLD.size;
	
	for(var i = 0; i < numberForests; i++){
		var x = randomBetween(WORLD.size/edgeValue, WORLD.size-(WORLD.size/edgeValue));//= Math.floor(Math.random()*worldSize);
		var y = randomBetween(WORLD.size/edgeValue, WORLD.size-(WORLD.size/edgeValue));//= Math.floor(Math.random()*worldSize);
		WORLD.landmarks.push(new Landmark(x,y,"Forest "+i));
		_.each(WORLD.tiles,function(tile){
			var a = tile.x;
			var b = tile.z;
			var base = tile.base
			if((a<x+getRandom(3,3)&&a>x-getRandom(3,3))&&(b<y+getRandom(3,3)&&b>y-getRandom(3,3))||
			(a<x+getRandom(3,3)&&a>x-getRandom(3,3))&&(b<y+getRandom(3,3)&&b>y-getRandom(3,3))){
				forestArea.push(a+"-"+b);
			}
		});
	}
	return forestArea;
}

function largeMountain(numberMountains){	
	var mountainArea = [];
	var worldSize = WORLD.size;
	
	for(var i = 0; i < numberMountains; i++){
		var x = randomBetween(WORLD.size/edgeValue, WORLD.size-(WORLD.size/edgeValue));//= Math.floor(Math.random()*worldSize);
		var y = randomBetween(WORLD.size/edgeValue, WORLD.size-(WORLD.size/edgeValue));//= Math.floor(Math.random()*worldSize);
		WORLD.landmarks.push(new Landmark(x,y,"Forest "+i));
		_.each(WORLD.tiles,function(tile){
			var a = tile.x;
			var b = tile.z;
			var base = tile.base
			if((a<x+getRandom(3,3)&&a>x-getRandom(3,3))&&(b<y+getRandom(3,3)&&b>y-getRandom(3,3))||
			(a<x+getRandom(3,3)&&a>x-getRandom(3,3))&&(b<y+getRandom(3,3)&&b>y-getRandom(3,3))){
				mountainArea.push(a+"-"+b);
			}
		});
	}
	return mountainArea;
}
/**
* For each tile in the specified location:
* If the tile is water tile, check all tiles to the N,S,E,&W.
* If it's not already a water or deep_water tile, make it a marsh tile.
*/
function marshLands(xpos, ypos, min, vari,name, fullname){
	var size = WORLD.size;
	var x = xpos || randomBetween(WORLD.size/edgeValue, WORLD.size-(WORLD.size/edgeValue));
	var y = ypos || randomBetween(WORLD.size/edgeValue, WORLD.size-(WORLD.size/edgeValue));
	WORLD.landmarks.push(new Landmark(x,y,"Marsh"));
	_.each(WORLD.tiles,function(tile){
		var a = tile.x;
		var b = tile.z;
		var northTile = getGridByCoords(a,b+1);
		var southTile = getGridByCoords(a,b-1);
		var eastTile = getGridByCoords(a+1,b);
		var westTile = getGridByCoords(a-1,b);
		if((a<x+getRandom(min,vari)&&a>x-getRandom(min,vari))&&(b<y+getRandom(min,vari)&&b>y-getRandom(min,vari))||
		(a<x+getRandom(min,vari)&&a>x-getRandom(min,vari))&&(b<y+getRandom(min,vari)&&b>y-getRandom(min,vari))){
			if(tile.type=="water"){
				//if(northTile.material.name!="water"&&northTile.material.name!="deep_water"&&(northTile.material.name.search("snow")==-1))northTile.cat=northTile.material.name="marsh";
				if(northTile.type!="water")northTile.type="marsh";
				if(southTile.type!="water")southTile.type="marsh"
				if(eastTile.type!="water")eastTile.type="marsh";
				if(westTile.type!="water")westTile.type="marsh";
			}
		}
	});
}

function getRandom(min, r1, r2){
			r2 = r2 || r1;
			var min = min;
			var vari = Math.floor(Math.random()*r1)+ Math.floor(Math.random()*r2);
			return min+vari;
}

/**
*Gets a tile from tileGrid by its x and y coordinates
*returns empty object if not found.
**/
function getGridByCoords(x,y){
	return WORLD.tiles[x+"-"+y] || {};
}

/**
*Gets a tile property from tileGrid by its x and y coordinates
*returns empty object if not found.
**/
function getPropByCoords(x,y,prop){
	var tile = WORLD.tiles[x+"-"+y] || {};
	return tile[prop];
}

function generateGround(){
	var groundMat = new BABYLON.StandardMaterial("desert", scene);
	groundMat.diffuseTexture = new BABYLON.Texture("img/desert.jpg", scene)
	groundMat.diffuseTexture.uScale = WORLD.size;
	groundMat.diffuseTexture.vScale = WORLD.size;
	groundMat.diffuseTexture.uOffset = 75;
	groundMat.diffuseTexture.vOffset = 33;
	console.log(groundMat);
	var size = WORLD.tileSize*WORLD.size;
	var ground = new BABYLON.Mesh.CreatePlane("ground",size,scene);
	ground.rotation.x = Math.PI/2;
	ground.position.x = size/2 - (WORLD.tileSize/2);
	ground.position.z = size/2 - (WORLD.tileSize/2);
	ground.position.y = -1;
	ground.material = groundMat;
}

function generate(scene){
	_.each(WORLD.tiles,function(tile){
		var object = new BABYLON.Mesh.CreateTile(tile.name, tile.type, tile.x, tile.z, scene);
		generateResources(object,tile);
	});
}

function generateResources(parent,tile){
	var resources = tile.resources;
	var size = WORLD.tileSize;
	new BABYLON.Mesh.Resource(parent, -(size/3), -(size/3), resources.sw);
	new BABYLON.Mesh.Resource(parent, (size/3), -(size/3), resources.se);
	new BABYLON.Mesh.Resource(parent, (size/3), -(size/3), resources.nw);
	new BABYLON.Mesh.Resource(parent, (size/3), (size/3), resources.ne);
	new BABYLON.Mesh.Resource(parent, -(size/3), 0, resources.w);
	new BABYLON.Mesh.Resource(parent, (size/3), 0, resources.e);
	new BABYLON.Mesh.Resource(parent, 0, -(size/3), resources.s);
	new BABYLON.Mesh.Resource(parent, 0, (size/3), resources.n);
	new BABYLON.Mesh.Resource(parent, 0, 0, resources.c);
}

function cloudDemo(){
	var cGeo = new THREE.CubeGeometry(320, 320, 1, 1);
	var cTexture = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture("/images/cloud.png"),transparent:true,opacity:.5});
	var cMesh = new THREE.Mesh(cGeo, cTexture);
	cMesh.castShadow = true;
	cMesh.position.x = half;
	cMesh.position.y = half;
	cMesh.position.z = 425;
	scene.add(cMesh);
}