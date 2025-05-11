import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { CiHeart } from "react-icons/ci";
import { IoSaveOutline } from "react-icons/io5";
import { MdArrowOutward } from "react-icons/md";
const ProductCard = ({linkUrl,thumbnailSrc,title,username,description, minPrice, avgPrice, maxPrice}) => {
  return (
    <Link to={`/productDetail/${linkUrl}`} className="md:w-[30%] w-full">
        <div key={linkUrl} className="flex flex-col   border border-emerald-600/20 border-solid bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-150">
          <div className="relative h-40 overflow-hidden">
            <img
              src={thumbnailSrc}
              alt="idea-thumbnail"
              className="w-full h-full object-cover"
            />
            {/* <div className="items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden group-hover:flex transition-all duration-300 gap-x-4">
              <a className="text-emerald-600 dark:text-slate-700 focus:text-red-600 dark:focus:text-red-600 hover:text-red-600 text-4xl">
              <CiHeart />
              </a>
              <a className="action-btn rounded-full hover:text-white text-emerald-600 ms-1 text-2xl hover:bg-emerald-600 transition-all duration-200 p-1">
              <IoSaveOutline />
              </a>
              <a className="action-btn rounded-full hover:text-white  border-emerald-600/10 text-emerald-600 ms-1 text-3xl hover:bg-emerald-600 transition-all duration-200 p-1">
              <MdArrowOutward />
              </a>
              </div> */}
          </div>
          <div className="flex flex-col gap-y-1 p-3">
            <h3 className="text-xl font-semibold">{title}</h3>
            <span className="text-[14px] font-semibold underline decoration-emerald-600">{username}</span>
            <p className="text-[#94a3b8] text-[15px]">
              {description?.substring(0,100)+"..."}
            </p>
            <div className="flex flex-wrap gap-2 items-center *:cursor-pointer">
              {/* <a >
              <span className="bg-orange-500/5 hover:bg-orange-500/20 inline-block text-orange-500 px-4 text-[14px] font-medium rounded-full mt-2 me-1 transition-all duration-500">
                Full Time
              </span>
              </a> */}
              
              <div>
              <span className="bg-purple-600/5 hover:bg-purple-600/20 inline-block text-purple-600 px-4 text-[14px] font-medium rounded-full mt-2 me-1 transition-all duration-500">{"min: $"+minPrice}</span>
              </div>
              <div>
              <span className="bg-purple-600/5 hover:bg-purple-600/20 inline-block text-purple-600 px-4 text-[14px] font-medium rounded-full mt-2 me-1 transition-all duration-500">{"avg: $"+avgPrice}</span>
              </div>
              <div>
              <span className="bg-purple-600/5 hover:bg-purple-600/20 inline-block text-purple-600 px-4 text-[14px] font-medium rounded-full mt-2 me-1 transition-all duration-500">{"max: $"+maxPrice}</span>
              </div>
              {/* <a>
              <span className="bg-emerald-600/5 hover:bg-emerald-600/20 inline-flex items-center text-emerald-600 px-4 text-[14px] font-medium rounded-full mt-2 transition-all duration-500">
              <div>
              <CiLocationOn />
              </div>
               USA</span>
              </a> */}
            </div>
          </div>
        </div>
          </Link>
  )
}

export default ProductCard