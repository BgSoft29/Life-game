var canvas;
var ctx;
var fps = 30;

var canvasX = 600; //pixels ancho
var canvasY = 600; // pixels alto

var tileX, tileY;

// Variables relacionadas con el tablero del juego
var tablero;
var filas = 100;
var columnas = 100;

var blanco = "white";
var negro = "black";


function creaArray2D(f,c){
    var obj = new Array(c);
    for( i=0; i<c; i++ ){
        obj[i] = new Array(f);
    }
    return obj;
}

// Crear agentes u objetos
var Agente = function(y,x,estado) {
    this.x = x;
    this.y = y;
    this.estado = estado;
    this.estadoProx = this.estado;

    this.vecinos = [];

    this.addVecinos = function() {
        var xVecino;
        var yVecino;

        for( i= -1; i<2; i++){
            for( j= -1; j<2; j++){
                // Asignar vecinos y acomodar agentes segun los limites del tablero
                xVecino = (this.x + j + columnas) % columnas;
                yVecino = (this.y + i + filas) % filas;
                // Descartamos el agente actual
                if( i!= 0|| j!=0 ){
                    this.vecinos.push(tablero[yVecino][xVecino]);
                }
            }
        }
            
    }
    this.dibuja = function() {
        var color;
        if(this.estado == 1){
            color = blanco;
        }
        else {
            color = negro;
        }
        ctx.fillStyle = color;
        ctx.fillRect(this.x * tileX, this.y * tileY, tileX, tileY);
    }

    // Cambio de estado o leyes de Conway
    this.nuevoCiclo = function(){
        var suma = 0;

        // Calculamos la cantidad de vecinos vivos
        for(i=0; i<this.vecinos.length; i++){
            suma += this.vecinos[i].estado;
        }

        // Aplicamos las normas
        this.estadoProx = this.estado; //por defecto queda igual

        // Si tiene menos de 2 o mas de 3 muere
        if(suma < 2 || suma > 3){
            this.estadoProx = 0;
        }

        // Si hay 3 vivos quedan vivos
        if(suma == 3){
            this.estadoProx = 1;
        }
    }
    this.mutacion = function(){
        this.estado = this.estadoProx;
    }
}

function inicializaTablero(obj){
    var estado;

    for(y= 0; y<filas; y++){
        for(x=0; x<columnas; x++){
            estado = Math.floor(Math.random()*2);
            obj[y][x] = new Agente(y,x,estado);
        };
    };
    for(y= 0; y<filas; y++){
        for(x=0; x<columnas; x++){
            obj[y][x].addVecinos();
        };
    };
}

// Para borrar cada fotograma
function borrarCanvas() {
    canvas.width = canvas.width;
    canvas.height = canvas.height;
}

function inicializa() {
    // Asociamos el canvas con la funcion de inicialización
    canvas = document.getElementById('pantalla')
    ctx = canvas.getContext('2d');

    canvas.width = canvasX;
    canvas.height = canvasY;

    // Calcula tamaño de los tiles
    tileX = Math.floor(canvasX/filas);
    tileY = Math.floor(canvasY/columnas);

    // Creamos el tablero
    tablero = creaArray2D(filas, columnas);

    // Inicializamos tablero
    inicializaTablero(tablero);

    // Ejecución del bucle principal
    setInterval(() => {
        principal();
    }, 1000/fps);
}

// Funcion dibuja tablero
function dibujaTablero(obj){


    // Dibuja los agentes en el tablero
    for(y=0; y<filas; y++){
        for(x=0; x<columnas; x++){
            obj[y][x].dibuja();
        }
    }

    // Calcula el siguiente ciclo
    for(y=0;y<filas;y++){
        for(x=0;x<columnas;x++){
            obj[x][y].nuevoCiclo();
        }
    }
    // Aplica mutación
    for(y=0;y<filas;y++){
        for(x=0;x<columnas;x++){
            obj[x][y].mutacion();
        }
    }
}



// Bucle principal
function principal () {

    borrarCanvas();
    dibujaTablero(tablero);
}