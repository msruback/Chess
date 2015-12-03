var http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser');

var app = express();

fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.get('/register', function(req, res){
    console.log('registering user');
    var toAdd='{"username":"'+req["username"]+'",\n"password":"'+req["password"]+'"\n},\n"';
    fs.readFile('user.json','utf8', function(err,data){
        if(err){
            return console.log(err);
        }
		var json = JSON.parse(data);
		for(var i=0;i<json.length-1;i++){
			if(json[i].username==req["username"]){
				res.end('{"success":false,"error":"username taken"}');
			}
		}
        var resultString='';
        for(var i=0;i<data.length-3;i++){
            resultString+=data.charAt(i);
        }
        resultString+=toAdd+']';
        fs.writeFile('users.json',resultString,function(err){
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
	fs.readFile('user.json','utf8',function(err, data){
		var json = JSON.parse(data);
		for(var i=0;i<json.length-1;i++){
			if(json[i].username==req["username"]&&json[i].password==req["password"]){
					var token = '';
					for(var i=0;i<20;i++){
						token+=Math.floor(Math.random()*10);
					}
					fs.readFile('currentGames.json','utf8',function(err,data){
						json = JSON.parse(data);
						if(json[json.length-1].black==""){
							json[json.length-1].black=token;
							json[json.length-1].currentPlayer='white';
							fs.writeFile('users.JSON',json.stringify(),function(err){
					            if(err){
					                return console.log(err);
									res.end('{"success":false}');
					            }
								res.end('{"success":true,"chessboard":"'+json[json.length-1].chessboard.stringify()+'","token":"'+token+'","color":"black"}');
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
							fs.writeFile('currentGames.json',json.stringify(),function(err){
					            if(err){
					                return console.log(err);
									res.end('{"success":false,"error":"server error"}');
					            }
								res.end('{"success":true,"chessboard":"wait","token":"'+token+'","color":"white"}');
							});
						}
					});
			}
		}
		res.end('{"success":false,"error":"incorrect username or password"');
	});
});
app.get('/wait', function(req, res){
	fs.readFile('currentGames.json','utf8',function(err,data){
		var json = JSON.parse(data);
		for(var i=0;i<json.length-1;i++){
			if(json[i].black==req["token"]&&json[i].currentPlayer=="black"){
				res.end('{"waitDone":true, "chess":"'+json[i].chessboard.stringify()+'"}');
			}else if(json[i].white==req["token"]&&json[i].currentPlayer=='white'){
					res.end('{"waitDone":true, "chess":"'+json[i].chessboard.stringify()+'"}');
			}else if((json[i].black==req["token"]||json[i].white==req["token"])&&json[i].currentPlayer=="win"){
					json.splice(i,1);
					fs.writeFile('currentGames.json',json.stringify(),function(err){
			            if(err){
			                return console.log(err);
							res.end('{"waitDone":false}');
			            }
						res.end('{"waitDone":true,"chessboard":"lose"}');
					});
			}else if((json[i].black==req["token"]||json[i].white==req["token"])&&json[i].currentPlayer=="draw"){
					json.splice(i,1);
					fs.writeFile('currentGames.json',json.stringify(),function(err){
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
	fs.readFile('currentGames.json','utf8',function(err,data){
		var json = JSON.parse(data);
		for(var i=0;i<json.length-1;i++){
			if(json[i].black==req["token"]&&json[i].currentPlayer=="black"){
				json[i].chessboard = req["chessboard"];
				json[i].currentplayer = "white";
				fs.writeFile('users.json',json.stringify(),function(err){
		            if(err){
		                return console.log(err);
						res.end('{"success":false,"error":"server error"}');
		            }
					res.end('{"success":true}');
				});
			}else if(json[i].white==req["token"]&&json[i].currentPlayer=="white"){
				json[i].chessboard = req["chessboard"];
				json[i].currentplayer = "black"
				fs.writeFile('currentGames.json',json.stringify(),function(err){
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
	fs.readFile('currentGames.json','utf8',function(err,data){
		var json = JSON.parse(data);
		for(var i=0;i<json.length-2;i++){
			if((json[i].black==req["token"]&&json[i].currentPlayer=="black")||(json[i].white==req["token"]&&json[i].currentPlayer=="white"){
				json[i].currentPlayer=req["type"];
				fs.writeFile('currentGames.json',json.stringify(),function(err){
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