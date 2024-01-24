class RecuperarContrasenia {
    constructor() {
      this.apiUrl = 'https://beppolevi.azurewebsites.net/RecuperarContrseña';
    }
  
    async enviarDato(Datos ) {
        const respuesta = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(Datos),
        });
  
        const resultado = await respuesta.text();
        return resultado
    }
  }

  export default RecuperarContrasenia;