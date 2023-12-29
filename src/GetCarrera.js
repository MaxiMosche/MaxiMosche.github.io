class GetCarrera {
    constructor() {
      this.url = 'https://beppoleviapi.azurewebsites.net/api/Carrera/ListaCarreras';
    }
  
    async BuscarLista(token) {       
        const requestOptions = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        };
        try {
          const response = await fetch(this.url, requestOptions);
          if (response.ok) {
            const responseData = await response.json();
            console.log(responseData)
            return responseData;
          } else {
            throw new Error('Error en la solicitud');
          }
        } catch (error) {
          throw error;
        }
      }
    }

  export default GetCarrera