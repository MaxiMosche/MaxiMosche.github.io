class ModificarRegistros {
    constructor() {
      this.apiUrl = `https://beppoleviapi.azurewebsites.net/api/Control/EliminarRegistros`;
    }
    async EliminarRegistros(token) {       
      const requestOptions = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      try {
        const response = await fetch(this.apiUrl, requestOptions);
        if (response.ok) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        throw error;
      }
    }
  }
  export default ModificarRegistros