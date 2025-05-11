import React, { useEffect } from "react";
import { FaMedkit } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdWorkHistory } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { FaHandsHoldingCircle } from "react-icons/fa6";
import { MdOutlineChevronRight } from "react-icons/md";
import { useState, useMemo } from "react";
import countryList from "react-select-country-list";
import { IconContext } from "react-icons";
import contactIdeas from '../../assets/home/contact-ideas.png'
import './home.css'
import axios from "axios";
import { CONFIG } from "../../../config";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/product-card/ProductCard";
import axiosInstance from "../../../axiosInstance";
const Home = () => {
  const [value, setValue] = useState("");
  const options = useMemo(() => countryList().getData(), []);
  const [categories, setCategories] = useState([])
  const [popularProducts, setPopularProducts] = useState([])
  const naviagte = useNavigate()
  const countries = options.flat();
  const changeHandler = (value) => {
    setValue(value);
  };
  useEffect(()=>{
    getAllCategories()
    fetchPopularProducts()
  },[])
  const getAllCategories = async()=>{
    try {
      const {data} = await axiosInstance.get(CONFIG.getAllCategories)
      if(data.success){
        setCategories(data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const fetchPopularProducts = async()=>{
    try {
      const {data} = await axiosInstance.post(CONFIG.getPopularProducts)
      setPopularProducts(data?.data)
    } catch (error) {
      console.log(error)
    }
  }
  const handleCategorySelect = (categoryId)=>{
    naviagte(`ideasListing/${categoryId}`)
  }
  return (
    <div>
      {/* hero section */}
      <section className="w-full relative bg-[#0596690d] py-20 px-4">
        <div className="md:max-w-[500px] xl:max-w-[768px] mx-auto flex flex-col justify-center items-center gap-4 text-center">
          <h4 className="lg:leading-normal leading-normal text-4xl lg:text-5xl mb-5 font-bold">
            Join us &{" "}
            <span className="text-emerald-600 font-bold">
              Explore Thousands
            </span>{" "}
            of Ideas
          </h4>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Find Jobs, Employment &amp; Career Opportunities. Some of the
            companies we've helped recruit excellent applicants over the years.
          </p>
          <div className="w-full flex max-xl:flex-col items-center justify-center gap-y-2 bg-white rounded-lg shadow p-2 ">
            <div className="relative w-full ">
              <input
                type="text"
                placeholder="Search Your Keywords"
                className="w-full h-[60px] text-[15px] rounded-md ps-10 pe-2 outline-none bg-gray-50"
              />
              <div className="absolute top-[20px] left-2">
                <IconContext.Provider
                  value={{ color: "#059669", size: "20px" }}
                >
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
                <IconContext.Provider
                  value={{ color: "#059669", size: "20px" }}
                >
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
                <IconContext.Provider
                  value={{ color: "#059669", size: "20px" }}
                >
                  <MdWorkHistory />
                </IconContext.Provider>
              </div>
            </div>
            <button className="bg-emerald-600 w-full rounded-md py-4 text-center text-white">
              Submit
            </button>
          </div>
          <div className="mt-4">
            <span className="text-slate-400">
              <span className="text-black">Popular Searches :</span> Designer,
              Developer, Web, IOS, PHP Senior Engineer
            </span>
          </div>
        </div>
      </section>
      {/* popular categories section */}
      <section className="w-full py-16 px-2">
        <div className="container flex flex-col gap-y-6 items-center text-center">
          <div className="flex flex-col">
            <h3 className="text-2xl mb-4 font-semibold">Popular Categories</h3>
            <p className="text-slate-400 max-w-xl">
              Search all the open positions on the web. Get your own
              personalized salary estimate. Read reviews on over 30000+
              companies worldwide..
            </p>
          </div>
          <div className="flex justify-center max-md:flex-col md:flex-wrap gap-4 w-full md:*:w-[30vh]">
            {categories.map((category)=>(
              <div id={category._id} key={category._id} className="cursor-pointer flex flex-col gap-y-2 items-center justify-center py-10 px-3 bg-white hover:bg-emerald-600/5 rounded-md text-center shadow group transition duration-200" onClick={()=>handleCategorySelect(category._id)}>
              <div className="size-16 bg-emerald-600/5 text-emerald-600 rounded-md text-2xl flex align-middle justify-center items-center shadow-sm  mx-auto">
                <img src={category?.categoryIcon} alt={category?.title} />
              </div>
              <span className="text-[17px] font-semibold">
                {category?.title}
              </span>
              <span className="text-slate-400 mt-3">{category?.productCount} ideas</span>
            </div>
            ))}
          </div>
        </div>
      </section>
      {/* conatct hero page */}
      <section className="w-full py-16 px-2">
        <div className="container flex max-md:flex-col gap-2 items-center">
          <div className="w-full md:w-1/2">
            <img src={contactIdeas} alt="contact-ideas" />
          </div>
          <div className="flex flex-col items-start gap-y-4">
            <h3 className="mb-6 md:text-[26px] text-2xl md:leading-normal leading-normal font-semibold">
              Millions of ideas. <br /> Find the one that's right for you.
            </h3>
            <p className="text-slate-400 max-w-xl">
              Search all the open positions on the web. Get your own
              personalized salary estimate. Read reviews on over 30000+
              companies worldwide.
            </p>
            <ul className="flex flex-col items-start gap-y-1">
              <li className="flex items-center gap-x-2">
                <div className="text-emerald-600 border border-solid border-emerald-600 p-[2px] rounded-full">
                  <TiTick />
                </div>
                <span className="text-slate-400">
                  Digital Marketing Solutions for Tomorrow
                </span>
              </li>
              <li className="flex items-center gap-x-2">
                <div className="text-emerald-600 border border-solid border-emerald-600 p-[2px] rounded-full">
                  <TiTick />
                </div>
                <span className="text-slate-400">
                  {" "}
                  Our Talented & Experienced Marketing Agency
                </span>
              </li>
              <li className="flex items-center gap-x-2">
                <div className="text-emerald-600 border border-solid border-emerald-600 p-[2px] rounded-full">
                  <TiTick />
                </div>
                <span className="text-slate-400">
                  {" "}
                  Create your own skin to match your brand
                </span>
              </li>
            </ul>
            <button className="flex items-center gap-x-2 bg-emerald-600 text-white text-sm font-medium rounded-md py-2 px-4">
              <div>
                <FaHandsHoldingCircle />
              </div>
              <span>Contact us</span>
            </button>
          </div>
        </div>
      </section>
      {/* popular ideas */}
      <section className="w-full py-16 px-2">
        <div className=" flex flex-col gap-y-6 items-center text-center">
          <div className="flex flex-col">
            <h3 className="text-2xl mb-4 font-semibold">Popular Ideas</h3>
            <p className="text-slate-400 max-w-xl">
              Search all the open positions on the web. Get your own
              personalized salary estimate. Read reviews on over 30000+
              companies worldwide.
            </p>
          </div>
          {/* <div className="flex justify-center md:justify-start max-md:flex-col md:flex-wrap gap-4 md:gap-6 w-full">
            <div className="flex flex-col md:w-[25vw] overflow-hidden rounded-md shadow gap-y-4">
              <div className="w-full h-[150px] overflow-hidden">
                <img
                  src="src\assets\home\mobile-repair-idea.png"
                  alt=""
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="flex flex-col items-start gap-y-2 px-4 py-2">
                <h3 className="text-[15px] font-semibold">Mobile Repair Business Idea</h3>
                <span className="text-xs font-medium uppercase text-slate-400">
                  Starting from: <span className="text-sm font-semibold text-black"> $150000</span>
                </span>
                <button className="flex items-center gap-x-2 bg-emerald-600 text-white text-xs font-medium rounded-md py-2 px-4">
                  <span>See Details</span>
                  <div className="text-base">
                  <MdOutlineChevronRight />
                  </div>
                </button>
              </div>
            </div>
            <div className="flex flex-col md:w-[25vw] overflow-hidden rounded-md shadow gap-y-4">
              <div className="w-full h-[150px] overflow-hidden">
                <img
                  src="src\assets\home\food-delivery-idea.jpg"
                  alt=""
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="flex flex-col items-start gap-y-2 px-4 py-2">
                <h3 className="text-[15px] font-semibold">Food Delivery Business Idea</h3>
                <span className="text-xs font-medium uppercase text-slate-400">
                  Starting from: <span className="text-sm font-semibold text-black"> $250000</span>
                </span>
                <button className="flex items-center gap-x-2 bg-emerald-600 text-white text-xs font-medium rounded-md py-2 px-4">
                  <span>See Details</span>
                  <div className="text-base">
                  <MdOutlineChevronRight />
                  </div>
                </button>
              </div>
            </div>
            <div className="flex flex-col md:w-[25vw] overflow-hidden rounded-md shadow gap-y-4">
              <div className="w-full h-[150px] overflow-hidden">
                <img
                  src="src\assets\home\construction-idea.jpg"
                  alt=""
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="flex flex-col items-start gap-y-2 px-4 py-2">
                <h3 className="text-[15px] font-semibold">Construction Business Idea</h3>
                <span className="text-xs font-medium uppercase text-slate-400">
                  Starting from: <span className="text-sm font-semibold text-black"> $650000</span>
                </span>
                <button className="flex items-center gap-x-2 bg-emerald-600 text-white text-xs font-medium rounded-md py-2 px-4">
                  <span>See Details</span>
                  <div className="text-base">
                  <MdOutlineChevronRight />
                  </div>
                </button>
              </div>
            </div>
            <div className="flex flex-col md:w-[25vw] overflow-hidden rounded-md shadow gap-y-4">
              <div className="w-full h-[150px] overflow-hidden">
                <img
                  src="src\assets\home\busniness-analyst-idea.jpg"
                  alt=""
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="flex flex-col items-start gap-y-2 px-4 py-2">
                <h3 className="text-[15px] font-semibold"> Business Analysis Idea</h3>
                <span className="text-xs font-medium uppercase text-slate-400">
                  Starting from: <span className="text-sm font-semibold text-black"> $1200</span>
                </span>
                <button className="flex items-center gap-x-2 bg-emerald-600 text-white text-xs font-medium rounded-md py-2 px-4">
                  <span>See Details</span>
                  <div className="text-base">
                  <MdOutlineChevronRight />
                  </div>
                </button>
              </div>
            </div>
            <div className="flex flex-col md:w-[25vw] overflow-hidden rounded-md shadow gap-y-4">
              <div className="w-full h-[150px] overflow-hidden">
                <img
                  src="src\assets\home\business-consultation-idea.jpg"
                  alt=""
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="flex flex-col items-start gap-y-2 px-4 py-2">
                <h3 className="text-[15px] font-semibold">Business Consultation Idea</h3>
                <span className="text-xs font-medium uppercase text-slate-400">
                  Starting from: <span className="text-sm font-semibold text-black"> $17000</span>
                </span>
                <button className="flex items-center gap-x-2 bg-emerald-600 text-white text-xs font-medium rounded-md py-2 px-4">
                  <span>See Details</span>
                  <div className="text-base">
                  <MdOutlineChevronRight />
                  </div>
                </button>
              </div>
            </div>
          </div> */}
          <div className="flex md:flex-wrap max-md:flex-col w-full gap-3 items-center my-6 md:px-8 px-2 justify-start">
            {popularProducts.map((product)=>(
              
              <ProductCard key={product._id} linkUrl={product._id} thumbnailSrc={product?.images[0]} title={product?.title} username={product?.user?.username} description={product?.description} minPrice={product?.pricing?.minPrice} avgPrice={product?.pricing?.avgPrice} maxPrice={product?.pricing?.maxPrice}/>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
