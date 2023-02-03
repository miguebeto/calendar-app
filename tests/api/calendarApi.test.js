import calendarApi from "../../src/api/calendarApi";


describe('Pruebas en el CalendarApi', () => {
    
    test('debe de tener la configuración por defecto', () => {

        // console.log(calendarApi.defaults);
        // console.log(process.env)
        expect( calendarApi.defaults.baseURL ).toBe( process.env.VITE_API_URL );  // se espera que el baseURL de la petición con axios sea el de la la varible de entorno
    });

    test('debe de tener el x-token en el header de todas las peticiones ', async() => {

        const token = 'ABC-123-XYZ';
        localStorage.setItem('token', token );
        const res = await calendarApi.get('/auth');

        // console.log(res.config.headers);
        expect(res.config.headers['x-token']).toBe( token ); // se espera que venga el token asignado en el localStorage luego de cualquier peticion a calendarapi
        
    });

});