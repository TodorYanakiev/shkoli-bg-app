import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClientProvider } from '@tanstack/react-query'

import appRouter from './routes/App.router'
import ToastProvider from './components/feedback/ToastProvider'
import { queryClient } from './utils/queryClient'

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ToastProvider>
        <RouterProvider router={appRouter} />
      </ToastProvider>
    </HelmetProvider>
  </QueryClientProvider>
)

export default App
