import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Header from '../shared/header/Header'
import Footer from '../shared/footer/Footer'

const Layout = () => {
  const location = useLocation()
  const [inboxActive, setInboxActive] = useState(false)
  useEffect(()=>{
    if(location.pathname.includes("inbox")){
      setInboxActive(true)
    }else{
      setInboxActive(false)
    }
  },[location.pathname])
  return (
    <div>
      {!inboxActive && <div>
            <Header/>
        </div>}
        
        <div >
            <Outlet/>
        </div>
        {!inboxActive && <div>
            <Footer/>
        </div>}
    </div>
  )
}

export default Layout