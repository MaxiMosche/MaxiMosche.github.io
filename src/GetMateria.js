class ListaMaterias {
    constructor(carrera) {
      this.apiUrl = `https://beppoleviapi.azurewebsites.net/api/Materias/FiltroCarrera?carrera=${carrera}`;
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
        const response = await fetch(this.apiUrl, requestOptions);
        if (response.ok) {
          const responseData = await response.json();
          console.log(responseData)
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