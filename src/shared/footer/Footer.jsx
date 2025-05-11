import React from 'react'
import { FaFacebook } from "react-icons/fa";
import { IconContext } from 'react-icons';
import { AiFillTwitterCircle } from "react-icons/ai";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { TiSocialYoutube } from "react-icons/ti";
import fullLogoWhite from "../../assets/full-logo-white.png";
const Footer = () => {
  return (
    <div className='w-full flex flex-col justify-center bg-slate-900'>
      <div className='container py-12'>
        <div className='mb-8'><img src={fullLogoWhite} alt="full-logo" className='mx-auto'/></div>
        <ul className='flex flex-wrap justify-center gap-4 text-white text-[15px] font-medium'>
          <li>Home</li>
          <li>How it Works</li>
          <li>Privacy & Policy</li>
          <li>Contact us</li>
          <li>Terms and Conditions</li>
        </ul>
      </div>
      <div className='h-[1px] w-full bg-neutral-300'></div>
      <div className='w-full container flex max-md:flex-col md:justify-between py-12 md:px-4 text-center text-white text-[15px]'>
        <div className='md:break-words'>© 2025  Jobstack. Design & Develop with Heart</div>
        <div className='flex items-center justify-center gap-1 max-md:mt-4 mb-2'>
          <IconContext.Provider value={{color:"white"}} >
          <div className='border-2 border-solid border-neutral-600 rounded-md p-1'><FaFacebook /></div>
          </IconContext.Provider>
          <IconContext.Provider value={{color:"white"}} >
          <div className='border-2 border-solid border-neutral-600 rounded-md p-1'><AiFillTwitterCircle /></div>
          </IconContext.Provider>
          <IconContext.Provider value={{color:"white"}} >
          <div className='border-2 border-solid border-neutral-600 rounded-md p-1'><FaInstagram /></div>
          </IconContext.Provider>
          <IconContext.Provider value={{color:"white"}} >
          <div className='border-2 border-solid border-neutral-600 rounded-md p-1'><FaWhatsapp /></div>
          </IconContext.Provider>
          <IconContext.Provider value={{color:"white"}} >
          <div className='border-2 border-solid border-neutral-600 rounded-md p-1'><FaLinkedin /></div>
          </IconContext.Provider>
          <IconContext.Provider value={{color:"white"}} >
          <div className='border-2 border-solid border-neutral-600 rounded-md p-1'><TiSocialYoutube /></div>
          </IconContext.Provider>
        </div>
      </div>
    </div>
  )
}

export default Footer