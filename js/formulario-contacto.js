function validacionFormulario() {
  let correo = document.getElementById("txtEmail").value;
  let asunto = document.getElementById("txtAsunto").value;
  let mensaje = document.getElementById("txtMensaje").value;
  let sexo = document.getElementById("cboSexo").value;
  let edad = parseInt(document.getElementById("txtEdad").value);

  // Validación de longitud del asunto
  if (asunto.length < 3) {
    alert("El asunto debe tener un mínimo de 3 caracteres");
    return false;
  }

  // Validación de mayoría de edad
  if (edad < 18) {
    alert("Solo mayores de edad pueden enviar consultas");
    return false;
  }

  // Creación del objeto de contacto
  const contacto = {
    "id": Date.now(), // Corregido: lleva paréntesis para generar el número id único
    "correo": correo,
    "asunto": asunto,
    "edad": edad,
    "mensaje": mensaje,
    "sexo": sexo
  };

  // Obtener lista previa de LocalStorage o crear una vacía
  const listaContactos = JSON.parse(localStorage.getItem("contactos")) || [];

  alert(JSON.stringify(contacto));
  listaContactos.push(contacto);

  // Guardar en LocalStorage
  localStorage.setItem("contactos", JSON.stringify(listaContactos));
  return true;
}

function listar() {
  const listaContactos = JSON.parse(localStorage.getItem("contactos")) || [];
  
  let tabla = "<table border='1' style='background-color: #222; color: white; padding: 10px; border-collapse: collapse;'>";
  tabla += "<tr style='background-color: rgb(128, 44, 206);'> <th style='padding: 8px;'>Asunto</th> <th style='padding: 8px;'>ID Registro</th> </tr>";
  
  listaContactos.forEach(element => {
    let fila = `<tr> <td style='padding: 8px;'>${element.asunto}</td> <td style='padding: 8px;'>${element.id}</td> </tr>`;
    tabla += fila;
  });
  
  tabla += "</table>";
  document.getElementById("salida").innerHTML = tabla;
}