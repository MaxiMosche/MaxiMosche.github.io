class ListaAlumnos {
  constructor() {
    this.paginatedApiUrl = 'https://beppolevi.azurewebsites.net/api/Alumno/Paginado';
    this.apiUrl = 'https://beppolevi.azurewebsites.net/api/Alumno/ListaAlumnos?pagina=';
    this.cache = [];
  }

  async obtenerPaginas(token) {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await fetch(this.paginatedApiUrl, requestOptions);
      if (response.ok) {
        const paginas = await response.text();
        console.log(parseInt(paginas))
        return parseInt(paginas);
      } else {
        throw new Error('Error al obtener el número de páginas');
      }
    } catch (error) {
      throw error;
    }
  }

  async obtenerAlumnos(token, paginas) {
    try {
      for (let i = 1; i <= paginas; i++) {
        const response = await this.obtenerAlumnosPorPagina(token, i);
        this.cache = this.cache.concat(response);
      }
      return this.cache;
    } catch (error) {
      throw error;
    }
  }

  async obtenerAlumnosPorPagina(token, pagina) {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await fetch(`${this.apiUrl}${pagina}`, requestOptions);
      if (response.ok) {
        const responseData = await response.json();
        console.log("este es el json alumno")
        console.log(response)
        return responseData;
      } else {
        throw new Error(`Error al obtener la página ${pagina}`);
      }
    } catch (error) {
      throw error;
    }
  }
}

export default ListaAlumnos