

// if user is running mozilla then use it's built-in WebSocket
window.WebSocket = window.WebSocket || window.MozWebSocket;

// if browser doesn't support WebSocket, just show some notification and exit
if (!window.WebSocket) {
	alert('asi stary browser. nevi to websocket');
}

// open connection
var connection = new WebSocket('ws://127.0.0.1:1337');

connection.onerror = function (error) {
	// just in there were some problems with conenction...
	// zas chyba
	alert('chyba s pripojenim k socketu (nieco sa dojebalo)');
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
goog.require('lime.animation.MoveBy');

goog.require('goog.events.KeyCodes');
 
// entrypoint
totalroyal.start = function(){

	var director = new lime.Director(document.body,1024,768),
	scene = new lime.Scene();

	var playerOneTarget = new lime.Layer().setPosition(40,384);
	var playerOne = new lime.Circle().setSize(50,50).setFill(255,150,0);
	playerOneTarget.appendChild(playerOne);
	scene.appendChild(playerOneTarget);
	
	var maxShots = 10;
	var playerOneRockets = [];
	
	var templ = {
		target : new lime.Layer(),
		rocket : new lime.Circle().setSize(10,10).setFill(40,40,0)
	};
	
	for (var i=1; i<=maxShots; i++) {
		playerOneRockets.push(templ); 
	}
	
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
		
		if (e.keyCode == goog.events.KeyCodes.ENTER) {
			for (var i in playerOneRockets) {
				pOnePos = playerOneTarget.getPosition();
				
				playerOneRockets[i].target.setPosition(pOnePos.x,pOnePos.y);
				playerOneRockets[i].target.appendChild(playerOneRockets[i].rocket);
				scene.appendChild(playerOneRockets[i].target);
				
				var moveright = new lime.animation.MoveBy(+200,0).setSpeed(1);
				
				playerOneRockets[i].target.runAction(moveright);
			}
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

