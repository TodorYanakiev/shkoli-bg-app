import React from 'react'
import ReactDOM from 'react-dom/client'

import { i18nReady } from './locales/i18n'
import App from './App'
import './index.css'

const bootstrap = () => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

void i18nReady.finally(bootstrap)
