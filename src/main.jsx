import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LoginStatusProvider } from './contexts/LoginStatusContext.jsx'
import { UserDetailsProvider } from './contexts/UserDetailContext.jsx'
import { ReceiverChatProvider } from './contexts/ReceiverChatContext.jsx'
import AxiosInterceptor from './interceptors/AxiosInterceptor.js'

createRoot(document.getElementById('root')).render(

        <LoginStatusProvider>
            <UserDetailsProvider>
                <ReceiverChatProvider>
                    <App />
                </ReceiverChatProvider>
            </UserDetailsProvider>
        </LoginStatusProvider>

)
