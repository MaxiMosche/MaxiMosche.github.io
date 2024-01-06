class Inscipcion {
    constructor() {
      this.radios = this.getRadioGroups();
    }

    async enviarDatos(objetoEnviar, token) {
      const datosAEnviar = JSON.stringify(objetoEnviar);
      console.log(datosAEnviar)
      const url = 'https://beppolevi.azurewebsites.net/api/AlumnoMateria/Agregar';
      const parametrosSolicitud = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: datosAEnviar,
      };
      return fetch(url, parametrosSolicitud)
        .then(respuesta => {
          if (!respuesta.ok) {
            throw new Error(`Ocurrió un error: ${respuesta.status}`);
          }
          return respuesta.text();
        })
    }
  
    getRadioGroups() {
      const radioGroups = {};
      const radioElements = document.querySelectorAll('input[type="radio"]');
      
      radioElements.forEach(radio => {
        const groupName = radio.getAttribute('name');
        if (groupName && !radioGroups[groupName]) {
          radioGroups[groupName] = document.querySelectorAll(`input[name="${groupName}"]`);
        }
      });
      return radioGroups;
    }
  
    getSelectedValues(dni , tiempo_) {
      const selectedRadioValues = [];
      for (const groupName in this.radios) {
        const values = {
          id : 0,
          numeroDocumento: dni, 
          materia: groupName,
          regularidad: Array.from(this.radios[groupName])
            .filter(radio => radio.checked)
            .map(radio => radio.value)[0] || null,
          tiempo: tiempo_
        };
        selectedRadioValues.push(values);
      }
      
      return selectedRadioValues;
    }
  }
  export default Inscipcion;