function validacionFormulario(e) {
    if (e) e.preventDefault();

    let correo = document.getElementById("txtEmail").value;
    let asunto = document.getElementById("txtAsunto").value;
    let mensaje = document.getElementById("txtMensaje").value;
    let sexo = document.getElementById("cboSexo").value;
    let edad = parseInt(document.getElementById("txtEdad").value);

    // Validación de longitud del asunto
    if (asunto.length < 3) {
        mostrarAlertaFormulario("El asunto debe tener un mínimo de 3 caracteres.");
        return false;
    }

    // Validación de mayoría de edad
    if (edad < 18) {
        mostrarAlertaFormulario("Solo mayores de edad pueden enviar consultas.");
        return false;
    }

    // Creación del objeto de contacto
    const contacto = {
        "id": Date.now(),
        "correo": correo,
        "asunto": asunto,
        "edad": edad,
        "mensaje": mensaje,
        "sexo": sexo
    };

    // Obtener lista previa de LocalStorage o crear una vacía
    const listaContactos = JSON.parse(localStorage.getItem("contactos")) || [];

    listaContactos.push(contacto);

    // Guardar en LocalStorage
    localStorage.setItem("contactos", JSON.stringify(listaContactos));

    // Mostrar mensaje de éxito bonito
    mostrarAlertaFormulario("¡Mensaje de contacto enviado con éxito!", true);

    // Limpiar formulario tras guardar
    document.querySelector('.form-contacto').reset();

    return false;
}

function listar() {
    const listaContactos = JSON.parse(localStorage.getItem("contactos")) || [];
    
    if (listaContactos.length === 0) {
        mostrarAlertaFormulario("No hay mensajes de contacto registrados en la lista.");
        document.getElementById("salida").innerHTML = "";
        return;
    }

    let tabla = "<table border='1' style='background-color: #222; color: white; padding: 10px; border-collapse: collapse; width: 100%; text-align: left;'>";
    tabla += "<tr style='background-color: rgb(128, 44, 206);'> <th style='padding: 8px;'>Asunto</th> <th style='padding: 8px;'>Correo</th> <th style='padding: 8px;'>ID Registro</th> </tr>";
    
    listaContactos.forEach(element => {
        let fila = `<tr> 
            <td style='padding: 8px;'>${element.asunto}</td> 
            <td style='padding: 8px;'>${element.correo}</td> 
            <td style='padding: 8px;'>${element.id}</td> 
        </tr>`;
        tabla += fila;
    });
    
    tabla += "</table>";
    document.getElementById("salida").innerHTML = tabla;
}