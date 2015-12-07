var serverURL = 'http://localhost:3000';
var secondsWaited=0;
var token = '';
var chessboard;
var files = ["a","b","c","d","e","f","g","h"];
var username,password,chessboard,color;
var registerNewUser = function(){
	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;
	$.getJSON(serverURL+'/register?username='+username+'&password='+password,function(json){
		if(json.success){
			document.getElementById('message').innerHTML='User Registered';
		}else{
			document.getElementById('message').innerHTML=json.error;
		}
	});
}
//this function will run when the user clicks the "New Game" button, having entered a username and password
var startNewGame = function(){
	var tempUsername = document.getElementById('username').value;
	var tempPassword = document.getElementById('password').value;
	//'/newGame' request
	$.getJSON(serverURL+'/newGame?username='+tempUsername+'&password='+tempPassword,function(json){
		if(json.success){
			//stores username and password for stat recording later
			username=tempUsername;
			password=tempPassword;
			//stores token for later game use
			token=json.token;
			//sets the json chessboard representation
			chessboard=JSON.parse('{"a":["wr","wp","","","","","bp","br"],"b":["wn","wp","","","","","bp","bn"],"c":["wb","wp","","","","","bp","bb"],"d":["wq","wp","","","","","bp","bq"],"e":["wk","wp","","","","","bp","bk"],"f":["wb","wp","","","","","bp","bb"],"g":["wn","wp","","","","","bp","bn"],"h":["wr","wp","","","","","bp","br"]}');
			if(json.color=='black'){
				//if the color is black, there is already an opponent to play against, and the game begins.
				color='b';
				document.getElementById('plugin').innerHTML='<table><tr><td></td><td>a</td><td>b</td><td>c</td><td>d</td><td>e</td><td>f</td><td>g</td><td>h</td></tr><tr id=one><td>1</td><td class=a><div class=black><div class=whiteRook></div></div></td><td class=b><div class=white><div class=whiteKnight></div></div></td><td class=c><div class=black><div class=whiteBishop></div></div></td><td class=d><div class=white><div class=whiteQueen></div></div></td><td class=e><div class=black><div class=whiteKing></div></div></td><td class=f><div class=white><div class=whiteBishop></div></div></td><td class=g><div class=black><div class=whiteKnight></div></div></td><td class=h><div class=white><div class=whiteRook></div></div></td><td>1</td><td><input id=move value="Waiting for Opponent" disabled=true type=text></td><td><button id=moveButton type="button" disabled=true onclick=movePiece()>Move</button></td></tr><tr id=two><td>2</td><td class=a><div class=white><div class=whitePawn></div></div></td><td class=b><div class=black><div class=whitePawn></div></div></td><td class=c><div class=white><div class=whitePawn></div></div></td><td class=d><div class=black><div class=whitePawn></div></div></td><td class=e><div class=white><div class=whitePawn></div></div></td><td class=f><div class=black><div class=whitePawn></div></div></td><td class=g><div class=white><div class=whitePawn></div></div></td><td class=h><div class=black><div class=whitePawn></div></div></td><td>2</td></tr><tr id=three><td>3</td><td class=a><div class=black></div></td><td class=b><div class=white></div></td><td class=c><div class=black></div></td><td class=d><div class=white></div></td><td class=e><div class=black></div></td><td class=f><div class=white></div></td><td class=g><div class=black></div></td><td class=h><div class=white></div></td><td>3</td></tr><tr id=four><td>4</td><td class=a><div class=white></div></td><td class=b><div class=black></div></td><td class=c><div class=white></div></td><td class=d><div class=black></div></td><td class=e><div class=white></div></td><td class=f><div class=black></div></td><td class=g><div class=white></div></td><td class=h><div class=black></div></td><td>4</td></tr><tr id=five><td>5</td><td class=a><div class=black></div></td><td class=b><div class=white></div></td><td class=c><div class=black></div></td><td class=d><div class=white></div></td><td class=e><div class=black></div></td><td class=f><div class=white></div></td><td class=g><div class=black></div></td><td class=h><div class=white></div></td><td>5</td></tr><tr id=six><td>6</td><td class=a><div class=white></div></td><td class=b><div class=black></div></td><td class=c><div class=white></div></td><td class=d><div class=black></div></td><td class=e><div class=white></div></td><td class=f><div class=black></div></td><td class=g><div class=white></div></td><td class=h><div class=black></div></td><td>6</td></tr><tr id=seven><td>7</td><td class=a><div class=black><div class=blackPawn></div></div></td><td class=b><div class=white><div class=blackPawn></div></div></td><td class=c><div class=black><div class=blackPawn></div></div></td><td class=d><div class=white><div class=blackPawn></div></div></td><td class=e><div class=black><div class=blackPawn></div></div></td><td class=f><div class=white><div class=blackPawn></div></div></td><td class=g><div class=black><div class=blackPawn></div></div></td><td class=h><div class=white><div class=blackPawn></div></div></td><td>7</td></tr><tr id=eight><td>8</td><td class=a><div class=white><div class=blackRook></div></div></td><td class=b><div class=black><div class=blackKnight></div></div></td><td class=c><div class=white><div class=blackBishop></div></div></td><td class=d><div class=black><div class=blackQueen></div></div></td><td class=e><div class=white><div class=blackKing></div></div></td><td class=f><div class=black><div class=blackBishop></div></div></td><td class=g><div class=white><div class=blackKnight></div></div></td><td class=h><div class=black><div class=blackRook></div></div></td><td>8</td></tr><tr><td></td><td>a</td><td>b</td><td>c</td><td>d</td><td>e</td><td>f</td><td>g</td><td>h</td></tr></table>';
			}else{
				//else an opponent must be found
				color='w';
				document.getElementById('plugin').innerHTML='<table><tr><td></td><td>h</td><td>g</td><td>f</td><td>e</td><td>d</td><td>c</td><td>b</td><td>a</td></tr><tr id=eight><td>8</td><td class=h><div class=white><div class=blackRook></div></div></td><td class=g><div class=black><div class=blackKnight></div></div></td><td class=f><div class=white><div class=blackBishop></div></div></td><td class=e><div class=black><div class=blackQueen></div></div></td><td class=d><div class=white><div class=blackKing></div></div></td><td class=c><div class=black><div class=blackBishop></div></div></td><td class=b><div class=white><div class=blackKnight></div></div></td><td class=a><div class=black><div class=blackRook></div></div></td><td>8</td><td><input id=move value="Waiting for Opponent" disabled=true type=text></td><td><button id=moveButton disabled=true type="button" onclick=movePiece()>Move</button></td></tr><tr id=seven><td>7</td><td class=h><div class=black><div class=blackPawn></div></div></td><td class=g><div class=white><div class=blackPawn></div></div></td><td class=f><div class=black><div class=blackPawn></div></div></td><td class=e><div class=white><div class=blackPawn></div></div></td><td class=d><div class=black><div class=blackPawn></div></div></td><td class=c><div class=white><div class=blackPawn></div></div></td><td class=b><div class=black><div class=blackPawn></div></div></td><td class=a><div class=white><div class=blackPawn></div></div></td><td>7</td></tr><tr id=six><td>6</td><td class=h><div class=white></div></td><td class=g><div class=black></div></td><td class=f><div class=white></div></td><td class=e><div class=black></div></td><td class=d><div class=white></div></td><td class=c><div class=black></div></td><td class=b><div class=white></div></td><td class=a><div class=black></div></td><td>6</td></tr><tr id=five><td>5</td><td class=h><div class=black></div></td><td class=g><div class=white></div></td><td class=f><div class=black></div></td><td class=e><div class=white></div></td><td class=d><div class=black></div></td><td class=c><div class=white></div></td><td class=b><div class=black></div></td><td class=a><div class=white></div></td><td>5</td></tr><tr id=four><td>4</td><td class=h><div class=white></div></td><td class=g><div class=black></div></td><td class=f><div class=white></div></td><td class=e><div class=black></div></td><td class=d><div class=white></div></td><td class=c><div class=black></div></td><td class=b><div class=white></div></td><td class=a><div class=black></div></td><td>4</td></tr><tr id=three><td>3</td><td class=h><div class=black></div></td><td class=g><div class=white></div></td><td class=f><div class=black></div></td><td class=e><div class=white></div></td><td class=d><div class=black></div></td><td class=c><div class=white></div></td><td class=b><div class=black></div></td><td class=a><div class=white></div></td><td>3</td></tr><tr id=two><td>2</td><td class=h><div class=white><div class=whitePawn></div></div></td><td class=g><div class=black><div class=whitePawn></div></div></td><td class=f><div class=white><div class=whitePawn></div></div></td><td class=e><div class=black><div class=whitePawn></div></div></td><td class=d><div class=white><div class=whitePawn></div></div></td><td class=c><div class=black><div class=whitePawn></div></div></td><td class=b><div class=white><div class=whitePawn></div></div></td><td class=a><div class=black><div class=whitePawn></div></div></td><td>2</td></tr><tr id=one><td>1</td><td class=h><div class=black><div class=whiteRook></div></div></td><td class=g><div class=white><div class=whiteKnight></div></div></td><td class=f><div class=black><div class=whiteBishop></div></div></td><td class=e><div class=white><div class=whiteQueen></div></div></td><td class=d><div class=black><div class=whiteKing></div></div></td><td class=c><div class=white><div class=whiteBishop></div></div></td><td class=b><div class=black><div class=whiteKnight></div></div></td><td class=a><div class=white><div class=whiteRook></div></div></td><td>1</td></tr><tr><td></td><td>h</td><td>g</td><td>f</td><td>e</td><td>d</td><td>c</td><td>b</td><td>a</td></tr></table>';
				
			}
			updateBoard();
			wait();
		}else{
			document.getElementById('message').innerHTML=json.error;
		}
	});
}
var wait = function(){
	//requests the status of the server every second until the wait is done
	$.getJSON(serverURL+'/wait?token='+token,function(json){
		console.log('asking');
		if(json.waitDone){
			console.log('done waiting');
			secondsWaited=0;
			console.log('wait done');
			document.getElementById('move').removeAttribute('disabled');
			document.getElementById('move').setAttribute('value','');
			document.getElementById('moveButton').removeAttribute('disabled');
			//if the game is over, as in the player has lost or tied with their opponent, the game ends and the page goes back to it's original state
			if(json.chessboard=='lose'){
				//record loss
				$.getJSON(serverURL+'/addStat?username='+username+'&password='+password+'&statName=losses',function(json){});
				document.getElementById('plugin').insertAdjacentHTML('<div>You Lose!<button type=button onclick=reset()>Done</button></div>');
			}else if(json.chessboard=='draw'){
				//record draw
				$.getJSON(serverURL+'/addStat?username='+username+'&password='+password+'&statName=draws',function(json){});
				document.getElementById('plugin').insertAdjacentHTML('<div>Draw!<button type=button onclick=reset()>Done</button></div>');
			}else{
				chessboard = json.chessboard;
				updateBoard();
			}
		}else{
			setTimeout(function(){
				wait();
			},1000);
		}
	});
}
var movePiece = function(){
	//disables the move button, will be enabled after either the move is proven incorrect, or the other player's turn is done
	document.getElementById('move').setAttribute('disabled',true);
	document.getElementById('move').setAttribute('value','Verifying Move');
	document.getElementById('moveButton').setAttribute('disabled',true);
	var move = document.getElementById('move').value;
	//if the move is successful, then this is set to true
	var moveSuccessful = false;
	//if the player takes the opponents king, then this is set to true
	var win = false;
	var rank,file,modifier,piece;
	//handles queen side castling
	if(move=="0-0-0"||move=="O-O-O"){
		console.log('castling queen side');
		if(color=='w'){
			if(hasPiece('e',1,'wk')&&hasPiece('d',1,"")&&hasPiece('c',1,"")&&hasPiece('b',1,"")&&hasPiece('a',1,'wr')){
				setSpace('c',1,'wk');
				setSpace('d',1,'wr');
				setSpace('a',1,"");
				setSpace('e',1,"");
				moveSuccessful = true;
			}
		}else if(color=='b'){
			if(hasPiece('e',8,'bk')&&hasPiece('d',8,"")&&hasPiece('c',8,"")&&hasPiece('b',8,"")&&hasPiece('a',8,'br')){
				setSpace('c',8,'bk');
				setSpace('d',8,'br');
				setSpace('a',8,"");
				setSpace('e',8,"");
				moveSuccessful = true;
			}
		}
	//handles king side castling
	}else if(move=="0-0"||move=="O-O"){
		console.log('castling king side');
		if(color=='w'){
			if(hasPiece('e',1,'wk')&&hasPiece('f',1,"")&&hasPiece('g',1,"")&&hasPiece('h',1,"wr")){
				setSpace('g',1,'wk');
				setSpace('f',1,'wr');
				setSpace('e',1,"");
				setSpace('h',1,"");
				moveSuccessful = true;
			}
		}else if(color=='b'){
			if(hasPiece('e',8,'bk')&&hasPiece('f',8,"")&&hasPiece('g',8,"")&&hasPiece('h',8,"br")){
				setSpace('g',8,'bk');
				setSpace('f',8,'br');
				setSpace('e',8,"");
				setSpace('h',8,"");
				moveSuccessful = true;
			}
		}
	//handles pawn attacks and attacks where only one of the specified pieces can move there
	}else if(move.charAt(1)=='x'){
		console.log('attack');
		modifier='';
		file=move.charAt(2);
		rank=move.charAt(3);
		//if the character at index 0 of move is one of the files in the chessboard, then the attack is being carried out by a pawn in that file
		for(var i=0;i<=8;i++){
			if(move.charAt(0)==files[i]){
				modifier=move.charAt(0);
				piece='P';
				//therefore, there must be a piece the pawn can take, a pawn in that file, which can take the piece, which differs between white and black
				if(attackPiece(file,rank)){
					if(modifier=files[files.indexOf(file)]){
						if(color=='w'){
							var pawnSpace=rank-1
							if(hasPiece(modifier,pawnSpace,'wp')){
								if(hasPiece(file,rank,'bk')){
									win=true;
								}
								setSpace(file,rank,'wp');
								setSpace(modifier,pawnSpace,"");
								moveSuccessful = true;
								//record a capture
								$.getJSON(serverURL+'/addStat?username='+username+'&password='+password+'&statName=piecesTaken',function(json){});
							}
						}else if(color=='b'){
							var pawnSpace=rank+1
							if(hasPiece(modifier,pawnSpace,'bp')){
								if(hasPiece(file,rank,'wk')){
									win=true;
								}
								setSpace(file,rank,'bp');
								setSpace(modifier,pawnSpace,"");
								moveSuccessful = true;
								//record a capture
								$.getJSON(serverURL+'/addStat?username='+username+'&password='+password+'&statName=piecesTaken',function(json){});
							}
						}
					}
				}
			}
		}
		//however if the piece isn't a pawn, then the piece is in index 0 of move
		if(piece!='P'){
			piece=move.charAt(0);
			//there must be a piece to attack, and a piece of the type specified that can move there
			if(attackPiece(file,rank)){
				pieceAt=canMove(file,rank,piece,modifier);
				if(pieceAt.length>0){
					if((color=='w'&&hasPiece(file,rank,'bk'))||(color=='b'&&hasPiece(file,rank,'wk'))){
						win=true;
					}
					setSpace(file,rank,color+piece.toLowerCase());
					setSpace(pieceAt[0],pieceAt[1],"");
					moveSuccessful = true;
					//record a capture
					$.getJSON(serverURL+'/addStat?username='+username+'&password='+password+'&statName=piecesTaken',function(json){});
				}
			}
		}
	//if there are multiple pieces of the same type that can attack the same piece, a modifier that is either the rank or file of the desired piece will be provided infront of the x
	}else if(move.charAt(2)=='x'){
		console.log('attack');
		piece=move.charAt(0);
		modifier=move.charAt(1);
		file=move.charAt(3);
		rank=move.charAt(4);
		//there must then be a piece to attack, and a piece of the type specified that can move there, in the rank or file specified
		if(attackPiece(file,rank)){
			pieceAt=canMove(file,rank,piece,modifier);
				if(pieceAt.length>0){
					if((color=='w'&&hasPiece(file,rank,'bk'))||(color=='b'&&hasPiece(file,rank,'wk'))){
						win=true;
					}
					setSpace(file,rank,color+piece.toLowerCase());
					setSpace(pieceAt[0],pieceAt[1],"");
					moveSuccessful = true;
					//record a capture
					$.getJSON(serverURL+'/addStat?username='+username+'&password='+password+'&statName=piecesTaken',function(json){});
				}
		}
	//otherwise, a move that has a length of two must be a pawn movement
	}else if(move.length==2){
		console.log('pawn move');
		file=move.charAt(0);
		rank=move.charAt(1);
		console.log(file);
		console.log(rank);
		//first there must be space for the pawn to move to
		if(hasPiece(file,rank,"")){
			var pawnSpace;
			console.log('hasPiece success');
			//the direction a pawn can move depends on the color
			if(color=='w'){
				console.log('color white');
				pawnSpace=rank-1;
				piece='wp';
				//if the rank provided is 4, then either a pawn is moving forward one from rank 3, or moving forward 2 from rank 2. The only way a pawn can move forward 2 is if it is moving to rank 4
				if(rank==4){
					if(hasPiece(file,3,"")){
						if(hasPiece(file,2,piece)){
							setSpace(file,4,piece);
							setSpace(file,2,"");
							moveSuccessful = true;
						}
					}
				}
			}else if(color=='b'){
				console.log('color black');
				piece='bp';
				pawnSpace=rank+1;
				//if the rank provided is 5, much like white, there must either be a pawn in 6 or 7
				if(rank==5){
					if(hasPiece(file,6,"")){
						if(hasPiece(file,7,piece)){
							setSpace(file,5,piece);
							setSpace(file,7,"");
							moveSuccessful = true;
						}
					}
				}
			}
			if(hasPiece(file,pawnSpace,piece)==true){
					console.log('hasPiece success');
					setSpace(file,rank,piece);
					setSpace(file,pawnSpace,"");
					moveSuccessful = true;
			}
		}
	//if the move is 3 in length, the possible moves are pawn promotion, or the movement of a piece where it is the only one of it's type that can move there
	}else if(move.length==3){
		console.log('normal move');
		//pawn promotion is a standard pawn move that ends with the letter of the desired piece
		if(move.charAt(3)=='Q'||move.charAt(3)=='N'||move.charAt(3)=='B'||move.charAt(3)=='R'){
			console.log('pawn promotion');
			if(color=='w'){
				//pawn promotion is only available for white if the pawn is moving into rank 8
				if(rank==8){
					piece='wp';
					var newPiece='w'+move.charAt(3).toLowerCase();
					if(hasPiece(file,rank,"")){
						if(hasPiece(file,rank-1,piece)){
							setSpace(file,rank,newPiece);
							setSpace(file,rank-1,"");
							moveSuccessful = true;
						}
					}
				}
			}else if(color=='b'){
				//likewise, pawn promotion is only available for black if the pawn is moving into rank 1
				if(rank==1){
					piece='bp'
					var newPiece='b'+move.charAt(3).toLowerCase();
					if(hasPiece(file,rank,"")){
						if(hasPiece(file,rank+1,piece)){
							setSpace(file,rank,newPiece);
							setSpace(file,rank+1,"");
							moveSuccessful = true;
						}
					}
				}
			}
		//if the move isn't pawn promotion, it is a standard movement
		}else{
			console.log('standard move');
			modifier="";
			piece=move.charAt(0);
			file=move.charAt(1);
			rank=move.charAt(2);
			//there must be a space where the piece is moving to
			if(hasPiece(file,rank,"")){
				console.log('hasPiece success');
				pieceAt=canMove(file,rank,piece,"");
				if(pieceAt.length>0){
					console.log('canMove success');
					setSpace(file,rank,color+piece.toLowerCase());
					setSpace(pieceAt[0],pieceAt[1],"");
					moveSuccessful = true;
				}
			}
		}
	//the only other type of move would be of length four, a standard move where multiple pieces of the same type can move to the desired space
	}else if(move.length==4){
		//the file or rank of the desired piece must be provided at index 1, as well as the file and rank of the desired space in indeces 2 and 3 respectivly
		modifier=move.charAt(1);
		piece=move.charAt(0);
		file=move.charAt(2);
		rank=move.charAt(3);
		//there must be an empty space, as well as a piece of the specified type in the specified rank or file, that can move to the specified space
		if(hasPiece(file,rank,"")){
			pieceAt=canMove(file,rank,piece,modifier);
			if(pieceAt.length>0){
				setSpace(file,rank,color+piece.toLowerCase());
				setSpace(pieceAt[0],pieceAt[1],"");
				moveSuccessful = true;
			}
		}
	}
	//if the player takes the opponents king, win is set to true, and the game is over
	if(win){
		$.getJSON(serverURL+'/endGame?token='+token+'&type=win',function(json){
			//record win
			$.getJSON(serverURL+'/addStat?username='+username+'&password='+password+'&statName=wins',function(json){});
			document.getElementById('plugin').insertAdjacentHTML('<div>You win!<button type=button onclick=reset()>Done</button></div>');
		});
	//otherwise the move is pushed to the server if it was valid
	}else if(moveSuccessful){
		document.getElementById('move').setAttribute('value','Waiting for other player');
		//the board on the website is updated
		console.log(JSON.stringify(chessboard));
		$.getJSON(serverURL+'/move?token='+token+'&chessboard='+JSON.stringify(chessboard),function(json){});
		updateBoard();
		wait();
	//otherwise, the player is prompted to insert a new command
	}else{
		document.getElementById('move').removeAttribute('disabled');
		document.getElementById('move').setAttribute('value','Incorrect Command');
		document.getElementById('moveButton').removeAttribute('disabled');	
	}
	
}
//Determines if there is a piece in the specified location of the opposite color. If so, returns true, else false
var attackPiece = function(file,rank){
	switch(file){
		case 'a':
			if(chessboard.a[rank-1].charAt(0)!=color){
				return true;
			}
			break;
		case 'b':
			if(chessboard.b[rank-1].charAt(0)!=color){
				return true;
			}
			break;
		case 'c':
			if(chessboard.c[rank-1].charAt(0)!=color){
				return true;
			}
			break;
		case 'd':
			if(chessboard.d[rank-1].charAt(0)!=color){
				return true;
			}
			break;
		case 'e':
			if(chessboard.e[rank-1].charAt(0)!=color){
				return true;
			}
			break;
		case 'f':
			if(chessboard.f[rank-1].charAt(0)!=color){
				return true;
			}
			break;
		case 'g':
			if(chessboard.g[rank-1].charAt(0)!=color){
				return true;
			}
			break;
		case 'h':
			if(chessboard.h[rank-1].charAt(0)!=color){
				return true;
			}
			break;
	}
	return false;
}
//determines if a specified location has a specified piece. If so, returns true, else false. This can be provided with "" to determine if a space does not have a piece.
var hasPiece = function(file,rank,piece){
	switch(file){
		case 'a':
			if(chessboard.a[rank-1]==piece){
				return true;
			}
			break;
		case 'b':
			if(chessboard.b[rank-1]==piece){
				return true;
			}
			break;
		case 'c':
			if(chessboard.c[rank-1]==piece){
				return true;
			}
			break;
		case 'd':
			if(chessboard.d[rank-1]==piece){
				return true;
			}
			break;
		case 'e':
			if(chessboard.e[rank-1]==piece){
				return true;
			}
			break;
		case 'f':
			if(chessboard.f[rank-1]==piece){
				return true;
			}
			break;
		case 'g':
			if(chessboard.g[rank-1]==piece){
				return true;
			}
			break;
		case 'h':
			if(chessboard.h[rank-1]==piece){
				return true;
			}
			break;
	}
	return false;
}
//determines if the provided piece can move to the provided location, given a rank or file the piece must be in. Use "" for modifierless commands
var canMove = function(file,rank,piece,modifier){
	var position = [];
	var fileIndex=files.indexOf(file);
	console.log(piece);
	switch(piece){
		//in the case that the moving piece is a king, then the king must be within 1 space of the destination
		case 'K':
			piece = toJsonTranslate('K');
			if(fileIndex>0){
				if(rank>1){
					if(hasPiece(files[fileIndex-1],rank-1,piece)){
						position = [files[fileIndex-1],rank-1];
					}
				}
				if(hasPiece(files[fileIndex-1],rank,piece)){
					position = [files[fileIndex-1],rank];
				}
				if(rank<8){
					if(hasPiece(files[fileIndex-1],rank+1,piece)){
						position = [files[fileIndex-1],rank+1];
					}
				}
			}
			if(rank>1){
				if(hasPiece(files[fileIndex],rank-1,piece)){
					position = [files[fileIndex],rank-1];
				}
			}
			if(rank<8){
				if(hasPiece(files[fileIndex],rank+1,piece)){
					position = [files[fileIndex],rank+1];
				}
			}
			if(fileIndex<7){
				if(rank>1){
					if(hasPiece(files[fileIndex+1],rank-1,piece)){
						position = [files[fileIndex+1],rank-1];
					}
				}
				if(hasPiece(files[fileIndex+1],rank,piece)){
					position = [files[fileIndex+1],rank];
				}
				if(rank<8){
					if(hasPiece(files[fileIndex+1],rank+1,piece)){
						position = [files[fileIndex+1],rank+1];
					}
				}
			}
			break;
		//in the case of the Queen, the piece must be on one of eight paths radiating from the destination
		case 'Q':
			var piece = toJsonTranslate('Q');
			//if a piece is found on one of the paths, then that path is set to false, as the queen cannot be down that path
			var northwest=true,north=true,northeast=true,east=true,southeast=true,south=true,southwest=true,west=true;
			for(var i=0;i<=8;i++){
				if(fileIndex>=i){
					//checking southwest
					if(rank>=(i+1)){
						if(hasPiece(files[fileIndex-i],rank-i,piece)&&southwest&&(modifier==""||modifer==files[fileIndex-i]||modifer==rank-i)){
							position = [files[fileIndex-i],rank-i];
						}else if(!hasPiece(files[fileIndex-i],rank-i,"")){
							southwest=false;
						}
					}
					//checking west
					if(hasPiece(files[fileIndex-i],rank,piece)&&west&&(modifier==""||modifer==files[fileIndex-i]||modifer==rank)){
						position = [files[fileIndex-i],rank];
					}else if(!hasPiece(files[fileIndex-i],rank,"")){
						west = false;
					}
					//checking northwest
					if(rank<(8-i)){
						if(hasPiece(files[fileIndex-i],rank+i,piece)&&northwest&&(modifier==""||modifer==files[fileIndex-i]||modifer==rank+i)){
								position = [files[fileIndex-i],rank+i];
						}else if(!hasPiece(files[fileIndex-i],rank+i,"")){
							northwest = false;
						}
					}
				}
				//checking north
				if(rank>=(i+1)){
					if(hasPiece(files[fileIndex],rank-i,piece)&&north&&(modifier==""||modifer==files[fileIndex]||modifer==rank-i)){
							position = [files[fileIndex],rank-i];
					}else if(!hasPiece(files[fileIndex],rank-i,"")){
						north = false;
					}
				}
				//checking south
				if(rank<(8-i)){
					if(hasPiece(files[fileIndex],rank+i,piece)&&south&&(modifier==""||modifer==files[fileIndex]||modifer==rank+i)){
							position = [files[fileIndex],rank+i];
					}else if(!hasPiece(files[fileIndex],rank+i,"")){
						south = false;
					}
				}
				if(fileIndex<(7-i)){
					//checking southeast
					if(rank>(i+1)){
						if(hasPiece(files[fileIndex+i],rank-i,piece)&&southeast&&(modifier==""||modifer==files[fileIndex+i]||modifer==rank-i)){
							position = [files[fileIndex+i],rank-i];
						}else if(!hasPiece(files[fileIndex+i],rank-i,"")){
							southeast = false;
						}
					}
					//checking east
					if(hasPiece(files[fileIndex+i],rank,piece)&&east&&(modifier==""||modifer==files[fileIndex+i]||modifer==rank)){
						position = [files[fileIndex+i],rank];
					}else if(!hasPiece(files[fileIndex+i],rank,"")){
						east==false
					}
					//checking northeast
					if(rank<(8-i)){
						if(hasPiece(files[fileIndex+i],rank+i,piece)&&northeast&&(modifier==""||modifer==files[fileIndex+i]||modifer==rank+i)){
							position = [files[fileIndex+i],rank+i];
						}else if(!hasPiece(files[fileIndex+i],rank+i,"")){
							northeast=false;
						}
					}
				}
			}
			break;
		//In the case of the Bishop, the piece must be on one of four diagonal pathes radiating from the center
		case 'B':
			var piece = toJsonTranslate('B');
			//Same as the Queen, but the ammount of routes are halved
			var northwest=true,northeast=true,southeast=true,southwest=true;
			for(var i=0;i<=8;i++){
				if(fileIndex>=i){
					//checking southwest
					if(rank>=(i+1)){
						if(hasPiece(files[fileIndex-i],rank-i,piece)&&southwest&&(modifier==""||modifer==files[fileIndex-i]||modifer==rank-i)){
							position = [files[fileIndex-i],rank-i];
						}else if(!hasPiece(files[fileIndex-i],rank-i,"")){
							southwest=false;
						}
					}
					//checking northwest
					if(rank<(8-i)){
						if(hasPiece(files[fileIndex-i],rank+i,piece)&&northwest&&(modifier==""||modifer==files[fileIndex-i]||modifer==rank+i)){
								position = [files[fileIndex-i],rank+i];
						}else if(!hasPiece(files[fileIndex-i],rank+i,"")){
							northwest = false;
						}
					}
				}
				
				if(fileIndex<(7-i)){
					//checking southeast
					if(rank>(i+1)){
						if(hasPiece(files[fileIndex+i],rank-i,piece)&&southeast&&(modifier==""||modifer==files[fileIndex+i]||modifer==rank-i)){
							position = [files[fileIndex+i],rank-i];
						}else if(!hasPiece(files[fileIndex+i],rank-i,"")){
							southeast = false;
						}
					}
					//checking northeast
					if(rank<(8-i)){
						if(hasPiece(files[fileIndex+i],rank+i,piece)&&northeast&&(modifier==""||modifer==files[fileIndex+i]||modifer==rank+i)){
							position = [files[fileIndex+i],rank+i];
						}else if(!hasPiece(files[fileIndex+i],rank+i,"")){
							northeast=false;
						}
					}
				}
			}
			break;
		//in the case of the Rook, the piece must be on one of 4 nondiagonal paths radiating from the destination
		case 'R':
			var piece = toJsonTranslate('R');
			var north=true,east=true,south=true,west=true;
			for(var i=0;i<8;i++){
				//checking west
				if(fileIndex>=i){
					if(hasPiece(files[fileIndex-i],rank,piece)&&west&&(modifier==""||modifer==files[fileIndex-i]||modifer==rank)){
						position = [files[fileIndex-i],rank];
					}else if(!hasPiece(files[fileIndex-i],rank,"")){
						west = false;
					}
				}
				//checking north
				if(rank>(i+1)){
					if(hasPiece(files[fileIndex],rank-i,piece)&&north&&(modifier==""||modifer==files[fileIndex]||modifer==rank-i)){
							position = [files[fileIndex],rank-i];
					}else if(!hasPiece(files[fileIndex],rank-i,"")){
						north = false;
					}
				}
				//checking south
				if(rank<(8-i)){
					if(hasPiece(files[fileIndex],rank+i,piece)&&south&&(modifier==""||modifer==files[fileIndex]||modifer==rank+i)){
							position = [files[fileIndex],rank+i];
					}else if(!hasPiece(files[fileIndex],rank+i,"")){
						south = false;
					}
				}
				//checking east
				if(fileIndex<(7-i)){
					if(hasPiece(files[fileIndex+i],rank,piece)&&east&&(modifier==""||modifer==files[fileIndex+i]||modifer==rank)){
						position = [files[fileIndex+i],rank];
					}else if(!hasPiece(files[fileIndex+i],rank,"")){
						east==false
					}
				}
			}
			break;
		//In the case of the Knight, much like the King, the knight must be on one of eight spaces around the destination
		case 'N':
			piece = toJsonTranslate('N');
			if(fileIndex>0){
				if(rank>2){
					if(hasPiece(files[fileIndex-1],rank-2,piece)&&(modifier==""||modifer==files[fileIndex-1]||modifer==rank-2)){
						position = [files[fileIndex-1],rank-2];
					}
				}
				if(rank<7){
					if(hasPiece(files[fileIndex-1],rank+2,piece)&&(modifier==""||modifer==files[fileIndex-1]||modifer==rank+2)){
						position = [files[fileIndex-1],rank+2];
					}
				}
			}
			if(fileIndex>1){
				if(rank>1){
					if(hasPiece(files[fileIndex-2],rank-1,piece)&&(modifier==""||modifer==files[fileIndex-2]||modifer==rank-1)){
						position = [files[fileIndex-2],rank-1];
					}
				}
				if(rank<8){
					if(hasPiece(files[fileIndex-2],rank+1,piece)&&(modifier==""||modifer==files[fileIndex-2]||modifer==rank+1)){
						position = [files[fileIndex-2],rank+1];
					}
				}
			}
			if(fileIndex<7){
				if(rank>2){
					if(hasPiece(files[fileIndex-1],rank-2,piece)&&(modifier==""||modifer==files[fileIndex+1]||modifer==rank-2)){
						position = [files[fileIndex-1],rank-2];
					}
				}
				if(rank<7){
					if(hasPiece(files[fileIndex+1],rank+2,piece)&&(modifier==""||modifer==files[fileIndex+1]||modifer==rank+2)){
						position = [files[fileIndex+1],rank+2];
					}
				}
			}
			if(fileIndex<6){
				if(rank>1){
					if(hasPiece(files[fileIndex+2],rank-1,piece)&&(modifier==""||modifer==files[fileIndex+2]||modifer==rank-1)){
						position = [files[fileIndex+2],rank-1];
					}
				}
				if(rank<8){
					if(hasPiece(files[fileIndex+2],rank+1,piece)&&(modifier==""||modifer==files[fileIndex+2]||modifer==rank+1)){
						position = [files[fileIndex+2],rank+1];
					}
				}
			}
			break;
	}
	return position;
}
//sets the specified space in the JSON representation of the chessboard to the provided piece. Can be given "" to remove a e
var setSpace = function(file,rank,toSet){
		switch(file){
		case 'a':
			chessboard.a[rank-1]=toSet;
			break;
		case 'b':
			chessboard.b[rank-1]=toSet;
			break;
		case 'c':
			chessboard.c[rank-1]=toSet;
			break;
		case 'd':
			chessboard.d[rank-1]=toSet;
			break;
		case 'e':
			chessboard.e[rank-1]=toSet;
			break;
		case 'f':
			chessboard.f[rank-1]=toSet;
			break;
		case 'g':
			chessboard.g[rank-1]=toSet;
			break;
		case 'h':
			chessboard.h[rank-1]=toSet;
			break;
	}
}
//translates the way pieces are moved into the JSON format
var toJsonTranslate = function(piece){
	switch(piece){
		case 'R':
			if(color=='w'){
				return 'wr';
			}else{
				return 'br';
			}
			break;
		case 'N':
			if(color=='w'){
				return 'wn';
			}else{
				return 'bn';
			}
			break;
		case 'B':
			if(color=='w'){
				return 'wb';
			}else{
				return 'bb';
			}
			break;
		case 'Q':
			if(color=='w'){
				return 'wq';
			}else{
				return 'bq';
			}
			break;
		case 'K':
			if(color=='w'){
				return 'wk';
			}else{
				return 'bk';
			}
			break;
	}
}
//translates the way the pieces are stored in the JSON to HTML objects to be inserted into the HTML Document
var fromJsonTranslate = function(piece){
	switch(piece){
		case 'wp':
			return "<div class=whitePawn></div>";
			break;
		case 'wr':
			return "<div class=whiteRook></div>";
			break;
		case 'wn':
			return "<div class=whiteKnight></div>";
			break;
		case 'wb':
			return "<div class=whiteBishop></div>";
			break;
		case 'wq':
			return "<div class=whiteQueen></div>";
			break;
		case 'wk':
			return "<div class=whiteKing></div>";
			break;
		case 'bp':
			return "<div class=blackPawn></div>";
			break;
		case 'br':
			return "<div class=blackRook></div>";
			break;
		case 'bn':
			return "<div class=blackKnight></div>";
			break;
		case 'bb':
			return "<div class=blackBishop></div>";
			break;
		case 'bq':
			return "<div class=blackQueen></div>";
			break;
		case 'bk':
			return "<div class=blackKing></div>";
			break;
		case '':
			return "<div></div>";
			break;
	}
}
//Updates the HTML chessboard to reflect the current situation
var updateBoard = function(){
	var numbers = ['one','two','three','four','five','six','seven','eight'];
	for(var i=0;i<8;i++){
		document.querySelector('#'+numbers[i]+' > .a > div').innerHTML=fromJsonTranslate(chessboard.a[i]);
		document.querySelector('#'+numbers[i]+' > .b > div').innerHTML=fromJsonTranslate(chessboard.b[i]);
		document.querySelector('#'+numbers[i]+' > .c > div').innerHTML=fromJsonTranslate(chessboard.c[i]);
		document.querySelector('#'+numbers[i]+' > .d > div').innerHTML=fromJsonTranslate(chessboard.d[i]);
		document.querySelector('#'+numbers[i]+' > .e > div').innerHTML=fromJsonTranslate(chessboard.e[i]);
		document.querySelector('#'+numbers[i]+' > .f > div').innerHTML=fromJsonTranslate(chessboard.f[i]);
		document.querySelector('#'+numbers[i]+' > .g > div').innerHTML=fromJsonTranslate(chessboard.g[i]);
		document.querySelector('#'+numbers[i]+' > .h > div').innerHTML=fromJsonTranslate(chessboard.h[i]);
	}
}