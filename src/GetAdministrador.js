class GetAdministrador {
    constructor() {
      this.apiUrl = 'https://beppolevi.azurewebsites.net/api/Administrador/Individual?id=';
    }  
    async EviarDatos(id, token) {
        const respuesta = await fetch(this.apiUrl+id, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
  
        const resultado = await respuesta.json();
        return resultado
    }
  }
  export default GetAdministrador;