import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { ChatList } from 'react-chat-elements'
import { Input } from '@mantine/core'
import axios from 'axios'
import { CONFIG } from '../../../config'
import { useUserDetails } from '../../contexts/UserDetailContext'
import { useReceiverChat } from '../../contexts/ReceiverChatContext'
import axiosInstance from '../../../axiosInstance'
import useDeviceWidth from '../../hooks/useDeviceWidth'
const ChatInbox = () => {
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState('');
    const [isDesktop, setIsDesktop] = useState(true);
    const [mobileChat, setMobileChat] = useState(false);
    const {details} = useUserDetails();
    const {setRecDetails} = useReceiverChat();
    const navigate = useNavigate();
    const width = useDeviceWidth();
    useEffect(()=>{
        if (width > 768) {
            setIsDesktop(true);
          } else {
            setIsDesktop(false);
          }
        fetchUserConversations()
    },[width])
    const fetchUserConversations = async()=>{
        try {
            const {data} = await axiosInstance.get(CONFIG.getUserConversations);
            if(data.success){
                const formatted = data.data.map((conv) => ({
                    _id:conv._id,
                    avatar: conv.receiver?.avatar || '', // optional
                    alt: conv.receiver?.username,
                    title: conv.receiver?.username,
                    subtitle: conv.lastMessage?.content || 'No messages yet',
                    date: new Date(conv.updatedAt),
                    unread: 0, // or set count
                    conversationId: conv._id,
                    receiverId: conv.receiver?._id
                  }));
            
                  setConversations(formatted);
            }
        } catch (error) {
            console.log(error)
        }
    }
    const openConversationHandler = async(conversationId, receiverId)=>{
        // setActiveConversation(conversationId)
        try {
            const {data} = await axiosInstance.post(CONFIG.getSingleConversation,{receiverId})
            if(data.success){
                setRecDetails(data?.data?.receiverField)
            }
          } catch (error) {
            console.log(error)
          }
        try {
           const {data} = await axiosInstance.get(CONFIG.getMessagesByConversation+`/${conversationId}`)
           if(data?.success){
            navigate(`/inbox/${details._id}/chat/${conversationId}`)
            setMobileChat(true);
           }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='flex w-full h-screen'>
            <div className={`flex flex-col bg-slate-100 ${!isDesktop && mobileChat ? 'hidden' : !isDesktop && !mobileChat ? 'w-full': ''}`}>
                <div>
                    <Input placeholder='Search Chats' p={'lg'} />
                </div>
                
                <ChatList
                
                    className={`chat-list`}
                    onClick={(item)=>{openConversationHandler(item._id,item?.receiverId)
                    }}
                    dataSource={conversations} />
            </div>
            <div className={`w-full ${!isDesktop && !mobileChat ? 'hidden' : !isDesktop && mobileChat?'w-full':''}`} >
                <Outlet/>
            </div>
        </div>
    )
}

export default ChatInbox