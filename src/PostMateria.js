class PostMateria {
    constructor() {
      this.UrlApi = 'https://beppolevi.azurewebsites.net/api/Materias/Agregar';
    }
    async agregarMateria(datosMateria , token) {
        const respuesta = await fetch(this.UrlApi, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(datosMateria),
        });
  
        const resultado = await respuesta.text();
        if(resultado == "Se agrego con éxito"){
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
  export default PostMateria