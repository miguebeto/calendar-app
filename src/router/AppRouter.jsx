import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../auth';
import { CalendarPage } from '../calendar';
import { useAuthStore } from '../hooks';


export const AppRouter = () => {

    const { status, checkAuthToken } = useAuthStore();
    // const authStatus = 'not-authenticated'; // 'authenticated'; // 'not-authenticated';
    
    useEffect(() => {
        checkAuthToken();
    }, []) // Actualiza el token
    

    if(status === 'checking'){
        return (
            <h3>Cargando...</h3>
        )
    }

    return (
        <Routes>
            {
                ( status === 'not-authenticated')  
                    ? (
                        <>
                            <Route path="/auth/*" element={ <LoginPage /> } />
                            <Route path="/*" element={ <Navigate to="/auth/login" /> } />     {/* redireciona al login en caso de que se quiera entrar a cualquier otra ruta */}
                        </>
                    )
                    : (
                        <>
                            <Route path="/" element={ <CalendarPage /> } />
                            <Route path="/*" element={ <Navigate to="/" /> } />     {/* redireciona al login en caso de que se quiera entrar a cualquier otra ruta */}
                        </>
                    )
            }
        </Routes>
    )
}