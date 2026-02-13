import { Navigate, createBrowserRouter } from 'react-router-dom'

import AppLayout from '../layouts/AppLayout'
import AuthLayout from '../layouts/AuthLayout'
import AboutPage from '../pages/About'
import AdminPage from '../pages/Admin'
import AdminCoursesPage from '../pages/Admin/Courses'
import AdminLyceumsPage from '../pages/Admin/Lyceums'
import AdminUsersPage from '../pages/Admin/Users'
import CookiesPage from '../pages/Cookies'
import LoginPage from '../pages/Login'
import LyceumsPage from '../pages/Lyceums'
import LyceumDetailPage from '../pages/Lyceums/Detail'
import LyceumEditPage from '../pages/Lyceums/Edit'
import MapPage from '../pages/Map'
import NotFoundPage from '../pages/NotFound'
import PrivacyPolicyPage from '../pages/PrivacyPolicy'
import ChangePasswordPage from '../pages/Profile/ChangePassword'
import EditProfilePage from '../pages/Profile/Edit'
import LyceumRightsPage from '../pages/Profile/LyceumRights'
import ProfilePage from '../pages/Profile'
import RegisterPage from '../pages/Register'
import ShkoliPage from '../pages/Shkoli'
import CourseCreatePage from '../pages/Shkoli/Create'
import CourseDetailPage from '../pages/Shkoli/Detail'
import CourseEditPage from '../pages/Shkoli/Edit'
import TermsAndConditionsPage from '../pages/TermsAndConditions'
import AdminRoute from './AdminRoute'
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
      {
        path: 'shkoli/new',
        element: (
          <ProtectedRoute>
            <CourseCreatePage />
          </ProtectedRoute>
        ),
      },
      { path: 'shkoli/:id', element: <CourseDetailPage /> },
      {
        path: 'shkoli/:id/edit',
        element: (
          <ProtectedRoute>
            <CourseEditPage />
          </ProtectedRoute>
        ),
      },
      { path: 'lyceums', element: <LyceumsPage /> },
      { path: 'lyceums/:id', element: <LyceumDetailPage /> },
      { path: 'cookies', element: <CookiesPage /> },
      { path: 'privacy-policy', element: <PrivacyPolicyPage /> },
      { path: 'terms-and-conditions', element: <TermsAndConditionsPage /> },
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
        path: 'admin',
        element: (
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        ),
        children: [
          { index: true, element: <Navigate to="courses" replace /> },
          { path: 'courses', element: <AdminCoursesPage /> },
          { path: 'lyceums', element: <AdminLyceumsPage /> },
          { path: 'users', element: <AdminUsersPage /> },
        ],
      },
      {
        path: 'profile/edit',
        element: (
          <ProtectedRoute>
            <EditProfilePage />
          </ProtectedRoute>
        ),
      },
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
