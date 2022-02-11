//Funcion que dibuja el tablero 
(function () {
    self.Board = function (width, height) {
        this.height = height;  //tamaño
        this.width = width;
        this.bars = [];//Barras
        this.ball = null;   //Pelota
        this.playing = true;
        this.game_over = false;
    }

    self.Board.prototype = {  //Se crean las barras y la pelota
        get elements() {
            var elements = this.bars.map(function (bar) { return bar; });
            elements.push(this.ball);
            return elements;
        }
    }
})();

//Funcion para crear movimiento de pelota
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

    self.Ball.prototype = { //Movimiento de la pelota 
        move: function () {
            this.x += (this.speed_x * this.direction);
            this.y += (this.speed_y);

            // Colision con paredes verticales
            if (this.x <= 10) {
                this.speed_x = -this.speed_x;
                this.bounce_angle = -this.bounce_angle;
            }
            if (this.x >= 790) {
                this.speed_x = -this.speed_x;
                this.bounce_angle = -this.bounce_angle;
            }

            // Colision con paredes horizontales
            if (this.y <= 10) {
                this.speed_y = -this.speed_y;
                this.bounce_angle = -this.bounce_angle;
            }
            if (this.y >= 390) {
                this.speed_y = -this.speed_y;
                this.bounce_angle = -this.bounce_angle;
            }
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

            if (this.x > (this.board.width / 2)) {
                this.direction = -1;
            } else {
                this.direction = 1;
            }
        }
    }
})();

//Funcion para definir las medidas del canvas
(function () {
    self.Bar = function (x, y, width, height, board) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this); //Se entra al board, luego al bar y se le agrega nuevo elemento
        this.kind = "rectangle"  //Forma de la barra
        this.speed = 10;  //Velocidad de la barra
    }


    self.Bar.prototype = {//Movimiento de las barras
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

// Funcion para dibujar el tablero
(function () {
    self.BoardView = function (canvas, board) {
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board; //Se asigna el tablero
        this.ctx = this.canvas.getContext("2d"); //Obtiene el contexto del canvas
    }

    self.BoardView.prototype = {
        clean: function () { //Limpiar el canvas
            this.ctx.clearRect(0, 0, this.board.width, this.board.height);
        },
        draw: function () {
            for (var i = this.board.elements.length - 1; i >= 0; i--) { // Se corre el elemento para dibujarlo
                var ele = this.board.elements[i];
                draw(this.ctx, ele);
            };
        },
        check_collisions: function () {//Validamos si la bola choca con las barras
            for (var i = this.board.bars.length - 1; i >= 0; i--) {
                var bar = this.board.bars[i];
                if (hit(bar, this.board.ball)) {
                    this.board.ball.collision(bar);
                }
            }
        },
        play: function () { //Se llama a las funciones para que el juego comience a funcionar
            if (!this.board.playing) {
                this.clean(); //Se limpia el canvas
                this.draw(); //Se dibuja el tablero
                this.check_collisions(); //Se verifica las colisiones
                this.board.ball.move(); // Se mueve la pelota
            }
        }
    }

    function hit(a, b) { //Revisa si a colisiona con b
        var hit = false;

        //Colisiones horizontales

        if (b.x + b.width >= a.x && b.x < a.x + a.width) {
            //Colisiones verticales
            if (b.y + b.height >= a.y && b.y < a.y + a.height) {
                hit = true;
            }
        }

        //Colision de a con b
        if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
            if (b.y <= a.y && b.y + b.height >= a.y + a.height) {
                hit = true;
            }
        }

        //Colision de b con a 
        if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
            if (a.y <= b.y && a.y + a.height >= b.y + b.height) {
                hit = true;
            }
        }
        return hit;
    }

    // Se encarga de dibujar el element elegido
    function draw(ctx, element) {
        switch (element.kind) {
            case "rectangle":
                ctx.fillRect(element.x, element.y, element.width, element.height)//fillRect es una funcion del contexto que nos permite dibujar un cuadrado, recibe los parametros
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

//Inicializacionn de objetos
var board = new Board(800, 400); //Tamaño del tablero
var bar = new Bar(20, 100, 40, 100, board); //Tamaño de la barra 1
var bar_2 = new Bar(735, 100, 40, 100, board); //Tamaño de la barra 2
var canvas = document.getElementById('canvas');// Se obtiene el canvas desde el DOM
var board_view = new BoardView(canvas, board);// Se crea el tablero
var ball = new Ball(350, 100, 10, board); // Se crea la pelota



document.addEventListener("keydown", function (ev) {

    if (ev.keyCode === 38) { //Movimiento de fecla hacia arriba
        ev.preventDefault();
        if (bar_2.y >= 10) {
            bar_2.up(); // 
        }
    } else if (ev.keyCode === 40) {//Movimiento de fecla hacia abajo
        ev.preventDefault();
        if (bar_2.y <= 290) {
            bar_2.down();
        }
    } else if (ev.keyCode === 87) { // Movimiento de letra w hacia arriba
        ev.preventDefault();
        if (bar.y >= 10) {
            bar.up();
        }
    } else if (ev.keyCode === 83) { //Movimiento de letra s hacia abajo
        ev.preventDefault();
        if (bar.y <= 290) {
            bar.down();
        }
    } else if (ev.keyCode === 32) {
        ev.preventDefault();
        board.playing = !board.playing;
    };

})

window.board_view.draw();

window.requestAnimationFrame(controller);//Animacion

//Ejecutar todos los elementos 
function controller() {
    board_view.play();
    window.requestAnimationFrame(controller);
};