class ApiService {
    constructor() {
      this.apiUrl = 'https://beppoleviapi.azurewebsites.net/Login';
    }
    
    async enviarDatos(usuario, contraseña) {
      const data = {
        usuario: usuario,
        contrasenia: contraseña
      };

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };
  
      try {
        const response = await fetch(this.apiUrl, requestOptions);
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
  }
export default ApiService;