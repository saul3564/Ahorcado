const lienzo = document.getElementById("canvas")
const pincel = lienzo.getContext('2d')

let listaPalabras = ["SABATINO", "BIGPINK", "TECLADO", "PINTURA"]
let palabra = undefined
let finDelJuego = false
let error = 0

//Figuras que hacen al ahorcado.
let valoresLinea = [
    //Poste o linea en vertical.
	{
		error: 1,
		moveToX: 50,
		moveToY: 340,
		lineToX: 50, 
		lineToY: 20
	},

	//Linea en horizontal pegada al poste.
	{
		error: 2,
		moveToX: 50,
		moveToY: 20,
		lineToX: 200, 
		lineToY: 20
	},
	
    //Linea en diagonal formando un triangulo con el poste y la horizontal.
	{
		error: 3,
		moveToX: 50,
		moveToY: 50,
		lineToX: 80, 
		lineToY: 20
	},
	
    //Cuerda que cuelga de la linea horizontal.
	{
		error: 4,
		moveToX: 200,
		moveToY: 20,
		lineToX: 200,
		lineToY: 70
	},
	
    //Cabeza del personaje.
	{
		error: 5,
		arcX: 200,
		arcY: 90,
		radio: 20,
		angulo: 0
	},
	
    //Tronco del personaje.
	{
		error: 6,
		moveToX: 200,
		moveToY: 110,
		lineToX: 200,
		lineToY: 180
	},
	
    //Brazo derecho del personaje.
	{
		error: 7,
		moveToX: 200,
		moveToY: 120,
		lineToX: 220,
		lineToY: 150
	},
	
    //Brazo izquierdo del personaje.
	{
		error: 8,
		moveToX: 200,
		moveToY: 120,
		lineToX: 180,
		lineToY: 150
	},
	
    //Pierna derecha del personaje.
	{
		error: 9,
		moveToX: 200,
		moveToY: 180,
		lineToX: 180,
		lineToY: 220
	},
	
    //Pierna izquierda del personaje.
	{
		error: 10,
		moveToX: 200,
		moveToY: 180,
		lineToX: 220,
		lineToY: 220
	}
]

window.addEventListener("load", elegirPalabra)

if(finDelJuego === false) {
    document.addEventListener("keyup", obtenerTecla, true)
}

/* 
* Dibuja una linea base en el canvas.
*/
function dibujarBaseCanvas() {
	
	pincel.beginPath()
	pincel.lineWidth = 3
	pincel.strokeStyle = "black"
	pincel.moveTo(0, 340)
	pincel.lineTo(280, 340)
	pincel.lineCap = "round"
	pincel.stroke()
}

/* 
* Genera un numero aleatorio para determinar la posicion de la palabra que se utilizara.
* Ejecuta la funcion generadora de TextArea proporcional a la longitud de la palabra.
* Ejecuta la funcion que dibuja la base del ahorcado.
*/
function elegirPalabra() {
    const posicion = Math.floor((Math.random() * ((listaPalabras.length - 1) + 1)))
    palabra = listaPalabras[posicion]
    dibujarBaseCanvas()
    generarTextArea()
}

/* 
* Crea un elemento de tipo TextArea con sus respectivas propiedades.
* Agrega el elemento al div 'Contenedor'.
*/
function generarTextArea() {
	let contador = 0
    const contenedor = document.getElementById('contenido')

	while(contador < palabra.length) {
        let textArea = document.createElement('textarea')
		textArea.textContent = ''
		textArea.name = 'input'
		textArea.id = 'inputChar'
		textArea.className = 'letra' + contador
		textArea.maxLength = 1
		textArea.readOnly = 'readonly'
		contenedor.appendChild(textArea)		
        ++contador
	}
}

/* 
* Esta funcion obtiene la tecla que fue precionada.
* Solo debe utilizar las teclas en mayusculas y de la A-Z
* No utiliza caracteres especiales, puntos, numeros, etc. Solo letras.
* Llama a una funcion para determinar la posicion de las letras en la palabra.
* Llama a una funcion para escribir en los textArea.
* Cuando se preciona una tecla que no coincide con letras de la palabra,
  el contador 'error' se incrementa en 1.
* Cada que se comete un error, se llama una funcion que completa la figura,
  del ahorcado.
* Cuando se alcanza el limite de errores, termina el juego y lanza un mensaje,
  de 'Game Over!!' y remueve el evento 'keyup'.
*/
function obtenerTecla(tecla) {
    const regEx = /[A-Z]\b/
    let posicion = undefined

    if(regEx.test(tecla.key) && tecla.key !== 'Enter') {
        if(palabra.includes(tecla.key)) {
            posicion = buscarLetras(palabra, tecla.key)
            escribirTextArea(tecla.key, posicion)
        } else {
            error += 1
            mostrarFiguras()
            if(error === 10) {
                error = 0
                finDelJuego = true
                console.log("Game over!!.")
                document.removeEventListener('keyup', obtenerTecla, true)
            }
        }
    }
    verificarTextArea(palabra)
}

/* 
* Cada que el usuario comete un error al tratar de adivinar la palabra,
  se completa la figura del ahorcado.
* Hay una excepcion al tratar de dibujar la cabeza del personaje y es al cometer,
  el error numero 5.
*/
function mostrarFiguras() {
	
	valoresLinea.forEach(element => {
		if(error === element.error && error !== 5) {
			pincel.beginPath()
			pincel.lineWidth = 3
			pincel.strokeStyle = "black"
			pincel.moveTo(element.moveToX, element.moveToY)
			pincel.lineTo(element.lineToX, element.lineToY)
			pincel.lineCap = "round"
			pincel.stroke()
		} else if(error === 5) {
			pincel.beginPath()
			pincel.lineWidth = 3
			pincel.strikeStyle = "black"
			pincel.arc(element.arcX, element.arcY, element.radio, element.angulo, 2*Math.PI)
			pincel.stroke()
		}
	})
}

/* 
* Determina la posicion de la letra introducida en la palabra.
* Si la letra se repite en la palabra, se obtiene mas de una posicion.
* La o las posiciones son guardadas en un arreglo que sera retornado.
*/
function buscarLetras(palabra, letra) {

    let posicion = []
    let posicionLetra = palabra.indexOf(letra);

    while ( posicionLetra !== -1 ) {
        posicion.push(palabra.indexOf(letra, posicionLetra))
        posicionLetra = palabra.indexOf(letra, posicionLetra + 1)
    }

    return posicion
}

/* 
* La letra que fue precionada, la agrega al textArea correspondiente.
*/
function escribirTextArea(letra, posicion) {
    if(posicion.length > 1) {
        for(let i = 0;i < posicion.length;i++) {
            const textArea = document.querySelector('.letra' + posicion[i])
            textArea.textContent = letra;
        }
    } else {
        let textArea = document.querySelector('.letra' + posicion[0])
        textArea.textContent = letra;
    }
}

/* TODO: Terminar el juego.
* Verifica que la palabra haya sido completada, de ser asi, debe terminar el juego.
*/
function verificarTextArea(palabra) {
    const contenedor = document.getElementById('contenido')
    let contador = 0

    contenedor.childNodes.forEach((element) => {
        if(element.nodeName !== '#text') {
            if(element.textContent !== '') {
                ++contador
            }
        }
    })
    //Terminar el juego
    if(palabra.length === contador) {
		finDelJuego = true
		console.log("Ganaste el juego!.")
        document.removeEventListener("keyup", obtenerTecla, true)
	}
}