import React, { useContext, useState } from 'react'
import { createContext } from 'react'

const LoadingContext = createContext();
export const useLoading = ()=>useContext(LoadingContext);
export const LoadingProvider = ({children})=>{
    const [loading, setLoading] = useState(false);
    const setLoadingState = (value)=>{
        setLoading(value)
    }
    return(
        <LoadingContext.Provider value={{loading,setLoadingState}}>
            {children}
        </LoadingContext.Provider>
    )
}