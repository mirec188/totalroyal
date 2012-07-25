

// if user is running mozilla then use it's built-in WebSocket
window.WebSocket = window.WebSocket || window.MozWebSocket;

// if browser doesn't support WebSocket, just show some notification and exit
if (!window.WebSocket) {
	// chyba
}

// open connection
var connection = new WebSocket('ws://127.0.0.1:1337');

connection.onerror = function (error) {
	// just in there were some problems with conenction...
	// zas chyba
	alert('chyba');
};


//set main namespace
goog.provide('totalroyal');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');

goog.require('goog.events.KeyCodes');
 
// entrypoint
totalroyal.start = function(){

	var director = new lime.Director(document.body,1024,768),
	scene = new lime.Scene();

	var playerOneTarget = new lime.Layer().setPosition(512,384);
	var playerOne = new lime.Circle().setSize(150,150).setFill(255,150,0);
   
	//add circle and label to target object
	playerOneTarget.appendChild(playerOne);
    
	//add target and title to the scene
	scene.appendChild(playerOneTarget);
    
	director.makeMobileWebAppCapable();

	//add some interaction
	goog.events.listen(document,['keydown'],function(e){
		pOnePos = playerOneTarget.getPosition();
		if (e.keyCode == goog.events.KeyCodes.UP) {
			var newY = parseInt(pOnePos.y)-5;
			playerOneTarget.setPosition(pOnePos.x, newY);
			var msg = 'p1-'+newY;
			connection.send(msg);
		}
		if (e.keyCode == goog.events.KeyCodes.DOWN) {
			var newY = parseInt(pOnePos.y)+5;
			playerOneTarget.setPosition(pOnePos.x, newY);
			var msg = 'p1-'+newY;
			connection.send(msg);
		}
	});
	
	 connection.onmessage = function (message) {
		 
		 var data = JSON.parse(message.data).data;
		 var d = data.split('-');
		 var player = d[0];
		 var posY = d[1];
		 pOnePos = playerOneTarget.getPosition();
		 playerOneTarget.setPosition(pOnePos.x, posY);
	 }
	
	// set current scene active
	director.replaceScene(scene);

}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('totalroyal.start', totalroyal.start);

