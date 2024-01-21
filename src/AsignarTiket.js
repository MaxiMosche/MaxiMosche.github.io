class AsignarTiket {
    constructor() {
      this.apiUrl = 'https://beppolevi.azurewebsites.net/api/AlumnoMateria/AgregarTiket';
    }
  
    async EnviarDato(ObjetoAlumnoMateria, token) {
        const respuesta = await fetch(this.apiUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(ObjetoAlumnoMateria)
        });
  
        if (!respuesta.ok) {
          console.log(respuesta)
        }
  
        const resultado = await respuesta.text();
        return resultado;
    }
  }
  
  export default AsignarTiket;