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
            elements.push(this.ball)
            return elements
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

        console.log("HOla")
    }

    //Funcion para moverse, declaracion 
    self.Bar.prototype = {
        down: function () {

        },
        up: function () {

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

    self.Board.prototype = {

        draw: function () {
            for (var i = this.board.elements.length - 1; i >= 0; i--) {
                var ele = this.board.elements[i]
                draw(this.ctx, ele)
                console.log("holiiiiiiiiii");
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

self.addEventListener("load", main)

//Ejecutar todos los elementos 
function main() {
    var board = new Board(800, 400);
    var bar = new Bar(20, 100, 40, 100, board);
    var canvas = document.getElementById("canvas");
    var board_view = new BoardView(canvas, board);
    console.log("Por aqui voy")
    board_view.draw();
    console.log("Aqui final")
};

