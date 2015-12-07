var http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser');

var path = require('path');

var app = express();

var userPath = path.join(__dirname,'user.txt');
var gamePath = path.join(__dirname,'currentGames.txt');

fs = require('fs');

app.use('/',express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
//provides the webChess webpage when requested
app.get('/', function(req,res){
    res.writeHead(302,{
        'Location' : 'webChess.html'
    });
    res.end();
})
//allows a user to register an account
app.get('/register', function(req, res){
    console.log('registering user');
	//reads user file
    fs.readFile(userPath,'utf8', function(err,data){
        var username = req.query['username'];
		var password = req.query['password'];
		if(err){
            return console.log(err);
			res.end('{"success":false,"error":"server error"}');
        }
		var json = JSON.parse(data);
		//checks if username is already taken
		for(var i=0;i<json.users.length;i++){
			if(json.users[i].username==username){
				res.end('{"success":false,"error":"username taken"}');
			}
		}
		//if not, pushes a new user into the json
		json.users.push({"username":username,"password":password,"stats":{"wins":"0","losses":"0","draws":"0","piecesTaken":"0"}});
        //and writes to the user file
		fs.writeFile(userPath,JSON.stringify(json),function(err){
            if(err){
                return console.log(err);
				res.end('{"success":false, "error":"server error"}');
            }
            res.end('{"success":true}');
        });
    });
});
//creates a new game
app.get('/newgame', function(req,res){
	var token = '';
	var username,password,foundUser;
	//reads the user file
	fs.readFile(userPath,'utf8',function(err, data){
		username = req.query['username'];
		password = req.query['password'];
		foundUser = false;
		if(err){
            return console.log(err);
			res.end('{"success":false,"error":"server error"}');
        }
		var json = JSON.parse(data);
		//verifies that the user is registered and their password is correct
		for(var i=0;i<=json.users.length-1;i++){
			if(json.users[i].username==username&&json.users[i].password==password){
				foundUser=true;
			}
		}
		if(foundUser){
				console.log('player is joining a game');
				var token = '';
				//generates a token for the requesting program to use for authentication
				for(var i=0;i<20;i++){
					token+=Math.floor(Math.random()*10);
				}
				console.log(token);
				//reads the game file
				fs.readFile(gamePath,'utf8',function(err,data){
					if(err){
						return console.log(err);
						res.end('{"success":false}');
					}
					json = JSON.parse(data);
					//if there is an open game, add the user to that, as black
					console.log(json.games.length);
					if(json.games.length>0&&json.games[json.games.length-1].black==""){
						json.games[json.games.length-1].black=token;
						//sets the currentPlayer to white so that the game begins
						json.games[json.games.length-1].currentPlayer='white';
						fs.writeFile(gamePath,JSON.stringify(json),function(err){
				            if(err){
				                return console.log(err);
								res.end('{"success":false}');
				            }
							//returns the token, and color of the player
							res.end('{"success":true,"token":"'+token+'","color":"black"}');
						});
					//otherwise, create a new game and set the player to white
					}else{
						console.log('creating new game');
						json.games.push({"currentPlayer":"black","white":token,"black":"","chessboard":{"a":["wr","wp","","","","","bp","br"],"b":["wn","wp","","","","","bp","bn"],"c":["wb","wp","","","","","bp","bb"],"d":["wq","wp","","","","","bp","bq"],"e":["wk","wp","","","","","bp","bk"],"f":["wb","wp","","","","","bp","bb"],"g":["wn","wp","","","","","bp","bn"],"h":["wr","wp","","","","","bp","br"]}});
						fs.writeFile(gamePath,JSON.stringify(json),function(err){
				            if(err){
				                return console.log(err);
								res.end('{"success":false,"error":"server error"}');
							}
							//player should '/wait' until opponent has joined them
							res.end('{"success":true,"token":"'+token+'","color":"white"}');
						});
					}
				});
		}else{
			console.log('incorrect username/password');
			res.end('{"success":false,"error":"incorrect username or password"');
		}
	});
});
//holds players back until it is their turn
app.get('/wait', function(req, res){
	//reads game file
	fs.readFile(gamePath,'utf8',function(err,data){
		var token = req.query['token'];
		if(err){
            return console.log(err);
			res.end('{"success":false,"error":"server error"}');
        }
		var json = JSON.parse(data);
		//searches for provided token in the game file's json
		for(var i=0;i<json.games.length;i++){
			//if the token matches a player, and it is that player's turn, then the response provided is that the wait is done, and the chessboard is given back to them
			if(json.games[i].black==token&&json.games[i].currentPlayer=="black"){
				console.log('wait is over for black');
				res.end('{"waitDone":true,"chessboard":'+JSON.stringify(json.games[i].chessboard)+'}');
			}else if(json.games[i].white==token&&json.games[i].currentPlayer=='white'){
				console.log('wait is over for white');
				res.end('{"waitDone":true,"chessboard":'+JSON.stringify(json.games[i].chessboard)+'}');
			//otherwise, if the game is over, then the wait is over and the game is terminated
			}else if((json.games[i].black==token||json.games[i].white==token)&&json.games[i].currentPlayer=="win"){
					json.splice(i,1);
					fs.writeFile(gamePath,JSON.stringify(json),function(err){
			            if(err){
			                return console.log(err);
							res.end('{"waitDone":false}');
			            }
						res.end('{"waitDone":true,"chessboard":"lose"}');
					});
			}else if((json.games[i].black==token||json.games[i].white==token)&&json.games[i].currentPlayer=="draw"){
					json.splice(i,1);
					fs.writeFile(gamePath,JSON.stringify(json),function(err){
			            if(err){
			                return console.log(err);
							res.end('{"waitDone":false}');
			            }
						res.end('{"waitDone":true,"chessboard":"draw"}');
					});
			}
		}
		res.end('{"waitDone":false}');
	});
});
//allows the player to move a piece
app.get('/move',function(req,res){
	fs.readFile(gamePath,'utf8',function(err,data){
		var token = req.query['token'];
		var chessboard = JSON.parse(req.query['chessboard']);
		if(err){
            return console.log(err);
			res.end('{"success":false,"error":"server error"}');
        }
		var json = JSON.parse(data);
		for(var i=0;i<json.games.length;i++){
			if(json.games[i].black==token&&json.games[i].currentPlayer=="black"){
				console.log('move');
				json.games[i].chessboard = chessboard;
				json.games[i].currentPlayer = "white";
				fs.writeFile(gamePath,JSON.stringify(json),function(err){
		            if(err){
		                return console.log(err);
						res.end('{"success":false,"error":"server error"}');
		            }
					res.end('{"success":true}');
				});
			}else if(json.games[i].white==token&&json.games[i].currentPlayer=="white"){
				json.games[i].chessboard = chessboard;
				json.games[i].currentPlayer = "black";
				fs.writeFile(gamePath,JSON.stringify(json),function(err){
		            if(err){
		                return console.log(err);
						res.end('{"success":false,"error":"server error"}');
		            }
					res.end('{"success":true}');
				});
			}
		}
		res.end('{"success":false,"error":"invalid information"}');
	});
});
app.get('/endGame',function(req,res){
	fs.readFile(gamePath,'utf8',function(err,data){
		var token = req.query['token'];
		var type = req.query['type'];
		if(err){
            return console.log(err);
			res.end('{"success":false,"error":"server error"}');
        }
		var json = JSON.parse(data);
		for(var i=0;i<json.games.length;i++){
			if((json.games[i].black==token&&json.games[i].currentPlayer=="black")||(json.games[i].white==token&&json.games[i].currentPlayer=="white")){
				json.games[i].currentPlayer=type;
				fs.writeFile(gamePath,JSON.stringify(json),function(err){
		            if(err){
		                return console.log(err);
						res.end('{"success":false,"error":"server error"}');
		            }
					res.end('{"success":true}');
				});
			}
		}
		res.end('{"success":false,"error":"invalid information"}');
	});
});
app.get('/addStat',function(req,res){
	var username = req.query['username'];
	var password = req.query['password'];
	var stat = req.query['statName'];
	fs.readFile(userPath,'utf8',function(err,data){
		if(err){
			return console.log(err);
			res.end('{"success":false,"error":"server error"}');
		}
		var json = JSON.parse(data);
		for(var i=0;i<json.users.length;i++){
			if(json.users[i].username==username&&json.users[i].password==password){
				if(stat=='wins'){
					json.users[i].wins++;
				}else if(stat=='losses'){
					json.users[i].losses++;
				}else if(stat=='draws'){
					json.users[i].draws++;
				}else if(stat=='piecesTaken'){
					json.users[i].piecesTaken++;
				}
				fs.writeFile(gamePath,JSON.stringify(json),function(err){
		            if(err){
		                return console.log(err);
						res.end('{"success":false,"error":"server error"}');
		            }
					res.end('{"success":true}');
				});
			}
		}
		res.end('{"success":false}');	
	});
})

http.createServer(app).listen(3000);