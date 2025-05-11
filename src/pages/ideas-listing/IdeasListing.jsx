import React, { useEffect } from "react";
import "../ideas-listing/ideaslisting.css";
import { IconContext } from "react-icons";
import { FaMedkit } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdWorkHistory } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { IoSaveOutline } from "react-icons/io5";
import { MdArrowOutward } from "react-icons/md";
import { useState, useMemo } from "react";
import countryList from "react-select-country-list";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { CONFIG } from "../../../config";
import ProductCard from "../../components/product-card/ProductCard";
import axiosInstance from "../../../axiosInstance";
import { useLoading } from "../../contexts/LoadingContext";
import Loading from "../../components/loader/Loading";
const IdeasListing = () => {
  const [value, setValue] = useState("");
  const [products, setProducts] = useState([]);
  const cardsData = [1,2,3,4,5,6,7,8,9,10,11,12];
  const params = useParams()
  const options = useMemo(() => countryList().getData(), []);
  const countries = options.flat();
  const {loading, setLoadingState} = useLoading()
  const changeHandler = (value) => {
    setValue(value);
  };
  useEffect(()=>{
    fetchProductByCategory()
  },[])
  const fetchProductByCategory = async()=>{
    try {
      setLoadingState(true)
      const categoryId = params?.categoryId
      const {data} = await axiosInstance.post(CONFIG.getProductsByCategory,{categoryId})
      if(data.success){
        setProducts(data?.data)
        setLoadingState(false)
      }
    } catch (error) {
      console.log(error);
      setLoadingState(false)
    }
  }
  if(loading) return <Loading/>
  return (
    // front hero image
    <div>
      <div className="relative w-full py-36 bg-front rounded-b-[80px] mb-2 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-900/90"></div>
        <h1 className="flex justify-center items-center text-white text-4xl relative font-semibold">
          Ideas Listings
        </h1>
      </div>
      <div className="md:w-[60%] w-5/6 md:-translate-y-[50px] -translate-y-[80px] mx-auto flex max-xl:flex-col items-center justify-center gap-y-2 bg-white rounded-lg shadow p-2 ">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search Your Keywords"
            className="w-full h-[60px] text-[15px] rounded-md ps-10 pe-2 outline-none bg-gray-50"
          />
          <div className="absolute top-[20px] left-2">
            <IconContext.Provider value={{ color: "#059669", size: "20px" }}>
              <FaMedkit />
            </IconContext.Provider>
          </div>
        </div>
        <div className="relative w-full">
          <select
            name=""
            id=""
            className="w-full h-[60px] text-[15px] rounded-md ps-10 pe-2 outline-none bg-gray-50"
          >
            {countries.map((item, index) => (
              <option key={index} value={value} onChange={changeHandler}>
                {item.label}
              </option>
            ))}
          </select>
          <div className="absolute top-5 left-2">
            <IconContext.Provider value={{ color: "#059669", size: "20px" }}>
              <FaLocationDot />
            </IconContext.Provider>
          </div>
        </div>
        <div className="relative w-full">
          <select
            name=""
            id=""
            className="w-full h-[60px] text-[15px] rounded-md ps-10 pe-6 outline-none bg-gray-50"
          >
            <option value="" disabled>
              Select...
            </option>
            <option value="">Full-time</option>
            <option value="">Part Time</option>
            <option value="">Internship</option>
          </select>
          <div className="absolute top-4 left-2">
            <IconContext.Provider value={{ color: "#059669", size: "20px" }}>
              <MdWorkHistory />
            </IconContext.Provider>
          </div>
        </div>
        <button className="bg-emerald-600 w-full rounded-md py-4 text-center text-white">
          Submit
        </button>
      </div>
      <div className="flex md:flex-wrap max-md:flex-col w-full gap-3 items-center justify-start my-6 md:px-8 px-2">
        {products.map((product)=>(
        //   <Link to={`/productDetail/${product._id}`} className="md:w-1/4 w-full">
        // <div key={product._id} className="flex flex-col   border border-emerald-600/20 border-solid bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-150">
        //   <div className="relative h-40 overflow-hidden group">
        //     <img
        //       src={product?.images[0]}
        //       alt="idea-thumbnail"
        //       className="w-full h-full object-cover group-hover:blur-sm transition-all duration-500"
        //     />
        //     <div className="items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden group-hover:flex transition-all duration-300 gap-x-4">
        //       <a className="text-emerald-600 dark:text-slate-700 focus:text-red-600 dark:focus:text-red-600 hover:text-red-600 text-4xl">
        //       <CiHeart />
        //       </a>
        //       <a className="action-btn rounded-full hover:text-white text-emerald-600 ms-1 text-2xl hover:bg-emerald-600 transition-all duration-200 p-1">
        //       <IoSaveOutline />
        //       </a>
        //       <a className="action-btn rounded-full hover:text-white  border-emerald-600/10 text-emerald-600 ms-1 text-3xl hover:bg-emerald-600 transition-all duration-200 p-1">
        //       <MdArrowOutward />
        //       </a>
        //       </div>
        //   </div>
        //   <div className="flex flex-col gap-y-1 p-3">
        //     <h3 className="text-xl font-semibold">{product?.title}</h3>
        //     <span className="text-[14px] font-semibold underline decoration-emerald-600">{product?.user?.username}</span>
        //     <p className="text-[#94a3b8] text-[15px]">
        //       {product?.description?.substring(0,100)+"..."}
        //     </p>
        //     <div className="flex flex-wrap gap-2 items-center *:cursor-pointer">
        //       {/* <a >
        //       <span className="bg-orange-500/5 hover:bg-orange-500/20 inline-block text-orange-500 px-4 text-[14px] font-medium rounded-full mt-2 me-1 transition-all duration-500">
        //         Full Time
        //       </span>
        //       </a> */}
              
        //       <a>
        //       <span className="bg-purple-600/5 hover:bg-purple-600/20 inline-block text-purple-600 px-4 text-[14px] font-medium rounded-full mt-2 me-1 transition-all duration-500">{"min: $"+product?.pricing?.minPrice}</span>
        //       </a>
        //       <a>
        //       <span className="bg-purple-600/5 hover:bg-purple-600/20 inline-block text-purple-600 px-4 text-[14px] font-medium rounded-full mt-2 me-1 transition-all duration-500">{"avg: $"+product?.pricing?.avgPrice}</span>
        //       </a>
        //       <a>
        //       <span className="bg-purple-600/5 hover:bg-purple-600/20 inline-block text-purple-600 px-4 text-[14px] font-medium rounded-full mt-2 me-1 transition-all duration-500">{"max: $"+product?.pricing?.maxPrice}</span>
        //       </a>
        //       {/* <a>
        //       <span className="bg-emerald-600/5 hover:bg-emerald-600/20 inline-flex items-center text-emerald-600 px-4 text-[14px] font-medium rounded-full mt-2 transition-all duration-500">
        //       <div>
        //       <CiLocationOn />
        //       </div>
        //        USA</span>
        //       </a> */}
        //     </div>
        //   </div>
        // </div>
        //   </Link>
        <ProductCard linkUrl={product._id} thumbnailSrc={product?.images[0]} title={product?.title} username={product?.user?.username} description={product?.description} minPrice={product?.pricing?.minPrice} avgPrice={product?.pricing?.avgPrice} maxPrice={product?.pricing?.maxPrice}/>
        ))}
      </div>
    </div>
  );
};

export default IdeasListing;
