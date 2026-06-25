import './App.css'
import LoginFormContainer from './containers/LoginFormContainer';
import HomeContainer from './containers/HomeContainer';
/* Para el manejo global del token*/
import AuthProvider from './context/AuthContext';
/* Para manejar URLs */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
/* Para las notificaciones con toastify */
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      {/* AuthProvider permite visualizar globalmente el valor del token */}
      <AuthProvider>
        {/* Punto de anclaje para las notificaciones con toastify */}
        <ToastContainer position="top-right" autoClose={3000} />
        {/* BrowserRouter no dibuja nada. Simplemente es el padre de routes*/}
        <BrowserRouter>
          <Routes>
            {/* Si el usuario entra a la raíz ("/") lo mandamos automáticamente a "/login" */}
            <Route path="/" element={<Navigate to="/signin" replace />} />

            {/* Todas las rutas*/}
            <Route path="/signin" element={<LoginFormContainer isSignIn />} />
            <Route path="/signup" element={<LoginFormContainer isSignIn={false} />} />
            <Route path="/home" element={<HomeContainer />} />


            {/* Buena práctica. Si alguien escribe lo que sea que no existe, lo mandamos a login */}
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
};

export default App
