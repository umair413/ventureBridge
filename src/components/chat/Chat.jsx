import { ActionIcon, Avatar, Input } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import './chat.css'
import { MessageList } from 'react-chat-elements'
import { IoSend } from "react-icons/io5";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CONFIG } from '../../../config';
import socket from '../../../socket';
import { useUserDetails } from '../../contexts/UserDetailContext';
import { useReceiverChat } from '../../contexts/ReceiverChatContext';
import axiosInstance from '../../../axiosInstance';
const Chat = () => {
    const [input, setInput] = useState('')
   const {details} = useUserDetails()
    const params = useParams();
    const [messages, setMessages] = useState([])
    const {receiverDetails} = useReceiverChat();
    
    useEffect(() => {
        fetchMessages()
        socket.on('receiveMessage', (message) => {
            if (params.chatId === message.conversation) {
                setMessages((prev) => [...prev, formatMessage(message)])
            }
        })
        
    return () => socket.off('receiveMessage')
        
    }, [params.chatId, details])
    
    const fetchMessages = async()=>{
        const {data} = await axiosInstance.get(CONFIG.getMessagesByConversation+`/${params?.chatId}`)
        socket.emit('joinRoom', params.chatId);
        // const formatted = data?.data.map((msg) => ({
        //     position: msg?.sender?._id === details?._id ? 'right' : 'left',
        //     type: 'text',
        //     text: msg.content,
        //     date: new Date(msg.createdAt),
        // }))
        setMessages(data?.data?.map(formatMessage))
    }
    const sendMessageHandler = async () => {
        try {
            const { data } = await axiosInstance.post(CONFIG.sendMessage, {
                sender: details._id,
                conversationId: params.chatId,
                content: input
            })
            if(data.success){
                setInput('')
            }
        } catch (error) {
            console.log(error)
        }
    }
    const formatMessage = (msg) => ({
        position: msg?.sender?._id === details?._id ? 'right' : 'left',
        type: 'text',
        text: msg.content,
        date: new Date(msg.sentAt || new Date()),

      });
    return (
        <div className='flex flex-col w-full'>
            <div className='flex justify-between bg-emerald-600 p-4'>
                <div className='flex items-center gap-3 text-white font-semibold'>
                    <Avatar src={receiverDetails?.avatar} size={'md'} />
                    {receiverDetails?.username}
                </div>
            </div>
            <div className='chat-background h-[calc(100dvh-140px)] overflow-y-auto'>
                <MessageList
                    className='message-list'
                    lockable={true}
                    toBottomHeight={'100%'}
                    dataSource={messages}
                />
            </div>
            <div className='flex justify-between items-center'>
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder='write your message here' style={{ width: '100%' }} radius={'md'} p={'md'} />
                <ActionIcon variant='filled' onClick={sendMessageHandler}>
                    <IoSend />
                </ActionIcon>
            </div>
        </div>
    )
}

export default Chat