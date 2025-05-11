import React, { useContext, useState } from 'react'
import { createContext } from 'react'

const ReceiverChatContext = createContext();
export const useReceiverChat = ()=>useContext(ReceiverChatContext);
export const ReceiverChatProvider = ({children})=>{
    const [receiverDetails, setReceiverDetails] = useState(false);
    const setRecDetails = (value)=>{
        setReceiverDetails(value)
    }
    return(
        <ReceiverChatContext.Provider value={{receiverDetails,setRecDetails}}>
            {children}
        </ReceiverChatContext.Provider>
    )
}