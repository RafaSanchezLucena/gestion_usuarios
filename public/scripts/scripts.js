const inputDni = document.querySelector(".campo-dni");
const inputDniConsulta = document.querySelector(".campo-dni-consulta");
const inputNombre = document.querySelector(".campo-nombre");
const inputApellido1 = document.querySelector(".campo-apellido1");
const inputApellido2 = document.querySelector(".campo-apellido2");
const inputEmail = document.querySelector(".campo-email");
const inputPassword = document.querySelector(".campo-password");
const parrafo = document.querySelector(".parrafo");
const botonConsultar = document.querySelector("#consultar");
const botonMostrar = document.querySelector("#mostrar");
const botonInsertar = document.querySelector("#insertar");
const botonActualizar = document.querySelector("#actualizar");
const botonEliminar = document.querySelector("#eliminar");
const div1 = document.querySelector("#mensaje");
const tbody = document.querySelector("tbody");
const botonLimpiar1 = document.querySelector("#limpiar1");
const botonLimpiar2 = document.querySelector("#limpiar2");

// Clase principal para crear los objetos.
class Persona {
  constructor(dni, nombre, apellido1, apellido2, email, password) {
    this.dni = dni;
    this.nombre = nombre;
    this.apellido1 = apellido1;
    this.apellido2 = apellido2;
    this.email = email;
    this.password = password;
  }
};

// Muestra los datos que corresponden con el dni
const consultarDatos = async (dni) => {
  const url = "http://127.0.0.1:3000/user/" + dni;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const elemento = data.map(
      (element) => /*html*/ `<tr>
                              <td class="celda">${element.dni}</td>
                              <td class="celda">${element.nombre}</td>
                              <td class="celda">${element.apellido1}</td>
                              <td class="celda">${element.apellido2}</td>
                              <td class="celda">${element.email}</td>
                              <td class="celda">${element.password}</td>                  
                            </tr>`
    );
    return (tbody.innerHTML = elemento);
  } catch (error) {
    div1.innerHTML = //html 
      `<h3>La consulta no ha devuelto ningún resultado.</h3>`;
    tbody.innerHTML = "";
  }
};

// Muestra todos los datos de la BD
const mostrarDatos = async () => {
  const url = "http://127.0.0.1:3000/user";
  try {
    const response = await fetch(url);
    const data = await response.json();
    const elemento = data.map(
      (element) => /*html*/ `<tr>
                              <td class="celda">${element.dni}</td>
                              <td class="celda">${element.nombre}</td>
                              <td class="celda">${element.apellido1}</td>
                              <td class="celda">${element.apellido2}</td>
                              <td class="celda">${element.email}</td>
                              <td class="celda">${element.password}</td>
                             </tr>`
    );
    return (tbody.innerHTML = elemento.join(""));
  } catch (error) {
    div1.innerHTML = `${error}`;
  }
};

// Inserta un nuevo contacto
const insertarDatos = async (datos, dni) => {
  const url = "http://127.0.0.1:3000/user/" + dni;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: datos,
    });
    const data = await response.text();
    return (div1.innerHTML = /*html*/ `<h3>${data}</h3>`);
  } catch (error) {
    div1.innerHTML = /*html*/ `<h3>${error}</h3>`;
  }
};

// Actualiza un contacto
const actualizarDatos = async (datos, dni) => {
  const url = "http://127.0.0.1:3000/user/" + dni;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: datos,
    });
    const data = await response.text();
    return (div1.innerHTML = /*html*/ `<h3>${data}</h3>`);
  } catch (error) {
    div1.innerHTML = /*html*/ `<h3>${error}</h3>`;
  }
};

// Elimina un contacto
const eliminarDatos = async (dni) => {
  const url = "http://127.0.0.1:3000/user/" + dni;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.text();
    return (div1.innerHTML = /*html*/ `<h3>${data}</h3>`);
  } catch (error) {
    div1.innerHTML = /*html*/ `<h3>${error}</h3>`;
  }
};

// Funciones que asignan los datos recogidos del formulario a las variables correspondientes
// y a continuación instancian la clase Persona
const datosFormulario = (fn) => {
  objeto = new Persona(
    inputDni.value,
    inputNombre.value,
    inputApellido1.value,
    inputApellido2.value,
    inputEmail.value,
    inputPassword.value
  );
  if (
    // Mediante este condicional nos aseguramos que no hay un campo sin datos
    objeto.dni === "" ||
    objeto.nombre === "" ||
    objeto.apellido1 === "" ||
    objeto.apellido2 === "" ||
    objeto.email === "" ||
    objeto.password === ""
  ) {
    alert("Debe cumplimentar todos los campos");
  } else {
    // Convertimos a formato JSON y llamamos a la función correspondiente que se encargará
    // de realizar la operación en la bd
    let dataJson = JSON.stringify(objeto);
    fn(dataJson, inputDni.value);
  }
};

// Botones de los dos formularios
botonInsertar.addEventListener("click", () => {
  datosFormulario(insertarDatos);
});

botonActualizar.addEventListener("click", () => {
  datosFormulario(actualizarDatos);
});

botonConsultar.addEventListener("click", () => {
  if (inputDniConsulta.value === "") {
    alert("Debe cumplimentar este campo");
  } else {
    consultarDatos(inputDniConsulta.value);
  }
});

botonMostrar.addEventListener("click", () => {
  mostrarDatos();
});

botonEliminar.addEventListener("click", () => {
  if (inputDniConsulta.value === "") {
    alert("Debe cumplimentar este campo");
  } else {
    eliminarDatos(inputDniConsulta.value);
  }
});

botonLimpiar1.addEventListener("click", () => {
  div1.innerHTML = " ";
  tbody.innerHTML = " ";
});

botonLimpiar2.addEventListener("click", () => {
  div1.innerHTML = " ";
  tbody.innerHTML = " ";
});


