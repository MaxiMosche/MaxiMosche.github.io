import ApiService from './Login.js';
import ListaAlumnos from './MenuAdministrador.js';
import ModificarAlumno from './ModificarAlumno.js';
import Registro from './Registro.js';
import { ToastCreator, obtenerValorInput , cargarSweetAlert } from './Alerts.js';

const apiService = new ApiService();
const enviarButton = document.getElementById("Btn-login");
const storedNotification = localStorage.getItem('notification');
const notifications = document.querySelector(".notifications");
const cardLoading = document.querySelector('.Card-Loading');
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

async function loadicon(){
  var iconosEdicion = document.querySelectorAll('.bx-edit');
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

if (enviarButton !== null) {

  enviarButton.addEventListener("click", async () => {
    cardLoading.classList.remove('invisible');
    cardLoading.classList.add('visible');
    console.log(cardLoading)
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
      toastCreator.createToast('error' , responseData.value.msg );
      cardLoading.classList.remove('visible')
      cardLoading.classList.add('invisible');

    }
  });
}

export async function CrearMenuAlumno()
{
  let idAlumno = localStorage.getItem('idAlumno');
  const Alumno = await ModificarAlumno.filtrarPorId(idAlumno);
  var elemento = document.getElementById("verificado");
  if (Alumno.verificacion) {
    elemento.classList.add("Verificado");
  } else {
    elemento.classList.add("NoVerificado");
  }
  document.getElementById("Nombre").innerText = Alumno.nombreCompleto;
  document.getElementById("Eimail").innerText = Alumno.email;
  document.getElementById("Carrera").innerText = Alumno.carrera;
  document.getElementById("Año").innerText = Alumno.anio;
  var primero = `<div class="accordion"><div class="accordion-header border-accordion">
  <span class="arrow-container ">
    <i class='bx bx-chevron-right arrow acordion-perfil-arrow'></i>
  </span> <h4 class="h4">Materias</h4></div>
  <div class="accordion-content container-opcion ">`
  var fin = `</div></div>`
  var examenes = `<div class="accordion">
  <div class="accordion-header border-accordion">
    <span class="arrow-container">
      <i class='bx bx-chevron-right arrow acordion-perfil-arrow'></i>
    </span>
     <h4 class="h4">Examenes</h4>
  </div>
  <div class="accordion-content examen-stilo">`
      for(var i = 0 ; i < Alumno.listaMateria.length ; i++)
      {
        if(Alumno.listaMateria[i].tiempo === "permanente")
        {
        primero += `<div class="row"><span class="col-6">${Alumno.listaMateria[i].materia}</span><span class="col-3">${Alumno.listaMateria[i].regularidad}</span></div>`
        } 
        else
        {
           examenes += `<a href="Perfil-Alumno/OpcionesDeExamenes.html"><div class="row cont-exam"><span class="col-3">${Alumno.listaMateria[i].materia}</span><i id="rotate-icon" class='rotate-icon col-9 bx bxs-brightness'></i></div></a>`

        }
      }
      document.getElementById("Lista-Materias").innerHTML = primero + fin
      document.getElementById("Lista-Examenes").innerHTML = examenes + fin
 }
 


export function CrearMenuAdministrador() {
  var dato = ""
  let token = sessionStorage.getItem('TokenLogin');
  const lista = new ListaAlumnos();
  lista.BuscarLista(token)
  .then(Alumno => {
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
  })
.catch(error => {
console.error('Error:', error);
});
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
    await loadHTMLFromAPI();
    setTimeout(async function (){
      await loadicon()
    }, 10000);
    if(notification.success.inicioOk)
    {
      const toastCreator = new ToastCreator(notifications);
      toastCreator.createToast('success' , notification.success.inicioText );
      updateNotification(false, "");
    };
  } // temina el if

  if (window.location.href.includes("Registro-Alumno.html")) {
    const btnCrear = document.getElementById('Btn-Crear');
    btnCrear.addEventListener('click', async function() {
      const objetoJson = formularioRegistro()
      var veri = await Registro.Registrar(objetoJson);
      if (veri == true) {
        console.log("paso por dentro del verificar");
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
  
  if (window.location.href.includes("Perfil-AdministradorMaster/ModificarInfoAlumno.html") ||
      window.location.href.includes("Perfil-Alumno/Modificar-Informacion.html") ) {
      let idAlumno = localStorage.getItem('idAlumno');
      document.getElementById("Label-nombre").innerText = "Cargando...";
      document.getElementById("Label-direccion").innerText = "Cargando...";
      document.getElementById("Label-localidad").innerText = "Cargando...";
      document.getElementById("Label-telefono").innerText = "Cargando...";
      document.getElementById("Label-email").innerText = "Cargando...";
      const Alumno = await ModificarAlumno.filtrarPorId(idAlumno);
      setTimeout(async function (){
        document.getElementById("Label-nombre").innerText = Alumno.nombreCompleto;
        document.getElementById("Label-direccion").innerText = Alumno.direccion;
        document.getElementById("Label-localidad").innerText = Alumno.localidad;
        document.getElementById("Label-telefono").innerText = Alumno.telefono;
        document.getElementById("Label-email").innerText = Alumno.email;
        handleClick("input-nombre" , "button-nombre");
        handleClick("input-direccion" , "button-direccion");
        handleClick("input-localidad" , "button-localidad");
        handleClick("input-telefono" ,"button-telefono");
        handleClick("input-email" ,"button-email");
      }, 5000);
    
        function handleClick(inputId ,buttonId  ) {
          const button = document.getElementById(buttonId);
          var alert = ModificarAlumno.agregarEventoClick(inputId , button)
        }
      }
  if (window.location.href.includes("Perfil-Alumno.html")) 
  {
    CrearMenuAlumno()
  }

  if (window.location.href.includes("Perfil-AdministradorMaster.html")) 
  {
    const progressBar = document.querySelector('.progress-bar');
    const porcentajeTexto = document.querySelector('.progress-bar');
    let width = 1; 

    const intervalo = 100; 
    const duracion = 7000; 
    const incremento = (100 / (duracion / intervalo)); 
    
    const intervalID = setInterval(() => {
      if (width >= 100) {
        clearInterval(intervalID); 
      } else {
        width += incremento;
        progressBar.style.width = width + '%';
        porcentajeTexto.textContent = Math.round(width) + '%';
      }
      }, intervalo);
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
  document.getElementById('registro').addEventListener('click', function() { 
    window.location.href = 'Registro-Alumno.html';
});
});
