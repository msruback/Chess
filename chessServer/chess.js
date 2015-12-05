var serverURL = 'localhost:3000';
var registerNewUser = function(){
	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;
	$.getJSON(serverURL+'/register?username='+username+'&password='+password,function(json){
		if(json.success){
			document.getElementById('message').innerHTML('User Registered');
		}else{
			document.getElementById('message').innerHTML(json.error);
		}
	});
}
var startNewGame = function(){
	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;
	$.getJSON(serverURL+'/login?username='+username+'&password='+password,function(json){
		if(json.success){
			document.getElementById('message').innerHTML('New Game');
		}else{
			document.getElementById('message').innerHTML(json.error);
		}
	});
}