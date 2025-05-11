import React, { useEffect, useState } from "react";
import "./profile.css";
import { Avatar, Button, Modal, Select, Table, Input, TextInput, Textarea, ScrollArea } from "@mantine/core";
import axios from "axios";
import { CiHeart } from "react-icons/ci";
import { IoSaveOutline } from "react-icons/io5";
import { MdArrowOutward } from "react-icons/md";
import { CONFIG } from "../../../config";
import { Link, useParams } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { useForm, yupResolver } from "@mantine/form";
import { DatePickerInput } from '@mantine/dates';
import * as Yup from 'yup';
import noData from '../../assets/no-data.svg'
import { CountrySelect, CitySelect, StateSelect } from "react-country-state-city";
import { useUserDetails } from "../../contexts/UserDetailContext";
import axiosInstance from "../../../axiosInstance";
import { useLoading } from "../../contexts/LoadingContext";
import Loading from "../../components/loader/Loading";
const Profile = () => {
  const [userInfo, setUserInfo] = useState({});
  const [userProducts, setUserProducts] = useState([]);
  const [userSavedProducts, setUserSavedProducts] = useState([]);
  const [duration, setDuration] = useState('');
  const [grade, setGrade] = useState('');
  const [eduOpened, { open: eduOpen, close: eduClose }] = useDisclosure(false);
  const [expOpened, { open: expOpen, close: expClose }] = useDisclosure(false);
  const [certOpened, { open: certOpen, close: certClose }] = useDisclosure(false);
  const [langOpened, { open: langOpen, close: langClose }] = useDisclosure(false);
  const [updateInfoOpened, { open: updateInfoOpen, close: updateInfoClose }] = useDisclosure(false);
  const [role, setRole] = useState('')
  const [dob, setDob] = useState(null);
  const [country, setCountry] = useState('');
  const [countryState, setCountryState] = useState('');
  const [city, setCity] = useState('')
  const params = useParams();
  const {details} = useUserDetails()
  const {loading, setLoadingState} = useLoading();
  const addEduValidationSchema = Yup.object({
    instituteName: Yup.string()
      .required('*Institute Name is required'),
    degreeName: Yup.string()
      .required('*Degree Name is required'),
    duration: Yup.string()
      .required('*Duration is required'),
    grade: Yup.string()
      .required('*Grade is required'),
  });
  const addExpValidationSchema = Yup.object({
    title: Yup.string()
      .required('*Title is required'),
    companyName: Yup.string()
      .required('*Company Name is required'),
    industry: Yup.string()
      .required('*Industry is required'),
    duration: Yup.string()
      .required('*Duration is required'),
    description: Yup.string()
      .required('*Description is required'),
    role: Yup.string()
      .required('*Role is required'),
  });
  const addCertValidationSchema = Yup.object({
    title: Yup.string()
      .required('*Title is required'),
    institute: Yup.string()
      .required('*Institute is required'),
    duration: Yup.string()
      .required('*Duration is required'),
    description: Yup.string()
      .required('*Description is required'),
  });
  const addLangValidationSchema = Yup.object({
    name: Yup.string()
      .required('*Name is required'),
    level: Yup.string()
      .required('*Level is required'),
  });
  const updateBioInfoForm = useForm({
    mode: 'uncontrolled',
    validateInputOnChange: true,
    initialValues: {
      fullName: '',
      dateOfBirth: '',
      aboutDescription: '',
      country: '',
      city: ''
    }
  })
  const addEduForm = useForm({
    mode: 'uncontrolled',
    validateInputOnChange: true,
    initialValues: {
      instituteName: '',
      degreeName: '',
      duration: '',
      grade: '',
    },
    validate: yupResolver(addEduValidationSchema)
  })
  const addExpForm = useForm({
    mode: 'uncontrolled',
    validateInputOnChange: true,
    initialValues: {
      title: '',
      companyName: '',
      industry: '',
      duration: '',
      description: '',
      role: ''
    },
    validate: yupResolver(addExpValidationSchema)
  })
  const addCertForm = useForm({
    mode: 'uncontrolled',
    validateInputOnChange: true,
    initialValues: {
      title: '',
      institute: '',
      duration: '',
      description: '',
    },
    validate: yupResolver(addCertValidationSchema)
  })
  const addLangForm = useForm({
    mode: 'uncontrolled',
    validateInputOnChange: true,
    initialValues: {
      name: '',
      lavel: '',
    },
    validate: yupResolver(addLangValidationSchema)
  })
  useEffect(() => {
    fetchUserInfo();
    if(role === 'investor'){
      fetchUserSavedProducts()
    }else{
      fetchUserProducts();
    }
    setRole(params?.userRole)
  }, [role]);
  const fetchUserInfo = async () => {
    try {
    setLoadingState(true)
      const { data } = await axiosInstance.post(CONFIG.getUserInfo);
      setUserInfo(data.data);
      setLoadingState(false)
    } catch (error) {
      console.log(error);
      setLoadingState(false)
    }
  };
  const fetchUserProducts = async () => {
    try {
      const { data } = await axiosInstance.post(CONFIG.getUserProducts);
      setUserProducts(data.data);
    } catch (error) {
      console.log(error)
    }
  }
  const fetchUserSavedProducts = async () => {
    try {
      const { data } = await axiosInstance.post(CONFIG.getSavedProducts);
      if(data.success){
        setUserSavedProducts(data.data?.savedProducts);
      }
    } catch (error) {
      console.log(error)
    }
  }
  const onAddEduSubmission = async (formObj) => {
    formObj.duration = formObj.duration + " " + duration;
    if (grade === 'percentage') {
      formObj.grade = formObj.grade + " %";
    } else {
      formObj.grade = formObj.grade + " " + grade;
    }
    try {
    setLoadingState(true)
      const { data } = await axiosInstance.post(CONFIG.addUserEducation, { ...formObj, userId })
      eduClose()
      fetchUserInfo()
      setLoadingState(false)
    } catch (error) {
      console.log(error)
    }
  }
  const onAddExpSubmission = async (formObj) => {
    formObj.duration = formObj.duration + " " + duration;
    try {
      setLoadingState(true)
      const { data } = await axiosInstance.post(CONFIG.addUserExperience, { ...formObj, userId })
      expClose()
      fetchUserInfo()
      setLoadingState(false)
    } catch (error) {
      console.log(error)
    }
  }
  const onAddCertSubmission = async (formObj) => {
    formObj.duration = formObj.duration + " " + duration;
    try {
      setLoadingState(true)
      const { data } = await axiosInstance.post(CONFIG.addUserCertification, { ...formObj, userId })
      certClose()
      fetchUserInfo()
      setLoadingState(false)
    } catch (error) {
      console.log(error)
    }
  }
  const onAddLangSubmission = async (formObj) => {
    try {
      setLoadingState(true)
      const { data } = await axiosInstance.post(CONFIG.addUserLanguage, { ...formObj, userId })
      langClose();
      fetchUserInfo()
      setLoadingState(false)
    } catch (error) {
      console.log(error)
    }
  }
  const updateBioDetails = async(formObj) => {
    try {
      setLoadingState(true)
      const {data} = await axiosInstance.post(CONFIG.updateUserInfo,{...formObj})
      console.log(data)
      updateInfoClose();
      fetchUserInfo();
      setLoadingState(false)
    } catch (error) {
      console.log(error)
    }
  }
  if(loading) return <Loading/>
  return (
    <div className="mb-10">
      <div className="relative w-full bg-front py-36 rounded-b-[20px] md:rounded-b-[80px] overflow-hidden">
        <div className="absolute inset-0 bg-emerald-900/90"></div>
        <div className="text-center text-white text-4xl relative font-semibold">
          Profile
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex items-center justify-center gap-2 font-medium text-white/50 max-md:text-xs text-nowrap mb-2">
          <span>Jobstack</span> &lt; <span className="text-white">Profile</span>
        </div>
      </div>
      <div className="flex max-md:flex-col items-start gap-4 w-full px-8 mt-8">
        <div className="flex flex-col w-full md:w-1/2">
          <Button onClick={updateInfoOpen} variant="filled" bg={'#059669'} w={180} mb={8} style={{ alignSelf: 'end' }}>Update Details</Button>
          <div className="flex max-md:flex-col justify-between items-center">
            <div className="flex items-center gap-2 mb-4">
              <Avatar
                src={userInfo?.avatar || details?.avatar}
                bg={"#059669"}
                color="white"
                size={"xl"}
              />
              <div className="flex flex-col">
                <span className="text-xl font-medium">
                  {userInfo ? userInfo?.fullName : "No Name"}
                </span>
                <span className="font-medium">{userInfo ? userInfo?.dateOfBirth?.substring(0, 10) : "No Date of Birth"}</span>
              </div>
            </div>
            <div className="mb-2">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-lg">Country:</span>
                <span className="font-medium">{userInfo ? userInfo?.country : "No Country"}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-lg">City:</span>
                <span className="font-medium">{userInfo ? userInfo?.city : "No City"}</span>
              </div>
            </div>
          </div>
          <div className="mb-2">
            <span className="text-lg font-semibold">Description:</span>
            <p>{userInfo ? userInfo?.aboutDescription : "No Description"}</p>
          </div>

          <div className="mb-2">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Education</span>
              <div>
                <Button variant="filled" bg={'#059669'} onClick={eduOpen} size="xs">Add New Education</Button>
              </div>
            </div>
            <ScrollArea>
            <Table striped highlightOnHover withTableBorder withColumnBorders mt={8}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Institute Name</Table.Th>
                  <Table.Th>Degree Name</Table.Th>
                  <Table.Th>Duration</Table.Th>
                  <Table.Th>Grade</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {userInfo?.education?.map((item) => (
                  <Table.Tr key={item._id}>
                    <Table.Td>{item.instituteName}</Table.Td>
                    <Table.Td>{item.degreeName}</Table.Td>
                    <Table.Td>{item.duration}</Table.Td>
                    <Table.Td>{item.grade}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
              <Table.Caption>{!userInfo?.education ? "No Data Available" : ""}</Table.Caption>
            </Table>
            </ScrollArea>
          </div>
          <div className="mb-2">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Experience</span>
              <div>
                <Button variant="filled" bg={'#059669'} size="xs" onClick={expOpen}>Add New Experience</Button>
              </div>
            </div>
            <ScrollArea>
            <Table striped highlightOnHover withTableBorder withColumnBorders mt={8}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Title</Table.Th>
                  <Table.Th>Company Name</Table.Th>
                  <Table.Th>Industry</Table.Th>
                  <Table.Th>Duration</Table.Th>
                  <Table.Th>Role</Table.Th>
                  <Table.Th>Description</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {userInfo?.experience?.map((item) => (
                  <Table.Tr key={item._id}>
                    <Table.Td>{item.title}</Table.Td>
                    <Table.Td>{item.companyName}</Table.Td>
                    <Table.Td>{item.industry}</Table.Td>
                    <Table.Td>{item.duration}</Table.Td>
                    <Table.Td>{item.role}</Table.Td>
                    <Table.Td>{item.description}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
              <Table.Caption>{!userInfo?.experience ? "No Data Available" : ""}</Table.Caption>
            </Table>
            </ScrollArea>
          </div>
          <div className="mb-2">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Certifications</span>
              <div>
                <Button variant="filled" bg={'#059669'} size="xs" onClick={certOpen}>Add New Certification</Button>
              </div>
            </div>
            <ScrollArea>
            <Table striped highlightOnHover withTableBorder withColumnBorders mt={8}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Title</Table.Th>
                  <Table.Th>Institution</Table.Th>
                  <Table.Th>Duration</Table.Th>
                  <Table.Th>Description</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {userInfo?.certifications?.map((item) => (
                  <Table.Tr key={item._id}>
                    <Table.Td>{item.title}</Table.Td>
                    <Table.Td>{item.institute}</Table.Td>
                    <Table.Td>{item.duration}</Table.Td>
                    <Table.Td>{item.description}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
              <Table.Caption>{!userInfo?.certifications ? "No Data Available" : ""}</Table.Caption>
            </Table>
            </ScrollArea>
          </div>
          <div className="mb-2">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Languages</span>
              <div>
                <Button variant="filled" bg={'#059669'} size="xs" onClick={langOpen}>Add New Language</Button>
              </div>
            </div>
            <ScrollArea>
            <Table striped highlightOnHover withTableBorder withColumnBorders mt={8}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Title</Table.Th>
                  <Table.Th>Level</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {userInfo?.languages?.map((item) => (
                  <Table.Tr key={item._id}>
                    <Table.Td>{item.name}</Table.Td>
                    <Table.Td>{item.level}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
              <Table.Caption>{!userInfo?.language ? "No Data Available" : ""}</Table.Caption>
            </Table>
            </ScrollArea>
          </div>
        </div>
        {role === 'entrepreneur' ? <div className="flex flex-wrap w-full md:w-1/2 justify-center gap-6">
          {userProducts.slice(0, 4).map((product) => (
            <Link to={`/productDetail/${product._id}`} className="md:w-[40%] w-full">
              <div key={product._id} className="flex flex-col   border border-emerald-600/20 border-solid bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-150">
                <div className="relative h-40 overflow-hidden group cursor-pointer">
                  <img
                    src={product?.images[0]}
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
                  <h3 className="text-xl font-semibold">{product?.title}</h3>
                  <span className="text-[14px] font-semibold underline decoration-emerald-600">{product?.user?.username}</span>
                  <p className="text-[#94a3b8] text-[15px]">
                    {product?.description?.substring(0, 100) + "..."}
                  </p>
                  <div className="flex flex-wrap gap-2 items-center *:cursor-pointer">
                    {/* <a >
                      <span className="bg-orange-500/5 hover:bg-orange-500/20 inline-block text-orange-500 px-4 text-[14px] font-medium rounded-full mt-2 me-1 transition-all duration-500">
                        Full Time
                      </span>
                      </a> */}

                    <a>
                      <span className="bg-purple-600/5 hover:bg-purple-600/20 inline-block text-purple-600 px-4 text-[14px] font-medium rounded-full mt-2 me-1 transition-all duration-500">{"min: $" + product?.pricing?.minPrice}</span>
                    </a>
                    <a>
                      <span className="bg-purple-600/5 hover:bg-purple-600/20 inline-block text-purple-600 px-4 text-[14px] font-medium rounded-full mt-2 me-1 transition-all duration-500">{"avg: $" + product?.pricing?.avgPrice}</span>
                    </a>
                    <a>
                      <span className="bg-purple-600/5 hover:bg-purple-600/20 inline-block text-purple-600 px-4 text-[14px] font-medium rounded-full mt-2 me-1 transition-all duration-500">{"max: $" + product?.pricing?.maxPrice}</span>
                    </a>
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
          ))}
          {userProducts.length === 0 ? <div className="w-full">
            <img src={noData} alt="no data for products" className="w-1/2 m-auto" />
          </div> : <></>}
          <div className="flex w-full justify-center gap-4">
            <Link to={'/addProduct'}>
              <Button variant="filled" bg={'#059669'}>Add new Idea</Button>
            </Link>
            <Button variant="outline" color="#059669">Show all my Ideas</Button>
          </div>
        </div> :
        <div className="w-full md:w-1/2">
          <h3 className="text-lg font-semibold ml-12 mb-2">Saved Ideas</h3>
<div className="flex flex-wrap  justify-center gap-6">
            {userSavedProducts?.slice(0, 4).map((product) => (
            <Link to={`/productDetail/${product._id}`} className="md:w-[40%] w-full">
              <div key={product._id} className="flex flex-col   border border-emerald-600/20 border-solid bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-150">
                <div className="relative h-40 overflow-hidden group cursor-pointer">
                  <img
                    src={product?.images[0]}
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
                  <h3 className="text-xl font-semibold">{product?.title}</h3>
                  <span className="text-[14px] font-semibold underline decoration-emerald-600">{product?.user?.username}</span>
                  <p className="text-[#94a3b8] text-[15px]">
                    {product?.description?.substring(0, 100) + "..."}
                  </p>
                  <div className="flex flex-wrap gap-2 items-center *:cursor-pointer">
                    {/* <a >
                      <span className="bg-orange-500/5 hover:bg-orange-500/20 inline-block text-orange-500 px-4 text-[14px] font-medium rounded-full mt-2 me-1 transition-all duration-500">
                        Full Time
                      </span>
                      </a> */}

                    <a>
                      <span className="bg-purple-600/5 hover:bg-purple-600/20 inline-block text-purple-600 px-4 text-[14px] font-medium rounded-full mt-2 me-1 transition-all duration-500">{"min: $" + product?.pricing?.minPrice}</span>
                    </a>
                    <a>
                      <span className="bg-purple-600/5 hover:bg-purple-600/20 inline-block text-purple-600 px-4 text-[14px] font-medium rounded-full mt-2 me-1 transition-all duration-500">{"avg: $" + product?.pricing?.avgPrice}</span>
                    </a>
                    <a>
                      <span className="bg-purple-600/5 hover:bg-purple-600/20 inline-block text-purple-600 px-4 text-[14px] font-medium rounded-full mt-2 me-1 transition-all duration-500">{"max: $" + product?.pricing?.maxPrice}</span>
                    </a>
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
          ))}
          {userSavedProducts?.length === 0 ? <div className="w-full">
            <img src={noData} alt="no data for products" className="w-1/2 m-auto" />
          </div> : <></>}
          </div>
        </div>
          }
          <div>
            <Link to={`/inbox/${details._id}/landing`}>
            <Button bg={'#059669'} variant="filled">See Inbox</Button>
            </Link>
          </div>

      </div>
      <Modal opened={eduOpened} onClose={eduClose} title="Add New Education">
        <form onSubmit={addEduForm.onSubmit((values) => onAddEduSubmission(values))}>
          <Input.Wrapper label="institute Name">
            <TextInput placeholder="Harvard University" {...addEduForm.getInputProps('instituteName')} />
          </Input.Wrapper>
          <Input.Wrapper label="Degree Name" >
            <TextInput placeholder="B.tech" {...addEduForm.getInputProps('degreeName')} />
          </Input.Wrapper>
          <Input.Wrapper label="Duration">
            <TextInput placeholder="3 months/4 years" {...addEduForm.getInputProps('duration')} />
            <Select data={['months', 'years']} placeholder="select year/month" mt={8} onChange={(e) => setDuration(e)} />
          </Input.Wrapper>
          <Input.Wrapper label="Marks">
            <TextInput placeholder="Grade" {...addEduForm.getInputProps('grade')} />
            <Select data={['grade', 'percentage', 'cgpa',]} mt={8} placeholder="select grading standard" onChange={(e) => setGrade(e)} />
          </Input.Wrapper>
          <Button variant="filled" type="submit" bg={'#059669'} mt={8}>Add Education</Button>
        </form>
      </Modal>
      <Modal opened={expOpened} onClose={expClose} title="Add New Experience">
        <form onSubmit={addExpForm.onSubmit((values) => onAddExpSubmission(values))}>
          <Input.Wrapper label="Title">
            <TextInput placeholder="Angular Developer" {...addExpForm.getInputProps('title')} />
          </Input.Wrapper>
          <Input.Wrapper label="Company Name">
            <TextInput placeholder="Microsoft" {...addExpForm.getInputProps('companyName')} />
          </Input.Wrapper>
          <Input.Wrapper label="Industry" >
            <TextInput placeholder="IT and Tech" {...addExpForm.getInputProps('industry')} />
          </Input.Wrapper>
          <Input.Wrapper label="Duration">
            <TextInput placeholder="3 months/4 years" {...addExpForm.getInputProps('duration')} />
            <Select data={['months', 'years']} placeholder="select year/month" mt={8} onChange={(e) => setDuration(e)} />
          </Input.Wrapper>
          <Input.Wrapper label="Description" >
            <TextInput placeholder="Write a short experience about there" {...addExpForm.getInputProps('description')} />
          </Input.Wrapper>
          <Input.Wrapper label="Role" >
            <TextInput placeholder="Sr. Developer" {...addExpForm.getInputProps('role')} />
          </Input.Wrapper>

          <Button variant="filled" type="submit" bg={'#059669'} mt={8}>Add Experience</Button>
        </form>
      </Modal>
      <Modal opened={certOpened} onClose={certClose} title="Add New Certification">
        <form onSubmit={addCertForm.onSubmit((values) => onAddCertSubmission(values))}>
          <Input.Wrapper label="Title">
            <TextInput placeholder="Angular Developer" {...addCertForm.getInputProps('title')} />
          </Input.Wrapper>
          <Input.Wrapper label="Institute Name">
            <TextInput placeholder="Microsoft" {...addCertForm.getInputProps('institute')} />
          </Input.Wrapper>
          <Input.Wrapper label="Duration">
            <TextInput placeholder="3 months/4 years" {...addCertForm.getInputProps('duration')} />
            <Select data={['months', 'years']} placeholder="select year/month" mt={8} onChange={(e) => setDuration(e)} />
          </Input.Wrapper>
          <Input.Wrapper label="Description" >
            <TextInput placeholder="Write a short experience about there" {...addCertForm.getInputProps('description')} />
          </Input.Wrapper>
          <Button variant="filled" type="submit" bg={'#059669'} mt={8}>Add Certification</Button>
        </form>
      </Modal>
      <Modal opened={langOpened} onClose={langClose} title="Add New Language">
        <form onSubmit={addLangForm.onSubmit((values) => onAddLangSubmission(values))}>
          <Input.Wrapper label="Name">
            <TextInput placeholder="English" {...addLangForm.getInputProps('name')} />
          </Input.Wrapper>
          <Input.Wrapper label="Level">
            <TextInput placeholder="Proficiency" {...addLangForm.getInputProps('level')} />
          </Input.Wrapper>
          <Button variant="filled" type="submit" bg={'#059669'} mt={8}>Add Language</Button>
        </form>
      </Modal>
      <Modal opened={updateInfoOpened} onClose={updateInfoClose} title="Update Bio Info">
        <form onSubmit={updateBioInfoForm.onSubmit((values) => updateBioDetails(values))}>
          <Input.Wrapper label="Full Name">
            <TextInput placeholder="John Doe" {...updateBioInfoForm.getInputProps('fullName')} />
          </Input.Wrapper>
          <Input.Wrapper label="Date of Birth">
            <DatePickerInput
              placeholder="Pick date"
              value={dob}
              onChange={(date)=>{
                setDob(date)
                updateBioInfoForm.setFieldValue('dateOfBirth',date.toISOString())
              }}
            />
          </Input.Wrapper>
          <Input.Wrapper label="User Description">
            <Textarea
              placeholder="Input placeholder"
              {...updateBioInfoForm.getInputProps('aboutDescription')}
            />
          </Input.Wrapper>
          <CountrySelect
            onChange={(_country) =>{ 
              setCountry(_country)
              updateBioInfoForm.setFieldValue('country',_country?.name)
            }}
            onTextChange={(_txt) => console.log(_txt)}
            placeHolder="Select Country"
            inputClassName="region-input"
            containerClassName="region-container"
          />
          <StateSelect
            countryid={country?.id}
            onChange={(_state) => setCountryState(_state)}
            onTextChange={(_txt) => console.log(_txt)}
            defaultValue={countryState}
            placeHolder="Select State"
            inputClassName="region-input"
            containerClassName="region-container"
          />
          <CitySelect
            countryid={country?.id}
            stateid={countryState?.id}
            onChange={(_city) => {
              setCity(_city);
              updateBioInfoForm.setFieldValue('city',_city?.name)
            }}
            defaultValue={city}
            placeHolder="Select City"
            inputClassName="region-input"
            containerClassName="region-container"
          />
          <Button variant="filled" type="submit" bg={'#059669'} mt={8}>Update Bio Info</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;