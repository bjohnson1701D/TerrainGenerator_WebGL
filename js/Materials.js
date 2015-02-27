var types = ["grass","water","desert","marsh","deep_water","forest"]
var mats = {}

function materialsInit(scene){
var grassMat = new BABYLON.StandardMaterial("grass", scene);
grassMat.emissiveTexture = new BABYLON.Texture("img/grass.jpg", scene)
grassMat.emissiveTexture.uScale = 3.0;
grassMat.emissiveTexture.vScale = 3.0;
grassMat.simple = new BABYLON.Color3(0.0, .7, .0);
mats.grass = grassMat;

var desertMat = new BABYLON.StandardMaterial("desert", scene);
desertMat.emissiveTexture = new BABYLON.Texture("img/desert.jpg", scene)
desertMat.emissiveTexture.uScale = 3.0;
desertMat.emissiveTexture.vScale = 3.0;
desertMat.simple = new BABYLON.Color3(.7, .5, 0.5);
mats.desert = desertMat;

var marshMat = new BABYLON.StandardMaterial("marsh", scene);
marshMat.emissiveTexture = new BABYLON.Texture("img/marsh.jpg", scene)
marshMat.emissiveTexture.hasAlpha = true;//TODO: png w/ some alpha
marshMat.emissiveTexture.uScale = 3.0;
marshMat.emissiveTexture.vScale = 3.0;
marshMat.simple = new BABYLON.Color3(0.3, .7, .8);
mats.marsh = marshMat;

var waterMat = new BABYLON.StandardMaterial("water", scene);
waterMat.emissiveTexture = new BABYLON.Texture("img/water.jpg", scene)
waterMat.alpha = .6;
waterMat.simple = new BABYLON.Color3(0.0, 0.0, .8);
mats.water = waterMat; 

var forestMat = new BABYLON.StandardMaterial("forest", scene);
forestMat.emissiveTexture = new BABYLON.Texture("img/forest.jpg", scene)
forestMat.simple = new BABYLON.Color3(0.0, 0.4, .0);
mats.forest = forestMat;

var mountainMat = new BABYLON.StandardMaterial("mountain", scene);
//mountainMat.emissiveTexture = new BABYLON.Texture("img/mountain.jpg", scene)
mountainMat.emissiveColor = new BABYLON.Color3.Gray();
mountainMat.simple = new BABYLON.Color3.Gray();
mats.mountain = mountainMat;

var deepWaterMat = new BABYLON.StandardMaterial("deep_water", scene);
deepWaterMat.emissiveTexture = new BABYLON.Texture("img/deep_water.jpg", scene)
deepWaterMat.alpha = .6;
deepWaterMat.simple = new BABYLON.Color3(0.0, 0.0, .4);
mats.deep_water = deepWaterMat;
}