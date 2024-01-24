class ModificarRegistros {
    constructor() {
      this.UrlEliminarRegistros = `https://beppolevi.azurewebsites.net/api/Control/EliminarRegistros`;
      this.urlEliminarMateria = `https://beppolevi.azurewebsites.net/api/Control/EliminarMateria`;
      this.urlEliminarExamenes = `https://beppolevi.azurewebsites.net/api/Control/EliminarExamenes`
    }
    async EliminarRegistros(token) {       
      const requestOptions = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      try {
        const response = await fetch(this.UrlEliminarRegistros, requestOptions);
        if (response.ok) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        throw error;
      }
    }

    async EliminarMateria(token) {       
      const requestOptions = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      try {
        const response = await fetch(this.UrlEliminarMateria, requestOptions);
        if (response.ok) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        throw error;
      }
    }

    async EliminarExamenes(token) {       
      const requestOptions = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      try {
        const response = await fetch(this.UrlEliminarExamenes, requestOptions);
        if (response.ok) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        throw error;
      }
    }
  }
  export default ModificarRegistros