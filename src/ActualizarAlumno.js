class ActualizarAlumno {
    constructor() {
        this.apiBaseUrl = 'https://beppolevi.azurewebsites.net/api/Alumno/Activar';
    }

    async EnviarDatos(objetoJson, token) {
            
            const response = await fetch (this.apiBaseUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(objetoJson),
            });          
            if (response.ok) {
                const resultado = await response.text()
                console.log(resultado)
                return  { ok: true, data: objetoJson };
            } else {
                return  { ok: false, data: objetoJson };
            }
    }
}

export default ActualizarAlumno;