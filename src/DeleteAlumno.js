class DeleteAlumno {
    constructor() {
      this.apiUrl = 'https://beppolevi.azurewebsites.net/api/Alumno/Eliminar';
    }
  
    async EnviarDato(Datos , token) {
        const respuesta = await fetch(this.apiUrl, {
          method: 'DELETE',
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

  export default DeleteAlumno;