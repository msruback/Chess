var http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser');

var path = require('path');

var app = express();

var userPath = path.join(__dirname,'user.txt');
var gamePath = path.join(__dirname,'currentGame.txt');

fs = require('fs');

app.use('/',express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.get('/', function(req,res){
    res.writeHead(302,{
        'Location' : 'webChess.html'
    });
    res.end();
})
app.get('/register', function(req, res){
    console.log('registering user');
    fs.readFile(userPath,'utf8', function(err,data){
        var username = req.query['username'];
		var password = req.query['password'];
		if(err){
            return console.log(err);
			res.end('{"success":false,"error":"server error"}');
        }
		var json = JSON.parse(data);
		for(var i=0;i<json.users.length;i++){
			if(json.users[i].username==username){
				res.end('{"success":false,"error":"username taken"}');
			}
		}
		json.users.push({"username":username,"password":password});
        fs.writeFile(userPath,JSON.stringify(json),function(err){
            if(err){
                return console.log(err);
				res.end('{"success":false, "error":"server error"}');
            }
            res.end('{"success":true}');
        });
    });
});
app.get('/newgame', function(req,res){
	var token = '';
	fs.readFile(userPath,'utf8',function(err, data){
		var username = req.query['username'];
		var password = req.query['password'];
		if(err){
            return console.log(err);
			res.end('{"success":false,"error":"server error"}');
        }
		var json = JSON.parse(data);
		for(var i=0;i<json.length-1;i++){
			if(json[i].username==username&&json[i].password==password){
					var token = '';
					for(var i=0;i<20;i++){
						token+=Math.floor(Math.random()*10);
					}
					fs.readFile(gamePath,'utf8',function(err,data){
						json = JSON.parse(data);
						if(json[json.length-1].black==""){
							json[json.length-1].black=token;
							json[json.length-1].currentPlayer='white';
							fs.writeFile(userPath,JSON.stringify(json),function(err){
					            if(err){
					                return console.log(err);
									res.end('{"success":false}');
					            }
								res.end('{"success":true,"token":"'+token+'","color":"black"}');
							});
						}else{
							json.push('{"currentPlayer":"black","white":"'+token+'","black":"","chessboard":"{'+
							'"1":["WR","WN","WB","WQ","WK","WB","WN","WR"],'+
							'"2":["WP","WP","WP","WP","WP","WP","WP","WP"],'+
							'"3":["","","","","","","",""],'+
							'"4":["","","","","","","",""],'+
							'"5":["","","","","","","",""],'+
							'"6":["","","","","","","",""],'+
							'"7":["BP","BP","BP","BP","BP","BP","BP","BP"],'+
							'"8":["BR","BN","BB","BQ","BK","BB","BN","BR"]}"}');
							fs.writeFile(gamePath,JSON.stringify(json),function(err){
					            if(err){
					                return console.log(err);
									res.end('{"success":false,"error":"server error"}');
					            }
								res.end('{"success":true,"token":"'+token+'","color":"white"}');
							});
						}
					});
			}
		}
		res.end('{"success":false,"error":"incorrect username or password"');
	});
});
app.get('/wait', function(req, res){
	fs.readFile(gamePath,'utf8',function(err,data){
		var token = req.query['token'];
		if(err){
            return console.log(err);
			res.end('{"success":false,"error":"server error"}');
        }
		var json = JSON.parse(data);
		for(var i=0;i<json.length-1;i++){
			if(json[i].black==token&&json[i].currentPlayer=="black"){
				res.end('{"waitDone":true, "chess":"'+json[i].chessboard.stringify()+'"}');
			}else if(json[i].white==token&&json[i].currentPlayer=='white'){
					res.end('{"waitDone":true, "chess":"'+json[i].chessboard.stringify()+'"}');
			}else if((json[i].black==token||json[i].white==token)&&json[i].currentPlayer=="win"){
					json.splice(i,1);
					fs.writeFile(gamePath,JSON.stringify(json),function(err){
			            if(err){
			                return console.log(err);
							res.end('{"waitDone":false}');
			            }
						res.end('{"waitDone":true,"chessboard":"lose"}');
					});
			}else if((json[i].black==token||json[i].white==token)&&json[i].currentPlayer=="draw"){
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
app.get('/move',function(req,res){
	fs.readFile(gamePath,'utf8',function(err,data){
		var token = req.query['token'];
		var chessboard = JSON.parse(req.query['chessboard']);
		if(err){
            return console.log(err);
			res.end('{"success":false,"error":"server error"}');
        }
		var json = JSON.parse(data);
		for(var i=0;i<json.length-1;i++){
			if(json[i].black==token&&json[i].currentPlayer=="black"){
				json[i].chessboard = chessboard
				json[i].currentplayer = "white";
				fs.writeFile('users.json',json.stringify(),function(err){
		            if(err){
		                return console.log(err);
						res.end('{"success":false,"error":"server error"}');
		            }
					res.end('{"success":true}');
				});
			}else if(json[i].white==token&&json[i].currentPlayer=="white"){
				json[i].chessboard = chessboard
				json[i].currentplayer = "black"
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
		for(var i=0;i<json.length-2;i++){
			if((json[i].black==token&&json[i].currentPlayer=="black")||(json[i].white==token&&json[i].currentPlayer=="white")){
				json[i].currentPlayer=type;
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

http.createServer(app).listen(3000);