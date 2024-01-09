const notifications = document.querySelector(".notifications");
import { ToastCreator, obtenerValorInput , cargarSweetAlert } from './Alerts.js';
export default class ModificarAlumno {
    
    static async filtrarPorId(id) {
        const idAlumno = parseInt(id);
        try {
            let token = sessionStorage.getItem('TokenLogin');
            const alumno = await ModificarAlumno.ObtenerAlumnoDatos( idAlumno , token )
            return alumno
        } catch (error) {
            console.error(error);
            throw new Error('Error al buscar el alumno');
        }
    }

    static async manejarAtributos(atributo, mensajes) {
        const toastCreator = new ToastCreator(notifications);
        for (let i = 0; i < mensajes.length; i++) {
          toastCreator.createToast('error', mensajes[i]);
        }
      }
      
    static async limpiarYAsignarPlaceholder(id, placeholderText) {
        const elemento = document.getElementById(id);
        if (elemento) {
          elemento.value = "";
          elemento.placeholder = placeholderText || "Escribe aquí...";
        }
      }


    static async ObtenerAlumnoDatos(docomento , token) {
        const apiUrl = `https://beppolevi.azurewebsites.net/api/Alumno/Individual?id=${docomento}`;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        };
        try {
          const response = await fetch(apiUrl, requestOptions);    
          if (response.ok) {
            const responseData = await response.json();
            return responseData;
          } else {
            throw new Error('Error en la solicitud');
          }
        } catch (error) {
          throw error;
        } 
    }

    static async enviarDatos(objetoJson , token) {
        const apiUrl = 'https://beppolevi.azurewebsites.net/api/Alumno/Modificar';
        const requestOptions = {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(objetoJson)
        };
        try {
          const response = await fetch(apiUrl, requestOptions);
          if (response.ok) {
            console.log(response)    
            return  { ok: true, data: objetoJson };
          } else {
            const errores = await response.json();
            return { ok: false, data: errores.errors };
          }
        } catch (error) {
          throw error;
        }
    }

  
    
  static agregarEventoClick(inputId , button) {
        button.addEventListener('click', async function() {
            try {
                const idAlumno = JSON.parse(localStorage.getItem('idAlumno'));
                const Alumno = await ModificarAlumno.filtrarPorId(localStorage.getItem('idAlumno'));
                const valor = obtenerValorInput(inputId);
                if (idAlumno && valor.valor) {
                    switch (valor.id) {
                        case 'input-nombre':
                            Alumno.nombreCompleto = valor.valor.toLowerCase()
                            break;
                        case 'input-direccion':
                            Alumno.direccion = valor.valor.toLowerCase()
                            break;
                        case 'input-localidad':
                            Alumno.localidad = valor.valor.toLowerCase()
                            break;
                        case 'input-telefono':
                            Alumno.telefono = valor.valor.toLowerCase()
                            break;
                        case 'input-email':
                            Alumno.email = valor.valor.toLowerCase()
                            break;
                        case 'input-password':
                            Alumno.contrasenia = valor.valor
                              break;
                        default:
                            // Manejar caso por defecto si no se encuentra la coincidencia
                            break;
                    }
                    let token = sessionStorage.getItem('TokenLogin');
                    ModificarAlumno.enviarDatos(Alumno , token)
                    .then(responseData => {
                        ModificarAlumno.limpiarYAsignarPlaceholder("input-nombre");
                        ModificarAlumno.limpiarYAsignarPlaceholder("input-direccion");
                        ModificarAlumno.limpiarYAsignarPlaceholder("input-localidad");
                        ModificarAlumno.limpiarYAsignarPlaceholder("input-telefono");
                        ModificarAlumno.limpiarYAsignarPlaceholder("input-email");
                            if(responseData.ok)
                            {
                              if(window.location.href.includes("Perfil-AdministradorMaster/ModificarInfoAlumno.html") ||
                              window.location.href.includes("Perfil-Alumno/Modificar-Informacion.html")){
                                document.getElementById("Label-nombre").innerText = Alumno.nombreCompleto.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
                                document.getElementById("Label-direccion").innerText = Alumno.direccion.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
                                document.getElementById("Label-localidad").innerText = Alumno.localidad.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
                                document.getElementById("Label-telefono").innerText = Alumno.telefono.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
                                document.getElementById("Label-email").innerText = Alumno.email.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
                              }
                                const toastCreator = new ToastCreator(notifications);
                                toastCreator.createToast('success' , 'Exito' );
                            }else
                            {
                              console.log(responseData.data)
                                const keys = Object.keys(responseData.data);
                                keys.forEach(key => {
                                    switch (key) {
                                      case 'Telefono':
                                      ModificarAlumno.manejarAtributos("Telefono: ", responseData.data.Telefono);
                                      break;
                                      case 'NombreCompleto':
                                      ModificarAlumno.manejarAtributos('NombreCompleto :' , responseData.data.NombreCompleto);
                                      break;
                                      case 'Direccion':
                                      ModificarAlumno.manejarAtributos('Domicilio: ' , responseData.data.Direccion);
                                      break;
                                      case 'Localidad':
                                      ModificarAlumno.manejarAtributos('Localidad: ' , responseData.data.Localidad);
                                      break;
                                      case 'Email':
                                      ModificarAlumno.manejarAtributos('Email: ' , responseData.data.Email);
                                      case 'Contrasenia':
                                        ModificarAlumno.manejarAtributos('Email: ' , responseData.data.Contrasenia);
                                      break;
                                    }
                                });
                            }
                        })
                        .catch(error => {
                            console.error("este es otro error" + error);
                        });
                } else {
                    console.error('No se encontró el objeto idAlumno en el localStorage o el valor del input está vacío');
                }
            } catch (error) {
                console.error("el 2do catch");
            }
        });
    }

    

}

