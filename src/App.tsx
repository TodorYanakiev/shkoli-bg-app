import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

import appRouter from './routes/App.router'

const App = () => (
  <HelmetProvider>
    <RouterProvider router={appRouter} />
  </HelmetProvider>
)

export default App
