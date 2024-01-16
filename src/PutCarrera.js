class PutCarrera {
    constructor() {
      this.apiUrl = 'https://beppolevi.azurewebsites.net/api/Carrera/Modificar';
    }
  
    async enviarDatos(objetoJson, token) {
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(objetoJson)
      };
  
        const response = await fetch(this.apiUrl, requestOptions);
        console.log(response)
        if (response.ok) {
          const responseData = await response.text;
          return { ok: true, data: responseData };
        } else {
          const errores = await response.text;
          return { ok: false, data: errores.errors };
        }
    }
  }

  export default PutCarrera