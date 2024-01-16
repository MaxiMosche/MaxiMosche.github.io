class EstadoInscripcion {
    constructor() {
      this.EstadoInscripcion = 'https://beppolevi.azurewebsites.net/api/Control/EstadoInscripcion';
      this.CambiarEstadoInscripcion = 'https://beppolevi.azurewebsites.net/api/Control/CambiarEstadoDeInscripción'; 
    }

    async enviarEstadoInscripcion(token, valor) {
        const requestOptions = {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            Valor: valor
          })
        };
    
        try {
          const response = await fetch(this.CambiarEstadoInscripcion, requestOptions);
    
          if (response.ok) {
            return true
          } else {
            return false
            console.error('Error al cambiar el estado de inscripción:', response.statusText);
          }
        } catch (error) {
          console.error('Error inesperado:', error);
        }
      }
    
  
    async obtenerEstadoInscripcion(token) {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
  
      try {
        const response = await fetch(this.EstadoInscripcion, requestOptions);
  
        if (response.ok) {
          const data = await response.json();
          return data;
        } else {
          console.error('Error al obtener el estado de inscripción:', response.statusText);
          return false;
        }
      } catch (error) {
        console.error('Error inesperado:', error);
        return false;
      }
    }
  }

  export default EstadoInscripcion