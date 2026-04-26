// Frontend entry: mounts the React app into the DOM and wraps it with Router.
// This file should remain minimal and only handle app bootstrapping.
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
