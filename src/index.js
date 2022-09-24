
//palabras de maximo 8 caracteres.
let listaPalabras = ["SABATINO", "BIGPINK", "TECLADO", "PINTURA"]
let palabra = undefined

window.addEventListener("load", elegirPalabra)


addEventListener("keyup", obtenerTecla)

/* 
* Crea un elemento de tipo TextArea con sus respectivas propiedades.
* Agrega el elemento al div 'Contenedor'.
*/
function generarTextArea(numero) {
    let textArea = document.createElement('textarea')
    const contenedor = document.getElementById('contenido')

    textArea.textContent = ''
    textArea.name = 'input'
    textArea.id = 'inputChar'
    textArea.className = 'letra' + numero
    textArea.maxLength = 1
    textArea.readOnly = 'readonly'
    contenedor.appendChild(textArea)
}

/* 
* Genera un numero aleatorio para determinar la posicion de la palabra que se utilizara.
* Ejecuta la funcion generadora de TextArea proporcional a la longitud de la palabra.
*/
function elegirPalabra() {
    const posicion = Math.floor((Math.random() * ((listaPalabras.length - 1) + 1)))
    palabra = listaPalabras[posicion]
    for(let numero = 0; numero < palabra.length;numero++) generarTextArea(numero)
}

/* 
* Esta funcion obtiene la tecla que fue precionada.
* Solo debe utilizar las teclas en mayusculas y de la A-Z
* No utiliza caracteres especiales, puntos, numeros, etc. Solo letras.
* Llama a una funcion para determinar la posicion de las letras en la palabra.
* Llama a una funcion para escribir en los textArea.
*/
function obtenerTecla(tecla) {
    const regEx = /[A-Z]/

    if(regEx.test(tecla.key) && tecla.key !== 'Enter') {
        if(palabra.includes(tecla.key)) {
            escribirTextArea(tecla.key, buscarLetras(palabra, tecla.key))
        }
    }
    verificarTextArea(palabra)
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

/* 
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
}