import { Suspense, lazy, type ReactElement } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'

import AppLayout from '../layouts/AppLayout'
import AuthLayout from '../layouts/AuthLayout'
import AboutPage from '../pages/About'
import AdminRoute from './AdminRoute'
import LocaleRoute from './LocaleRoute'
import ProtectedRoute from './ProtectedRoute'
import RootRedirect from './RootRedirect'

const routeLoadingFallback = (
  <div
    data-route-suspense-fallback="true"
    className="mx-auto w-full max-w-6xl space-y-4 px-4 py-8 sm:px-6"
  >
    <div className="h-7 w-2/5 animate-pulse rounded-xl bg-slate-200" />
    <div className="h-4 w-4/5 animate-pulse rounded-xl bg-slate-200" />
    <div className="h-44 animate-pulse rounded-2xl bg-slate-200" />
  </div>
)

const withSuspense = (element: ReactElement) => (
  <Suspense fallback={routeLoadingFallback}>
    {element}
  </Suspense>
)

const AdminPage = lazy(() => import('../pages/Admin'))
const AdminCoursesPage = lazy(() => import('../pages/Admin/Courses'))
const AdminLyceumsPage = lazy(() => import('../pages/Admin/Lyceums'))
const AdminUsersPage = lazy(() => import('../pages/Admin/Users'))
const CookiesPage = lazy(() => import('../pages/Cookies'))
const LoginPage = lazy(() => import('../pages/Login'))
const LyceumsPage = lazy(() => import('../pages/Lyceums'))
const LyceumDetailPage = lazy(() => import('../pages/Lyceums/Detail'))
const LyceumEditPage = lazy(() => import('../pages/Lyceums/Edit'))
const MapPage = lazy(() => import('../pages/Map'))
const NotFoundPage = lazy(() => import('../pages/NotFound'))
const PrivacyPolicyPage = lazy(() => import('../pages/PrivacyPolicy'))
const ChangePasswordPage = lazy(() => import('../pages/Profile/ChangePassword'))
const OAuth2Page = lazy(() => import('../pages/OAuth2'))
const EditProfilePage = lazy(() => import('../pages/Profile/Edit'))
const LyceumRightsPage = lazy(() => import('../pages/Profile/LyceumRights'))
const ProfilePage = lazy(() => import('../pages/Profile'))
const RegisterPage = lazy(() => import('../pages/Register'))
const ShkoliPage = lazy(() => import('../pages/Shkoli'))
const CourseCreatePage = lazy(() => import('../pages/Shkoli/Create'))
const CourseDetailPage = lazy(() => import('../pages/Shkoli/Detail'))
const CourseEditPage = lazy(() => import('../pages/Shkoli/Edit'))
const TermsAndConditionsPage = lazy(() => import('../pages/TermsAndConditions'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '/:locale',
    element: <LocaleRoute />,
    children: [
      {
        path: 'login',
        element: <Navigate to="../auth/login" replace />,
      },
      {
        path: 'register',
        element: <Navigate to="../auth/register" replace />,
      },
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          { index: true, element: <Navigate to="login" replace /> },
          { path: 'login', element: withSuspense(<LoginPage />) },
          { path: 'register', element: withSuspense(<RegisterPage />) },
          { path: 'oauth2/callback', element: withSuspense(<OAuth2Page />) },
          { path: '*', element: <Navigate to="login" replace /> },
        ],
      },
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="shkoli" replace /> },
          { path: 'shkoli', element: withSuspense(<ShkoliPage />) },
          {
            path: 'shkoli/new',
            element: (
              <ProtectedRoute>
                {withSuspense(<CourseCreatePage />)}
              </ProtectedRoute>
            ),
          },
          { path: 'shkoli/:id', element: withSuspense(<CourseDetailPage />) },
          {
            path: 'shkoli/:id/edit',
            element: (
              <ProtectedRoute>
                {withSuspense(<CourseEditPage />)}
              </ProtectedRoute>
            ),
          },
          { path: 'lyceums', element: withSuspense(<LyceumsPage />) },
          {
            path: 'lyceums/:id',
            element: withSuspense(<LyceumDetailPage />),
          },
          { path: 'cookies', element: withSuspense(<CookiesPage />) },
          {
            path: 'privacy-policy',
            element: withSuspense(<PrivacyPolicyPage />),
          },
          {
            path: 'terms-and-conditions',
            element: withSuspense(<TermsAndConditionsPage />),
          },
          {
            path: 'lyceums/:id/edit',
            element: (
              <ProtectedRoute>
                {withSuspense(<LyceumEditPage />)}
              </ProtectedRoute>
            ),
          },
          { path: 'map', element: withSuspense(<MapPage />) },
          { path: 'about', element: <AboutPage /> },
          {
            path: 'admin',
            element: (
              <AdminRoute>
                {withSuspense(<AdminPage />)}
              </AdminRoute>
            ),
            children: [
              { index: true, element: <Navigate to="courses" replace /> },
              {
                path: 'courses',
                element: withSuspense(<AdminCoursesPage />),
              },
              {
                path: 'lyceums',
                element: withSuspense(<AdminLyceumsPage />),
              },
              { path: 'users', element: withSuspense(<AdminUsersPage />) },
            ],
          },
          {
            path: 'profile/edit',
            element: (
              <ProtectedRoute>
                {withSuspense(<EditProfilePage />)}
              </ProtectedRoute>
            ),
          },
          {
            path: 'profile/change-password',
            element: (
              <ProtectedRoute>
                {withSuspense(<ChangePasswordPage />)}
              </ProtectedRoute>
            ),
          },
          {
            path: 'profile/lyceum-rights',
            element: (
              <ProtectedRoute>
                {withSuspense(<LyceumRightsPage />)}
              </ProtectedRoute>
            ),
          },
          {
            path: 'profile',
            element: (
              <ProtectedRoute>
                {withSuspense(<ProfilePage />)}
              </ProtectedRoute>
            ),
          },
          { path: '*', element: withSuspense(<NotFoundPage />) },
        ],
      },
    ],
  },
])

export default router
