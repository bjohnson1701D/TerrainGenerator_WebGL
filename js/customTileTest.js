/*var gap = .3;
var size = 10;
BABYLON.Mesh.CreateTile = function (name, x, z, scene) {  
  var tile = new BABYLON.Mesh.CreateBox(name, size ,scene);
  tile.scaling = new BABYLON.Vector3(1, .25, 1);
  tile.position.x = (x * size) + (x * gap);
  tile.position.z = (z * size) + (z * gap);
  tile.loc = {};
  tile.loc.x = x;
  tile.loc.z = z;
  var type = types[Math.round(Math.random()*(types.length-1))];
  tile.type = type;
  tile.material = mats[type];
  return tile;
}*/

function customTiles(scene){
	for(var i = 0; i < 50; i++){
		for(var j = 0; j < 50; j++){
			new BABYLON.Mesh.CreateTile(i+"-"+j,i,j,scene);
		}
	}
}