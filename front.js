let contadorSorteos = 0;
let temporizadorResultado = null; // Para controlar el temporizador de animación

// Función para obtener el valor de una cookie por su nombre
function realizarSorteo() {
    const inicio = parseInt(document.getElementById("inicio").value);
    const fin = parseInt(document.getElementById("fin").value);
    const resultadoDiv = document.getElementById("resultado");
    const resultadoNumDiv = document.getElementById("resultadoNum");
    const cargandoDiv = document.getElementById("cargando");
    const barraCarga = document.getElementById("barraCarga");
    const inputNumero = document.getElementById("numero");

    resultadoDiv.innerHTML = `¡El número ganador es:`;
    if (resultadoNumDiv.innerHTML) {
        resultadoNumDiv.innerHTML = "";
    }

    // Validar que el rango de inicio y fin sea correcto
    if (isNaN(inicio) || isNaN(fin) || inicio >= fin) {
        resultadoDiv.innerHTML = "Por favor, ingresa un rango válido.";
        return;
    }

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

    let intervaloAnimacion = setInterval(() => {
        const numeroAleatorio = Math.floor(Math.random() * (fin - inicio + 1)) + inicio;
        resultadoNumDiv.innerHTML = `<span style="font-size: 1.5em;">${numeroAleatorio}</span>`;
    }, 80);

    // Retrasar el resultado por el tiempo de espera (mayor que la carga de la barra)
    setTimeout(() => {
        clearInterval(intervaloAnimacion);

        // Generar el número aleatorio
        const numeroSorteado = Math.floor(Math.random() * (fin - inicio + 1)) + inicio;

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
        "TV 50 pulgadas",
        "Celular Samsung",
        "Bicicleta de montaña",
        "Aspiradora Robot",
        "Parlante Bluetooth",
        "TV 50 pulgadas",
        "Celular Samsung",
        "Bicicleta de montaña",
        "Aspiradora Robot",
        "Parlante Bluetooth"
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
