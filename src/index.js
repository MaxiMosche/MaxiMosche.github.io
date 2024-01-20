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
import GetCurso from './GetCurso.js';
import Validar from './Validar.js';
import LibroExel from './LibroExel.js';
import PostMateria from './PostMateria.js';
import DeleteMateria from './DeleteMateria.js';
import PutCarrera from './PutCarrera.js';
import EstadoInscripcion from './EstadoInscripciones.js';
import CrearAdministrador from './CrearAdministrador.js';
import PutAdministrador from './PutAdministrador.js';
import GetAdministrador from './GetAdministrador.js';
import PostCarrera from './PostCarrera.js';
import DeleteCarrera from './DeleteCarrera.js';

if (!(window.location.href.includes("index.html") || window.location.href.includes("Registro-Alumno.html") || window.location.href.includes("RecuperarContrasenia.html"))){
  let token = sessionStorage.getItem('TokenLogin');
  console.log(token)
  if(token == null){
    window.location.href = "index.html"
  }
}
const listaAlumnos = [];
const arrayDni ={};
let contadorCarteles = 0;
const apiService = new ApiService();
const enviarButton = document.getElementById('Btn-login');
const storedNotification = localStorage.getItem('notification');
const notifications = document.querySelector(".notifications");
const cardLoading = document.querySelector('.Card-Loading');
const cardLoadingmateria = document.querySelector('.Card-Loading-incripcion');

function capitalizarPrimeraLetra(cadena) {
  return cadena.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase()});
}

function formatearDocumento(numero) {
  numero = numero.toString();
  let documentoFormateado = numero.substring(0, 2) + '.' + numero.substring(2, 5) + '.' + numero.substring(5);
  return documentoFormateado;
}

function formatearFecha(fecha) {
  var dia = fecha.getDate();
  var mes = fecha.getMonth() + 1; 
  var año = fecha.getFullYear() % 100;
  dia = (dia < 10) ? '0' + dia : dia;
  mes = (mes < 10) ? '0' + mes : mes;

  return dia + '/' + mes + '/' + año;
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
      console.log(resultado)
      if (resultado === 'Se agrego la materia con éxito') {
        arraystrng +=`<li class="Exitosa"><i class='bx bx-check'></i><span>${Materias[i].materia.toUpperCase()}</span><br><span>Se agrego la materia con éxito</span></li>`
      } else {
        arraystrng +=`<li class="Erronea"><i class='bx bx-x'></i><span>${Materias[i].materia.toUpperCase()}</span><br><span>${resultado}</span></li>`
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

async function CargarCartelHerramienta(Cartel) {
  const nuevoCartel = document.createElement('li');
  nuevoCartel.classList.add('Carteles-loading');
  nuevoCartel.id = `cartel-${contadorCarteles}`;
  nuevoCartel.innerHTML = `
    <h4>${Cartel}</h4>
    <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" style="width: 1%" data-progress="0"></div>
    <div class="Div-Cant"><span></span></div>
  `;
  document.getElementById('listaLoading').appendChild(nuevoCartel);
  contadorCarteles++;
}




async function forCartelHerramienta(ParaElFor, NombreCartel, atributosConContenido) {
  let pasadas = 0;
  let nombre = document.getElementById('Nombre-Atributo').value
  if(nombre == ""){
    nombre = "DEFAULT"
  }
  document.getElementById('Nombre-Atributo').value= "";
  if (arrayDni[ParaElFor].length !== 0) {
    document.getElementById('listaLoading').classList.remove('invisible');
    const ul = document.getElementById('listaLoading');
    const lis = ul.getElementsByTagName('li');

    await CargarCartelHerramienta(NombreCartel);
    const nuevoCartelId = `cartel-${contadorCarteles - 1}`;
    const progressBar = document.getElementById(nuevoCartelId).querySelector('.progress-bar');
    const text = document.getElementById(nuevoCartelId).querySelector('.Div-Cant');
    let token = sessionStorage.getItem('TokenLogin');
    const ObjetoArmado = [];

    for (const dni of arrayDni[ParaElFor]) {
      const Alumno = await ModificarAlumno.filtrarPorId(dni);

      if (NombreCartel === `Verificando Alumnos`) {
        const verificacion = await Validar.verificarAlumno(parseInt(dni), token);
      }

      if (NombreCartel === `Asignar Alumnos`) {
        const alumnoExistente = await ModificarAlumno.filtrarPorId(dni);
        
        if (alumnoExistente) {
          let selectElement = document.getElementById('Select-Curso1').value.toLowerCase();
          
          if (selectElement !== "curso") {
            alumnoExistente.curso = selectElement;
            await ModificarAlumno.enviarDatos(alumnoExistente, token);

          }
        } else {
          console.error("El Alumno No Existe");
        }
      }

      if (NombreCartel === `Descargar Exel`) {
        const miObjeto = {};

        for (const atributo of atributosConContenido) {
          if (atributo === "nombreCompleto") {
            miObjeto.NombreCompleto = Alumno.nombreCompleto;
          }
          if (atributo === "numeroDocumento") {
            miObjeto.numeroDocumento = formatearDocumento(Alumno.numeroDocumento);
          }
          if (atributo === "carrera") {
            miObjeto.carrera = Alumno.carrera;
          }
          if (atributo === "curso") {
            miObjeto.curso = Alumno.curso;
          }
          if (atributo === "anio") {
            miObjeto.año = Alumno.anio;
          }
        }
        ObjetoArmado.push(miObjeto);
      }

      pasadas++;
      const progreso = `${pasadas}/${arrayDni[ParaElFor].length}`;
      const porcentaje = (pasadas / arrayDni[ParaElFor].length) * 100;
      progressBar.style.width = porcentaje + '%';
      text.innerText = progreso;
    }
    if (NombreCartel === `Asignar Alumnos`){
      await CrearHerramientasAdministrador()
    }
       
    if (NombreCartel === `Descargar Exel`){
        const NuevoLibro = new LibroExel()
        NuevoLibro.generarYDescargarExcel(ObjetoArmado , atributosConContenido , nombre)
    }
    document.getElementById(nuevoCartelId).classList.add('invisible');
  }
}


async function TablaCursosAlumnos(){
 const Nuevalista = new GetCarrera()
 const ListaCarrera = await Nuevalista.BuscarLista()
 let inicio = ` <thead>
 <tr>
  <th >Carrera</th>
  <th >Curso</th>
  <th >Alumnos</th>
  </tr>
  </thead>
  <tbody>`
  console.log (ListaCarrera)
  let fin = `</tbody></table>`
  
 for (var carrera of ListaCarrera){
    inicio += `<tr>
    <td>${capitalizarPrimeraLetra(carrera.nombreCarrera)}</td>
    <td>${carrera.ncursos}</td>
    <td>${carrera.nalumnos}</td>
    </tr>`
 }

 document.getElementById('tabla-carrara-control').innerHTML = inicio + fin
}


async function loadicon(){
  var iconosEdicion = document.querySelectorAll('.bx-edit');
  console.log("Cantidad de iconos encontrados:", iconosEdicion.length);
  iconosEdicion.forEach(function (icono) {
    icono.addEventListener('click', function () {
      var idAlumno = icono.getAttribute('data-id');
      localStorage.setItem('idAlumno', idAlumno);
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
  document.getElementById("Año").innerText = capitalizarPrimeraLetra(Alumno.anio) + "  " + capitalizarPrimeraLetra(Alumno.curso);
  document.getElementById("FC").innerText =  formatearFecha(new Date(Alumno.fechaRegistro));
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

 async function selectCurso(){
  var nuevalista = new GetCurso()
  var ListaCarreras = `<option selected>CURSO</option>`;
  document.getElementById("Select-Curso").innerHTML = ListaCarreras;
  console.log(document.getElementById("Select-Curso"))
  const listacarreras = await nuevalista.BuscarLista()
  for(let i = 0 ; i < listacarreras.length ; i++){
    console.log(listacarreras[i].letraEscala)
    ListaCarreras += `<option value="${listacarreras[i].letraEscala}">${capitalizarPrimeraLetra(listacarreras[i].letraEscala)}</option>`
  }
  document.getElementById("Select-Curso").innerHTML = ListaCarreras;
  document.getElementById("Select-Curso1").innerHTML = ListaCarreras;
 }

 async function selectcarrera(){
  var nuevalista = new GetCarrera()
  var ListaCarreras = `<option selected>CARRERA</option>`;
  document.getElementById("Select-Carrera").innerHTML = ListaCarreras;
  const listacarreras = await nuevalista.BuscarLista()
  for(let i = 0 ; i < listacarreras.length ; i++){
    ListaCarreras += `<option value="${listacarreras[i].nombreCarrera}">${capitalizarPrimeraLetra(listacarreras[i].nombreCarrera)}</option>`
  }
  document.getElementById("Select-Carrera").innerHTML = ListaCarreras;
 }

 async function selectcarreraConId(){
  var nuevalista = new GetCarrera()
  var ListaCarreras = `<option selected>CARRERA</option>`;
  document.getElementById("Select-Carrera").innerHTML = ListaCarreras;
  const listacarreras = await nuevalista.BuscarLista()
  for(let i = 0 ; i < listacarreras.length ; i++){
    ListaCarreras += `<option value="${listacarreras[i].iDcarrera}">${capitalizarPrimeraLetra(listacarreras[i].nombreCarrera)}</option>`
  }
  document.getElementById("Select-Carrera").innerHTML = ListaCarreras;
 }

 async function selectMateria(materia){
  let token = sessionStorage.getItem('TokenLogin');
  var nuevalista = new GetMateria(materia)
  var ListaCarreras = `<option selected>CARGANDO...</option>`;
  document.getElementById("Select-Mateira").innerHTML = ListaCarreras;
  const listacarreras = await nuevalista.BuscarLista(token);
  ListaCarreras = `<option value="a-1" selected>MATERIAS</option>`;
  for(let i = 0 ; i < listacarreras.length ; i++){
    ListaCarreras += `<option value="${listacarreras[i].iDmateria}">${listacarreras[i].nombreMateria.toUpperCase()}</option>`
  }
  document.getElementById("Select-Mateira").innerHTML = ListaCarreras;
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

async function ObtenerArregloHerramienta() {
  const elementos = document.querySelectorAll('li.Elemento');
  const dniArray = [];
  
  elementos.forEach((elemento) => {
    const checkbox = elemento.querySelector('input[type="checkbox"]');
    
    if (
      window.getComputedStyle(elemento).display !== 'none' &&
      checkbox.checked
    ) {
      const dni = elemento.getAttribute('data-dni');
      dniArray.push(dni);
    }
  });
  
  return dniArray;
}

async function CrearHerramientasAdministrador(){
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
          var inicio = `<li class="list-group-item">
          <input class="form-check-input me-1" type="checkbox" id="selectAll">
          <label for="selectAll">Seleccionar Todos</label>
        </li>`;
          for(let i = 0 ; i < Alumno.length ; i++){ 
           dato += `<li class="Elemento ElementoEstilo" data-id="${Alumno[i].nombreCompleto}" data-dni="${Alumno[i].numeroDocumento}" data-c="${Alumno[i].carrera}" data-i="${Alumno[i].anio}" data-cu="${Alumno[i].curso}">
          <input class="form-check-input me-1" type="checkbox" id="firstCheckbox">
          <label class="form-check-label" for="firstCheckbox" >${formatearDocumento(Alumno[i].numeroDocumento)}&nbsp&nbsp</label>
          <label class="form-check-label Label-Invisible" for="firstCheckbox" >-&nbsp&nbsp${Alumno[i].nombreCompleto.toUpperCase()}</label>
        </li>`
         }
         document.getElementById("myList").innerHTML = inicio + dato;
         const selectAllCheckbox = document.getElementById('selectAll');
         console.log(selectAllCheckbox)
         const checkboxes = document.querySelectorAll('.form-check-input');
       
         selectAllCheckbox.addEventListener('change', function() {
           checkboxes.forEach(checkbox => {
             checkbox.checked = selectAllCheckbox.checked;
           });
         });
        })
        .catch((error) => console.error(`Error al obtener la página ${i}:`, error));
    }
  })
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
      <li class="Elemento ElementoStilo2" data-id="${Alumno[i].nombreCompleto}" data-dni="${Alumno[i].numeroDocumento}" data-c="${Alumno[i].carrera}" data-i="${Alumno[i].anio}" data-cu="${Alumno[i].curso}"> 
      <button class="acordion"><span >${capitalizarPrimeraLetra(Alumno[i].nombreCompleto)}</span><i class='bx bx-show'></i></button>
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
      <td>${formatearDocumento(Alumno[i].numeroDocumento)}</td>
      <td></td>
      </tr>
      <tr>
      <td>Mail</td>
      <td>${capitalizarPrimeraLetra(Alumno[i].email)}</td>
      <td></td>
      </tr>
      <tr>
      <td>Carrera</td>
      <td>${capitalizarPrimeraLetra(Alumno[i].carrera)}</td>
      <td></td>
      </tr>
      <tr>
      <td>Año</td>
      <td>${capitalizarPrimeraLetra(Alumno[i].anio)}</td>
      <td></td>
      </tr>
      <tr>
      <td>Curso</td>
      <td>${capitalizarPrimeraLetra(Alumno[i].curso)}</td>
      <td></td>
      </tr>
      <tr>
      <td>Telefono</td>
      <td>${capitalizarPrimeraLetra(Alumno[i].telefono)}</td>
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
       <td>${Alumno[i].listaMateria[x].materia.toUpperCase()}</td> 
       <td>Primero</td>
       <td>libre</td>
       </tr>`
      }
      else
      {
      Ltemporal += `<tr>
       <td>${Alumno[i].listaMateria[x].materia.toUpperCase()}</td> 
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
    selectcarrera()
    selectCurso()
    const filters = {
      buscador: "",
      año: "",
      carrera: "",
      curso: ""
    };
    document.addEventListener("keyup", e => {
      if (e.target.matches("#buscador")) {
        if (e.key === "Escape") {
          e.target.value = "";
          filters.buscador = "";
        } else {
          filters.buscador = e.target.value.toLowerCase();
        }
        filterElements();
      }
    });
    
    document.addEventListener("change", e => {
      if (e.target.matches("#año")) {
        filters.año = e.target.value.toLowerCase();
      } else if (e.target.matches("#Select-Carrera")) {
        filters.carrera = e.target.value.toLowerCase();
      } else if (e.target.matches("#Select-Curso")) {
        filters.curso = e.target.value.toLowerCase();
      }
      filterElements();
    });
    
    function filterElements() {
      document.querySelectorAll(".Elemento").forEach(Elemento => {
        const id = Elemento.dataset.id.toLowerCase();
        const dni = Elemento.dataset.dni.toLowerCase();
        const año = Elemento.dataset.i.toLowerCase();
        const carrera = Elemento.dataset.c.toLowerCase();
        const curso = Elemento.dataset.cu.toLowerCase();
    
        if(filters.curso === "curso"){
          filters.curso = ""
        }
        if (filters.carrera === "carrera"){
          filters.carrera = ""
        }
        if (filters.año === "año"){
          filters.año = ""
        }
        const cumpleBuscador = filters.buscador === "" || id.includes(filters.buscador) || dni.includes(filters.buscador);
        const cumpleAño = filters.año === "" || año.includes(filters.año);
        const cumpleCarrera = filters.carrera === "" || carrera.includes(filters.carrera);
        const cumpleCurso = filters.curso === "" || curso.includes(filters.curso);
    
        if (cumpleBuscador && cumpleAño && cumpleCarrera && cumpleCurso) {
          Elemento.classList.remove("invisible");
        } else {
          Elemento.classList.add("invisible");
        }
      });
    }
    if(notification.success.inicioOk)
    {
      const toastCreator = new ToastCreator(notifications);
      toastCreator.createToast('success' , notification.success.inicioText );
      updateNotification(false, "");
    };
  } // temina el if
  if (window.location.href.includes("Herramientas.html")){
    document.getElementById('section-atributos').classList.add('invisible');
  await CrearHerramientasAdministrador()
  await selectcarrera()
  await selectCurso()
   const filters = {
     buscador: "",
     año: "",
     carrera: "",
     curso: ""
   };
   const visible = document.getElementById('Btn-DescargarExel');;
   visible.addEventListener('click', async () => {
    document.getElementById('section-atributos').classList.remove('invisible');
   });

   const cancelar = document.getElementById('Btn-Cancelar');;
   cancelar.addEventListener('click', async () => {
    document.getElementById('section-atributos').classList.add('invisible');
   });
   
   const boton = document.getElementById('Btn-verificar');
   let contadorArrays = 1;
   boton.addEventListener('click', async () => {
     var ParaElFor = contadorArrays;
     arrayDni[contadorArrays] = await ObtenerArregloHerramienta();
     contadorArrays++;
     await forCartelHerramienta(ParaElFor , `Verificando Alumnos`);
   });
   const boton2 = document.getElementById('Btn-agregar' , []);
   boton2.addEventListener('click', async () => {
     var ParaElFor = contadorArrays;
     arrayDni[contadorArrays] = await ObtenerArregloHerramienta();
     contadorArrays++;
     await forCartelHerramienta(ParaElFor , `Asignar Alumnos` , []);
   });
   const boton3 = document.getElementById('Btn-Guardar');
   boton3.addEventListener('click', async () => {
   const checkboxes = document.querySelectorAll('.check-atribute');
   const valoresCheckboxes = {};
   checkboxes.forEach(checkbox => { 
     const id = checkbox.id;
     const estaSeleccionado = checkbox.checked; 
     valoresCheckboxes[id] = estaSeleccionado ? document.querySelector(`label[for="${id}"]`).innerText : "";
   });
   const atributosConContenido = [];
   for (const campo in valoresCheckboxes) {
      if (valoresCheckboxes[campo] !== "") {
         atributosConContenido.push(campo);
  }
   }
    let todosVacios = 0;
    for (const campo in valoresCheckboxes) {
        if (valoresCheckboxes[campo] !== "") {    
          todosVacios ++;
        }
    }
    console.log(todosVacios)
    if (todosVacios > 0){
    console.log(todosVacios)
     var ParaElFor = contadorArrays;
     arrayDni[contadorArrays] = await ObtenerArregloHerramienta();
     contadorArrays++;
     document.getElementById('section-atributos').classList.add('invisible');
     await forCartelHerramienta(ParaElFor , `Descargar Exel` , atributosConContenido);
    }else
    {
      const toastCreator = new ToastCreator(notifications);
      toastCreator.createToast('error' , 'Al menos un atributo debe estar seleccionado' );
    }
   });
   

  
   document.addEventListener("keyup", e => {
     if (e.target.matches("#buscador")) {
       if (e.key === "Escape") {
         e.target.value = "";
         filters.buscador = "";
       } else {
        console.log(e.target.value.toLowerCase())
         filters.buscador = e.target.value.toLowerCase();
       }
       filterElements();
     }
   });
   
   document.addEventListener("change", e => {
     if (e.target.matches("#año")) {
       filters.año = e.target.value.toLowerCase();
     } else if (e.target.matches("#Select-Carrera")) {
       filters.carrera = e.target.value.toLowerCase();
     } else if (e.target.matches("#Select-Curso")) {
       filters.curso = e.target.value.toLowerCase();
     }
     filterElements();
   });
   
   function filterElements() {
     document.querySelectorAll(".Elemento").forEach(Elemento => {
       const id = Elemento.dataset.id.toLowerCase();
       const dni = Elemento.dataset.dni.toLowerCase();
       const año = Elemento.dataset.i.toLowerCase();
       const carrera = Elemento.dataset.c.toLowerCase();
       const curso = Elemento.dataset.cu.toLowerCase();
   
       if(filters.curso === "curso"){
         filters.curso = ""
       }
       if (filters.carrera === "carrera"){
         filters.carrera = ""
       }
       if (filters.año === "año"){
         filters.año = ""
       }
       const cumpleBuscador = filters.buscador === "" || id.includes(filters.buscador) || dni.includes(filters.buscador);
       const cumpleAño = filters.año === "" || año.includes(filters.año);
       const cumpleCarrera = filters.carrera === "" || carrera.includes(filters.carrera);
       const cumpleCurso = filters.curso === "" || curso.includes(filters.curso);
   
       if (cumpleBuscador && cumpleAño && cumpleCarrera && cumpleCurso) {
         Elemento.classList.remove("invisible");
       } else {
         Elemento.classList.add("invisible");
       }
     });
   }
  }
  
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
                  if (window.location.href.includes("Perfil-Alumno/Incripcion-Materia.html")){
                    window.location.href = '/Perfil-Alumno.html';
                  }
                  else
                  {
                    if (window.location.href.includes("/Perfil-AdministradorMaster/ModificarInfoAlumno/Incripcion-Materia.html")){
                      window.location.href =  '/Perfil-AdministradorMaster.html'
                    }
                    else
                    {
                      window.location.href =  '/Perfil-Administrador.html'
                    }
                    
                  }
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

  
  if (window.location.href.includes("Perfil-AdministradorMaster/Modificar-Informacion.html")|| window.location.href.includes("Perfil-Administrador/Modificar-Informacion.html")){
    var elemento = document.getElementById("Modificar-administrador");
      elemento.addEventListener('click', async function () {
        let iDadministrador = sessionStorage.getItem('iDadministrador');
        console.log(iDadministrador)
        const Usuario = document.getElementById('Usuario-Administrador').value;
        if(Usuario != ""){
          let token = sessionStorage.getItem('TokenLogin');
          const BuscarAdministrdor = new GetAdministrador()
          let administrador = await BuscarAdministrdor.EviarDatos(iDadministrador ,token)
          administrador.usuario = Usuario
          const ModificarAdministrador = new PutAdministrador();
          const nota = await ModificarAdministrador.EnviarDato(administrador , token)
          if(nota == "Se modifico con éxito"){
            const toastCreator = new ToastCreator(notifications);
            toastCreator.createToast('success' , nota );
          }
          else
          {
            const toastCreator = new ToastCreator(notifications);
            toastCreator.createToast('error' , nota );
          }
        }
        else
        {
          ///ERROR
        }
      });
  }

  if (window.location.href.includes("Perfil-AdministradorMaster/Modificar-Contrase")|| window.location.href.includes("Perfil-Administrador/Modificar-Contrase")){
    var elemento = document.getElementById("Cambiar-pass");
      elemento.addEventListener('click', async function () {
        let iDadministrador = sessionStorage.getItem('iDadministrador');
        const pass = document.getElementById('pass-admin').value;
        const Repass = document.getElementById('re-pass-admin').value;
        if(pass != "" || pass == Repass){
          let token = sessionStorage.getItem('TokenLogin');
          const BuscarAdministrdor = new GetAdministrador()
          let administrador = await BuscarAdministrdor.EviarDatos(iDadministrador ,token)
          administrador.contrasenia = pass
          const ModificarAdministrador = new PutAdministrador();
          const nota = await ModificarAdministrador.EnviarDato(administrador , token)
          if(nota == "Se modifico con éxito"){
            const toastCreator = new ToastCreator(notifications);
            toastCreator.createToast('success' , nota );
          }
          else
          {
            const toastCreator = new ToastCreator(notifications);
            toastCreator.createToast('error' , nota );
          }
        }
        else
        {
          if(pass == Repass){
            const toastCreator = new ToastCreator(notifications);
            toastCreator.createToast('error' , 'Las contraseñas no son iguales' );
          }
          else
          {
            const toastCreator = new ToastCreator(notifications);
            toastCreator.createToast('error' , 'El campo Contraseña es obligatorio' );
          }
        }
      });
  }
  if (window.location.href.includes("Perfil-AdministradorMaster/CrearCuenta.html")){
    var elemento = document.getElementById("CrearAdministrador");
      elemento.addEventListener('click', async function () {
        let token = sessionStorage.getItem('TokenLogin');
        const Usuario = document.getElementById('usuario').value;
        const pass = document.getElementById('pass').value;
        const Repass = document.getElementById('repass').value;
        if(Usuario != "" && pass != "" && pass == pass){
          const Administrador = {
            iDadministrador: 0,
            usuario: Usuario,
            contrasenia: pass
          }
          const crearadmin = new CrearAdministrador();
          const nota = await crearadmin.EnviarDatos(Administrador , token );
          if(nota == "Se creo la cuenta con éxito"){
            const toastCreator = new ToastCreator(notifications);
            toastCreator.createToast('success' , nota);
            document.getElementById('usuario').value = "";
            document.getElementById('pass').value= "";
            document.getElementById('repass').value= "";
          }
          else
          {
            const toastCreator = new ToastCreator(notifications);
            toastCreator.createToast('error' , nota );
          }
        }
        else
        {
          if(Usuario == "" && pass == ""){
            if(Usuario == ""){
              const toastCreator = new ToastCreator(notifications);
              toastCreator.createToast('error' , 'Usuario es un campo obligatorio' );
            }
            else
            {
              const toastCreator = new ToastCreator(notifications);
              toastCreator.createToast('error' , 'Contraseña es un campo obligatorio' );
            }
          }
          else
          {
            const toastCreator = new ToastCreator(notifications);
            toastCreator.createToast('error' , 'Las contraseñas no son iguales' );
          }
        }
      })
  }

  if (window.location.href.includes("/Agregar-Carrera.html")){
    let token = sessionStorage.getItem('TokenLogin');
    var elemento = document.getElementById("Agregar-Carrera");
      elemento.addEventListener('click', async function () {
         const NombreCarrera = document.getElementById("Nombre-Carrera").value;
         if(NombreCarrera != ""){
          const Carrera = {
            iDcarrera: 0,
            NombreCarrera: NombreCarrera,
            nalumnos: 0,
            ncursos: 0
          }
           const NuevaCarrera = new PostCarrera();
           const nota = await NuevaCarrera.enviarDato(Carrera , token )
           if(nota == "Se agrego con éxito"){
            const toastCreator = new ToastCreator(notifications);
            toastCreator.createToast('success' , nota);
            document.getElementById("Nombre-Carrera").value = "";
           }
           else
           {
            const toastCreator = new ToastCreator(notifications);
            toastCreator.createToast('error' , nota);
           }
         }
         else
         {
          const toastCreator = new ToastCreator(notifications);
          toastCreator.createToast('error' , "NombreCarrera es requerido");
         }
        

      });
  }
  /////
  if (window.location.href.includes("/Perfil-AdministradorMaster/Eliminar-Carrera.html")){
    await selectcarreraConId()
    var elemento = document.getElementById("Eliminar-Carrera");
    elemento.addEventListener('click', async function () {
      const selectCarrera = document.getElementById('Select-Carrera');
      let token = sessionStorage.getItem('TokenLogin');
      const EliminarCarrera = new DeleteCarrera()
      const selectedValue = selectCarrera.value;
      const selectedText = selectCarrera.options[selectCarrera.selectedIndex].text;
      if(selectedText.toLowerCase() != "carrera"){
        const Carrera = {
          iDcarrera: selectedValue,
          nombreCarrera:  selectedText.toLowerCase(),
          nalumnos: 0,
          ncursos: 0
        }
        const nota = await EliminarCarrera.EnviarDato(Carrera , token )
        if(nota == "Se elimino con éxito"){
          const toastCreator = new ToastCreator(notifications);
          toastCreator.createToast('success' , nota);
        }
        else
        {
          const toastCreator = new ToastCreator(notifications);
          toastCreator.createToast('error' , nota);
        }
      }
      else
      {
        const toastCreator = new ToastCreator(notifications);
        toastCreator.createToast('error' , 'Seleccione una carrera');
      }

    })
  }

  if (window.location.href.includes("/PanelControl.html")){
    selectcarreraConId()
    TablaCursosAlumnos()
    let token = sessionStorage.getItem('TokenLogin');
    const estadoIncripcion = new EstadoInscripcion()
    const estadoCheck = await estadoIncripcion.obtenerEstadoInscripcion(token)
    if(estadoCheck){
      document.getElementById('Activar-Inscripciones').checked = true;
    }else{
      document.getElementById('Activar-Inscripciones').checked = false;
    }


    const ActualizarEstado = document.getElementById('Actualizar-Estado');
    ActualizarEstado.addEventListener('click', async () => {
      const check = document.getElementById('Activar-Inscripciones').checked
      const verificador = await estadoIncripcion.enviarEstadoInscripcion(token , check)
      if(verificador){
        const toastCreator = new ToastCreator(notifications);
        toastCreator.createToast('success' , 'Se cambió el estado de inscripción con éxito' );
      }else
      {
        const toastCreator = new ToastCreator(notifications);
        toastCreator.createToast('error' , 'Algo salio mal' );
      }
    });


    const ActualizarCursos = document.getElementById('Actualizar-Cursos');
    ActualizarCursos.addEventListener('click', async () => {
      let valoresInputs = [];
      const checkboxes = document.querySelectorAll('.input-control input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        const input = checkbox.parentNode.nextElementSibling;   
        const defaultValue = input.getAttribute("data-default-value");
        const inputValue = checkbox.checked ? input.value : defaultValue;
        valoresInputs.push(inputValue);
    });
    const selectCarrera = document.getElementById('Select-Carrera');
    const selectedValue = selectCarrera.value; 
    const selectedText = selectCarrera.options[selectCarrera.selectedIndex].text;
     const modificarCarrera = new PutCarrera()
     const Carrera = {
      iDcarrera : selectedValue,
      nombreCarrera: selectedText.toLowerCase(),
      nalumnos: valoresInputs[1],
      ncursos: valoresInputs[0]
    }
    const response = await modificarCarrera.enviarDatos(Carrera , token )
    if (response.ok) {
      await TablaCursosAlumnos();
      await selectcarreraConId();
      const toastCreator = new ToastCreator(notifications);
      toastCreator.createToast('success' , 'Se cambiaron los valores con éxito' );
    }else
    {
      const toastCreator = new ToastCreator(notifications);
      toastCreator.createToast('error' , 'Algo salio mal' );
    }
    });
    


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

if (window.location.href.includes("/Modificar-Informacion.html")){
  const editButtons = document.querySelectorAll(".Editar");
    editButtons.forEach(button => {
    button.onclick = function () {
    const container = button.closest(".container-config-administrador");
    const inputDisplay = container.querySelector(".container-input-display");
    const labelDisplay = container.querySelector(".container-label-display");
    inputDisplay.classList.remove("settingoff");
    inputDisplay.classList.add("settingon");
    labelDisplay.classList.remove("settingon");
    labelDisplay.classList.add("settingoff");
  };
});

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
      window.location.href.includes("Perfil-Alumno/Modificar-Contrase")||
      window.location.href.includes("Perfil-AdministradorMaster/ModificarInfoAlumno/Modificar-Contrase") )
       {
      let idAlumno = localStorage.getItem('idAlumno');
      
      if(window.location.href.includes("/Perfil-AdministradorMaster/ModificarInfoAlumno.html") ||
      window.location.href.includes("/Perfil-Alumno/Modificar-Informacion.html")){
        document.getElementById("Label-nombre").innerText = "Cargando...";
        document.getElementById("Label-direccion").innerText = "Cargando...";
        document.getElementById("Label-localidad").innerText = "Cargando...";
        document.getElementById("Label-telefono").innerText = "Cargando...";
        document.getElementById("Label-email").innerText = "Cargando...";
        if(window.location.href.includes("/Perfil-AdministradorMaster/ModificarInfoAlumno.html")){
          const inscribirMaterias = document.getElementById("Inscribir-materia")
          inscribirMaterias.addEventListener('click', function () {
          window.location.href = "ModificarInfoAlumno/Incripcion-Materia.html"
          });
          const modificarContraseña = document.getElementById("Modificar-Contraseña")
          modificarContraseña.addEventListener('click', function () {
          window.location.href = "ModificarInfoAlumno/Modificar-Contraseña.html"
          });

        }
      }
      ModificarAlumno.filtrarPorId(idAlumno)
  .then(Alumno => {
    if(window.location.href.includes("Perfil-Alumno/Modificar-Contrase")|| 
    window.location.href.includes("Perfil-Alumno/Modificar-Contrase")||
    window.location.href.includes("Perfil-AdministradorMaster/ModificarInfoAlumno/Modificar-Contrase"))
    {
      console.log("pasapor aca")
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
  })
  .catch(error => {
    // Manejo de errores si la promesa es rechazada
  }); 
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
      if (window.location.href.includes("/Eliminar-Materia.html")){
         selectcarrera()
         var selectElement = document.getElementById("Select-Carrera");
         selectElement.addEventListener("change", function() {
          if(selectElement.value != "CARRERA"){
            selectMateria(selectElement.value);
          }
          else
          {
            document.getElementById("Select-Mateira").innerHTML = `<option selected>Selecciona una carrera</option>`;
          }
          document.getElementById('Eliminar-Materia').addEventListener('click', async function() {
            let token = sessionStorage.getItem('TokenLogin');
            const Materia = document.getElementById('Select-Mateira').value;
            const EliminarMateria = {
              iDmateria: Materia,
              nombreMateria: "nombremateria",
              carrera: "carrera",
              anio: "anio"
            };
            if(Materia != "a-1"){
              var eliminar = new DeleteMateria()
              var verificar = await eliminar.EliminarMateria(EliminarMateria , token );
              if(verificar.ok){
                const toastCreator = new ToastCreator(notifications);
                toastCreator.createToast('success', verificar.data);
              }
              else
              {
                const toastCreator = new ToastCreator(notifications);
                for (var error of verificar.data.errors.NombreMateria){
                  toastCreator.createToast('error', error);
                }
              }
            }
            else
            {
              const toastCreator = new ToastCreator(notifications);
              toastCreator.createToast('error', 'Selecciona una materia para eliminar');
            }

          });
        });
      }
      if (window.location.href.includes("/Agregar-Materia.html")){
        selectcarrera()
        document.getElementById('Agregar-Materia').addEventListener('click', async function() {
          const nombreMateria = document.getElementById('text-Nombre').value;
          const carrera = document.getElementById('Select-Carrera').value;
          const anio = document.getElementById('select-curso').value;
          let token = sessionStorage.getItem('TokenLogin');
          const nuevaMateria = {
            iDmateria: 0,
            nombreMateria: nombreMateria.toLowerCase(),
            carrera: carrera,
            anio: anio
          };
          if(carrera != "Carrera" && anio != "Año" ){
            var AgregarMateria = new PostMateria()
            var verificar =  await AgregarMateria.agregarMateria( nuevaMateria , token)
            if(verificar.ok){
              const toastCreator = new ToastCreator(notifications);
              toastCreator.createToast('success', verificar.data);
            }
            else
            {
              const toastCreator = new ToastCreator(notifications);
              for (var error of verificar.data.errors.NombreMateria){
                toastCreator.createToast('error', error);
              }
            }
          }else
          {
            const toastCreator = new ToastCreator(notifications);
            toastCreator.createToast('error', 'Selecciona una carrera y un año');
          }

        });
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
    
    window.addEventListener("resize", function() {
      var rowElement = document.getElementById("row");
      var windowWidth = window.innerWidth;
    
      if (windowWidth <= 950) {
        if (rowElement.classList.contains("row")) {
          rowElement.classList.remove("row");
        }
      } else {
        if (!rowElement.classList.contains("row")) {
          rowElement.classList.add("row");
        }
      }
    });



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
  enviarButton.addEventListener("click", async () => {
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
          sessionStorage.setItem('iDadministrador', responseData.value.iDadministrador);
          window.location.href = "Perfil-AdministradorMaster.html"
        }
        else 
        {
        
          sessionStorage.setItem('TokenLogin', responseData.value.token);
          sessionStorage.setItem('iDadministrador', responseData.value.iDadministrador);
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