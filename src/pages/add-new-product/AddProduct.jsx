import React, { useEffect, useState } from "react";
import "./add-product.css";
import { Input, Button, Group, Text, Select, SimpleGrid, Image, TextInput } from "@mantine/core";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { SiTicktick } from "react-icons/si";
import { Dropzone, IMAGE_MIME_TYPE, PDF_MIME_TYPE } from "@mantine/dropzone";
import {useForm, yupResolver} from '@mantine/form'
import { VscError } from "react-icons/vsc";
import { IoMdPhotos } from "react-icons/io";
import axios from "axios";
import { CONFIG } from "../../../config";
import * as Yup from 'yup';
import axiosInstance from "../../../axiosInstance";
import { useLoading } from "../../contexts/LoadingContext";
import { toast } from "react-toastify";
import Loading from "../../components/loader/Loading";

const AddProduct = () => {
    const IMAGE_SIZE_LIMIT = 2 * 1024 * 1024;
    const IMAGE_SUPPORTED_FORMATS = ["image/jpeg", "image/png"];
    const DOCUMENT_SIZE_LIMIT = 2 * 1024 * 1024;
    const {loading, setLoadingState} = useLoading()
const DOCUMENT_SUPPORTED_FORMATS = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/msword", // .doc
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "text/csv", // .csv
  "application/vnd.ms-powerpoint", // .ppt
  "application/vnd.openxmlformats-officedocument.presentationml.presentation" // .pptx
];
  const [categories, setCategories] = useState([]);
  const validationSchema = Yup.object().shape({
      title: Yup.string()
        .required('*title is required'),
      description: Yup.string()
        .required('*description is required'),
      category: Yup.string()
        .required('*category is required'),
      minPrice: Yup.number()
        .min(100, '*minPrice should be above than $100')
        .required('*minPrice is required'),
      avgPrice: Yup.number()
        .min(300, '*avgPrice should be above than $300')
        .required('*avgPrice is required'),
      maxPrice: Yup.number()
        .min(500, '*maxPrice should be above than $500')
        .required('*maxPrice is required'),
        gallery: Yup.array()
        .min(1, "*Gallery images are required") // Ensure at least 1 file is uploaded
        .of(
          Yup.mixed()
            .test("fileSize", "*File size must be less than 2MB", (file) =>
              file ? file.size <= IMAGE_SIZE_LIMIT : false
            )
            .test("fileType", "*Only JPEG or PNG files are allowed", (file) =>
              file ? IMAGE_SUPPORTED_FORMATS.includes(file.type) : false
            )
        ),
    
      docs: Yup.array()
        .min(1, "*At least one document is required") // Ensure at least 1 document is uploaded
        .of(
          Yup.mixed()
            .test("fileSize", "*File size must be less than 2MB", (file) =>
              file ? file.size <= DOCUMENT_SIZE_LIMIT : false
            )
            .test("fileType", "*Only .pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx, .csv are allowed", (file) =>
              file ? DOCUMENT_SUPPORTED_FORMATS.includes(file.type) : false
            )
        )
    });
  const form = useForm({
    mode:'uncontrolled',
    validateInputOnChange:true,
    initialValues:{
        title:'',
        description:'',
        category:'',
        minPrice:0,
        avgPrice:0,
        maxPrice:0,
        gallery:[],
        docs:[],
    },
    validate:yupResolver(validationSchema)
  })
  useEffect(()=>{
    fetchCategories()
  },[])
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    
    onUpdate:({editor})=>{
        form.setFieldValue('description',editor.getHTML())
    },
  });
  const galleryPreviews = form.getValues().gallery.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return <Image maw={120} key={index} src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />;
  });
  const docsPreviews = form.getValues().docs.map((file, index) => {
    let imageUrl
    if(file.type === 'application/pdf'){
        imageUrl = 'src/assets/filetype-icons/pdf.png'
    }else if(file.type==='application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
      imageUrl = 'src/assets/filetype-icons/docx-file.png'
    }else if(file.type==='application/msword'){
      imageUrl = 'src/assets/filetype-icons/doc.png'
    }else if(file.type==='application/vnd.ms-excel'){
      imageUrl = 'src/assets/filetype-icons/xls.png'
    }else if(file.type==='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
      imageUrl = 'src/assets/filetype-icons/xlsx.png'
    }else if(file.type==='text/csv'){
      imageUrl = 'src/assets/filetype-icons/csv-file.png'
    }else if(file.type==='application/vnd.ms-powerpoint'){
      imageUrl = 'src/assets/filetype-icons/ppt.png'
    }else if(file.type==='application/vnd.openxmlformats-officedocument.presentationml.presentation'){
      imageUrl = 'src/assets/filetype-icons/pptx.png'
    }
    return <Image maw={40} key={index} src={imageUrl}  />;
  });
  const fetchCategories = async()=>{
    try {
        const {data} = await axiosInstance.get(CONFIG.getAllCategories)
        if(data.success){
          setCategories(data?.data)
        }
      } catch (error) {
        console.log(error)
      }
  }
  const handleSubmission =async(formObj)=>{

    // const pricing = {minPrice,avgPrice,maxPrice}
    const obj = {title:formObj.title, description:formObj.description, category:formObj.category}
    const formData = new FormData();
    Object.entries(obj).forEach(([key, value]) => formData.append(key, value));
    formData.append('pricing[minPrice]', formObj.minPrice);
    formData.append('pricing[avgPrice]', formObj.avgPrice);
    formData.append('pricing[maxPrice]', formObj.maxPrice);
    formObj.gallery.forEach((item)=>formData.append('gallery',item));
    formObj.docs.forEach((item)=>formData.append('docs',item))

    try {
        setLoadingState(true)
        const {data} = await axiosInstance.post(CONFIG.addProduct,formData)
        if(data.success){
          toast.success(data.message);
          form.reset();
          setLoadingState(false);
        }
    } catch (error) {
        console.log(error)
        setLoadingState(false)
    }
  }
  const handleCategory = (value)=>{
    const categoryItem = categories.filter((category)=>category.title===value)[0];
    form.setFieldValue('category',categoryItem._id)
  }
  const handleDropzone = (key,files)=>{
    if(key==='gallery'){
        form.setFieldValue('gallery',files)
    }else if(key==='docs'){
        form.setFieldValue('docs',files)
    }
  }
  if(loading) return <Loading/>
  return (
    <div className="mb-10">
      <div className="relative w-full bg-front py-36 rounded-b-[20px] md:rounded-b-[80px] overflow-hidden">
        <div className="absolute inset-0 bg-emerald-900/90"></div>
        <div className="text-center text-white text-4xl relative font-semibold">
          Idea Detail
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex items-center justify-center gap-2 font-medium text-white/50 max-md:text-xs text-nowrap mb-2">
          <span>Jobstack</span> &lt;{" "}
          <span className="text-white">Add New Idea</span>
        </div>
      </div>
      <div className="flex items-center px-8 mt-8">
        <div >
            <form className="flex flex-col" onSubmit={form.onSubmit((values) => handleSubmission(values))}>
          <Input.Wrapper label="*Title">
            <TextInput placeholder="Enter title" {...form.getInputProps('title')}/>
          </Input.Wrapper>
          <span className="font-medium mt-2">*Description</span>
          <RichTextEditor editor={editor} value={form.values.description}>
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Highlight />
                <RichTextEditor.Code />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote />
                <RichTextEditor.Hr />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
                <RichTextEditor.Subscript />
                <RichTextEditor.Superscript />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignJustify />
                <RichTextEditor.AlignRight />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Undo />
                <RichTextEditor.Redo />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content {...form.getInputProps('description')}/>
          </RichTextEditor>
          {form.errors.description && (
          <Text color="red" size="sm" mt={4}>
            {form.errors.description}
          </Text>
        )}
          
          <Select mt={8} label="*Pick a Category"
          placeholder="Select a Category"
          value={form.values.category}
          data={categories?.map((item)=>item?.title)} onChange={(value)=>handleCategory(value)}/>
          {form.errors.category && (
          <Text color="red" size="sm" mt={4}>
            {form.errors.category}
          </Text>
        )}
          <span className="font-medium mt-2">*Pricing</span>
          <div className="flex gap-2">
            <TextInput label="Minimum Price" type="number" placeholder="minPrice" {...form.getInputProps('minPrice')}/>
            <TextInput label="Average Price" type="number" placeholder="avgPrice" {...form.getInputProps('avgPrice')}/>
            <TextInput label="Maximum Price" type="number" placeholder="maxPrice" {...form.getInputProps('maxPrice')}/>
          </div>
          <span className="font-medium mt-2">*Gallery to Upload</span>
          <Dropzone
            onDrop={(files) => handleDropzone('gallery',files)}
            onReject={(files) => console.log("rejected files", files)}
            maxSize={5 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
            value={form.values.gallery}
          >
            <Group
              justify="center"
              gap="xl"
              mih={220}
              style={{ pointerEvents: "none" }}
            >
              <Dropzone.Accept>
                <SiTicktick />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <VscError />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IoMdPhotos />
              </Dropzone.Idle>

              <div>
                <Text size="xl" inline>
                  Drag images here or click to select files
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  Attach as many files as you like, each file should not exceed
                  5mb
                </Text>
              </div>
            </Group>
          </Dropzone>
          {form.errors.gallery && (
          <Text color="red" size="sm" mt={4}>
            {form.errors.gallery}
          </Text>
        )}
          <SimpleGrid cols={{ base: 1, sm: 4 }} mt={galleryPreviews.length > 0 ? 'xl' : 0}>
        {galleryPreviews}
      </SimpleGrid>
      <Button variant="filled" bg={'#059669'} onClick={()=>form.setFieldValue('gallery',[])} mt={'xs'}>Reset Gallery Upload</Button>
          <span className="font-medium mt-2">*Documents to upload</span>
          <Dropzone
            onDrop={(files) => {handleDropzone('docs',files); console.log(files)}}
            onReject={(files) => console.log("rejected files", files)}
            maxSize={5 * 1024 ** 2}
            accept={DOCUMENT_SUPPORTED_FORMATS}
            value={form.values.docs}
          >
            <Group
              justify="center"
              gap="xl"
              mih={220}
              style={{ pointerEvents: "none" }}
            >
              <Dropzone.Accept>
                <SiTicktick />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <VscError />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IoMdPhotos />
              </Dropzone.Idle>

              <div>
                <Text size="xl" inline>
                  Drag Documents here or click to select files
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  Attach as many files as you like, each file should not exceed
                  5mb
                </Text>
              </div>
            </Group>
          </Dropzone>
          {form.errors.docs && (
          <Text color="red" size="sm" mt={4}>
            {form.errors.docs}
          </Text>
        )}
          <SimpleGrid cols={{ base: 1, sm: 4 }} mt={docsPreviews.length > 0 ? 'xl' : 0}>
        {docsPreviews}
      </SimpleGrid>
      <Button variant="filled" bg={'#059669'} onClick={()=>form.setFieldValue('docs',[])} mt={'xs'}>Reset Documents Upload</Button>
          <Button variant="filled" type="submit" bg={'#059669'} mt={'md'}>Submit</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
