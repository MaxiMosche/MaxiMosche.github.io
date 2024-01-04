import { ToastCreator, obtenerValorInput , cargarSweetAlert } from'./Alerts.js';
const notifications = document.querySelector('.notifications');
export default class Registro 
{
      
     static async Registrar(objetoJson) {
      console.log(objetoJson)
        const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(objetoJson)
          };
          try {
            const apiUrl = 'https://beppoleviapi.azurewebsites.net/api/Alumno/Agregar';
            const response = await fetch(apiUrl, requestOptions);
            if (response.statusText == "Bad Request") {
              const responsejson = await response.json();
              const keys = Object.keys(responsejson.errors);
              keys.forEach(key => {
                  switch (key) {
                  case 'Telefono':
                    imprimirErrores("Telefono: ", responsejson.errors.Telefono);
                    break;
                    case 'NombreCompleto':
                    imprimirErrores('NombreCompleto :' , responsejson.errors.NombreCompleto);
                    break;
                    case 'Direccion':
                    imprimirErrores('Domicilio:: ' , responsejson.errors.Direccion);
                    break;
                    case 'Localidad':
                    imprimirErrores('Localidad: ' , responsejson.errors.Localidad);
                    break;
                    case 'Email':
                    imprimirErrores('Email: ' , responsejson.errors.Email);
                    break;
                    case 'Carrera':
                    imprimirErrores('Carrera: ' , responsejson.errors.Email);
                    break;
                    case 'Anio':
                    imprimirErrores('Anio: ' , responsejson.errors.Email);
                    break;
                    case '$.numeroDocumento':
                    imprimirErrores('NumeroDocumento: ' , responsejson.errors.Email);
                    break;
                    case 'Anio':
                    imprimirErrores('Anio: ' , responsejson.errors.Email);
                    break;
                  }
              }
              );
            }
             else {
              return true
            }
          } catch (error) {
            throw error;
          }
      }
}

function imprimirErrores(clave, errores) {
  if (errores && errores.length > 0) {
      for (let i = 0; i < errores.length; i++) {
        const toastCreator = new ToastCreator(notifications);
        toastCreator.createToast( "error" , `${clave} : ${ errores[i]}`);
      }
  } else if (errores) {
      console.log(`No hay errores en ${clave}`);
  } else {
      console.log(`No se encontraron errores para ${clave}`);
  }
}
