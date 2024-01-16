class ListaMaterias {
    constructor(carrera) {
      this.apiUrlGetCarrera = `https://beppolevi.azurewebsites.net/api/Materias/FiltroCarrera?carrera=${carrera}`;
    }
    async BuscarLista(token) {       
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      try {
        const response = await fetch(this.apiUrlGetCarrera, requestOptions);
        if (response.ok) {
          const responseData = await response.json();
          return responseData;
        } else {
          throw new Error('Error en la solicitud');
        }
      } catch (error) {
        throw error;
      }
    }
  }
  export default ListaMaterias