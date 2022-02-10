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
        this.bars = [];
        //Pelota
        this.ball = null;
    }

    self.Board.prototype = {
        //Se crean la sbarras y la pelota
        get elements() {
            var elements = this.bars;
            elements.push(this.ball);
            return elements;
        }
    }
})();

//Pelota
(function () {
    self.Bar = function (x, y, width, height, board) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;

        //Se entra al board, luego al bar y se le agrega nuevo elemento
        this.board.bars.push(this);
        //forma
        this.kind = "rectangle"

        //Velocidad
        this.speed = 10;
    }

    //Funcion para mover las barras
    self.Bar.prototype = {
        down: function () {
            this.y += this.speed;
        },
        up: function () {
            this.y -= this.speed;
        },
        toString: function () {
            return "X: " + this.x + " Y: " + this.y
        }
    }
})();

// Esta funcion se encarga de dibujar el tablero
(function () {
    self.BoardView = function (canvas, board) {
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board; //se asgina el tablero
        this.ctx = canvas.getContext("2d"); //obtiene el contexto del canvas
    }

    self.BoardView.prototype = {

        draw: function () {
            for (var i = this.board.elements.length - 1; i >= 0; i--) { // Se corre el elemento para dibujarlo
                var ele = this.board.elements[i]
                draw(this.ctx, ele)
            }
        }
    }

    //funcion para dinujar los elementos

    function draw(ctx, element) {
        if (element !== null && element.hasOwnProperty("kind")) {
            switch (element.kind) {
                case "rectangle":
                    //fillRect es una funcion del contexto que nos permite dibujar un cuadrado, recib los parametros
                    ctx.fillRect(element.x, element.y, element.width, element.height)
                    break;
            }
        }

    }
})();
var board = new Board(800, 400);
var bar = new Bar(20, 100, 40, 100, board);
var bar = new Bar(700, 100, 40, 100, board);
var canvas = document.getElementById("canvas");
var board_view = new BoardView(canvas, board);

document.addEventListener("keydown", function (ev) {
    console.log(ev.keyCode);
    if (ev.keyCode == 38) {
        bar.up();
    } else if (ev.keyCode == 40) {
        bar.down();
    }
    console.log("" + bar)

})

self.addEventListener("load", main)

//Ejecutar todos los elementos 
function main() {

    board_view.draw();
};

