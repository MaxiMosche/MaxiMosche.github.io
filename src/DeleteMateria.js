class DeleteMateria {
    constructor() {
      this.UrlApi = 'https://beppolevi.azurewebsites.net/api/Materias/Eliminar';
    }
    async EliminarMateria(datosMateria , token) {
        const respuesta = await fetch(this.UrlApi, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(datosMateria),
        });
  
        const resultado = await respuesta.text();
        if(resultado == "Se elimono con éxito"){
            const respuestaObj = {
                ok: true,
                data: resultado
            };
            return respuestaObj;
        }
        else
        {
            const jsonObject = JSON.parse(resultado);
            const respuestaObj = {
                ok: false,
                data: jsonObject
            };
            return respuestaObj;
        }
    }
  }
  export default DeleteMateria