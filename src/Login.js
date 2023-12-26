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
        const responseData = await response.json();
        if (response.ok) {
          if(responseData.value.ok){
            return responseData;
          }
          else
          {     
            responseData.value.acceso = true;
            return responseData;
          }
        }
         else
        {
          if (!responseData.value) {
            responseData.value = {}; 
          }
          responseData.value.ok = false;
          responseData.value.acceso = false;
          return responseData;
        }
      } catch (error) {
        throw error;
      }
    }
  }
export default ApiService;