//6 parts 
window.onload = function() {
	//1. Initial states
	var num;
	var box;
	var ctx;
	var turn = 1;
	var filled;
	var symbol;
	var winner;
	var gameOver = false;
	var human = 'X';
	var ai = 'O';
	var result = {};
	filled = new Array();
	symbol = new Array();
	winner = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
	for(var i=0; i<9; i++) {
		filled[i] = false;
		symbol[i] = '';
	}
	
	//newGame - event + function
	var n = document.getElementById("new");
	n.addEventListener("click",newGame);
	
	//Reload page
	function newGame() {
		document.location.reload();
	}
	
	//Canvas click + retrieving the box's number 
	//canvas click event
	document.getElementById("tic").addEventListener("click",function(e){
		boxClick(e.target.id);
	});
	
	//2.Drawing X's and O's
	//Draw X
	function drawX() {
		box.style.backgroundColor = "#f5fafa";//"#fb51c5";
		ctx.beginPath();
		ctx.moveTo(15,15);
		ctx.lineTo(85,85);
		ctx.moveTo(85,15);
		ctx.lineTo(15,85);
		ctx.lineWidth = 12;
		ctx.lineCap = "round";
		ctx.strokeStyle = "red";
		ctx.stroke();
		ctx.closePath();
		
		symbol[num-1] = human;
	}
	
	//Drawing O
	function drawO(next) {
		box.style.backgroundColor = "#f5fafa";  //"#fbdf51" //"#93f273";
		ctx.beginPath();
		ctx.arc(50,50,35,0,2*Math.PI);
		ctx.lineWidth = 12;
		ctx.strokeStyle = "black";
		ctx.stroke();
		ctx.closePath();
		
		symbol[next] = ai; // 'O'
	}
	
	//3.Winner check function 
	function winnerCheck(symbol,player) {
		for(var j=0;j<winner.length;j++) {
			if((symbol[winner[j][0]] == player) && (symbol[winner[j][1]] == player) && (symbol[winner[j][2]] == player)) {
				return true;
			}
		}
		return false;
	}
	
	//4.Box click function - human playing
	function boxClick(numId) {
		box = document.getElementById(numId);
		ctx = box.getContext("2d");
		switch(numId) {
			case "canvas1": num = 1;
							break;
			case "canvas2": num = 2;
							break;
			case "canvas3": num = 3;
							break;
			case "canvas4": num = 4;
							break;
			case "canvas5": num = 5;
							break;
			case "canvas6": num = 6;
							break;
			case "canvas7": num = 7;
							break;
			case "canvas8": num = 8;
							break;
			case "canvas9": num = 9;
							break;
		}
		
		if(filled[num-1] === false) {
			if(gameOver === false) {
				if(turn%2 !== 0) {
					drawX();
					turn++;
					filled[num-1] = true;
					
					if(winnerCheck(symbol,symbol[num-1]) === true) {
						document.getElementById("result").innerText = "Player '" + symbol[num-1] + "' won!";
						gameOver = true;
						
					}
					
					if(turn > 9 && gameOver !== true) {
						document.getElementById("result").innerText = "GAME OVER! IT WAS A DRAW!";
						return;
					}
					
					if(turn%2 == 0) {
						playAI();
					}
				}
			}
			else {
				alert("Game over. Please click the New Game button to start again");
			}
		}
		else {
			alert("This box was already filled. Please click on another one.")
		}
	}
	
	//5. Find the empty boxes
	function emptyBoxes(newSymbol) {   //sending seperate array
		var j = 0;
		var empty = [];
		for(var i=0; i<newSymbol.length; i++) {
			if(newSymbol[i] !== 'X' && newSymbol[i] !== 'O') {
				empty[j] = i;
				j++;
			}
		}
		return empty;
	}
//-------------------------------------------------------------	
	//6. Making the AI play - playAI() and minimax()
	
	//playAI()   //this is going to be from box-click function
                 //our function AI will not accept any arguments
	function playAI() {
		//symbol = ['X','','O','O','','O','','X','X'], 'O'
		//nextMove = id:4,score:10
		var nextMove = miniMax(symbol,ai); //object that stores id of next move and score of the box for next move
		var nextId = "canvas" + (nextMove.id + 1);  // +1 is because canvas is starting from 1 and our array starts form 0 index
		box = document.getElementById(nextId);// getting element by nextID(index-canas) //holds partucular element to be drawn on that
		ctx = box.getContext("2d");
		if(gameOver === false) {
			if(turn%2 === 0) { //if turn is even - AI turn 
				drawO(nextMove.id);
				turn++;
				filled[nextMove.id] = true; //update id state to filled as there is a value now //mark it as filled
				
				//winner check - ai wins           //symbol[***] - is player var
				if(winnerCheck(symbol, symbol[nextMove.id]) === true) {
					document.getElementById("result").innerText = "Player '" + symbol[nextMove.id] + "' won!";
					gameOver = true;
				}
				
				//draw condition
				if(turn > 9 && gameOver !== true) {  //if turns reach the limit and gaveover is still false than it is draw because there is no more unfilled boxes
					document.getElementById("result").innerText = "GAME OVER! IT WAS A DRAW!";
				}
			}
		}
		
		else {
			alert("Game is over. Please click the New Game button to start again");
		}
	}
//-------------------------------------------------------------------------------------	
	//Minimax function 
	//symbol = ['X','','O','X','','O','','X','X'], 'O' -> human
	function miniMax(newSymbol, player) {
		var empty = [];
		empty = emptyBoxes(newSymbol); //[]
		
		if(winnerCheck(newSymbol,human)) {
			return { score: -10 }; //human wins
		}
		else if(winnerCheck(newSymbol,ai)) {
			return { score: 10 }; //AI wins
		}
		else if(empty.length === 0) { //if all boxes are filled 
			if(winnerCheck(newSymbol,human)) { //at the end someone could we so that we again winnerCheck
				return { score: -10 };
			}
			else if(winnerCheck(newSymbol,ai)) {
				return { score : 10 };
			}
			return { score: 0 }; //game is draw
		}
		
        //7.recurring conditions
		//if its not a terminal state
		//possible moves- their indices and score values
		var posMoves = []; 
		
		for(var i=0; i<empty.length; i++) {
			//current move - index of current move,score
			var curMove = {}; // we dont know the score yet
			//generate the new board with the current move and player, get the datails of previous board and copy them to the new one
			curMove.id = empty[i];
			newSymbol[empty[i]] = player; //AI
            //new state we will get from that
			
			if(player === ai) {
				//result = [{id:4,score:-10}], 
				//curMove = {id:1,score:-10}
                // we need result because the playAi() function will need the id and score
				result = miniMax(newSymbol, human); //index and score
				curMove.score = result.score; //10
			}
			else {
				//(id, score)
				result = miniMax(newSymbol, ai);  // result var will store index and the socre of the player to be sent to playAI() function
				curMove.score = result.score; //-10
			}
			
			newSymbol[empty[i]] = '';
			
			posMoves.push(curMove); //id: 1, score: -10
			
		}
		
		//Calculate score of intermediate states - best move + score with respect to that player + return statement 
		var bestMove;
		//AI - max player (always) -> choose maximum value, human - min player -> choose minimum value
		
		if(player === ai) {
			//posMoves 
			var highestScore = -1000;
			for(var j=0; j<posMoves.length;j++) {
				if(posMoves[j].score > highestScore) {
					highestScore = posMoves[j].score;
					bestMove = j; //0  we will take j value as an index to access that particular id
				}
			}
		}
		//posMoves
		else {   //This applies for human, as the highestscore 1000, which should find other values less than 1000 for best pos move
			var lowestScore = 1000;
			for(var j=0; j<posMoves.length;j++) {
				if(posMoves[j].score < lowestScore) {
					lowestScore = posMoves[j].score;
					bestMove = j;
				}
			}
		}
		return posMoves[bestMove]; 
        //AI wants MiniMax algorithm to win so it will take the best posible move while human takes min pos value
		//posMoves[0] id:4,score:10
	}
	

	
};
	
	
	
	
	
	
	
	
	
	
	
	
