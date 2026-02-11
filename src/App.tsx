import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClientProvider } from '@tanstack/react-query'

import appRouter from './routes/App.router'
import ToastProvider from './components/feedback/ToastProvider'
import { useAuthQueryReset } from './hooks/useAuthQueryReset'
import { queryClient } from './utils/queryClient'

const AuthQuerySync = () => {
  useAuthQueryReset()
  return null
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthQuerySync />
    <HelmetProvider>
      <ToastProvider>
        <RouterProvider router={appRouter} />
      </ToastProvider>
    </HelmetProvider>
  </QueryClientProvider>
)

export default App
