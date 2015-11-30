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
				res.end('{"success":false,"reason":"username taken"}');
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
				res.end('{"success":false}');
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
			if(json[i].username==req["username"]){
				if(json[i].password==req["password"]){
					var token = '';
					for(var i=0;i<20;i++){
						token+=Math.floor(Math.random()*10);
					}
					fs.readFile('currentGames.json','utf8',function(err,data){
						json = JSON.parse(data);
						if(json[json.length-1].black==""){
							json[json.length-1].black=token;
							json[json.length-1].currentplayer='white';
							json[json.length-1].chessboard='{'
							'"1":["WR","WN","WB","WQ","WK","WB","WN","WR"],'+
							'"2":["WP","WP","WP","WP","WP","WP","WP","WP"],'+
							'"3":["","","","","","","",""],'+
							'"4":["","","","","","","",""],'+
							'"5":["","","","","","","",""],'+
							'"6":["","","","","","","",""],'+
							'"7":["BP","BP","BP","BP","BP","BP","BP","BP"],'+
							'"8":["BR","BN","BB","BQ","BK","BB","BN","BR"]}';
							fs.writeFile('users.JSON',json.stringify(),function(err){
					            if(err){
					                return console.log(err);
									res.end('{"success":false}');
					            }
								res.end('{"success":true,"chess":"'+json[json.length-1].chessboard.stringify()+'","token":"'+token+'"}');
							});
						}else{
							json.push('{"current":"black","white":"'+token+'","black":"","chessboard":""}');
							fs.writeFile('users.JSON',json.stringify(),function(err){
					            if(err){
					                return console.log(err);
									res.end('{"success":false}');
					            }
								res.end('{"success":true,"chess":"wait","token":"'+token+'"}');
							});
						}
					});
				}else{
					res.end('{"success":false,"error":"incorrect password"');
				}
			}else{
				res.end('{"success":false,"error":"incorrect username"');
			}
		}
	});
});
app.get('/wait', function(req, res){
	fs.readFile('currentGames.json','utf8',function(err,data){
		var json = JSON.parse(data);
		for(var i=0;i<json.length-1;i++){
			if(json[i].black==req["token"]&&json[i].currentplayer=="black"){
				res.end('{"waitDone":true, "chess":"'+json[i].chessboard.stringify()+'"}');
			}else if(json[i].white==req["token"]&&json[i].currentplayer=='white'){
					res.end('{"waitDone":true, "chess":"'+json[i].chessboard.stringify()+'"}');
			}else{
					res.end('{"waitDone":false}');
			}
		}
	});
});
app.get('/move',function(req,res){
	fs.readFile('currentGames.json','utf8',function(err,data){
		var json = JSON.parse(data);
		for(var i=0;i<json.length-1;i++){
			if(json[i].black==req["token"]&&json[i].currentplayer=="black"){
				json[i].chessboard = req["chess"];
				json[i].currentplayer = "white";
				fs.writeFile('users.json',json.stringify(),function(err){
		            if(err){
		                return console.log(err);
						res.end('{"success":false}');
		            }
					res.end('{"success":true}');
				});
			}else if(json[i].white==req["token"]&&json[i].currentplayer=="white"){
				json[i].chessboard = req["chess"];
				json[i].currentplayer = "black"
				fs.writeFile('users.json',json.stringify(),function(err){
		            if(err){
		                return console.log(err);
						res.end('{"success":false}');
		            }
					res.end('{"success":true}');
				});
			}
		}
	})
});

http.createServer(app).listen(3000);