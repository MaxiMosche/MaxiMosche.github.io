class PostCarrera {
    constructor() {
      this.apiUrl = 'https://beppolevi.azurewebsites.net/api/Carrera/Agregar';
    }
  
    async enviarDato(Datos , token) {
        const respuesta = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(Datos),
        });
  
        const resultado = await respuesta.text();
        return resultado
    }
  }

  export default PostCarrera;