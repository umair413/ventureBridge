import React, { useContext, useState } from 'react'
import { createContext } from 'react'

const UserDetailContext = createContext();
export const useUserDetails = ()=>useContext(UserDetailContext);
export const UserDetailsProvider = ({children})=>{
    const [details, setDetails] = useState({});
    const setUserDetails = (value)=>{
        setDetails(value)
    }
    return(
        <UserDetailContext.Provider value={{details,setUserDetails}}>
            {children}
        </UserDetailContext.Provider>
    )
}