import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { NextUIProvider } from '@nextui-org/react'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
        <NextUIProvider>
        <main className="dark text-foreground bg-background">
          <App />
        </main>
        </NextUIProvider>
  </React.StrictMode>
)

// <main className="dark text-foreground bg-background">
