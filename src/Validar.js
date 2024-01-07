class Validar {
    static async verificarAlumno(docomento , token) {
        const apiUrl = `https://beppolevi.azurewebsites.net/api/Control/VerificarAlumno?id=${docomento}`;
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        };
        try {
          const response = await fetch(apiUrl, requestOptions);    
          if (response.ok) {
            const responseData = await response.text();
            return responseData;
          } else {
            throw new Error('Error en la solicitud');
          }
        } catch (error) {
          throw error;
        } 
    }
  }
  export default Validar;