class ListaAlumnos {
  constructor() {
    this.apiUrl = 'https://beppoleviapi.azurewebsites.net/api/Alumno/ListaAlumnos';
  }

  async BuscarLista(token) {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,  // Usar el token pasado como argumento
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await fetch(this.apiUrl, requestOptions);

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
export default ListaAlumnos