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
        this.playing = false;
    }

    self.Board.prototype = {
        //Se crean la sbarras y la pelota
        get elements() {
            var elements = this.bars.map(function (bar) { return bar; }); //generar una copia del arreglo
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
        this.direction = 1;

        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;
        this.speed = 3;

        board.ball = this;
        this.kind = "circle";
    }

    self.Ball.prototype = { //movimiento de la pelota 
        move: function () {
            this.x += (this.speed_x * this.direction);
            this.y += (this.speed_y);
        },
        get width() {
            return this.radius * 2;
        },
        get height() {
            return this.radius * 2;
        }
        ,
        collision: function () {
            //Reacciona a la colision con una barra que recibe como parametro 

            var relative_intersect_y = (bar.y + (bar.height / 2)) - this.y;
            var normalized_intersect_y = relative_intersect_y / (bar.height / 2);

            this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

            this.speed_y = this.speed * -Math.sin(this.bounce_angle);
            this.speed_x = this.speed * Math.cos(this.bounce_angle);

            if (this.x > (this.board.width / 2)) this.direction = -1;
            else this.direction = 1;
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
        clean: function () { //limpiar el canvas
            this.ctx.clearRect(0, 0, this.board.width, this.board.height);
        },
        draw: function () {
            for (var i = this.board.elements.length - 1; i >= 0; i--) { // Se corre el elemento para dibujarlo
                var ele = this.board.elements[i]
                draw(this.ctx, ele)
            };
        },
        check_collisions: function () {//validamos si la bola choca con las barras
            for (var i = this.board.bars.length - 1; i >= 0; i--) {
                var bar = this.board.bars[i];
                if (hit(bar, this.board.ball)) {
                    this.board.ball.collision(bar);
                }
            }
        },
        play: function () { // para que el juego funcione
            if (this.board.playing) {
                this.clean();
                this.draw();
                this.check_collisions();
                this.board.ball.move();
            }
        }
    }

    function hit(a, b) { //revisa si a colisiona con b
        var hit = false;

        //colisiones horizontales

        if (b.x + b.width >= a.x && b.x < a.x + a.width) {
            //colisiones verticales
            if (b.y + b.height >= a.y && b.y < a.y + a.height) {
                hit = true;
            }
        }

        //colision de a con b
        if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
            if (b.y <= a.y && b.y + b.height >= a.y + a.height) {
                hit = true;
            }
        }

        //colision de b con a 
        if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
            if (a.y <= b.y && a.y + a.height >= b.y + b.height) {
                hit = true;
            }
        }
        return hit;
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
setTimeout(function () {
    ball.direction = - 1 // direccion de la pelota 
}, 4000)



document.addEventListener("keydown", function (ev) {

    if (ev.keyCode === 38) { //movimiento de la felcha arriba y abajo 
        ev.preventDefault();
        bar.up();
    } else if (ev.keyCode === 40) {
        ev.preventDefault();
        bar.down();
    } else if (ev.keyCode === 87) { //movimiento de la w
        ev.preventDefault();
        bar_2.up();
    } else if (ev.keyCode === 83) { //ws
        ev.preventDefault();
        bar_2.down();
    } else if (ev.keyCode === 32) {
        ev.preventDefault();
        board.playing = !board.playing;
    };

})

board_view.draw();


//Ejecutar todos los elementos 
function controller() {
    board_view.play();
    window.requestAnimationFrame(controller);
};

