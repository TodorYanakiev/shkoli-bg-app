import { Navigate, createBrowserRouter } from 'react-router-dom'

import AppLayout from '../layouts/AppLayout'
import AuthLayout from '../layouts/AuthLayout'
import AboutPage from '../pages/About'
import LoginPage from '../pages/Login'
import LyceumsPage from '../pages/Lyceums'
import MapPage from '../pages/Map'
import NotFoundPage from '../pages/NotFound'
import RegisterPage from '../pages/Register'
import ShkoliPage from '../pages/Shkoli'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: '/register',
    element: <Navigate to="/auth/register" replace />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: '*', element: <Navigate to="/auth/login" replace /> },
    ],
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/shkoli" replace /> },
      { path: 'shkoli', element: <ShkoliPage /> },
      { path: 'lyceums', element: <LyceumsPage /> },
      { path: 'map', element: <MapPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default router
