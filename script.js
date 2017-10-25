let board,
game = new Chess();

/*
 Random move generation. game passed is an instance of
 The Chess() constructor which provides our initial board
 config and functionality
 */

//piece values given 13359 system
const pieceValues = {
	'p': 1,
	'n':3,
	'b':3,
	'r':5,
	'q':9,
	'k':0
}

const getBestMove = () => {
	let moves = game.ugly_moves(),
		positionCount = 0,
		bestMove = null,
		maxValue = -9999, //dummy max for black
		maxPlayer = true

	let depth = parseInt($('#search-depth').find(':selected').text());

	// return move with highest evaluation post recursive search at specified depth

		for(let i = 0; i < moves.length; i++) {
			let currentMove = moves[i]
			game.ugly_move(currentMove)
			let moveValue = minimax(depth - 1, !maxPlayer)

			if (moveValue >= maxValue) {
				maxValue = moveValue
				bestMove = currentMove
			}
			
			game.undo();

		}

		return bestMove;


	// return move with highest resulting board evaluation


	// for (let i = 0; i < moves.length; i++){
	// 	let currentMove = moves[i]
	// 	game.ugly_move(currentMove);

	// 	let boardValue = -evaluateBoard(game.board())

	// 	if(boardValue > maxValue) {
	// 		bestMove = currentMove;
	// 	}

	// 	game.undo();
	// }

	// return bestMove


	// return random move out of possible moves
	// return moves[Math.floor(Math.random() * moves.length)]
 };

let positionCount;

const minimax = (depth, maxPlayer) => {
	let moves = game.ugly_moves()
	let maxValue = -9999;
	positionCount++;

	if (depth === 0) {
		return -evaluateBoard(game.board());
	}

	for(let i = 0; i < moves.length; i++) {
		let currentMove = moves[i]
		game.ugly_move(currentMove)
		if(maxPlayer) {
			maxValue = Math.max(maxValue, minimax(depth - 1, !maxPlayer))
		} else {
		 	maxValue = Math.min(maxValue * -1, minimax(depth - 1, !maxPlayer))
		}

		game.undo();

	}

	return maxValue
}

const evaluateBoard = (board) => {
	let evaluation = 0;
	for(let i = 0; i < 8; i++){
		for(let j = 0; j < 8; j++){
			let piece = board[i][j];
			if(piece) {
				piece.color === 'w' ? evaluation += pieceValues[piece.type] : evaluation += -pieceValues[piece.type]
			}
		}
	}
	return evaluation;
}



const onDragStart = (source, piece, position, orientation) => {
	  if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
}

const makeBestMove = () => {
	let startDate = new Date().getTime();
	positionCount = 0;

	let bestMove = getBestMove();
	let endDate = new Date().getTime();
	let totalTime = (endDate - startDate);

	game.ugly_move(bestMove);
	board.position(game.fen());
	$('#positions-evaluated').text(positionCount)
	$('#time').text(totalTime)
	// renderMoveHistory(game.history());
}

//temporarily disabling move history
const renderMoveHistory = function (moves) {
    // let historyElement = $('#move-history').empty();
    // historyElement.empty();
    // for (let i = 0; i < moves.length; i += 2) {
    //     historyElement.append('<span>' + moves[i] + ' ' + ( moves[i + 1] ? moves[i + 1] : ' ') + '</span><br>')
    // }
    // historyElement.scrollTop(historyElement[0].scrollHeight);
}

const onDrop = (source, target) => {
	let move = game.move({
		from: source,
		to: target,
		promotion: 'q'
	})

	if(move === null){
		return 'snapback';
	}

	renderMoveHistory(game.history());
	window.setTimeout(makeBestMove, 250);
	
};	

const onSnapEnd = () => {
	board.position(game.fen());
}

let cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
}

board = ChessBoard('board', cfg)