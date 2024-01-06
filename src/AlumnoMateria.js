class AlumnoMateria {
    constructor() {
      this.modificarUrl = 'https://beppolevi.azurewebsites.net/api/AlumnoMateria/Modificar';
      this.eliminarUrl = 'https://beppolevi.azurewebsites.net/api/AlumnoMateria/Eliminar';
    }
  
    modificarAlumnoMateria(data, token) {
      return fetch(this.modificarUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        console.log(response.ok)
        if (response.ok) {
          return true;
        } else {
          return false;
        }
      })
      .catch(error => {
        throw new Error('Error al realizar la solicitud:', error);
      });
    }
  
    eliminarAlumnoMateria(data, token) {
      return fetch(this.eliminarUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        console.log(response.ok)
        if (response.ok) {
          return true;
        } else {
          return false;
        }
      })
      .catch(error => {
        throw new Error('Error al realizar la solicitud:', error);
      });
    }
  }
  
  export default AlumnoMateria;