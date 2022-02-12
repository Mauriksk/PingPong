// Creamos el canvas
const canvas = document.getElementById("pong");
// contexto del canvas
const context = canvas.getContext('2d');

// Objeto pelota
const pelota = {
    x : canvas.width/2,
    y : canvas.height/2,
    radio : 10,
    velocidadEnX : 5,
    velocidadEnY : 5,
    speed : 7,
    color : "WHITE"
}

// Paleta del jugador Humano, la x, e y son para posicionar la paleta en el canvas
const jugadorHumano = {
    x : 0, 
    y : (canvas.height - 100)/2, 
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}

// Jugador automatico
const jugadorBot = {
    x : canvas.width - 10, // - width of paddle
    y : (canvas.height - 100)/2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}

// Red del medio de la cancha
const red = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "WHITE"
}

// Crea un cuadrado canvas 
const crearReactangulo = (x, y, w, h, color) => {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

// Crea un circulo canvas
const crearCirculo = (x, y, r, color) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x,y,r,0,Math.PI*2,true);
    context.closePath();
    context.fill();
}


const posicionMouse = (e) => {
    let rect = canvas.getBoundingClientRect();
    jugadorHumano.y = e.clientY - rect.top - jugadorHumano.height/2;
}

// Agregar evento del mouse al canvas
canvas.addEventListener("mousemove", posicionMouse);



// Estado inicial de la pelota al comenzar de nuevo el tanto
const resetBall = () => {
    pelota.x = canvas.width/2;
    pelota.y = canvas.height/2;
    pelota.velocidadEnX = -pelota.velocidadEnX;
    pelota.speed = 7;
}

// Pintar la red
const crearRed = () => {
    for(let i = 0; i <= canvas.height; i+=15){
        crearReactangulo(red.x, red.y + i, red.width, red.height, red.color);
    }
}

// Crear texto
const crearTexto = ( text, x, y ) => {
    context.fillStyle = "#FFF";
    context.font = "75px fantasy";
    context.fillText(text, x, y);
}

// Detecta Contacto de objetos
const reconoceContacto = (b,p) => {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radio;
    b.bottom = b.y + b.radio;
    b.left = b.x - b.radio;
    b.right = b.x + b.radio;
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// Actualiza Score de los jugadores
const actualizarScore = () =>{
    
    if( pelota.x - pelota.radio < 0 ){
        jugadorBot.score++;
        resetBall();
    }else if( pelota.x + pelota.radio > canvas.width){
        jugadorHumano.score++;
        resetBall();
    }
    
    pelota.x += pelota.velocidadEnX;
    pelota.y += pelota.velocidadEnY;
    
    //AI del jugadorBot
    jugadorBot.y += ((pelota.y - (jugadorBot.y + jugadorBot.height/2)))*0.1;
    
    if(pelota.y - pelota.radio < 0 || pelota.y + pelota.radio > canvas.height){
        pelota.velocidadEnY = -pelota.velocidadEnY;
    }
    //Identifica que jugador tocara la pelota
    let player = (pelota.x + pelota.radio < canvas.width/2) ? jugadorHumano : jugadorBot;
    
    // Funcion que controla el choque de la pelota con la raqueta
    if(reconoceContacto(pelota,player)){
        
        // Reconoce el punto de choque del jugador que toca la pelota
        let puntoDeChoque = (pelota.y - (player.y + player.height/2));
        puntoDeChoque = puntoDeChoque / (player.height/2);
        let anguloResultante = (Math.PI/4) * puntoDeChoque;
        
        // Cambios de direccion de la pelota segun el angulo de donde golpea la pelota
        let direction = (pelota.x + pelota.radio < canvas.width/2) ? 1 : -1;
        pelota.velocidadEnX = direction * pelota.speed * Math.cos(anguloResultante);
        pelota.velocidadEnY = pelota.speed * Math.sin(anguloResultante);
        
        // La pelota sube de velocidad gradualmente
        pelota.speed += 0.1;
    }
}

// Esta funcion ejecuta todas las creaciones de objetos canvas
const render = () => {
    crearReactangulo(0, 0, canvas.width, canvas.height, "#000");
    crearTexto(jugadorHumano.score,canvas.width/4,canvas.height/5);
    crearTexto(jugadorBot.score,3*canvas.width/4,canvas.height/5);
    crearRed();
    crearReactangulo(jugadorHumano.x, jugadorHumano.y, jugadorHumano.width, jugadorHumano.height, jugadorHumano.color);
    crearReactangulo(jugadorBot.x, jugadorBot.y, jugadorBot.width, jugadorBot.height, jugadorBot.color);
    crearCirculo(pelota.x, pelota.y, pelota.radio, pelota.color);
}

//Esta ejecuta todo el juego
const game = () => {
    actualizarScore();
    render();
}
//Numero de frames por segundo al que se ejecuta el juego
let fps = 50;
let loop = setInterval(game,1000/fps);