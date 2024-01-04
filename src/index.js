import ApiService from './Login.js';
import GetMateria from './GetMateria.js';
import ListaAlumnos from './MenuAdministrador.js';
import ModificarAlumno from './ModificarAlumno.js';
import Registro from './Registro.js';
import Inscipcion from './Inscipcion.js';
import AlumnoMateria from './AlumnoMateria.js';
import GetCarrera from './GetCarrera.js';
import ModificarRegistros from './ModificarRegistros.js';
import { ToastCreator, obtenerValorInput , cargarSweetAlert } from './Alerts.js';

if (!(window.location.href.includes("index.html") || window.location.href.includes("Registro-Alumno.html") || window.location.href.includes("RecuperarContrasenia.html"))){
  let token = sessionStorage.getItem('TokenLogin');
  console.log(token)
  if(token == null){
    window.location.href = "index.html"
  }
}

const apiService = new ApiService();
const enviarButton = document.getElementById('Btn-login');
const storedNotification = localStorage.getItem('notification');
const notifications = document.querySelector(".notifications");
const cardLoading = document.querySelector('.Card-Loading');
const cardLoadingmateria = document.querySelector('.Card-Loading-incripcion');

function capitalizarPrimeraLetra(cadena) {
  return cadena.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase()});
}

const notification = storedNotification ? JSON.parse(storedNotification) : {
  success: {
    inicioOk: false,
    inicioText: ""
  }
};
const updateNotification = (inicioOk, inicioText) => {
  notification.success.inicioOk = inicioOk;
  notification.success.inicioText = inicioText;
  localStorage.setItem('notification', JSON.stringify(notification));
};

function borrarTodasLasCookies() {
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var igualPos = cookie.indexOf("=");
      var nombre = igualPos > -1 ? cookie.substr(0, igualPos) : cookie;
  }
}


async function loadHTMLFromAPI() {
  await CrearMenuAdministrador();
  var container = document.getElementById("myList");
  container.addEventListener("click", function(event) {
      if (event.target.classList.contains("acordion")) {
          event.target.classList.toggle("active");
          var panel = event.target.nextElementSibling;
          if (panel.style.display === "block") {
              panel.style.display = "none";
          } else {
              panel.style.display = "block";
          }
          var icon = event.target.querySelector("i");
          var currentClass = icon.className;
          if (currentClass.includes("bx-show")) {
              icon.className = currentClass.replace("bx-show", "bx-hide");
          } else {
              icon.className = currentClass.replace("bx-hide", "bx-show");
          }
      }
  });
}

async function enviarSeleccionados(Materias) {
  let token = sessionStorage.getItem('TokenLogin');
  let arraystrng = ""
  let pasadas = 0
  const progressBar = document.querySelector('.progress-bar');
  const porcentajeTexto = document.querySelector('.progress-bar');
  const totalMaterias = Materias.length;
  for (let i = 0; i < totalMaterias; i++) {
    if(Materias[i].regularidad != "ninguno"){
      const objeto = Materias[i];
      const radioValuesInstance = new Inscipcion();
      const resultado = await radioValuesInstance.enviarDatos(objeto, token);
      if (resultado === 'Se agrego la materia con éxito') {
        arraystrng +=`<li class="Exitosa"><i class='bx bx-check'></i><span>${Materias[i].materia.toUpperCase()}</span></li>`
      } else {
        arraystrng +=`<li class="Erronea"><i class='bx bx-x'></i><span>${Materias[i].materia.toUpperCase()}</span></li>`
      }
      document.getElementById("list-aprobadas-rechazadas").innerHTML = arraystrng
    }
    pasadas++
    const progreso = `${pasadas}/${totalMaterias}`;
      const porcentaje = (pasadas / totalMaterias) * 100;
      progressBar.style.width = porcentaje + '%';
      porcentajeTexto.innerText = Math.round(porcentaje) + '%';
  }
  let botones = `<div class="Btn-centrar">
  <button id="btn-cartel-aceptar" class="btn btn-light">ACEPTAR</button>
  </div>`
  document.getElementById("list-aprobadas-rechazadas").innerHTML = arraystrng + botones
}

async function loadicon(){
  var iconosEdicion = document.querySelectorAll('.bx-edit');
  console.log("Cantidad de iconos encontrados:", iconosEdicion.length);
  iconosEdicion.forEach(function (icono) {
    icono.addEventListener('click', function () {
      var idAlumno = icono.getAttribute('data-id');
      localStorage.setItem('idAlumno', idAlumno);
      console.log("ID de alumno almacenado:", idAlumno);
      try {
        window.location.href = "Perfil-AdministradorMaster/ModificarInfoAlumno.html";
      } catch (error) {
        console.error(error);
      }
    });
  });
}

export async function CrearMenuAlumno()
{
  console.log("esta entrando a crearmenualumno")
  let idAlumno = localStorage.getItem('idAlumno');
  console.log(idAlumno)
  document.getElementById("nombrecompleto-perfil").innerText = "Cargando..." 
  const Alumno = await ModificarAlumno.filtrarPorId(idAlumno);
  sessionStorage.setItem('NombreAlumno', Alumno.nombreCompleto);
  document.getElementById("nombrecompleto-perfil").innerText = capitalizarPrimeraLetra(Alumno.nombreCompleto); 
  var elemento = document.getElementById("verificado");
  if (Alumno.verificacion) {
    elemento.classList.add("Verificado");
  } else {
    elemento.classList.add("NoVerificado");
  }
  document.getElementById("Nombre").innerText = capitalizarPrimeraLetra(Alumno.nombreCompleto);
  document.getElementById("Eimail").innerText = capitalizarPrimeraLetra(Alumno.email);
  document.getElementById("Carrera").innerText = capitalizarPrimeraLetra(Alumno.carrera);
  document.getElementById("Año").innerText = capitalizarPrimeraLetra(Alumno.anio);
  var primero = `<div class="accordion"><div class="accordion-header border-accordion">
  <span class="arrow-container ">
    <i class='bx bx-chevron-right arrow acordion-perfil-arrow'></i>
  </span> <h4 class="h4">Materias</h4></div>
  <div class="accordion-content container-opcion ">`
  var fin = `</div></div>`
  var examenes = `<div class="accordion">
  <div class="accordion-header examen-posit border-accordion">
    <span class="arrow-container">
      <i class='bx bx-chevron-right arrow acordion-perfil-arrow'></i>
    </span>
     <h4 class="h4">Examenes</h4>
  </div>
  <div class="accordion-content examen-stilo">`
   const tieneTiempoPermanente = Alumno.listaMateria.some(objeto => objeto.hasOwnProperty('tiempo') && objeto.tiempo === 'permanente');
   const tieneTiempotemporal = Alumno.listaMateria.some(objeto => objeto.hasOwnProperty('tiempo') && objeto.tiempo === 'temporal');
   if (!tieneTiempoPermanente) {
    var boton = `<div class="alert alert-primary" role="alert">
    No estas inscripto a ninguna materia , <a id="Btn-incripcion-materias" href="#" class="alert-link">INSCRIBIRME</a></div>`
    document.getElementById("Lista-Materias").innerHTML = boton  
   }else{
      for(var i = 0 ; i < Alumno.listaMateria.length ; i++)
      {
        if(Alumno.listaMateria[i].tiempo === "permanente")
        {
        primero += `<div class=" materia-form"><span class="Regularidad2-w800">${Alumno.listaMateria[i].materia.toUpperCase()}</span><span id="Regularidad-w800" class="Regularidad-w800">${Alumno.listaMateria[i].regularidad.toUpperCase()}</span></div>`
        } 
        else
        {
          console.log(Alumno.listaMateria[i].id)
        examenes += `<div class="row cont-exam"><span class="col-3">${Alumno.listaMateria[i].materia.toUpperCase()}</span><i id="rotate-icon" data-id-valor="${Alumno.listaMateria[i].id}" class='rotate-icon col-9 bx bxs-brightness'></i></div>`
        }
      }
      if (!tieneTiempotemporal)
      {
        document.getElementById("Lista-Examenes").innerHTML = ""
      }else
      {
        document.getElementById("Lista-Examenes").innerHTML = examenes + fin
      }
      document.getElementById("Lista-Materias").innerHTML = primero + fin
    }
 }


 async function selectcarrera(){
  var nuevalista = new GetCarrera()
  var ListaCarreras = `<option selected>CARRERA</option>`;
  document.getElementById("Select-Carrera").innerHTML = ListaCarreras;
  console.log(document.getElementById("Select-Carrera").innerHTML = ListaCarreras)
  const listacarreras = await nuevalista.BuscarLista()
  for(let i = 0 ; i < listacarreras.length ; i++){
    ListaCarreras += `<option value="${listacarreras[i].nombreCarrera}">${capitalizarPrimeraLetra(listacarreras[i].nombreCarrera)}</option>`
  }
  document.getElementById("Select-Carrera").innerHTML = ListaCarreras;
 }
 
 async function CrearRegistro() {
  try {
    let token = sessionStorage.getItem('TokenLogin');
    let idAlumno = localStorage.getItem('idAlumno');
    const Alumno = await ModificarAlumno.filtrarPorId(idAlumno);
    const lista = new GetMateria(Alumno.carrera);
    const materia = await lista.BuscarLista(token);
    let primero = ""
    let segundo = ""
    let tercero = ""
    let checkMateriasprimero = "";
    let checkMateriassegundo = "";
    let checkMateriastercero = "";
    for (let i = 0; i < materia.length; i++) {
      if(materia[i].anio == "primero" && (Alumno.anio == "primero" || Alumno.anio == "segundo" || Alumno.anio == "tercero")){
        primero =`<h2>Primero</h2>`
        checkMateriasprimero += `<div class="container-materia ">
        <div class="materia"><span>${materia[i].nombreMateria.toUpperCase()}</span></div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="${materia[i].nombreMateria}" id="${materia[i].nombreMateria}1" value="regular">
          <label class="form-check-label" for="${materia[i].nombreMateria}1">Regular</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="${materia[i].nombreMateria}" id="${materia[i].nombreMateria}2" value="libre">
          <label class="form-check-label" for="${materia[i].nombreMateria}2">Libre</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="${materia[i].nombreMateria}" id="${materia[i].nombreMateria}3" value="ninguno">
          <label class="form-check-label" for="${materia[i].nombreMateria}3">Ninguno</label>
        </div>
      </div>`;
      
      }

      if(materia[i].anio == "segundo" && (Alumno.anio == "segundo" || Alumno.anio == "tercero" )){
        console.log("pasa por segundo")
        segundo =`<h2>Segundo</h2>`
        checkMateriassegundo += `<div class="container-materia ">
        <div class="materia"><span>${materia[i].nombreMateria.toUpperCase()}</span></div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="${materia[i].nombreMateria}" id="${materia[i].nombreMateria}1" value="regular">
          <label class="form-check-label" for="${materia[i].nombreMateria}1">Regular</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="${materia[i].nombreMateria}" id="${materia[i].nombreMateria}2" value="libre">
          <label class="form-check-label" for="${materia[i].nombreMateria}2">Libre</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="${materia[i].nombreMateria}" id="${materia[i].nombreMateria}3" value="ninguno">
          <label class="form-check-label" for="${materia[i].nombreMateria}3">Ninguno</label>
        </div>
      </div>`;
      }

      if(materia[i].anio == "tercero" && Alumno.anio == "tercero" ){
        tercero =`<h2>tercero</h2>`
        checkMateriastercero += `<div class="container-materia ">
        <div class="materia"><span>${materia[i].nombreMateria.toUpperCase()}</span></div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="${materia[i].nombreMateria}" id="${materia[i].nombreMateria}1" value="regular">
          <label class="form-check-label" for="${materia[i].nombreMateria}1">Regular</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="${materia[i].nombreMateria}" id="${materia[i].nombreMateria}2" value="libre">
          <label class="form-check-label" for="${materia[i].nombreMateria}2">Libre</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="${materia[i].nombreMateria}" id="${materia[i].nombreMateria}3" value="ninguno">
          <label class="form-check-label" for="${materia[i].nombreMateria}3">Ninguno</label>
        </div>
      </div>`;
      }
    }
    return primero + checkMateriasprimero + segundo + checkMateriassegundo + tercero + checkMateriastercero
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function CrearMenuAdministrador() {
  var dato = ""
  let token = sessionStorage.getItem('TokenLogin');
const lista = new ListaAlumnos();
(async () => {
    const paginas = await listaAlumnos.obtenerPaginas(token);
    const alumno = await listaAlumnos.obtenerAlumnos(token, paginas);
    console.log(alumno);
})();
lista.obtenerPaginas(token)
  .then(async (paginas) => {
    for (let i = 1; i <= paginas; i++) {
      await lista.obtenerAlumnosPorPagina(token, i)
        .then((Alumno) => {
          console.log(Alumno)
          var datosPersonales = ""
          var ListaMaterias = ""
          var Lpermanente = ""
          var Ltemporal = ""
          var iniciolistamaterias = `</div>
          <div class="table-container">
          <table>
          <h1>Materias</h1>
          <thead>
          <tr>
          <th>Materia</th>
          <th>Año</th>
          <th>Regularidad</th>
          </tr>
          </thead>
          <tbody>`
          var inicioListaexamenes =   `<div class="table-container">
            <h1>Examenes</h1>
            <table>
            <thead>
            <tr>
            <th>Materia</th>
            <th>Año</th>
            <th>Regularidad</th>
            </tr>
            </thead>
            <tbody>`
      for (let i = 0; i < Alumno.length; i++) {
      datosPersonales += `
      <li> 
      <button class="acordion"><span>${Alumno[i].nombreCompleto}</span><i class='bx bx-show'></i></button>
      <div class="panel">
      <div class="table-container">
      <table>
      <h1>Informacion Del Alumno</h1>
      <thead>
      <tr>
      <th>Informacion</th>
      <th>Dato Del Alumno</th>
      <th></th>
      </tr>
      </thead>
      <tbody>
      <tr>
      <td>Verificado</td>
      <td><i class='bx bx-badge-check ${(Alumno[i].verificacion) ? " Verificado" : " NoVerificado"}'></i></td>
      <td><i class='bx bx-edit' data-id="${Alumno[i].numeroDocumento}"></i></td>
      </tr>
      <tr>
      <td>DNI</td>
      <td>${Alumno[i].numeroDocumento}</td>
      <td></td>
      </tr>
      <tr>
      <td>Mail</td>
      <td>${Alumno[i].email}</td>
      <td></td>
      </tr>
      <tr>
      <td>Carrera</td>
      <td>${Alumno[i].carrera}</td>
      <td></td>
      </tr>
      <tr>
      <td>Telefono</td>
      <td>${Alumno[i].telefono}</td>
      <td>
      </td>
      </tr>
      </tbody>
      </table>`
      if (Alumno[i].listaMateria === undefined) {
      }
      else
      {
      for (let x = 0; x < Alumno[i].listaMateria.length; x++)
      {
      if(Alumno[i].listaMateria[x].tiempo === "permanente")
      {
      Lpermanente +=`<tr>
       <td>${Alumno[i].listaMateria[x].materia}</td> 
       <td>Primero</td>
       <td>libre</td>
       </tr>`
      }
      else
      {
      Ltemporal += `<tr>
       <td>${Alumno[i].listaMateria[x].materia}</td> 
       <td>Primero</td>
       <td>libre</td>
       </tr>`
      }
      }        
      }
      Lpermanente += `</tbody>
      </table>
      </div>`
      Ltemporal += `</tbody>
      </table>
      </div> `
      ListaMaterias = iniciolistamaterias + Lpermanente + inicioListaexamenes + Ltemporal + `</div></div></li>`;
      Lpermanente = "" ;
      Ltemporal = "" ;
      dato += datosPersonales + ListaMaterias
      datosPersonales = "";
      }
      document.getElementById("myList").innerHTML = dato
      loadicon()
        })
        .catch((error) => console.error(`Error al obtener la página ${i}:`, error));
    }
  })
  .catch((error) => console.error('Error al obtener el número de páginas:', error));
}

export function formularioRegistro()
{
if(document.getElementById("Input-contraseña").value === document.getElementById("Input-recontraseña").value )
{
  const objetoJSON = {
    "numeroDocumento": parseInt(document.getElementById("Input-documento").value),
    "nombreCompleto":   document.getElementById("Input-Nombre").value,
    "direccion": document.getElementById("Input-domicilio").value,
    "carrera": document.getElementById("Select-Carrera").value,
    "anio": document.getElementById("select-Año").value,
    "contrasenia": document.getElementById("Input-contraseña").value,
    "telefono": document.getElementById("Input-telefono").value,
    "email": document.getElementById("Input-email").value,
    "localidad": document.getElementById("Input-localidad").value
  };
  return objetoJSON
}else
{
  const toastCreator = new ToastCreator(notifications);
  toastCreator.createToast('error' , "Las Contraseñas No Son Iguales" );
}

}
if (window.location.href.includes("Perfil-AdministradorMaster")){
  document.getElementById("id-perfil").innerText = "ADMIN-MASTER";
}


document.addEventListener('DOMContentLoaded', async function () {
  if (window.location.href.includes("Perfil-AdministradorMaster.html") || window.location.href.includes("index-AdministradorMaster.html") ) {
    await loadHTMLFromAPI()
    if(notification.success.inicioOk)
    {
      const toastCreator = new ToastCreator(notifications);
      toastCreator.createToast('success' , notification.success.inicioText );
      updateNotification(false, "");
    };
  } // temina el if
  
  if (window.location.href.includes("index.html")){
    document.getElementById('registro').addEventListener('click', function() {
      window.location.href = 'Registro-Alumno.html';
    });
  }
  
  if (window.location.href.includes("Registro-Alumno.html")){
    selectcarrera()
  }

  let nombreCompleto = sessionStorage.getItem('NombreAlumno');
  var elemento = document.getElementById("nombrecompleto-perfil");
  if (elemento != null ) {
     if(nombreCompleto != null){
      elemento.innerText = capitalizarPrimeraLetra(nombreCompleto); 
     }
     else
     {
      elemento.innerText = "ALUMNO"
     }
    
  }else { 
    console.log("El elemento con ID 'nombrecompleto-perfil' no fue encontrado.");
  }

  if (window.location.href.includes("Incripcion-Examenes.html")){
    const texthtml = await CrearRegistro()
    document.getElementById("container-materia").innerHTML = texthtml ;
    const btninscripcion = document.getElementById('btn-inscripcion');
    btninscripcion.addEventListener('click', async function() {
    
    const radioValuesInstance = new Inscipcion();
    const ancla = document.getElementById('mi-ancla');
    ancla.scrollIntoView({ behavior: 'smooth' });
    cardLoadingmateria.classList.remove('invisible');
    cardLoadingmateria.classList.add('visible');
    const selectedRadioValues = radioValuesInstance.getSelectedValues(localStorage.getItem('idAlumno') , "temporal");
    let verificadocheck = true
    for(let i = 0; i < selectedRadioValues.length ; i++ ){
      if(selectedRadioValues[i].regularidad == null){
        verificadocheck = false
      }
    }
    if(verificadocheck){
      enviarSeleccionados(selectedRadioValues).then((resultado) => {
        const btnAceptar = document.getElementById('btn-cartel-aceptar');
                  btnAceptar.addEventListener('click', () => {
                  btnAceptar.click();
                  window.location.href = '/Perfil-Alumno.html';
                 });
      })
      .catch((error) => {
        console.error(error);
      });
    }
    else
    {
      cardLoadingmateria.classList.remove('visible');
      cardLoadingmateria.classList.add('invisible');
      const toastCreator = new ToastCreator(notifications);
      toastCreator.createToast('error' , 'Seleccione todas las Materias' );
    }
  });
  } //termina el if

  if (window.location.href.includes("Incripcion-Materia.html")){
    const texthtml = await CrearRegistro()
    document.getElementById("container-materia").innerHTML = texthtml ;
    const btninscripcion = document.getElementById('btn-inscripcion');
    btninscripcion.addEventListener('click', async function() {
    const radioValuesInstance = new Inscipcion();
    const ancla = document.getElementById('mi-ancla');
    ancla.scrollIntoView({ behavior: 'smooth' });
    cardLoadingmateria.classList.remove('invisible');
    cardLoadingmateria.classList.add('visible');
    const selectedRadioValues = radioValuesInstance.getSelectedValues(localStorage.getItem('idAlumno') , "permanente");
    let verificadocheck = true
    for(let i = 0; i < selectedRadioValues.length ; i++ ){
      if(selectedRadioValues[i].regularidad == null){
        verificadocheck = false
      }
    }
    if(verificadocheck){
      enviarSeleccionados(selectedRadioValues).then((resultado) => {
        const btnAceptar = document.getElementById('btn-cartel-aceptar');
                  btnAceptar.addEventListener('click', () => {
                  btnAceptar.click();
                  window.location.href = '/Perfil-Alumno.html';
                 });
      })
      .catch((error) => {
        console.error(error);
      });
    }
    else
    {
      cardLoadingmateria.classList.remove('visible');
      cardLoadingmateria.classList.add('invisible');
      const toastCreator = new ToastCreator(notifications);
      toastCreator.createToast('error' , 'Seleccione todas las Materias' );
    }

  });
  } //termina el if

  if (window.location.href.includes("Registro-Alumno.html")) {
    const btnCrear = document.getElementById('Btn-Crear');
    btnCrear.addEventListener('click', async function() {
      const objetoJson = formularioRegistro()
      var veri = await Registro.Registrar(objetoJson);
      if (veri == true) {
        cargarSweetAlert().then(() => {
          Swal.fire({
            title: '¡Registrado con Éxito!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            window.location.href = "index.html";
          });
        }).catch((error) => {
          console.error('Error al cargar SweetAlert2', error);
        });
      }
    });
  } // temina el if

  if (window.location.href.includes("/BorrarExamenes.html")){
    const botonBorrar = document.getElementById('BorrarRegistros');
    botonBorrar.addEventListener('click', accionBorrar);
   async function accionBorrar() {
     let token = sessionStorage.getItem('TokenLogin');
     var NuevoModificar = new ModificarRegistros()
     var verificar = await NuevoModificar.EliminarRegistros(token)
     if(verificar){
       const toastCreator = new ToastCreator(notifications);
       toastCreator.createToast('success', "Se Eliminaron Los Registros Con Éxito");
     }else
     {
       const toastCreator = new ToastCreator(notifications);
       toastCreator.createToast('error', "Algo Salio Mal");
     }
    }
}

  if (window.location.href.includes("Modificar.html")) {
    function handleClickModificar(buttonId) {
      var elemento = document.getElementById(buttonId);
      elemento.addEventListener('click', function () {
        const selectRegularidad = document.getElementById('selectRegularidad').value;
        let token = sessionStorage.getItem('TokenLogin');
        let AlumnoMateiraString = sessionStorage.getItem('ObjetoAlumnoMateria');
        let AlumnoMateira = JSON.parse(AlumnoMateiraString);
        AlumnoMateira.regularidad = selectRegularidad;
        const Classalumnomateria = new AlumnoMateria();
        const toastCreator = new ToastCreator(notifications);
       console.log(AlumnoMateira)
        Classalumnomateria.modificarAlumnoMateria(AlumnoMateira, token)
          .then(alert => {
            if (alert) {
              toastCreator.createToast('success', "Se Modificó Con Éxito");
            } else {
              toastCreator.createToast('error', "No se pudo modificar");
            }
          })
          .catch(error => {
            console.error('Error al realizar la solicitud:', error);
            toastCreator.createToast('error', "Error al realizar la solicitud");
          });
      });
    }
  
    function handleClickEliminar(buttonId) {
      var elemento = document.getElementById(buttonId);
      elemento.addEventListener('click', function () {
        let token = sessionStorage.getItem('TokenLogin');
        let AlumnoMateiraString = sessionStorage.getItem('ObjetoAlumnoMateria');
        let AlumnoMateira = JSON.parse(AlumnoMateiraString);
        const Classalumnomateria = new AlumnoMateria();
        const toastCreator = new ToastCreator(notifications);
        cargarSweetAlert().then(() => {
          Swal.fire({
            title: '¿Estás seguro que quieres eliminar el examen?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              if (alert) {
                Classalumnomateria.eliminarAlumnoMateria(AlumnoMateira, token)
                cargarSweetAlert().then(() => {
                  Swal.fire({
                    title: '¡Se elimino con Éxito!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                  }).then(() => {
                    window.location.href = "/Perfil-Alumno.html";
                  });
                })
              } else {
                toastCreator.createToast('error', "No se pudo eliminar");
              }
            }
          });
        });
      });
    }
  
    handleClickEliminar("Btn-EliminarAlumnoMateria");
    handleClickModificar("Btn-ModificarAlumnoMateria");
  }

  if (window.location.href.includes("Perfil-AdministradorMaster/ModificarInfoAlumno.html") ||
      window.location.href.includes("Perfil-Alumno/Modificar-Informacion.html") ||
      window.location.href.includes("Perfil-Alumno/Modificar-Contrase") ) {
      let idAlumno = localStorage.getItem('idAlumno');
      if(window.location.href.includes("Perfil-AdministradorMaster/ModificarInfoAlumno.html") ||
      window.location.href.includes("Perfil-Alumno/Modificar-Informacion.html")){
        document.getElementById("Label-nombre").innerText = "Cargando...";
        document.getElementById("Label-direccion").innerText = "Cargando...";
        document.getElementById("Label-localidad").innerText = "Cargando...";
        document.getElementById("Label-telefono").innerText = "Cargando...";
        document.getElementById("Label-email").innerText = "Cargando...";
      }
      const Alumno = await ModificarAlumno.filtrarPorId(idAlumno);
      setTimeout(async function (){
        if(window.location.href.includes("Perfil-Alumno/Modificar-Contrase"))
        {
          handleClickpss("input-password" ,"Button-Password");       
        }else
        {
          document.getElementById("Label-nombre").innerText = capitalizarPrimeraLetra(Alumno.nombreCompleto);
          document.getElementById("Label-direccion").innerText = capitalizarPrimeraLetra(Alumno.direccion);
          document.getElementById("Label-localidad").innerText = capitalizarPrimeraLetra(Alumno.localidad);
          document.getElementById("Label-telefono").innerText = capitalizarPrimeraLetra(Alumno.telefono);
          document.getElementById("Label-email").innerText = capitalizarPrimeraLetra(Alumno.email);
          handleClick("input-nombre" , "button-nombre");
          handleClick("input-direccion" , "button-direccion");
          handleClick("input-localidad" , "button-localidad");
          handleClick("input-telefono" ,"button-telefono");
          handleClick("input-email" ,"button-email");
        }
      }, 5000);
    
        function handleClick(inputId ,buttonId  ) {
          const button = document.getElementById(buttonId);
          ModificarAlumno.agregarEventoClick(inputId , button)
        }
        function handleClickpss(inputId ,buttonId  ) {
          if(document.getElementById("input-password").value == document.getElementById("input-repassword").value ){
            const button = document.getElementById(buttonId);
            ModificarAlumno.agregarEventoClick(inputId , button)
          }
          else
          {
            const toastCreator = new ToastCreator(notifications);
            toastCreator.createToast('error', "las contraseñas no coinciden");
          }
        }
      }
      if (window.location.href.includes("Perfil-Alumno.html")) {
      console.log("pasa por perfil alumno")
        try {
          document.getElementById('Nombre').innerText = "Cargando...";
          document.getElementById('Eimail').innerText = "Cargando...";
          document.getElementById('Carrera').innerText = "Cargando...";
          document.getElementById('Año').innerText = "Cargando...";
          await CrearMenuAlumno();     
          setTimeout(async function() {
            const barracarga = document.querySelector('.Lista-alumnos');
            const materias = document.querySelector('.Lista-Materias');        
            var elemento = document.querySelectorAll('.rotate-icon');
                 if(elemento){
                  Array.from(elemento).forEach(function(elemento) {
                    elemento.addEventListener('click', function() {
                      var idValor = this.getAttribute('data-id-valor');
                      sessionStorage.setItem('IdValorAlumnoMateria', idValor);
                      handleClickAlumnoMateria();
                    });
                });
                 }
           async function handleClickAlumnoMateria() {
              let idAlumnoMateria = sessionStorage.getItem('IdValorAlumnoMateria');
              let idAlumno = localStorage.getItem('idAlumno');
              const Alumno = await ModificarAlumno.filtrarPorId(idAlumno)
                for (let i = 0 ; i < Alumno.listaMateria.length ; i++){
                  if(Alumno.listaMateria[i].id == idAlumnoMateria ){
                    const Dato = {
                      "id": Alumno.listaMateria[i].id,
                      "numeroDocumento": Alumno.numeroDocumento,
                      "materia": Alumno.listaMateria[i].materia,
                      "regularidad": Alumno.listaMateria[i].regularidad,
                      "tiempo": "temporal"
                    };
                    sessionStorage.setItem('ObjetoAlumnoMateria', JSON.stringify(Dato));
                    window.location.href = 'Perfil-Alumno/OpcionesDeExamenes/Modificar.html';
                        }
                      }
                           
                 }
            if (barracarga) {
              barracarga.classList.add('invisible');
              materias.classList.remove('invisible');
              materias.classList.add('visible');
            } else {
              console.error('La lista de alumnos no fue encontrada.');
            }
          }, 2000);
          
          const botonInscribirse = document.getElementById('Btn-incripcion-materias');
          if (botonInscribirse) {
            botonInscribirse.addEventListener('click', function() {
              window.location.href = 'Perfil-Alumno/Incripcion-Materia.html';
            });
          } else {
            console.log('El botón no está presente en el documento.');
          }
        } catch (error) {
          console.error('Error al cargar el menú del alumno:', error);
        }
      }

  if (window.location.href.includes("Perfil-AdministradorMaster.html")||(window.location.href.includes("Perfil-Alumno.html")))
  {
    const progressBar = document.querySelector('.progress-bar');
    const porcentajeTexto = document.querySelector('.progress-bar');
    let width = 0;
    const intervalo = 100; 
    let duracion = 0; 
    if(window.location.href.includes("Perfil-Alumno.html")){
            duracion = 2000;
    }else
    {
            duracion= 7000;     
    }
    const incremento = (100 / (duracion / intervalo)); 
    
    const intervalID = setInterval(() => {
      if (width >= 100) {
        clearInterval(intervalID); 
      } else {
        width += incremento;
        progressBar.style.width = width + '%';
        porcentajeTexto.textContent = Math.round(width) + '%';
      }
      },intervalo);
  } 
  
  //va en todos
  setTimeout(function () {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
      const accordion = header.parentElement;
      const content = accordion.querySelector('.accordion-content');
      content.style.display = 'none'; 
      header.addEventListener('click', () => {
        accordion.classList.toggle('active');
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
      });

      header.addEventListener('click', function() {
        var arrowContainer = this.querySelector('.arrow-container');
        arrowContainer.classList.toggle('rotated');
      });
    });
  }, 2000);
});

if (enviarButton !== null) {
  console.log("SALE EL BOTON LOGIN")
  enviarButton.addEventListener("click", async () => {
    console.log("hace el click")
    cardLoading.classList.remove('invisible');
    cardLoading.classList.add('visible');
    const usuario = document.getElementById("Login").value; 
    const contraseña = document.getElementById("Contraseña").value;
    const responseData = await apiService.enviarDatos(usuario, contraseña);
    if(responseData.value.ok)
    {
      if(responseData.value.ok === "administrdor")
      {
        if(responseData.value.iDadministrador == 1)
        {
          sessionStorage.setItem('TokenLogin', responseData.value.token);
          updateNotification(true, responseData.value.msg);
          window.location.href = "Perfil-AdministradorMaster.html"
        }
        else 
        {
          sessionStorage.setItem('TokenLogin', responseData.value.token);
          window.location.href = "Perfil-Administrador.html"
        }
      }
      if(responseData.value.ok === "alumno")
      {
          sessionStorage.setItem('TokenLogin', responseData.value.token);
          localStorage.setItem('idAlumno' , responseData.value.numeroDocumento);
          window.location.href = "Perfil-Alumno.html"
      }
    }
    else
    {
     const toastCreator = new ToastCreator(notifications);
     console.log(responseData.value.acceso)
      if (responseData.value.acceso){
        toastCreator.createToast('error' , responseData.value.msg );
        cardLoading.classList.remove('visible')
        cardLoading.classList.add('invisible');
      }
      else
      {
        if ('usuario' in responseData.errors){
            for(let i = 0 ; i < responseData.errors.usuario.length ; i++){
              toastCreator.createToast('error' , responseData.errors.usuario[i]);
            }
          }else
          {
            for(let i = 0 ; i <  responseData.errors.contrasenia.length ; i++){
              toastCreator.createToast('error' , responseData.errors.contrasenia[i]);
            }
          }
        cardLoading.classList.remove('visible')
        cardLoading.classList.add('invisible');
      }
    }
  });
}