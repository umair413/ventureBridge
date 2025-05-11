import React, { useContext, useState } from 'react'
import { createContext } from 'react'

const LoginStatusContext = createContext();
export const useLoginStatus = ()=>useContext(LoginStatusContext);
export const LoginStatusProvider = ({children})=>{
    const [status, setStatus] = useState(false);
    const setLoginStatus = (value)=>{
        setStatus(value)
    }
    return(
        <LoginStatusContext.Provider value={{status,setLoginStatus}}>
            {children}
        </LoginStatusContext.Provider>
    )
}