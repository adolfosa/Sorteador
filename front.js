let contadorSorteos = 0;
let temporizadorResultado = null; // Para controlar el temporizador de animación

// Función para obtener el valor de una cookie por su nombre
function realizarSorteo() {
    const inicio = parseInt(document.getElementById("inicio").value);
    const fin = parseInt(document.getElementById("fin").value);
    const resultadoDiv = document.getElementById("resultado");
    const cargandoDiv = document.getElementById("cargando");
    const barraCarga = document.getElementById("barraCarga");
    const inputNumero = document.getElementById("numero");

    // Si hay un resultado anterior, ocultarlo antes de hacer el nuevo sorteo
    if (resultadoDiv.innerHTML) {
        resultadoDiv.innerHTML = "";
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

    // Retrasar el resultado por el tiempo de espera (mayor que la carga de la barra)
    setTimeout(() => {
        // Generar el número aleatorio
        const numeroSorteado = Math.floor(Math.random() * (fin - inicio + 1)) + inicio;

        // Mostrar el número sorteado con animación
        cargandoDiv.style.display = "none"; // Ocultar "Procesando..."
        resultadoDiv.innerHTML = `¡El folio ganador es: <span class="animar">${numeroSorteado}</span>!`;

        // Reaplicar la animación (esto reinicia la animación del número)
        const numeroAnimado = resultadoDiv.querySelector("span");
        numeroAnimado.classList.remove("animar");
        void numeroAnimado.offsetWidth; // Forzar reflow para reiniciar la animación
        numeroAnimado.classList.add("animar");

        // No necesitamos detener la animación ahora, porque la animación se mantiene en el estado final después de 5s
        // Si aún quieres garantizar el tamaño máximo, puedes hacer:
        setTimeout(() => {
            const numeroFijo = resultadoDiv.querySelector("span"); // Obtener el span del número
            numeroFijo.style.fontSize = "3.5em"; // Establecer el tamaño máximo manualmente
        }, 5000); // 5 segundos después de la animación

        // Ocultar la barra de carga después del sorteo
        barraCarga.style.display = "none"; // Ocultar la barra de carga

        // Registrar el sorteo en la tabla
        contadorSorteos++;
        const tablaSorteos = document.getElementById("tablaSorteos");
        const nuevaFila = document.createElement("tr");
        nuevaFila.innerHTML = `<td>${contadorSorteos}</td><td>${numeroSorteado}</td>
        <td><input type="number" id="numero${contadorSorteos}" max="99" min="10" placeholder="Número">
        <input type="nombre" id="nombre${contadorSorteos}" max="99" min="10" placeholder="Ganador"></td>
        `;
        tablaSorteos.appendChild(nuevaFila);

        // Habilitar el campo de entrada de número después del primer sorteo
        if (contadorSorteos === 1) {
            inputNumero.disabled = false; // Habilitar el campo de número
        }

        // Actualizar el historial de sorteos en la cookie
        const historial = cargarHistorialDeCookie();
        historial.push({ numeroSorteado: numeroSorteado, contador: contadorSorteos });
        guardarEnCookie(historial);

    }, tiempoEspera * 1000); // El sorteo se retrasará durante el tiempo completo de espera
}

// Cargar historial desde la cookie al cargar la página
window.onload = function() {
    const historial = cargarHistorialDeCookie();
    const tablaSorteos = document.getElementById("tablaSorteos");

    if (historial.length === 0) {
        console.log("No se encontraron sorteos previos en las cookies.");
    } else {
        historial.forEach((sorteo) => {
            const nuevaFila = document.createElement("tr");
            nuevaFila.innerHTML = `<td>${sorteo.contador}</td>
            <td>${sorteo.numeroSorteado}</td>
            <td><input type="number" id="numero${sorteo.contador}" max="99" min="10" placeholder="Número"></td>`;
            
            tablaSorteos.appendChild(nuevaFila);
            contadorSorteos = sorteo.contador; // Mantener el contador actualizado
        });
    }
};
