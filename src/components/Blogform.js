import React, {useRef, useState, useEffect, useMemo} from 'react'

import { Formik, Form, ErrorMessage, useField, useFormikContext } from 'formik';
import { v4 as uuid } from 'uuid';
import { db } from "../pages/firebase";
import { collection, addDoc, doc,  setDoc, getDoc, deleteDoc, increment,  updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../pages/firebase";
import * as Yup from 'yup';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Select, Input, Button, Divider } from 'antd';

import Photo from '../assets/icons/upload.svg'
import Edit from '../assets/icons/edit.svg'
import ModalDelete from './modalDelete';
import ModalDuplicate from './modalDuplicate';
import ModalPreview from './modalPreview';
import { useLocation, useNavigate } from 'react-router-dom';
import UploadfromGallery from './UploadfromGallery';
import {websiteDomain} from '../App.js'
 
function Blogform({permaLink, setPermaLink, cat}) {
 const {pathname} = useLocation()
 let navigate = useNavigate()
    const website_domain = websiteDomain
  
  

   // const [myid, setmyid] = useState(uuid())
    const myid = uuid()
    const formRef = useRef()
    const [uploadProgress, setUploadProgress] = useState(false)
    const [ufd, setUFD] = useState(true)
    const [ufg, setUFG] = useState(true)

    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return null
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    
        const i = Math.floor(Math.log(bytes) / Math.log(k))
    
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }
    const [statusopen, setStatusOpen] = useState(false)
    const [docId, setDocId] = useState("")
    const [typeopen, setTypeOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [blogImg, setBlogImg] = useState({
        base64: "",
        firebaseLink: "",
        name:"",
        size:""
    })
    const [imgArray,setImgArray] = useState([])
    //const [isDraft, setIsDraft] = useState(true)
    //const [currentDoc, setCurrentDoc] = useState([])
    // const [permalinkId, setPermaLinkId] = useState("")
    const publish = useRef()
    const status = useRef()

    
    const currDate= new Date()
    let monthName = "";
    const month = String(currDate.getMonth() + 1).padStart(2, '0'); 
    const year = String(currDate.getFullYear());
    const day = String(currDate.getDate())
    switch (month) {
        case "01" || "1":
            monthName = "Jan"
            break;
        case "02" || "2":
            monthName = "Feb"
            break;
        case "03" || "3":
            monthName = "Mar"
            break;
        case "04" || "4":
            monthName = "Apr"
            break;
        case "05" || "5":
            monthName = "May"
            break;
        case "06" || "6":
            monthName = "Jun"
            break;
        case "07" || "7":
            monthName = "July"
            break;
        case "08" || "8":
            monthName = "Aug"
            break;
        case "09" || "9":
            monthName = "Sep"
            break;
        case "10":
            monthName = "Oct"
            break;
        case "11" :
            monthName = "Nov"
            break;
        case "12" :
            monthName = "Dec"
            break;
    
        default:
            monthName = month
            break;
    }
    const mydate = `${monthName} ${day}, ${year}`
 


    // Get the query parameters as an object

 const displayPermalink = (text) => {
    let str = text.toLowerCase().split(" ")
    let formattedString = str.slice(0,5).join("-")
    let currId = pathname.split("blog_id=")[1] 
    const newId = myid
    if(currId == undefined || currId == null) {
        setPermaLink(`${website_domain}/news/blogs/${formattedString}?id=${newId}`)  
    } else {
        setPermaLink(`${website_domain}/news/blogs/${formattedString}?id=${currId}`)   
    }
 }



    //const [go, setgo] = useState(false)
    const BlogTitle = (props) => {
        const {
            values: { blog_type },
            setFieldValue
        } = useFormikContext()
        const [field] = useField(props)

        return (
            <input 
            {...props}
            {...field}
            placeholder="Enter blog title"
            onChange={(e) => {
                setFieldValue(props.name, e.target.value)
                displayPermalink(e.target.value, blog_type, props.draft_id)
                
                
              //  setgo((prevVal) => !prevVal)
            }}
            />
        )
    }
    const RichText =  (props) => {
        const { setFieldValue } = useFormikContext()
        const [field] = useField(props);
       
        return (
            <div>

                <CKEditor
                    editor={ClassicEditor}
                    {...props} {...field}
                    data={field.value}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        setFieldValue(props.name, data)
                      
                      //  setgo((prevVal) => !prevVal)
                    }}
                    onBlur={ ( event, editor ) => {
                        // console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        // console.log( 'Focus.', editor );
                    } }
                />
            </div>
        );
    }
    const SelectStatus = (props) => {
        const { setFieldValue} = useFormikContext()
        const [field] = useField(props)


        const handleChange = (value) => {
            setFieldValue(props.name, value);
            setStatusOpen(!statusopen);
        };

       
    
       
    
        return (
            <>
            <Select
                className='select-status'
                bordered={false}
                 open={statusopen}
                {...props}
                {...field}
                ref={status}
                style={{
                width: 120,
                }}
                onChange={handleChange}
                onClick={(e) => {
                     setStatusOpen(!statusopen)
                 
                }}
                options={[
                {
                    value: 'active',
                    label: 'Active',
                },
                {
                    value: 'archived',
                    label: 'Archived',
                },
                ]}
            />
             
            </>
            
            
        )
    }
    const SelectType = (props) => {
        const { setFieldValue} = useFormikContext()
        const [field] = useField(props)
    
      
        const { Option } = Select;
        const handleChange = (value) => {
            setFieldValue(props.name, value)
        };
   
        return (
            <Select
            {...props}
            {...field}
            mode="multiple"
            style={{
              width: 120,
            }}
            bordered={false}
            placeholder="Select type"
            // defaultValue={['articles']}
            onChange={handleChange}
            optionLabelProp="label"
          >
            <Option value="articles" label="Articles">
              <div className="demo-option-label-item">
                Articles
              </div>
            </Option>
            <Option value="awards" label="Awards">
              <div className="demo-option-label-item">
                Awards
              </div>
            </Option>
            <Option value="deals" label="Deals">
              <div className="demo-option-label-item">
                Deals
              </div>
            </Option>
            {/* <Option value="team" label="Team" disabled>
              <div className="demo-option-label-item">
                Team 
              </div>
            </Option> */}
          </Select>


          
        )
    }
    const SelectDate = (props) => {
        const { setFieldValue } = useFormikContext()
        const [field] = useField(props)
   
        return (
          <Input
            {...props}
            {...field}
            bordered={false}
            placeholder="Edit date"
            onChange={(e) => setFieldValue(props.name, e.target.value)}
            className="date_input"
          />
        );
    }
   


    const UploadImage = () => {
        const upload = useRef()
        return (
            <div>
                <input hidden type="file" ref={upload} multiple onChange={(e) => { 

                   for (let i = 0; i < e.target.files.length; i++) {                    
                    const image_name = e.target.files[i].name + new Date().getTime();
                    const storageRef = ref(storage, image_name);
                    const uploadTask = uploadBytesResumable(storageRef, e.target.files[i]);
                    setImgArray([])

                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                        // const progress =
                        //     (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                        switch (snapshot.state) {
                            case "paused":
                            // console.log("Upload is paused");
                            break;
                            case "running":
                            console.log("Upload is running");
                            setUploadProgress(true)
                            //    setIsLoading(true)
                            break;
                            default:
                                
                            break;
                        }
                        },
                        (error) => {
                        console.log(error);
                        },
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                setUploadProgress(false)
                                let list = []
                                let pushToImageDB = async () => {
                            
                                await addDoc(collection(db, "images"), {
                                    timeStamp: Date.now(),
                                    blog_image: downloadURL,
                                    blog_image_name: e.target.files[i].name,
                                    blog_image_size: e.target.files[i].size
                                });
                                
                            //   console.log("Document written with ID: ", docRef.id);
                            list.push(downloadURL)
                            };
                            
                            setImgArray((p) => [...p, {
                                blog_image: downloadURL,
                                blog_image_name: e.target.files[i].name,
                                blog_image_size: e.target.files[i].size
                            }])
                            setUFG(false)
                            setUFD(true)
                            pushToImageDB();
                            
                        });
                        }
                    );
                   }
                    
                }}/>
                <div className='upload_image_wrapper'>
                    <div>
                        <img src={Photo} alt="upload_img" />
                      
                        <div style={{"display": "grid"}}>
                            {
                                //if upload from device is true
                              ufd === true && imgArray.length > 0 ?
                                imgArray.map((img,i) => {
                                    return <span key={i} className='span-ellipse'>{img.blog_image_name} {formatBytes(img.blog_image_size)}</span>
                                })
                                : 
                                <span> Upload from device </span>
                            }
                          
                        </div>
                    </div>
    
                    <Button loading={uploadProgress} className='button-no_outline_primary' style={{"width":"auto"}} type='button' onClick={() => upload.current.click()}> UPLOAD </Button>
                </div>
            </div>
      
        )
    }

    const addData = async (vals, blogstatus) => {
        let currId = pathname.split("blog_id=")[1]
        const countRef = doc(db, "length", "length");

          try {
            //xxx
            await setDoc(doc(db, "blogs", currId || myid), {
                draft_id: myid,
                id: currId || myid,
                timeStamp: Date.now(),
                blog_title: vals.blog_title,
                blog_body: vals.blog_body ,
                imgArr: imgArray,
                blog_status: blogstatus || vals.blog_status,
                blog_type: vals.blog_type,
                blog_date: vals.blog_date,
                blog_permalink: permaLink.split('=')[0] + '=' + permaLink.split('=')[1].replace(permaLink.split('=')[1], myid).toString()
            }); 

           // console.log("THESE VALUES ARE BEING SENT", vals, imgArray, blogstatus, permaLink)
            !currId && await updateDoc(countRef, {
                blogs: increment(1)
            });
           // setIsDraft(false)

            navigate(-1)


            //draftidan amoshla

            const del = async () => {
                await deleteDoc(doc(db, "drafts", myid));
            }
            del()
           // console.log("del", myid)

          } catch (e) {
            console.error("Error adding document: ", e);
          }
    };

     let richtextMemo = React.useMemo( () =>  <RichText name="blog_body"/>, [] )
     let blogTitleMemo = React.useMemo( () => <BlogTitle name="blog_title" />, [] )
  




    useEffect(() => {
        let arr_temp = []
        let docId = pathname.split("=")
        docId = docId[docId.length-1]
        // setDocId(docId)

        const docRef = doc(db, "blogs", docId);

        const getCurrentDoc = async () => {

            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
              
              arr_temp.push({id: docId, data: docSnap.data()})


               // setDocId(arr_temp[0]?.id)
              if (formRef.current) {
                formRef.current.setFieldValue("id", arr_temp[0].data?.id);
                formRef.current.setFieldValue("blog_title", arr_temp[0].data?.blog_title);
                formRef.current.setFieldValue("blog_body", arr_temp[0].data?.blog_body);
                formRef.current.setFieldValue("blog_status", arr_temp[0].data?.blog_status);
                formRef.current.setFieldValue("blog_type", arr_temp[0].data?.blog_type);
                formRef.current.setFieldValue("blog_date", arr_temp[0].data?.blog_date);
                formRef.current.setFieldValue("imgArr", arr_temp[0].data?.imgArr);
                formRef.current.setFieldValue("blog_image", arr_temp[0].data?.blog_image);
                formRef.current.setFieldValue("blog_image_name", arr_temp[0].data?.blog_image_name);
                formRef.current.setFieldValue("blog_image_size", arr_temp[0].data?.blog_image_size);
                formRef.current.setFieldValue("blog_permalink", arr_temp[0].data?.blog_permalink);
                setBlogImg({...blogImg, firebaseLink: arr_temp[0].data?.blog_image, name:arr_temp[0].data?.blog_image_name, size:arr_temp[0].data?.blog_image_size })
                setPermaLink(arr_temp[0].data?.blog_permalink)
                setImgArray(arr_temp[0].data?.imgArr)
              }

            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }

            //setCurrentDoc(arr_temp)
           
           
        }

         getCurrentDoc()
         
      
      
    }, [])


  
        
     return (
        <>
         <div className="blog_form">
      
        
            <Formik
            innerRef={formRef}
            initialValues={{
                timeStamp: Date.now(),
                status:"on",
                draft_id:"",
                blog_title: "",
                blog_body: "" ,
                blog_image: "",
                imgArr: [],
                blog_image_name: "",
                blog_image_size: "",
                blog_status: "active",
                blog_type: ["articles"],
                blog_date: mydate,
                permalink: permaLink
            }}
            validationSchema = {Yup.object({
                blog_title: Yup.string()
                .required('Required'),
                blog_body: Yup.string()
                .required('Required'),
                blog_status: Yup.string()
                .required('Required'),
                blog_type: Yup.array().nullable(),
                // xx
                blog_date: Yup.string()
                .required('Required'),
            })}
            onSubmit={(values, { setSubmitting }) => {
                setSubmitting(false)
                addData(values)
            }}>

                {(formik) => (
                <Form onSubmit={formik.handleSubmit} className="blog_form">
                    <fieldset>
                        <div className="blog_form_header">
                         
                            {blogTitleMemo}
                           
                             {/* <BlogTitle name="blog_title" /> */}
                            <ErrorMessage name="blog_title" />
                        </div>

                        <div className="blog_form_body"> 
                            {richtextMemo}
                            {/* <RichText name="blog_body" /> */}
                            <ErrorMessage name="blog_body" />
                        </div>
                    </fieldset>

                    <fieldset>
                        <div className='blog_form_details'>
                            <div className='content_wrapper'>
                                <span> Publish status </span>
                                <button type='button' className='button button-publish' disabled={isLoading || Object.keys(formik.errors).length !== 0}
                                onClick={() => {publish.current.click()}}> Publish </button>
                            </div>

                            <div className='content_wrapper '>
                                {/* <button type='button' className='button button-no_active'> Draft </button> */}
                                {/* <ModalPreview vals={formik.values} img={blogImg}/> */}
                                <ModalPreview vals={formik.values} images={imgArray} fullWidth={true}/>
                            </div>

                            <div className='content_wrapper' id='blog_form_dropdowns'>
                                <div>
                                    <label htmlFor="status">Status:</label>
                                    <SelectStatus name="blog_status" />
                                    <span onClick={() => {
                                        setStatusOpen(!statusopen)
                                    }} style={{cursor:"pointer"}}>
                                        <img src={Edit} alt="edit" />
                                    </span>
                                </div>
                                <div>
                                    <label htmlFor="type">Type:</label>
                                    <SelectType name="blog_type" />
                                    <span onClick={() => {
                                        setTypeOpen(!typeopen)
                                    }} style={{cursor:"pointer"}}>
                                        <img src={Edit} alt="edit" />
                                    </span>
                                </div>
                                <div>
                                    <label htmlFor="type">Date:</label>
                                    <SelectDate name="blog_date" type="text" as="select"/>
                                    <span style={{color:"transparent"}}> x </span>
                                </div>
                            </div>

                            <div className='upload_image' >
                                <UploadImage  className="upload_image" />
                                <Divider orientation='left'>or</Divider>
                                <UploadfromGallery classnm="upload_image_wrapper" icon={Photo} setimgarray={setImgArray} docid={docId || myid}
                                setufd={setUFD} ufg={ufg} setufg={setUFG} vals={formRef.current?.values}
                                />
                            </div>

                            <div className='content_wrapper button-group'>
                             <ModalDuplicate record={formRef.current?.values} dbName={"blogs"}  />
                             <ModalDelete docId={docId} dbName={"blogs"} redirect={true} decrementfield={"blogs"}/>
                            </div>


                        </div>
                    </fieldset>
                

                    <button hidden type="submit" ref={publish} className='btn btn-primary mt-2'>Submit</button>
                </Form>
                )}
            </Formik>
        </div>
        </>
       
    );
}

export default Blogform