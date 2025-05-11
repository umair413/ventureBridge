import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../header/header.css";
import jobstackFav from "../../assets/jobstack-fav.png";
import jobstackFullLogo from "../../assets/full-logo.png";
import fullLogoWhite from "../../assets/full-logo-white.png";
import vbAbstract from "../../assets/VB-abstract.svg";
import useDeviceWidth from "../../hooks/useDeviceWidth";
import { Avatar, Button, Menu, MenuItem, Text } from "@mantine/core";
import Cookies from 'js-cookie'
import axios from "axios";
import { CONFIG } from "../../../config";
import { useLoginStatus } from "../../contexts/LoginStatusContext";
import { useUserDetails } from "../../contexts/UserDetailContext";
import { toast } from "react-toastify";
import axiosInstance from "../../../axiosInstance";

const Header = () => {
  const [userDropdown, setUserDropdown] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(false);
  const [dropdownId, setDropdownId] = useState("");
  const [windowScroll, setWindowScroll] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const location = useLocation();
  const width = useDeviceWidth();
  const [isHomeRoute, setIsHomeRoute] = useState(false);
  const [role, setRole] = useState('')
  const {status} = useLoginStatus();
  const {details, setUserDetails} = useUserDetails();
  const navigate = useNavigate()
  useEffect(() => {
    setRole(details?.role)
    if (location.pathname === "/") {
      setIsHomeRoute(true);
    } else {
      setIsHomeRoute(false);
    }
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setWindowScroll(true);
      } else {
        setWindowScroll(false);
      }
    };

    if (width > 768) {
      setIsDesktop(true);
    } else {
      setIsDesktop(false);
    }

    // setRole(localStorage.getItem('role'))

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [width, location.pathname, role]);
  const handleuserDropdown = () => {
    setUserDropdown(!userDropdown);
  };
  const handleMobileDropdown = () => {
    setMobileDropdown(!mobileDropdown);
  };
  const toggleDropdownById = (id) => {
    if (dropdownId === "") {
      setDropdownId(id);
    } else {
      setDropdownId("");
    }
  };
  const updateUserRole = async(role)=>{
    try {
      const {data} = await axiosInstance.post(CONFIG.updateUserRole,{role});
      if(data.success){
        localStorage.setItem('userDetails',JSON.stringify(data?.data))
        setUserDetails(data?.data)
        setRole(data?.data?.role)
        toast.success(data.message)
      }
      setRole(Cookies.get('role'))
    } catch (error) {
      console.log(error)
    }
  }
  const logoutHandler = async()=>{
    try {
      const {data} = await axiosInstance.post(CONFIG.logoutUser,{withCredentials:true})
      if(data.success){
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userDetails')
        setUserDetails(null)
        toast.success(data.message)
        navigate('/login')
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div
      className={`w-full shadow fixed top-0 mx-auto z-10 transition-all duration-200 bg-white ${
        !windowScroll && isDesktop ? "bg-opacity-0 shadow-none" : "bg-white"
      }`}
    >
      <div
        className={`flex justify-between items-center p-2 container mx-auto md:min-h-[74px] ${
          mobileDropdown ? "shadow" : ""
        }`}
      >
        <div>
          <Link to={"/"}>
            <img src={vbAbstract} alt="main-logo" className="md:hidden w-8" />
            {isHomeRoute ? (
              <img
                src={vbAbstract}
                alt="full-main-logo"
                className="max-md:hidden w-16"
              />
            ) : !isHomeRoute && !windowScroll ? (
              <img
                src={vbAbstract}
                alt="white-main-logo"
                className="max-md:hidden w-16"
              />
            ) : !isHomeRoute && windowScroll ? (
              <img
                src={vbAbstract}
                alt="full-main-logo"
                className="max-md:hidden w-16"
              />
            ) : (
              <></>
            )}
          </Link>
        </div>
        <div className="flex items-center gap-x-3 ">
          <ul className="flex items-center gap-x-2 max-[992px]:hidden">
            <li className="relative cursor-pointer dropdown-item block">
              <div
                className={`flex items-center gap-x-1 ${
                  !windowScroll && !isHomeRoute ? "text-white" : ""
                }`}
              >
                <span>Quick Links</span>
                <i className="fa-solid fa-chevron-down"></i>
              </div>
              <ul
                className={`dropdown-menu absolute top-[60px] shadow bg-white rounded flex flex-col items-center min-w-[180px] transition-all duration-200 opacity-0 invisible`}
              >
                <li className="px-4 py-2 w-full border-b border-solid border-neutral-200">
                  Contact Us
                </li>
                <li className="px-4 py-2 w-full border-b border-solid border-neutral-200">
                  Privacy Policy
                </li>
                <li className="px-4 py-2 w-full border-b border-solid border-neutral-200">
                  About Us
                </li>
              </ul>
            </li>
          </ul>
          <div className="relative outline outline-[.2px] outline-neutral-200 py-1 px-3 rounded-3xl ">
            <input
              type="text"
              placeholder="Search..."
              className={`border-none outline-none text-sm bg-transparent w-36 ${
                !windowScroll && !isHomeRoute ? "bg-transparent" : ""
              }`}
            />
            <div className="absolute top-1 right-2">
              <i
                className={`fa-solid fa-magnifying-glass ${
                  !windowScroll && !isHomeRoute ? "text-white" : ""
                }`}
              ></i>
            </div>
          </div>
          <div className="relative">
            <Menu width={180}>
              <Menu.Target>
                <Avatar color="white" src={details ? details.avatar : ""} bg={"#059669"} radius={"xl"}>
                  
                </Avatar>
              </Menu.Target>
              <Menu.Dropdown width={180}>
                {status ? <>
                  <Menu.Item>
                  <Link to={`/profile/${role}`}>
                  <div className="flex gap-2">
                    <Avatar color="white" src={details ? details.avatar : ""} bg={"#059669"} radius={"xl"}>
                      
                    </Avatar>
                    <div className="flex flex-col">
                      <Text size="sm">{details?.username}</Text>
                      <Text size="xs" c="dimmed">{details?.role}</Text>
                    </div>
                  </div>
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  
                  <div className="bg-emerald-600 text-white py-1 px-4 rounded-md font-medium text-center" onClick={()=>updateUserRole(role==='investor'?'entrepreneur':'investor')}>Switch to {role==='investor'?'entrepreneur':'investor'}</div>
                  
                  </Menu.Item>
                </>:
                <div className="flex flex-col items-center gap-4 w-full p-2">
                <Link className="bg-[#059669] w-full text-center font-medium px-4 py-1 rounded-md text-white" to={'/signup'}>
                Sign Up
                </Link>
                <Link className="border-[#059669] text-[#059669] border-2 w-full text-center font-medium px-4 py-1 rounded-md" to={'/login'}>
                Login
                </Link>
                </div>
                }
               
                <Menu.Label>Quick Options</Menu.Label>
                <Menu.Item>Settings</Menu.Item>
                <Menu.Item>Inbox</Menu.Item>
                <Menu.Item>Analytics</Menu.Item>
                <Menu.Divider></Menu.Divider>
                {status ? <MenuItem>
                <div className="bg-emerald-600 text-white py-1 px-4 rounded-md font-medium text-center" onClick={logoutHandler}>
                  Logout
                </div>
                </MenuItem>:<></>}
              </Menu.Dropdown>
            </Menu>
          </div>

          <div onClick={handleMobileDropdown} className="mobile-dropdown">
            <i className="fa-solid fa-bars text-lg"></i>
          </div>
        </div>
      </div>

      <ul
        className={`flex flex-col w-full overflow-hidden max-h-0 transition-all duration-200 ${
          mobileDropdown ? "max-h-[20rem]" : ""
        }`}
      >
        <li
          className={`flex justify-between items-center py-3 px-5 ${
            dropdownId === "sub-1" ? "text-green-500" : ""
          }`}
          onClick={() => toggleDropdownById("sub-1")}
        >
          <span>Dropdown 1</span>
          <div>
            <i className="fa-solid fa-chevron-down"></i>
          </div>
        </li>
        <ul
          className={`max-h-0 ${
            dropdownId === "sub-1" ? "max-h-[10rem]" : ""
          } flex flex-col w-full overflow-hidden transition-all duration-200 ps-5`}
        >
          <li className="py-2 px-3">Sub Dropdown 1</li>
          <li className="py-2 px-3">Sub Dropdown 2</li>
          <li className="py-2 px-3">Sub Dropdown 3</li>
        </ul>
        <li
          className={`flex justify-between items-center py-3 px-5 ${
            dropdownId === "sub-2" ? "text-green-500" : ""
          }`}
          onClick={() => toggleDropdownById("sub-2")}
        >
          <span>Dropdown 2</span>
          <div>
            <i className="fa-solid fa-chevron-down"></i>
          </div>
        </li>
        <ul
          className={`max-h-0 ${
            dropdownId === "sub-2" ? "max-h-[10rem]" : ""
          } flex flex-col w-full overflow-hidden transition-all duration-200 ps-5`}
        >
          <li className="py-2 px-3">Sub Dropdown 1</li>
          <li className="py-2 px-3">Sub Dropdown 2</li>
          <li className="py-2 px-3">Sub Dropdown 3</li>
        </ul>
        <li
          className={`flex justify-between items-center py-3 px-5 ${
            dropdownId === "sub-3" ? "text-green-500" : ""
          }`}
          onClick={() => toggleDropdownById("sub-3")}
        >
          <span>Dropdown 3</span>
          <div>
            <i className="fa-solid fa-chevron-down"></i>
          </div>
        </li>
        <ul
          className={`max-h-0 ${
            dropdownId === "sub-3" ? "max-h-[10rem]" : ""
          } flex flex-col w-full overflow-hidden transition-all duration-200 ps-5`}
        >
          <li className="py-2 px-3">Sub Dropdown 1</li>
          <li className="py-2 px-3">Sub Dropdown 2</li>
          <li className="py-2 px-3">Sub Dropdown 3</li>
        </ul>
      </ul>
    </div>
  );
};

export default Header;
