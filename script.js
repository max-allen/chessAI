let game = new Chess();

let moves = game.moves();

let cfg = {
    draggable: true, 
    position: 'start'
};

let board = ChessBoard('board',cfg)