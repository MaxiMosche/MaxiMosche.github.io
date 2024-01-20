class CrearAdministrador {
    constructor() {
      this.apiUrl = 'https://beppolevi.azurewebsites.net/api/Administrador/Agregar';
    }
  
    async EnviarDatos(DatosAdministrador , token) {
        const respuesta = await fetch(this.apiUrl, {
          method: 'POST',
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

  export default CrearAdministrador;