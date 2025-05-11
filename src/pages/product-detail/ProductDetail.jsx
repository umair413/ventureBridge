import React, { useEffect, useState } from 'react'
import '../product-detail/productdetail.css'
import { Carousel } from '@mantine/carousel';
import { LuUserRoundCheck } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";
import { PiOfficeChair } from "react-icons/pi";
import { MdOutlineWorkHistory } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { CiMoneyBill } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { IoArrowRedoSharp } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { IoSaveOutline } from "react-icons/io5";
import { MdArrowOutward } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CONFIG } from '../../../config';
import { useUserDetails } from '../../contexts/UserDetailContext';
import { useReceiverChat } from '../../contexts/ReceiverChatContext';
import { toast } from 'react-toastify';
import axiosInstance from '../../../axiosInstance';
import { useLoading } from '../../contexts/LoadingContext';
import Loading from '../../components/loader/Loading';
const ProductDetail = () => {
  const params = useParams();
  const [productId, setProductId] = useState('');
  const [productDetail, setProductDetail] = useState({});
  const [conversation, setConversation] = useState({});
  const [productSaved, setProductSaved] = useState(false);
  const navigate = useNavigate();
  const {details} = useUserDetails();
  const {setRecDetails} = useReceiverChat()
  const {loading, setLoadingState} = useLoading()
  useEffect(() => {
    if (params.id) {
      setProductId(params.id);
    }
  }, [params.id]);
  useEffect(() => {
    if (!productId) return;
    fetchProductDetails();
    viewProductHandler();
    if (details?.savedProducts?.includes(productId)) {
      setProductSaved(true);
    }
  }, [productId,conversation])
  const fetchProductDetails = async () => {
    try {
      setLoadingState(true)
      const { data } = await axiosInstance.post(CONFIG.getProductById, { productId });
      if(data.success){
        setProductDetail(data?.data)
        setLoadingState(false)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const viewProductHandler = async()=>{
    try {
      const {data} = await axiosInstance.post(CONFIG.viewProduct,{productId})

    } catch (error) {
      console.log(error)
    }
  }
  const onChatHandler = async()=>{
    try {
      setLoadingState(true)
      const {data} = await axiosInstance.post(CONFIG.getSingleConversation,{receiverId:productDetail?.user})
      if(data.success){
        setConversation(data?.data);
        
          setRecDetails(data?.data?.receiverField)
      
        navigate(`/inbox/${details._id}/chat/${data.data._id}`)
        setLoadingState(false)
      }
    } catch (error) {
      console.log(error)
      setLoadingState(false)
    }
  }
  const addToSaveHandler = async()=> {
    try {
      const {data} = await axiosInstance.post(CONFIG.addToSaveProduct,{productId})
      if(data.success){
        toast.success(data.message)
        localStorage.setItem('userDetails', JSON.stringify(data.data));
        setProductSaved(true)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const removeFromSaveProduct = async()=>{
    try {
      const {data} = await axiosInstance.post(CONFIG.removeFromSaveProduct,{productId})
      if(data.success){
        toast.success(data.message)
        localStorage.setItem('userDetails', JSON.stringify(data.data));
        setProductSaved(false)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const relatedCardData = [1, 2, 3];
  if(loading) return <Loading/>
  return (
    <div className='mb-10'>
      {/* hero section */}
      <div className='relative w-full bg-front py-36 rounded-b-[20px] md:rounded-b-[80px] overflow-hidden'>
        <div className='absolute inset-0 bg-emerald-900/90'></div>
        <div className='text-center text-white text-4xl relative font-semibold'>Idea Detail</div>
        <div className='absolute left-1/2 -translate-x-1/2 bottom-0 flex items-center justify-center gap-2 font-medium text-white/50 max-md:text-xs text-nowrap mb-2'>
          <span>Jobstack</span> &lt; <span>Ideas</span> &lt; <span className='text-white'>Idea Detail</span>
        </div>
      </div>
      {/* body container */}
      <div className='container'>
        <div className='flex max-md:flex-col items-start mt-10 gap-4'>
          {/* sidebar */}
          <div className='flex flex-col md:sticky top-20 rounded-md shadow bg-white w-full md:w-[70%]'>
            <div className='p-6'>
              <h1 className='text-lg font-semibold'>Idea Information</h1>
            </div>
            <div className='p-6 border-t border-slate-100'>
              <ul className='flex flex-col gap-3'>
                <li className='flex items-center gap-3'>
                  <div className='text-[20px]'><LuUserRoundCheck /></div>
                  <div className="flex flex-col font-medium">
                    <h4 className='text-[15px]'>Employee Type</h4>
                    <span className='text-sm text-emerald-600'>Full time</span>
                  </div>
                </li>
                <li className='flex items-center gap-3'>
                  <div className='text-[20px]'><IoLocationOutline /></div>
                  <div className="flex flex-col font-medium">
                    <h4 className='text-[15px]'>Location</h4>
                    <span className='text-sm text-emerald-600'>Berlin</span>
                  </div>
                </li>
                <li className='flex items-center gap-3'>
                  <div className='text-[20px]'><PiOfficeChair /></div>
                  <div className="flex flex-col font-medium">
                    <h4 className='text-[15px]'>Job Type</h4>
                    <span className='text-sm text-emerald-600'>Developer/Engineer</span>
                  </div>
                </li>
                <li className='flex items-center gap-3'>
                  <div className='text-[20px]'><MdOutlineWorkHistory /></div>
                  <div className="flex flex-col font-medium">
                    <h4 className='text-[15px]'>Experience</h4>
                    <span className='text-sm text-emerald-600'>5-8 Years</span>
                  </div>
                </li>
                <li className='flex items-center gap-3'>
                  <div className='text-[20px]'><PiStudent /></div>
                  <div className="flex flex-col font-medium">
                    <h4 className='text-[15px]'>Qualifcations</h4>
                    <span className='text-sm text-emerald-600'>MCA</span>
                  </div>
                </li>
                <li className='flex items-center gap-3'>
                  <div className='text-[20px]'><CiMoneyBill /></div>
                  <div className="flex flex-col font-medium">
                    <h4 className='text-[15px]'>Salary</h4>
                    <span className='text-sm text-emerald-600'>$500-$4k</span>
                  </div>
                </li>
                <li className='flex items-center gap-3'>
                  <div className='text-[20px]'><CiCalendarDate /></div>
                  <div className="flex flex-col font-medium">
                    <h4 className='text-[15px]'>Date Posted</h4>
                    <span className='text-sm text-emerald-600'>28 Feb 2025</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          {/* content */}
          {/* <div>
            <h5 className='text-[17px] font-semibold'>Idea Description</h5>
            <p className='text-slate-400 mt-4'>One disadvantage of Lorum Ipsum is that in Latin certain letters appear more frequently than others - which creates a distinct visual impression. Moreover, in Latin only words at the beginning of sentences are capitalized.</p>
            <p className='text-slate-400 mt-4'>
              This means that Lorem Ipsum cannot accurately represent, for example, German, in which all nouns are capitalized. Thus, Lorem Ipsum has only limited suitability as a visual filler for German texts. If the fill text is intended to illustrate the characteristics of different typefaces.
            </p>
            <p className='text-slate-400 mt-4'>
              It sometimes makes sense to select texts containing the various letters and symbols specific to the output language.
            </p>
            <h5 className='text-[17px] font-semibold mt-4'>Features</h5>
            <p className='text-slate-400 mt-4'>
              It sometimes makes sense to select texts containing the various letters and symbols specific to the output language.
            </p>
            <ul className='flex flex-col'>
              <li className='text-slate-400 mt-2 inline-flex items-center gap-2'>
                <div className='text-emerald-600'>
                  <IoArrowRedoSharp />
                </div>
                Participate in requirements analysis
              </li>
              <li className='text-slate-400 mt-2 inline-flex items-center gap-2'>
                <div className='text-emerald-600'>
                  <IoArrowRedoSharp />
                </div>
                Write clean, scalable code using C# and .NET frameworks
              </li>
              <li className='text-slate-400 mt-2 inline-flex items-center gap-2'>
                <div className='text-emerald-600'>
                  <IoArrowRedoSharp />
                </div>
                Test and deploy applications and systems
              </li>
              <li className='text-slate-400 mt-2 inline-flex items-center gap-2'>
                <div className='text-emerald-600'>
                  <IoArrowRedoSharp />
                </div>
                Revise, update, refactor and debug code
              </li>
              <li className='text-slate-400 mt-2 inline-flex items-center gap-2'>
                <div className='text-emerald-600'>
                  <IoArrowRedoSharp />
                </div>
                Participate in requirements analysis
              </li>
              <li className='text-slate-400 mt-2 inline-flex items-center gap-2'>
                <div className='text-emerald-600'>
                  <IoArrowRedoSharp />
                </div>
                Develop documentation throughout the software development life cycle (SDLC)
              </li>
            </ul>
            <h5 className='text-[17px] font-semibold mt-4'>Requirements</h5>
            <p className='text-slate-400 mt-4'>
              It sometimes makes sense to select texts containing the various letters and symbols specific to the output language.
            </p>
            <ul className='flex flex-col'>
              <li className='text-slate-400 mt-2 inline-flex items-center gap-2'>
                <div className='text-emerald-600'>
                  <IoArrowRedoSharp />
                </div>
                Proven experience as a .NET Developer or Application Developer
              </li>
              <li className='text-slate-400 mt-2 inline-flex items-center gap-2'>
                <div className='text-emerald-600'>
                  <IoArrowRedoSharp />
                </div>
                good understanding of SQL and Relational Databases, specifically Microsoft SQL Server.
              </li>
              <li className='text-slate-400 mt-2 inline-flex items-center gap-2'>
                <div className='text-emerald-600'>
                  <IoArrowRedoSharp />
                </div>
                Experience designing, developing and creating RESTful web services and APIs
              </li>
              <li className='text-slate-400 mt-2 inline-flex items-center gap-2'>
                <div className='text-emerald-600'>
                  <IoArrowRedoSharp />
                </div>
                Basic know how of Agile process and practices
              </li>
              <li className='text-slate-400 mt-2 inline-flex items-center gap-2'>
                <div className='text-emerald-600'>
                  <IoArrowRedoSharp />
                </div>
                Good understanding of object-oriented programming.
              </li>
              <li className='text-slate-400 mt-2 inline-flex items-center gap-2'>
                <div className='text-emerald-600'>
                  <IoArrowRedoSharp />
                </div>
                Good understanding of concurrent programming.
              </li>
            </ul>
            <button className='bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold px-4 py-2 mt-5 transition-all duration-150'>Apply Now</button>
          </div> */}
          <div className="flex flex-col">
          <Carousel withIndicators height={200}>
            {productDetail?.images?.map((item,index)=>(
              <Carousel.Slide>
                <img src={item} alt="" className='w-full'/>
              </Carousel.Slide>
            ))}
      
      
    </Carousel>
            <p dangerouslySetInnerHTML={{ __html: productDetail?.description }}></p>
            {productDetail?.files?.map((file,index)=>(
              <a
              key={index}
              href={file}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'blue', textDecoration: 'underline' }}
            >
              <button className='bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold px-4 py-2 mt-5 transition-all duration-150'>
              Download File
              </button>
            </a>
            ))}
            
            
            <button onClick={onChatHandler} className='bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold px-4 py-2 mt-5 transition-all duration-150'>Apply Now</button>
            {productSaved ? 
          <button onClick={removeFromSaveProduct} className='bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold px-4 py-2 mt-5 transition-all duration-150'>Remove from Saved Ideas</button>
            : 
            <button onClick={addToSaveHandler} className='bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold px-4 py-2 mt-5 transition-all duration-150'>Add to Save Ideas</button>
              
          }
            
          </div>
        </div>
        {/* related ideas */}
        <div className='text-center mt-10'>
          <h3 className='mb-4 text-[26px] font-semibold'>Related Ideas</h3>
          <p className='text-slate-400 max-w-xl mx-auto'>Search all the open positions on the web. Get your own personalized salary estimate. Read reviews on over 30000+ companies worldwide.</p>
        </div>
        <div className='flex md:flex-wrap max-md:flex-col w-full mt-6 gap-6 items-center justify-center'>
          {relatedCardData.map((index) => (
            <div key={index} className="flex flex-col md:w-1/4 w-full  border border-emerald-600/20 border-solid bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-150">
              <div className="relative h-40 overflow-hidden group ">
                <img
                  src="src\assets\ideas-listing\idea-thumbnail.jpg"
                  alt="idea-thumbnail"
                  className="w-full h-full object-cover group-hover:blur-sm transition-all duration-500"
                />
                <div className="items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden group-hover:flex transition-all duration-300 gap-x-4">
                  <a className="text-emerald-600 dark:text-slate-700 focus:text-red-600 dark:focus:text-red-600 hover:text-red-600 text-4xl">
                    <CiHeart />
                  </a>
                  <a className="action-btn rounded-full hover:text-white text-emerald-600 ms-1 text-2xl hover:bg-emerald-600 transition-all duration-200 p-1">
                    <IoSaveOutline />
                  </a>
                  <a className="action-btn rounded-full hover:text-white  border-emerald-600/10 text-emerald-600 ms-1 text-3xl hover:bg-emerald-600 transition-all duration-200 p-1">
                    <MdArrowOutward />
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-y-1 p-3">
                <h3 className="text-xl font-semibold">Mark Edward Travels</h3>
                <span className="text-[14px] font-semibold underline decoration-emerald-600">Mark Ed.</span>
                <p className="text-[#94a3b8] text-[15px]">
                  This Idea is Presented on the basis of travel data found from
                  Internet
                </p>
                <div className="flex flex-wrap gap-2 items-center *:cursor-pointer">
                  <a >
                    <span className="bg-orange-500/5 hover:bg-orange-500/20 inline-block text-orange-500 px-4 text-[14px] font-medium rounded-full mt-2 me-1 transition-all duration-500">
                      Full Time
                    </span>
                  </a>
                  <a>
                    <span className="bg-purple-600/5 hover:bg-purple-600/20 inline-block text-purple-600 px-4 text-[14px] font-medium rounded-full mt-2 me-1 transition-all duration-500">$4,000 - $4,500</span>
                  </a>
                  <a>
                    <span className="bg-emerald-600/5 hover:bg-emerald-600/20 inline-flex items-center text-emerald-600 px-4 text-[14px] font-medium rounded-full mt-2 transition-all duration-500">
                      <div>
                        <CiLocationOn />
                      </div>
                      USA</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail