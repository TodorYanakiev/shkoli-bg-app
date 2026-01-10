import { Navigate, createBrowserRouter } from 'react-router-dom'

import AppLayout from '../layouts/AppLayout'
import AuthLayout from '../layouts/AuthLayout'
import AboutPage from '../pages/About'
import LoginPage from '../pages/Login'
import LyceumsPage from '../pages/Lyceums'
import LyceumDetailPage from '../pages/Lyceums/Detail'
import LyceumEditPage from '../pages/Lyceums/Edit'
import MapPage from '../pages/Map'
import NotFoundPage from '../pages/NotFound'
import ChangePasswordPage from '../pages/Profile/ChangePassword'
import LyceumRightsPage from '../pages/Profile/LyceumRights'
import ProfilePage from '../pages/Profile'
import RegisterPage from '../pages/Register'
import ShkoliPage from '../pages/Shkoli'
import CourseDetailPage from '../pages/Shkoli/Detail'
import ProtectedRoute from './ProtectedRoute'

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
      { path: 'shkoli/:id', element: <CourseDetailPage /> },
      { path: 'lyceums', element: <LyceumsPage /> },
      { path: 'lyceums/:id', element: <LyceumDetailPage /> },
      {
        path: 'lyceums/:id/edit',
        element: (
          <ProtectedRoute>
            <LyceumEditPage />
          </ProtectedRoute>
        ),
      },
      { path: 'map', element: <MapPage /> },
      { path: 'about', element: <AboutPage /> },
      {
        path: 'profile/change-password',
        element: (
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile/lyceum-rights',
        element: (
          <ProtectedRoute>
            <LyceumRightsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default router
