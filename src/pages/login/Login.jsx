import React from "react";
import './login.css'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { CONFIG } from "../../../config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useLoginStatus } from "../../contexts/LoginStatusContext";
import { useUserDetails } from "../../contexts/UserDetailContext";
import vbAbstract from '../../assets/VB-abstract.svg'
import loginGraphics from '../../assets/login-graphics.jpg'
import axiosInstance from "../../../axiosInstance";
import { useLoading } from "../../contexts/LoadingContext";
import { Loader } from "@mantine/core";
import Loading from "../../components/loader/Loading";
const Login = () => {
    const navigate = useNavigate()
    const {setLoginStatus} = useLoginStatus();
    const {setUserDetails} = useUserDetails();
    const {loading, setLoadingState} = useLoading()
    let initialValues = {
         email: "",
        password: "",
      }
      const validationSchema = Yup.object({
          email: Yup.string()
            .email('*Invalid email address')
            .required('*Email is required'),
          password: Yup.string()
            .min(8, '*Password must be at least 8 characters long')
            .required('*Password is required'),
        });
        const handlePostLogin = async(values, { resetForm, setSubmitting })=>{
            setLoadingState(true)
            try {
                const {data} = await axiosInstance.post(CONFIG.loginUser, values);
                if(data?.success){
                  setLoginStatus(true);
                  setUserDetails(data?.data?.user)
                  toast(data?.message);
                  localStorage.setItem('accessToken',data?.data?.accessToken)
                  localStorage.setItem('refreshToken',data?.data?.refreshToken)
                  localStorage.setItem('userDetails',JSON.stringify(data?.data?.user))
                  // Cookies.set('role',data?.data?.user?.role)
                  // Cookies.set('userDetails',JSON.stringify(data?.data?.user))
                  resetForm();
                  navigate("/");
                  setLoadingState(false)
                }
              } catch (error) {
                toast(error?.response?.data?.error);
                setLoadingState(false)
              } finally {
                setSubmitting(false);
                setLoadingState(false)
              }
        }
        if(loading) return <Loading/>
  return (
    <div className="w-screen  flex max-md:flex-col-reverse max-md:gap-4  items-center justify-center">
      <div className=" flex flex-col items-center gap-4 md:px-[10%] md:w-[50vw] max-md:p-4">
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
                onSubmit={handlePostLogin}>
                   {({ isSubmitting, setFieldValue, values, resetForm }) => (
                <Form className="w-full">
                <div className="flex flex-col">
                  <div className={`flex flex-col gap-2 w-full mb-4`}>
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
                  <div
                    className={`flex flex-col w-full gap-2 font-[Lato]`}
                  >
                    <button disabled={isSubmitting} type="submit"  className=" bg-emerald-600 text-white rounded-md py-[6px] px-[28px] font-semibold">
                      Login
                    </button>
                    <span className="text-slate-600">Dont have any Account?</span>
                    <button  className=" border border-emerald-600 text-emerald-600 rounded-md py-[6px] px-[28px] font-semibold">
                      Register
                    </button>
                  </div>
                </div>
                </Form>
                )}
                </Formik>
      </div>
      <div className="md:w-[50vw] md:h-[100dvh]">
        <img
          src={loginGraphics}
          alt="login-graphic"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default Login;
