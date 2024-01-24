class PutAdministrador {
    constructor() {
      this.apiUrl = 'https://beppolevi.azurewebsites.net/api/Administrador/Modificar';
    }  
    async EnviarDato(DatosAdministrador , token) {
        const respuesta = await fetch(this.apiUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(DatosAdministrador),
        });
  
        const resultado = await respuesta.text();
        return resultado
    }
  }
  export default PutAdministrador;