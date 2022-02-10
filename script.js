//tablero 
(function () {

    self.Board = function (width, height) {
        //tamaño
        this.height = height;
        this.width = width;
        //verificar si estan jugando o se acabo el juego
        this.playing = false;
        this.game_over = false;

        //Barras
        this.bars = []
        //Pelota
        this.ball = null
    }

    self.Board.prototype = {

        //Se crean la sbarras y la pelota
        get elements() {
            var elements = this.bars
            elements.push(ball)
            return elements
        }
    }


})();


(function () {
    self.BoardView = function (canvas, board) {
        this.canvas = canvas
        this.canvas.width = board.width
        this.canvas.height = board.height
        this.board = board;
        this.ctx = canvas.getContext("2d")

    }
})();

addEventListener("load", main)

//Ejecutar todos los elementos 
function main() {
    var board = new Board(800, 400)
    var canvas = document.getElementById("canvas")
    var board_view = new BoardView(canvas, board)
};