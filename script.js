let board,
game = new Chess();

/*
 Random move generation. game passed is an instance of
 The Chess() constructor which provides our initial board
 config and functionality
 */

const getBestMove = () => {
	let moves = game.ugly_moves();
	return moves[Math.floor(Math.random() * moves.length)]
};

const onDragStart = (source, piece, position, orientation) => {
	  if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
}

const makeBestMove = () => {
	let bestMove = getBestMove(game);
	game.ugly_move(bestMove);
	board.position(game.fen());
	renderMoveHistory(game.history());
}

const renderMoveHistory = function (moves) {
    let historyElement = $('#move-history').empty();
    historyElement.empty();
    for (let i = 0; i < moves.length; i += 2) {
        historyElement.append('<span>' + moves[i] + ' ' + ( moves[i + 1] ? moves[i + 1] : ' ') + '</span><br>')
    }
    historyElement.scrollTop(historyElement[0].scrollHeight);
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