import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './pages/AuthContent.jsx'
import { ApiHostProvider } from "./context/ApiHostContext";

createRoot(document.getElementById('root')).render(

  <ApiHostProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ApiHostProvider>

)
