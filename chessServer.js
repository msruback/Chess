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
    var toAdd='{"username":"'+req["username"]+'",\n"password":"'+req["password"]+'"\n},\n";
    fs.readFile('user.JSON','utf8', function(err,data){
        if(err){
            return console.log(err);
        }
		var json = JSON.parse(data);
		for(var i=0;i<json.length-1;i++){
			if(json[i].username==req["username"]){
				res.end('{"success":false,"reason","username taken"}');
			}
		}
        var resultString='';
        for(var i=0;i<data.length-3;i++){
            resultString+=data.charAt(i);
        }
        resultString+=toAdd+']'
        fs.writeFile('users.JSON',resultString,function(err){
            if(err){
                return console.log(err);
				res.end('{"success":false}');
            }
            res.end('{"success":true}');
        })
    })
});
app.get('/login', function(req, res){
	fs.readfile('user.JSON','utf8',function(err, data){
		var json = JSON.parse(data);
		for(var i=0;i<json.length-1;i++){
			if(json[i].username==req["username"]){
				if(json[i].password==req["password"]){
					var token = '';
					for(var i=0;i<20;i++){
						token+=Math.floor(Math.random()*10);
					}
					res.end('{"success":true,"token":"'+token+'"}');
				}
			}
		}
	});
});

http.createServer(app).listen(3000);