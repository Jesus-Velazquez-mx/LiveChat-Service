import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
    /* Buscamos el token */
    const token = localStorage.getItem('token_livechat');

    /* Si no hay token, lo mandamos directo al signin */
    if (!token) {
        return <Navigate to="/signin" replace />;
    }
    /* Si sí hay token, lo dejamos pasar al componente que quería ver (el Home) */
    return <Outlet />;
}

export default ProtectedRoute;