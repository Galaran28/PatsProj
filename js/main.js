var shotCount;
var hitCount;	
var gameBoard;
var rows = 8;
var cols = 8;
var boardSize = rows * cols;
var numPieces = 22;
var numShots = 1000;
var $gameBoard;
var $shotCount;
var $info;
var $resetBtn;

$(function(){
	$gameBoard = $('#gameBoard');
	$shotCount = $('#shots');
	$info = $('#info');
	$resetBtn = $('#reset');

	if(!localStorage.getItem('shotCount')){
		localStorage.setItem('shotCount', numShots);
	}
	
    $resetBtn.on('click', ResetGame);
	$gameBoard.on('click', fire);
	init();
});

function init(){
	$gameBoard.empty();
	$gameBoard.show();

	hitCount = 0;
	$info.show();
	$info.text('You have hit ' + hitCount + ' square' + (hitCount > 1 ? 's' : ''));
	
	localStorage.setItem('shotCount', numShots);
	shotCount = Number(localStorage.getItem('shotCount'));
	$shotCount.text('Number of Shots Left: ' + shotCount);
	$shotCount.css('color', 'white');

	gameBoard = GenerateBoard();
	/*[ 
		[0,0,0,1,1,1,1,0],
		[0,0,0,0,0,0,0,0],
		[0,0,1,0,1,1,1,1],
		[1,0,1,0,0,0,0,0],
		[1,0,1,0,0,0,0,0],
		[1,0,0,0,0,1,1,1],
		[1,0,0,1,0,0,0,0],
		[1,0,0,1,0,0,1,0]];
		*/
	for (i = 0; i < cols; i++) {
		for (j = 0; j < rows; j++) {		
			var square = document.createElement("div");
			$gameBoard.append(square);
			square.id = 's' + j + i;										
		}
	}
}

function fire(e) {
	if (e.target !== e.currentTarget) {
		var row = e.target.id.substring(1,2);
		var col = e.target.id.substring(2,3);
				
		if (gameBoard[col][row] == 0) {
			e.target.style.background = '#bbb';
			gameBoard[col][row] = 3;
			$info.text('That was a miss :(');
			ShotFired();
		} 
		else if (gameBoard[col][row] == 1) {
			e.target.style.background = 'red';
			gameBoard[col][row] = 2;
			
			hitCount++;
			$info.text('You have hit ' + hitCount + ' square' + (hitCount > 1 ? 's' : ''));
			ShotFired();	
		} 
		else if (gameBoard[row][col] > 1) {
			$info.text('You cannot shoot the same space more than once');
		}
	}
	if (hitCount == numPieces) {
		Win();
	}		
	else if(shotCount < 1){
		GameOver();
	}
	e.stopPropagation();
}

function ShotFired(){
	shotCount--;	
	$shotCount.text('Number of Shots Left: ' + shotCount);
}

function ResetGame(){
  init();
}

function GameOver(){
	$gameBoard.empty();
	$gameBoard.hide();
	$info.hide();
	$shotCount.text('Unfortunately you ran out of shots and have lost. Good luck next time');
	$shotCount.css('color', 'red');
}

function Win(){
	$info.hide();
	$shotCount.text('You Win! Great Job!');
}

function GenerateBoard() {
	var ShipLengths = [5,4,4,3,3,2,1]
	var Board = [
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0]];

	//do{
	//	var clear = false;
		Board = GenerateShipLocations(ShipLengths, Board);
	//	clear = CheckPositions(Board);				
	//}
	//while(!clear);
	return Board;
}

function GenerateShipLocations(shipLengths, board){
	try{
		for(var i = 0; i < shipLengths.length(); i++){
			var dir = Math.floor(Math.random() * 2); // 1 - horizontal  2 - vertical		
			var length = shipLengths[i];	
			var start = Math.floor(Math.random() * boardSize) - 1;
			var row = start / 8;
			var col = start % 8;

			board[row][col] = 1;
			if(dir === 1){ // horizontal piece
				for(var i = 0; i < length; i++){
					if(i % 2 === 1){ // alternate direction to place to piece on odd/even
						board[row - 1][col] = 1;
					}
					else{
						board[row + 1][col] = 1;
					}
				}
			}
			else{ // vertical piece
				for(var i = 0; i < length; i++){
					if(i % 2 === 1){ // alternate direction to place to piece on odd/even
						board[row][col - 1] = 1;
					}
					else{
						board[row][col + 1] = 1;
					}
				}
			}
		}
		return board;
	}
	catch{
		// something went wrong... just start over
		return board;
	}		
}

function CheckPositions(board){
	let boardCheck = 0;
	for (i = 0; i < cols; i++) {
		for (j = 0; j < rows; j++) {
			if(board[i][j] === 1){
				boardCheck++;
			}
		}
	}	
	if(boardCheck === 22){
		return true;
	}
	else{
		return false;
	}
}