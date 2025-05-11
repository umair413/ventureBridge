import React from 'react'
import { Loader } from '@mantine/core'
const Loading = () => {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
        <Loader size={50} color='#059669'/>
    </div>
  )
}

export default Loading