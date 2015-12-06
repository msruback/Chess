var serverURL = 'localhost:3000';
var token = '';
var chessboard;
var files = ["a","b","c","d","e","f","g","h"];
var color;
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
			token=json.token;
			chessboard=JSON.parse('{"a":["wk","wp","","","","","bp","br"],"b":["wn","wp","","","","","bp","bn"],"c":["wb","wp","","","","","","bp","bb"],"d":["wq","wp","","","","","","bp","bq"],"e":["wk","wp","","","","","","bp","bk"],"f":["wb","wp","","","","","","bp","bb"],"g":["wn","wp","","","","","","bp","bn"],"h":["wr","wp","","","","","","bp","br"]');
			if(json.color=='black'){
				color='b';
				document.getElementById('plugin').innerHTML('<table><tr id=one><td class=a><div class=black><div class=whiteRook></div></div></td><td class=b><div class=white><div class=whiteKnight></div></div></td><td class=c><div class=black><div class=whiteBishop></div></div></td><td class=d><div class=white><div class=whiteQueen></div></div></td><td class=e><div class=black><div class=whiteKing></div></div></td><td class=f><div class=white><div class=whiteBishop></div></div></td><td class=g><div class=black><div class=whiteKnight></div></div></td><td class=h><div class=white><div class=whiteRook></div></div></td><td><input id=move type=text></td><td><button id=moveButton type="button" onclick=movePiece()>Move</button></td></tr><tr id=two><td class=a><div class=white><div class=whitePawn></div></div></td><td class=b><div class=black><div class=whitePawn></div></div></td><td class=c><div class=white><div class=whitePawn></div></div></td><td class=d><div class=black><div class=whitePawn></div></div></td><td class=e><div class=white><div class=whitePawn></div></div></td><td class=f><div class=black><div class=whitePawn></div></div></td><td class=g><div class=white><div class=whitePawn></div></div></td><td class=h><div class=black><div class=whitePawn></div></div></td></tr><tr id=three><td class=a><div class=black></div></td><td class=b><div class=white></div></td><td class=c><div class=black></div></td><td class=d><div class=white></div></td><td class=e><div class=black></div></td><td class=f><div class=white></div></td><td class=g><div class=black></div></td><td class=h><div class=white></div></td></tr><tr id=four><td class=a><div class=white></div></td><td class=b><div class=black></div></td><td class=c><div class=white></div></td<td class=d><div class=black></div></td><td class=e><div class=white></div></td><td class=f><div class=black></div></td><td class=g><div class=white></div></td><td class=h><div class=black></div></td></tr><tr id=five><td class=a><div class=black></div></td><td class=b><div class=white></div></td><td class=c><div class=black></div></td><td class=d><div class=white></div></td><td class=e><div class=black></div></td><td class=f><div class=white></div></td><td class=g><div class=black></div></td><td class=h><div class=white></div></td></tr><tr id=six><td class=a><div class=white></div></td><td class=b><div class=black></div></td><td class=c><div class=white></div></td><td class=d><div class=black></div></td><td class=e><div class=white></div></td><td class=f><div class=black></div></td><td class=g><div class=white></div></td><td class=h><div class=black></div></td></tr><tr id=seven><td class=a><div class=black><div class=blackPawn></div></div></td><td class=b><div class=white><div class=blackPawn></div></div></td><td class=c><div class=black><div class=blackPawn></div></div></td><td class=d><div class=white><div class=blackPawn></div></div></td><td class=e><div class=black><div class=blackPawn></div></div></td><td class=f><div class=white><div class=blackPawn></div></div></td><td class=g><div class=black><div class=blackPawn></div></div></td><td class=h><div class=white><div class=blackPawn></div></div></td></tr><tr id=eight><td class=a><div class=white><div class=blackRook></div></div></td><td class=b><div class=black><div class=blackKnight></div></div></td><td class=c><div class=white><div class=blackBishop></div></div></td><td class=d><div class=black><div class=blackQueen></div></div></td><td class=e><div class=white><div class=blackKing></div></div></td><td class=f><div class=black><div class=blackBishop></div></div></td><td class=g><div class=white><div class=blackKnight></div></div></td><td class=h><div class=black><div class=blackRook></div></div></td></tr></table>');
			}else{
				color='w';
				document.getElementById('plugin').innerHTML('<table><tr id=eight><td class=h><div class=white><div class=blackRook></div></div></td><td class=g><div class=black><div class=blackKnight></div></div></td><td class=f><div class=white><div class=blackBishop></div></div></td><td class=e><div class=black><div class=blackQueen></div></div></td><td class=d><div class=white><div class=blackKing></div></div></td><td class=c><div class=black><div class=blackBishop></div></div></td><td class=b><div class=white><div class=blackKnight></div></div></td><td class=a><div class=black><div class=blackRook></div></div></td><td><input id=move value="Waiting for Opponent" disabled=true type=text></td><td><button id=moveButton disabled=true type="button" onclick=movePiece()>Move</button></td></tr><tr id=seven><td class=h><div class=black><div class=blackPawn></div></div></td><td class=g><div class=white><div class=blackPawn></div></div></td><td class=f><div class=black><div class=blackPawn></div></div></td><td class=e><div class=white><div class=blackPawn></div></div></td><td class=d><div class=black><div class=blackPawn></div></div></td><td class=c><div class=white><div class=blackPawn></div></div></td><td class=b><div class=black><div class=blackPawn></div></div></td><td class=a><div class=white><div class=blackPawn></div></div></td></tr><tr id=six><td class=h><div class=white></div></td><td class=g><div class=black></div></td><td class=f><div class=white></div></td><td class=e><div class=black></div></td><td class=d><div class=white></div></td><td class=c><div class=black></div></td><td class=b><div class=white></div></td><td class=a><div class=black></div></td></tr><tr id=five><td class=h><div class=black></div></td><td class=g><div class=white></div></td><td class=f><div class=black></div></td<td class=e><div class=white></div></td><td class=d><div class=black></div></td><td class=c><div class=white></div></td><td class=b><div class=black></div></td><td class=a><div class=white></div></td></tr><tr id=four><td class=h><div class=white></div></td><td class=g><div class=black></div></td><td class=f><div class=white></div></td><td class=e><div class=black></div></td><td class=d><div class=white></div></td><td class=c><div class=black></div></td><td class=b><div class=white></div></td><td class=a><div class=black></div></td></tr><tr id=three><td class=h><div class=black></div></td><td class=g><div class=white></div></td><td class=f><div class=black></div></td><td class=e><div class=white></div></td><td class=d><div class=black></div></td><td class=c><div class=white></div></td><td class=b><div class=black></div></td><td class=a><div class=white></div></td></tr><tr id=two><td class=h><div class=white><div class=whitePawn></div></div></td><td class=g><div class=black><div class=whitePawn></div></div></td><td class=f><div class=white><div class=whitePawn></div></div></td><td class=e><div class=black><div class=whitePawn></div></div></td><td class=d><div class=white><div class=whitePawn></div></div></td><td class=c><div class=black><div class=whitePawn></div></div></td><td class=b><div class=white><div class=whitePawn></div></div></td><td class=a><div class=black><div class=whitePawn></div></div></td></tr><tr id=one><td class=g><div class=black><div class=whiteRook></div></div></td><td class=g><div class=white><div class=whiteKnight></div></div></td><td class=f><div class=black><div class=whiteBishop></div></div></td><td class=e><div class=white><div class=whiteQueen></div></div></td><td class=d><div class=black><div class=whiteKing></div></div></td><td class=c><div class=white><div class=whiteBishop></div></div></td><td class=b><div class=black><div class=whiteKnight></div></div></td><td class=a><div class=white><div class=whiteRook></div></div></td></tr></table>');
				wait();
				document.getElementById('move').setAttribute('disabled',false);
				document.getElementById('move').setAttribute('value','');
				document.getElementById('moveButton').setAttribute('disabled',false);
			}		
		}else{
			document.getElementById('message').innerHTML(json.error);
		}
	});
}
var wait = function(){
	setInterval(function(){
		$.getJSON(serverURL+'/wait?token='+token);
	},1000);
}
var movePiece = function(){
	document.getElementById('move').setAttribute('disabled',true);
	document.getElementById('move').setAttribute('value','Verifying Move');
	document.getElementById('moveButton').setAttribute('disabled',true);
	var move = document.getElementById('move').value;
	var moveSuccessful = false;
	var rank,file,modifier,piece;
	if(move=="0-0-0"||move=="O-O-O"){
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
	}else if(move=="0-0"||move=="O-O"){
		if(color=='w'){
			if(hasPiece('e',1,'wk')&&hasPiece('f',1,"")&&hasPiece('g',1,"")&&hasPiece('h',1,"wr"){
				setSpace('g',1,'wk');
				setSpace('f',1,'wr');
				setSpace('e',1,"");
				setSpace('h',1,"");
				moveSuccessful = true;
			}
		}else if(color=='b'){
			if(hasPiece('e',8,'bk')&&hasPiece('f',8,"")&&hasPiece('g',8,"")&&hasPiece('h',8,"br"){
				setSpace('g',8,'bk');
				setSpace('f',8,'br');
				setSpace('e',8,"");
				setSpace('h',8,"");
				moveSuccessful = true;
			}
		}
	}else if(move.getCharAt(1)=='x'){
		modifier='';
		file=move.getCharAt(2);
		rank=move.getCharAt(3);
		for(var i=0;i<=8;i++){
			if(move.getCharAt(0)==files[i]){
				modifier=move.getCharAt(0);
				piece='P';
				if(attackPiece(file,rank)){
					if(hasPiece(files[files.getIndexOf(file)-1],rank-1,color+'p')){
						setSpace(file,rank,color+'p');
						setSpace(files[files.getIndexOf(file)-1],rank-1,"");
						moveSuccessful = true;
					}else if(hasPiece(files[files.getIndexOf(file)+1],rank-1,color+'p')){
						setSpace(file,rank,color+'p');
						setSpace(files[files.getIndexOf(file)+1],rank-1,"");
						moveSuccessful = true;
					}
				}
			}
		}
		if(piece!='P'){
			piece=move.getCharAt(0);
			if(attackPiece(file,rank)){
				pieceAt=canMove(file,rank,piece,modifier);
				if(pieceAt.length>0){
					setSpace(file,rank,color+piece.toLowerCase());
					setSpace(pieceAt[0],pieceAt[1],"");
					moveSuccessful = true;
				}
			}
		}
			
	}else if(move.getCharAt(2)=='x'){
		modifier=move.getCharAt(1);
		file=move.getCharAt(3);
		rank=move.getCharAt(4);
		if(attackPiece(file,rank)){
			pieceAt=canMove(file,rank,piece,modifier);
				if(pieceAt.length>0){
					setSpace(file,rank,color+piece.toLowerCase());
					setSpace(pieceAt[0],pieceAt[1],"");
					moveSuccessful = true;
				}
		}
	}else if(move.length==2){
		file=move.getCharAt(0);
		rank=move.getCharAt(1);
		if(hasPiece(file,rank,"")){
			if(color=='w'){
				piece='wp';
				if(rank==4){
					if(hasPiece(file,rank-1,"")){
						if(hasPiece(file,rank-2,piece)){
							setSpace(file,rank,piece);
							setSpace(file,rank-2,"");
							moveSuccessful = true;
						}
					}
				}
				if(hasPiece(file,rank-1,piece)){
					setSpace(file,rank,piece);
					setSpace(file,rank-1,"");
					moveSuccessful = true;
				}
			}else if(color=='b'){
				piece='bp';
				if(rank==5){
					if(hasPiece(file,rank+1,"")){
						if(hasPiece(file,rank+2,piece)){
							setSpace(file,rank,piece);
							setSpace(file,rank+2,"");
							moveSuccessful = true;
						}
					}
				}
				if(hasPiece(file,rank+1,piece)){
					setSpace(file,rank,piece);
					setSpace(file,rank+1,"");
					moveSuccessful = true;
				}
			}
		}
	}else if(move.length==3){
		if(move.getCharAt(3)=='Q'||move.getCharAt(3)=='N'||move.getCharAt(3)=='B'||move.getCharAt(3)=='R'){
			if(color=='w'){
				if(rank==8){
					piece='wp';
					var newPiece='w'+move.getCharAt(3).toLowerCase();
					if(hasPiece(file,rank-1,piece)){
						setSpace(file,rank,newPiece);
						setSpace(file,rank-1,"");
						moveSuccessful = true;
					}
				}
			}else if(color=='b'){
				if(rank==1){
					piece='bp'
					var newPiece='b'+move.getCharAt(3).toLowerCase();
					if(hasPiece(file,rank+1,piece)){
						setSpace(file,rank,newPiece);
						setSpace(file,rank+1,"");
						moveSuccessful = true;
					}
				}
			}
		}else{
			modifier="";
			file=move.getCharAt(1);
			rank=move.getCharAt(2);
			if(hasPiece(file,rank,"")){
				pieceAt=canMove(file,rank,piece,modifier);
				if(pieceAt.length>0){
					setSpace(file,rank,color+piece.toLowerCase());
					setSpace(pieceAt[0],pieceAt[1],"");
					moveSuccessful = true;
				}
			}
		}
	}else if(move.length==4){
		modifier=move.getCharAt(1);
		file=move.getCharAt(2);
		rank=move.getCharAt(3);
		if(hasPiece(file,rank,"")){
			pieceAt=canMove(file,rank,piece,modifier);
			if(pieceAt.length>0){
				setSpace(file,rank,color+piece.toLowerCase());
				setSpace(pieceAt[0],pieceAt[1],"");
				moveSuccessful = true;
			}
		}
	}
	if(moveSuccess){
		document.getElementById('move').setAttribute('value','Waiting for other player');
		updateBoard();
	}else{
		document.getElementById('move').setAttribute('disabled',false);
		document.getElementById('move').setAttribute('value','Incorrect Command');
		document.getElementById('moveButton').setAttribute('disabled',false);	
	}
	
}
var attackPiece = function(file,rank){
	switch(file){
		case 'a':
			if(chessboard.a[rank-1].getCharAt(0)!=color){
				return true;
			}
			break;
		case 'b':
			if(chessboard.b[rank-1].getCharAt(0)!=color){
				return true;
			}
			break;
		case 'c':
			if(chessboard.c[rank-1].getCharAt(0)!=color){
				return true;
			}
			break;
		case 'd':
			if(chessboard.d[rank-1].getCharAt(0)!=color){
				return true;
			}
			break;
		case 'e':
			if(chessboard.e[rank-1].getCharAt(0)!=color){
				return true;
			}
			break;
		case 'f':
			if(chessboard.f[rank-1].getCharAt(0)!=color){
				return true;
			}
			break;
		case 'g':
			if(chessboard.g[rank-1].getCharAt(0)!=color){
				return true;
			}
			break;
		case 'h':
			if(chessboard.h[rank-1].getCharAt(0)!=color){
				return true;
			}
			break;
	}
	return false;
}
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
var canMove = function(file,rank,piece,modifier){
	var position = [];
	var fileIndex=files.indexOf(file);
	switch(piece){
		case 'K':
			piece = color+'k';
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
			if(rank>0){
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
		case 'Q':
			var piece = color+'q';
			var northwest=true,north=true,northeast=true,east=true,southeast=true,south=true,southwest=true,west=true;
			for(var i=0;i<=8;i++){
				if(fileIndex>=i){
					if(rank>=(i+1)){
						if(hasPiece(files[fileIndex-i],rank-i,piece)&&southwest&&(modifier==""||modifer==files[fileIndex-i]||modifer==rank-i)){
							position = [files[fileIndex-i],rank-i];
						}else if(!hasPiece(files[fileIndex-i],rank-i,"")){
							southwest=false;
						}
					}
					if(hasPiece(files[fileIndex-i],rank,piece)&&west&&(modifier==""||modifer==files[fileIndex-i]||modifer==rank)){
						position = [files[fileIndex-i],rank];
					}else if(!hasPiece(files[fileIndex-i],rank,"")){
						west = false;
					}
					if(rank<(8-i)){
						if(hasPiece(files[fileIndex-i],rank+i,piece)&&northwest&&(modifier==""||modifer==files[fileIndex-i]||modifer==rank+i)){
								position = [files[fileIndex-i],rank+i];
						}else if(!hasPiece(files[fileIndex-i],rank+i,"")){
							northwest = false;
						}
					}
				}
				if(rank>=(i+1)){
					if(hasPiece(files[fileIndex],rank-i,piece)&&north&&(modifier==""||modifer==files[fileIndex]||modifer==rank-i)){
							position = [files[fileIndex],rank-i];
					}else if(!hasPiece(files[fileIndex],rank-i,"")){
						north = false;
					}
				}
				if(rank<(8-i)){
					if(hasPiece(files[fileIndex],rank+i,piece)&&south&&(modifier==""||modifer==files[fileIndex]||modifer==rank+i)){
							position = [files[fileIndex],rank++i];
					}else if(!hasPiece(files[fileIndex],rank+i,"")){
						south = false;
					}
				}
				if(fileIndex<(7-i)){
					if(rank>(i+1)){
						if(hasPiece(files[fileIndex+i],rank-i,piece)&&southeast&&(modifier==""||modifer==files[fileIndex+i]||modifer==rank-i)){
							position = [files[fileIndex+i],rank-i];
						}else if(!hasPiece(files[fileIndex+i],rank-i,"")){
							southeast = false;
						}
					}
					if(hasPiece(files[fileIndex+i],rank,piece)&&east&&(modifier==""||modifer==files[fileIndex+i]||modifer==rank)){
						position = [files[fileIndex+i],rank];
					}else if(!hasPiece(files[fileIndex+i],rank,"")){
						east==false
					}
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
		case 'B':
			var piece = color+'b';
			var northwest=true,north=true,northeast=true,east=true,southeast=true,south=true,southwest=true,west=true;
			for(var i=0;i<8;i++){
				if(fileIndex>=i){
					if(rank>(i+1)){
						if(hasPiece(files[fileIndex-i],rank-i,piece)&&southwest&&(modifier==""||modifer==files[fileIndex-i]||modifer==rank-i)){
							position = [files[fileIndex-i],rank-i];
						}else if(!hasPiece(files[fileIndex-i],rank-i,"")){
							southwest=false;
						}
					}
					if(rank<(8-i)){
						if(hasPiece(files[fileIndex-i],rank+i,piece)&&northwest&&(modifier==""||modifer==files[fileIndex-i]||modifer==rank+i)){
								position = [files[fileIndex-i],rank+i];
						}else if(!hasPiece(files[fileIndex-i],rank+i,"")){
							northwest = false;
						}
					}
				}
				if(fileIndex<(7-i)){
					if(rank>(i+1)){
						if(hasPiece(files[fileIndex+i],rank-i,piece)&&southeast&&(modifier==""||modifer==files[fileIndex+i]||modifer==rank-i)){
							position = [files[fileIndex+i],rank-i];
						}else if(!hasPiece(files[fileIndex+i],rank-i,"")){
							southeast = false;
						}
					}
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
		case 'R':
			var piece = color+'r';
			var northwest=true,north=true,northeast=true,east=true,southeast=true,south=true,southwest=true,west=true;
			for(var i=0;i<8;i++){
				if(fileIndex>=i){
					if(hasPiece(files[fileIndex-i],rank,piece)&&west&&(modifier==""||modifer==files[fileIndex-i]||modifer==rank)){
						position = [files[fileIndex-i],rank];
					}else if(!hasPiece(files[fileIndex-i],rank,"")){
						west = false;
					}
				}
				if(rank>(i+1)){
					if(hasPiece(files[fileIndex],rank-i,piece)&&north&&(modifier==""||modifer==files[fileIndex]||modifer==rank-i)){
							position = [files[fileIndex],rank-i];
					}else if(!hasPiece(files[fileIndex],rank-i,"")){
						north = false;
					}
				}
				if(rank<(8-i)){
					if(hasPiece(files[fileIndex],rank+i,piece)&&south&&(modifier==""||modifer==files[fileIndex]||modifer==rank+i)){
							position = [files[fileIndex],rank++i];
					}else if(!hasPiece(files[fileIndex],rank+i,"")){
						south = false;
					}
				}
				if(fileIndex<(7-i)){
					if(hasPiece(files[fileIndex+i],rank,piece)&&east&&(modifier==""||modifer==files[fileIndex+i]||modifer==rank)){
						position = [files[fileIndex+i],rank];
					}else if(!hasPiece(files[fileIndex+i],rank,"")){
						east==false
					}
				}
			}
			break;
		case 'N':
			piece = color+'k';
			if(fileIndex>0){
				if(rank>2){
					if(hasPiece(files[fileIndex-1],rank-2,piece)&&(modifier==""||modifer==files[fileIndex-1]||modifer==rank-2){
						position = [files[fileIndex-1],rank-2];
					}
				}
				if(rank<7){
					if(hasPiece(files[fileIndex-1],rank+2,piece)&&(modifier==""||modifer==files[fileIndex-1]||modifer==rank+2){
						position = [files[fileIndex-1],rank+2];
					}
				}
			}
			if(fileIndex>1){
				if(rank>1){
					if(hasPiece(files[fileIndex-2],rank-1,piece)&&(modifier==""||modifer==files[fileIndex-2]||modifer==rank-1){
						position = [files[fileIndex-2],rank-1];
					}
				}
				if(rank<8){
					if(hasPiece(files[fileIndex-2],rank+1,piece)&&(modifier==""||modifer==files[fileIndex-2]||modifer==rank+1){
						position = [files[fileIndex-2],rank+1];
					}
				}
			}
			if(fileIndex<7){
				if(rank>2){
					if(hasPiece(files[fileIndex-1],rank-2,piece)&&(modifier==""||modifer==files[fileIndex+1]||modifer==rank-2){
						position = [files[fileIndex-1],rank-2];
					}
				}
				if(rank<7){
					if(hasPiece(files[fileIndex+1],rank+2,piece)&&(modifier==""||modifer==files[fileIndex+1]||modifer==rank+2){
						position = [files[fileIndex+1],rank+2];
					}
				}
			}
			if(fileIndex<6){
				if(rank>1){
					if(hasPiece(files[fileIndex+2],rank-1,piece)&&(modifier==""||modifer==files[fileIndex+2]||modifer==rank-1){
						position = [files[fileIndex+2],rank-1];
					}
				}
				if(rank<8){
					if(hasPiece(files[fileIndex+2],rank+1,piece)&&(modifier==""||modifer==files[fileIndex+2]||modifer==rank+1){
						position = [files[fileIndex+2],rank+1];
					}
				}
			}
			break;
	}
	return position;
}
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
var updateBoard = function(){
	
}