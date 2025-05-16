let contadorSorteos = 0;
let temporizadorResultado = null; // Para controlar el temporizador de animación
let yacomenzo = false;
let numerosSortedos = [];

// Función para obtener el valor de una cookie por su nombre
function realizarSorteo() {
    if (yacomenzo) return;

    
    const inicio = parseInt(document.getElementById("inicio").value);
    const fin = parseInt(document.getElementById("fin").value);
    const resultadoDiv = document.getElementById("resultado");
    const resultadoNumDiv = document.getElementById("resultadoNum");
    const cargandoDiv = document.getElementById("cargando");
    const barraCarga = document.getElementById("barraCarga");
    const inputNumero = document.getElementById("numero");
    
    const totalPosibles = fin - inicio + 1;
    if (numerosSortedos.length >= totalPosibles){
        resultadoDiv.innerHTML = "Ya han salido todos los números posibles. Reinicia el sorteo.";
        return;
    }
    resultadoDiv.innerHTML = `¡El número ganador es:`;
    if (resultadoNumDiv.innerHTML) {
        resultadoNumDiv.innerHTML = "";
    }
    
    // Validar que el rango de inicio y fin sea correcto
    if (isNaN(inicio) || isNaN(fin) || inicio >= fin) {
        resultadoDiv.innerHTML = "Por favor, ingresa un rango válido.";
        return;
    }
    
    yacomenzo = true;
    // Calcular el rango y determinar el tiempo de espera proporcional
    const rango = fin - inicio;
    const tiempoEspera = Math.min(10, Math.max(3, rango / 10)); // Tiempo proporcional en segundos (máximo 10, mínimo 3)

    // Hacer que la barra de carga se llene más lentamente que el tiempo de espera
    const tiempoCargaBarra = tiempoEspera + 10; // Incrementar el tiempo de carga para que tarde más

    // Reiniciar y ocultar la barra de carga al iniciar un nuevo sorteo
    barraCarga.style.width = "0%"; // Reiniciar barra de carga
    barraCarga.style.display = "block"; // Mostrar la barra de carga
    cargandoDiv.style.display = "block"; // Mostrar el mensaje "Procesando..."

    // Establecer la transición de la barra de carga para que dure más tiempo que el de espera
    barraCarga.style.transition = `width ${tiempoCargaBarra}s ease`;

    // Establecer el valor de la barra de carga (rellenándola)
    setTimeout(() => {
        barraCarga.style.width = "100%"; // La barra se llena en el tiempo ajustado
    }, 10); // Esperar un pequeño intervalo para forzar la transición

    let audioBeep = document.getElementById("sonidoNumero");

    let intervaloAnimacion = setInterval(() => {
        const numeroAleatorio = Math.floor(Math.random() * (fin - inicio + 1)) + inicio;
        resultadoNumDiv.innerHTML = `<span style="font-size: 1.5em;">${numeroAleatorio}</span>`;

        if (!audioBeep.paused)
            audioBeep.currentTime = 0;

        audioBeep.play();
    }, 100);

    // Retrasar el resultado por el tiempo de espera (mayor que la carga de la barra)
    setTimeout(() => {
        clearInterval(intervaloAnimacion);

        yacomenzo = false;
        let audioRevelacion = document.getElementById("sonidoRevelacion");
        if (!audioRevelacion.paused)
            audioRevelacion.currentTime = 0;

        audioRevelacion.play();

        let numeroUnico = false;
        let numeroSorteado;

        while (!numeroUnico) {
            numeroSorteado = Math.floor(Math.random() * (fin - inicio + 1)) + inicio;

            if (!numerosSortedos.includes(numeroSorteado)) {
                numeroUnico = true;
                numerosSortedos.push(numeroSorteado);
            }
        }
        
        // Mostrar el número sorteado con animación
        cargandoDiv.style.display = "none"; // Ocultar "Procesando..."
        resultadoNumDiv.innerHTML = `<span style="font-size: 3.5em;">${numeroSorteado}!</span>`;

        // Ocultar la barra de carga después del sorteo
        barraCarga.style.display = "none"; // Ocultar la barra de carga

        // Habilitar el campo de entrada de número después del primer sorteo
        if (contadorSorteos === 1) {
            inputNumero.disabled = false; // Habilitar el campo de número
        }

    }, tiempoEspera * 1000); // El sorteo se retrasará durante el tiempo completo de espera
}

// Cargar historial desde la cookie al cargar la página
window.onload = function() {
    const tablaSorteos = document.getElementById("tablaSorteos");

    const Premios = [
        "Cafetera",
        "Pulsera de Plata",
        "Horno eléctrico",
        "Soporte de TV",
        "Pinzas para asado con led",
        "2 Candelabros",
        "Minipimer Somela",
        "6 Vinos Diablo Rojo",
        "Chivas Regal 12 años (750cc)",
        "Caja de Cerveza Corona (pack de 24)",
        "Bateria cocina 5 piezas",
        "6 Posillos de postre",
        "Sabana plaza y media",
        "3 Vasos Wiskeros",
        "Set para jugos",
        "Sandwichera",
        "Polera algodón negra diseño",
        "Polera algodón naranja diseño",
        "Polera de hilo manga larga diseño",
        "Par de Botines N°37",
        "Bolso deportivo Xtrem",
        "Gift Card $30.000",
        "Juego de Vasos",
        "¡Guitarra Electroacústica!"
    ];

    Premios.forEach((premio, index) => {
        const nuevaFila = document.createElement("tr");
        nuevaFila.innerHTML = 
            `<td style="font-size: 1.5em;">${index + 1}</td> 
             <td style="font-size: 1.5em;">${premio}</td>
             <td> <input type="number" placeholder="-"> </td>
             <td> <input type="string" placeholder="-"> </td>`;
        tablaSorteos.appendChild(nuevaFila);
    });    
    contadorSorteos = Premios.length;
};
