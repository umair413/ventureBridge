import React, { useEffect, useState } from "react";
import "./signup.css";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoIosArrowRoundForward } from "react-icons/io";
import { FaUserTie } from "react-icons/fa6";
import { PiStudent } from "react-icons/pi";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import { CONFIG } from "../../../config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import vbAbstract from '../../assets/VB-abstract.svg'
import axiosInstance from "../../../axiosInstance";
import { useLoading } from "../../contexts/LoadingContext";
import Loading from "../../components/loader/Loading";
const SignUp = () => {
  const FILE_SIZE_LIMIT = 2 * 1024 * 1024;
const SUPPORTED_FORMATS = ["image/jpeg", "image/png"];
  const [formIndex, setFormIndex] = useState(0);
  const [roleValue, setRoleValue] = useState('investor')
  const navigate = useNavigate()
  const {loading,setLoadingState} = useLoading()
  let initialValues = {
    username: "",
     email: "",
      password: "",
       avatar: null
  }
  const handlePrevBtn = () => {
    setFormIndex((state) => state - 1);
  };
  const handleNextBtn = () => {
    setFormIndex((state) => state + 1);
  };
  const handleRoleValue = (value)=>{
    setRoleValue(value)
  }
  const handlePostSubmission = async (values, { resetForm, setSubmitting }) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value));
    formData.append("role", roleValue);

    try {
      setLoadingState(true)
      const { data } = await axiosInstance.post(CONFIG.registerUser, formData);
      toast(data?.message);
      resetForm();
      navigate("/login");
      setLoadingState(false)
    } catch (error) {
      toast(error?.response?.data?.error || "Signup failed");
      setLoadingState(false)
    } finally {
      setSubmitting(false);
      setLoadingState(false)
    }
  };
  const validationSchema = Yup.object({
    username: Yup.string()
      .required('*Username is required'),
    email: Yup.string()
      .email('*Invalid email address')
      .required('*Email is required'),
    password: Yup.string()
      .min(8, '*Password must be at least 8 characters long')
      .required('*Password is required'),
    avatar: Yup.mixed()
    .required("*A file is required")
    .test("fileSize", "*File size must be less than 2MB", (value) => {
      return value && value.size <= FILE_SIZE_LIMIT;
    })
    .test("fileType", "*Only JPEG or PNG files are allowed", (value) => {
      return value && SUPPORTED_FORMATS.includes(value.type);
    }),
  });
  if(loading) return <Loading/>
  return (
    <div className="w-screen  flex max-md:flex-col-reverse max-md:gap-4 max-md:p-4 items-center justify-center">
      <div className=" flex flex-col items-center gap-4 w-full md:max-w-[480px] md:p-[60px]">
        <div>
          <img src={vbAbstract} className="w-24" />
        </div>
        <div className="text-center font-[Lato]">
          <h2 className="text-2xl font-bold mb-2">
            Get more things done with Login platform.
          </h2>
          <p className="text-lg">
            Access to the most powerfull tool in the entire design and web
            industry.
          </p>
        </div>
        <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handlePostSubmission}>
           {({ isSubmitting, setFieldValue, values, resetForm }) => (
        <Form className="w-full">
        <div className="flex flex-col">
          <div className={`flex flex-col gap-2 w-full ${formIndex === 1 ? "hidden" : ""}`}>
          <Field
            type="text"
            name="username"
            placeholder="Username"
            className="input-field"
          />
           <ErrorMessage name="username" component="div" className="text-sm text-red-600"/>
          <Field
            type="email"
            name="email"
            placeholder="Email Address"
            className="input-field"
          />
          <ErrorMessage name="email" component="div" className="text-sm text-red-600"/>
          <Field
            type="password"
            name="password"
            placeholder="Password"
            className="input-field"
          />
           <ErrorMessage name="password" component="div" className="text-sm text-red-600"/>
          </div>
          <div className={`flex flex-col ${formIndex === 0 ? "hidden" : ""}`}>
            <h4 className="text-lg font-semibold text-center mb-2">Choose Your Role</h4>
            <div className="flex w-full gap-3 mb-2">
              <div className={`w-1/2 h-[174px] bg-[#F7F7F7] text-6xl flex items-center justify-center transition-all duration-150 rounded-xl ${roleValue==='investor'?'border-[6px] border-emerald-600':''}`} onClick={()=>handleRoleValue('investor')}>
                <FaUserTie />
              </div>
              <div className={`w-1/2 h-[174px] bg-[#F7F7F7] text-6xl flex items-center justify-center transition-all duration-150 rounded-xl ${roleValue==='entrepreneur'?'border-[6px] border-emerald-600':''}`}
              onClick={()=>handleRoleValue('entrepreneur')}>
                <PiStudent />
              </div>
            </div>
            <div className="mb-2">
              <h4 className="text-lg font-semibold text-center mb-2">Upload Avatar</h4>
              <div className="relative w-full h-12 bg-white text-emerald-600 rounded-md flex items-center justify-center border-[2px] border-emerald-600">
              <div className="text-center text-lg font-medium">{values?.avatar ? values?.avatar?.name?.substring(0,24)+"..." : 'Choose File'}</div>
              <input name="avatar" type="file" className="absolute w-full left-0 top-0 opacity-0 h-12" onChange={(event) => {
                setFieldValue("avatar", event.currentTarget.files[0]);
              }}/>
              </div>
              <ErrorMessage name="avatar" component="div" className="text-red-500" />
            </div>
          </div>
          <div
            className={`flex w-full gap-2 font-[Lato] ${
              formIndex === 0 ? "hidden" : ""
            }`}
          >
            <button type="submit" disabled={isSubmitting} className="w-1/2 bg-emerald-600 text-white rounded-md py-[6px] px-[28px] font-semibold">
              Register
            </button>
            <button className="w-1/2 border border-emerald-600 text-emerald-600 rounded-md py-[6px] px-[28px] font-semibold">
              Login
            </button>
          </div>
        </div>
        </Form>
        )}
        </Formik>
        <div className="flex self-end gap-2">
          <button
            disabled={formIndex === 0}
            onClick={handlePrevBtn}
            className={`text-4xl bg-[#F7F7F7] text-emerald-600 border rounded-s-full p-2 transition-all duration-150 ${
              formIndex === 0 ? "text-slate-400" : ""
            }`}
          >
            <IoIosArrowRoundBack />
          </button>
          <button
            onClick={handleNextBtn}
            disabled={formIndex === 1}
            className={`text-4xl bg-[#F7F7F7] text-emerald-600 border rounded-e-full p-2 transition-all duration-150 ${
              formIndex === 1 ? "text-slate-400" : ""
            }`}
          >
            <IoIosArrowRoundForward />
          </button>
        </div>
      </div>
      <div className=" md:p-[60px]">
        <img
          src="src\assets\graphic-signup.svg"
          alt="signup-graphic"
          className="md:max-w-[500px] w-full"
        />
      </div>
    </div>
  );
};

export default SignUp;
