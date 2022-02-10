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

//movimiento de pelota
(function () {
    self.Ball = function (x, y, radius, board) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed_y = 0;
        this.speed_x = 3;
        this.board = board;

        board.ball = this;
        this.kind = "circle";

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
        clean: function () { //limpiar el canvas
            this.ctx.clearRect(0, 0, this.board.width, this.board.height);
        },
        draw: function () {
            for (var i = this.board.elements.length - 1; i >= 0; i--) { // Se corre el elemento para dibujarlo
                var ele = this.board.elements[i]
                draw(this.ctx, ele)
            };
        },
        play: function () { // para que el juego funcione
            this.clean();
            this.draw();
        }
    }

    //funcion para dinujar los elementos

    function draw(ctx, element) {
        switch (element.kind) {
            case "rectangle":
                //fillRect es una funcion del contexto que nos permite dibujar un cuadrado, recib los parametros
                ctx.fillRect(element.x, element.y, element.width, element.height)
                break;
            case "circle":
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.radius, 0, 7);
                ctx.fill();
                ctx.closePath();
                break;
        }
    }
})();
var board = new Board(800, 400);
var bar = new Bar(20, 100, 40, 100, board);
var bar_2 = new Bar(735, 100, 40, 100, board);
var canvas = document.getElementById("canvas");
var board_view = new BoardView(canvas, board);
var ball = new Ball(350, 100, 10, board)


//animacion
window.requestAnimationFrame(controller);



document.addEventListener("keydown", function (ev) {
    ev.preventDefault();
    if (ev.keyCode == 38) { //movimiento de la felcha arriba y abajo 
        bar.up();
    } else if (ev.keyCode == 40) {
        bar.down();
    } else if (ev.keyCode == 87) { //movimiento de la w y s
        bar_2.up();
    } else if (ev.keyCode == 83) {
        bar_2.down();
    }
    console.log("" + bar_2)
})


//Ejecutar todos los elementos 
function controller() {
    board_view.play();
    window.requestAnimationFrame(controller);
};

