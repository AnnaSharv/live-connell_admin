import React, {useRef, useState, useEffect} from 'react'
import { Formik, Form, ErrorMessage, useField, useFormikContext } from 'formik';
import { v4 as uuid } from 'uuid';
import { db } from "../pages/firebase";
import { collection, addDoc, doc,  setDoc, getDoc, deleteDoc, increment, updateDoc, getDocs, } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import { storage } from "../pages/firebase";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Select,  Button, Divider} from 'antd';

import Photo from '../assets/icons/upload.svg'
import ModalDelete from './modalDelete';
import ModalDuplicate from './modalDuplicate';
import { useLocation, useNavigate } from 'react-router-dom';
import UploadfromGallery from './UploadfromGallery';
import SelectwithSearch from './SelectwithSearch';
import {websiteDomain} from '../App.js'

 


function BlogformSlider() {
 const {pathname} = useLocation()
    const website_domain = websiteDomain
    const navigate = useNavigate()
    const [myid, setmyid] = useState(uuid())
    const formRef = useRef()
    const [ufd, setUFD] = useState(true)
    const [ufg, setUFG] = useState(true)
    const [imgArray,setImgArray] = useState([])
    function formatBytes(bytes, decimals = 2) {
        // if (!+bytes) return '0 Bytes'
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
    const [memberImg, setmemberImg] = useState({
        base64: "",
        firebaseLink: "",
        name:"",
        size:""
    })
    const [isDraft, setIsDraft] = useState(true)
    const [currentDoc, setCurrentDoc] = useState([])
    const publish = useRef()
    const status = useRef()

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalGallery, setModalGallery] = useState([])
    const [modalActiveImagesArray, setModalActiveImagesArray] = useState([])
    
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
 

  
    const [go, setgo] = useState(false)
    const SliderName = (props) => {
        const {setFieldValue} = useFormikContext()
        const [field] = useField(props)

        return (
            <input 
            {...props}
            {...field}
            placeholder="Slider name"
            onChange={(e) => {
                setFieldValue(props.name, e.target.value)
                setgo((prevVal) => !prevVal)
            }}/>
        )
    }
    const SliderSubheadingText = (props) => {
        const {setFieldValue} = useFormikContext()
        const [field] = useField(props)

        return (
            <input 
            {...props}
            {...field}
            placeholder="Subheading text"
            onChange={(e) => {
                setFieldValue(props.name, e.target.value)
                setgo((prevVal) => !prevVal)
            }}
            />
        )
    }
   


    const RichText =  (props) => {
        const { setFieldValue } = useFormikContext()
        const [field, meta] = useField(props);
       
        return (
            <div>
                <CKEditor
                    editor={ClassicEditor}
                    {...props} {...field}
                    data={field.value}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        setFieldValue(props.name, data)
                      
                        setgo((prevVal) => !prevVal)
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

    const uploadImage = (img, arr_temp) => {
        setIsLoading(true)
        const image_name = img.name + new Date().getTime();
        const storageRef = ref(storage, image_name);
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
        "state_changed",
        (snapshot) => {
            const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            switch (snapshot.state) {
            case "paused":
               // console.log("Upload is paused");
                break;
            case "running":
                
               // console.log("Upload is running");
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
            setIsLoading(false)
          //  console.log("File available at", downloadURL);
            let pushToImageDB = async () => {
                //xxx
                const docRef = await addDoc(collection(db, "images"), {
                    timeStamp: Date.now(),
                    slider_image: downloadURL,
                    slider_image_name: img.name,
                    slider_image_size: img.size
                  });
                 // console.log("Document written with ID: ", docRef.id);
            }
            pushToImageDB()
            setmemberImg({
                ...memberImg,
                base64: img,
                firebaseLink: downloadURL,
                name: img.name,
                size: img.size
            })

            });
        }
        );
    };


    const UploadImage = () => {
        const upload = useRef()
        return (
            <div>
                <div>
                    <input hidden type="file" ref={upload} onChange={(e) => { uploadImage(e.target.files[0]) }}/>
                    <div className='upload_image_wrapper'>
                        <div>
                            <img src={Photo} alt="upload_img" />
                            <div> 
                                {memberImg.name || formRef.current?.values.slider_image_name || "Upload from device"}
                            </div>
                        </div>
        
                        <Button loading={isLoading} className='button-no_outline_primary' type='button' onClick={() => upload.current.click()} style={{"width":"auto"}}> UPLOAD </Button>
                    </div>
                </div>
            </div>
        )
    }

    const addSlider = async (vals) => {
       // let currId = pathname.split("blog_id=")[1]
        
     
          try {
            await setDoc(doc(db, "sliders", id || myid), {
                draft_id: myid,
                id: id || myid,
                timeStamp: Date.now(),
                slider_status: vals.slider_status,
                slider_name: vals.slider_name,
                slider_subheading: vals.slider_subheading ,
                slider_button: vals.slider_button ,
                slider_description: vals.slider_description ,
                slider_image: memberImg.firebaseLink,
                slider_image_name: memberImg.name,
                slider_image_size: memberImg.size,
            }); 
            setIsDraft(false)
            const countRef = doc(db, "length", "length");
            !id && await updateDoc(countRef, {
                sliders: increment(1)
            });
           // window.location.href = adminDomain + "/members";
           // window.location.href = "https://annasharv.github.io/members";
           navigate(-1)


            //draftidan amoshla

            const del = async () => {
                await deleteDoc(doc(db, "drafts", myid));
            }
            del()
            console.log("del", myid)

          } catch (e) {
            console.error("Error adding document: ", e);
          }
    };

    let richtextMemo = React.useMemo( () =>  <RichText name="slider_description"/>, [] )
    let sliderNameMemo = React.useMemo( () => <SliderName name="slider_name" />, [] )
    let sliderSubheadingMemo = React.useMemo( () => <SliderSubheadingText name="slider_subheading" />, [] )
  
    async function getModalImages() {
        const list = []
        const querySnapshot = await getDocs(collection(db, "images"));
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
            list.push({id: doc.id, data: doc.data()})
        });

        setModalGallery(list)

    }



    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    // Get the value of a specific query parameter
    const id = queryParams.get('slider_id');

    useEffect(() => {
        let editOrAdd = document.querySelector(".blog_header h1")
         let arr_temp = []
        // let docId = pathname.split("=") 
        // docId = docId[docId.length-1]xoxo

        if(id && editOrAdd.innerText === "Add Slider") {
            editOrAdd.innerText = "Edit Slider"
        }
        

        // setDocId(docId)

    if(id) {
        const docRef = doc(db, "sliders", id);
        const getCurrentDoc = async () => {
           const docSnap = await getDoc(docRef);
           if (docSnap.exists()) {
             arr_temp.push({id: docId, data: docSnap.data()})
             setDocId(arr_temp[0]?.id)
             if (formRef.current) {
               formRef.current.setFieldValue("slider_name", arr_temp[0].data?.slider_name);
               formRef.current.setFieldValue("slider_status", arr_temp[0].data?.slider_status);
               formRef.current.setFieldValue("slider_subheading", arr_temp[0].data?.slider_subheading);
               formRef.current.setFieldValue("slider_button", arr_temp[0].data?.slider_button);
               formRef.current.setFieldValue("slider_description", arr_temp[0].data?.slider_description);
                formRef.current.setFieldValue("slider_image", arr_temp[0].data?.slider_image);
                formRef.current.setFieldValue("slider_image_name", arr_temp[0].data?.slider_image_name);
                formRef.current.setFieldValue("slider_image_size", arr_temp[0].data?.slider_image_size);
               // formRef.current.setFieldValue("blog_type", arr_temp[0].data?.blog_type);
                setmemberImg({...memberImg, firebaseLink: arr_temp[0].data?.slider_image, name:arr_temp[0].data?.slider_image_name, size:arr_temp[0].data?.slider_image_size })
             
           }

           } else {
             console.log("No such document!");
           }
           setCurrentDoc(arr_temp)
       }
        getCurrentDoc() 
    }
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
                slider_name: "",
                slider_button:"Select button",
                slider_subheading: "" ,
                slider_description: "" ,
                slider_status: "active",
                slider_image: "",
                slider_image_name: "",
                slider_image_size: "",
            }}
            
            onSubmit={(values, { setSubmitting }) => {
                setSubmitting(false)
                addSlider(values)
            }}>

                {(formik) => (
                <Form onSubmit={formik.handleSubmit} className="blog_form">
                    <fieldset>
                        <div className="blog_form_header">
                            {sliderNameMemo}
                        </div>
                        <div className="blog_form_header">
                            <UploadImage  className="upload_image" />
                            <Divider orientation='left'>or</Divider>
                            <UploadfromGallery classnm="upload_image_wrapper" icon={Photo} setimgarray={setImgArray} docid={docId || myid}
                            setufd={setUFD} ufg={ufg} setufg={setUFG} vals={formRef.current?.values} cat={"sliders"} setimgfield={setmemberImg}
                            imgfield={memberImg} /> 
                        </div>
                        <div className="blog_form_header">
                            <SelectwithSearch 
                                name="slider_button" 
                                cat={"sliders"}
                                slideroptions={[
                                    {
                                      value: 'news',
                                      label: 'News',
                                    },
                                    {
                                      value: 'transactions',
                                      label: 'Transactions',
                                    },
                                    {
                                      value: 'team',
                                      label: 'Team',
                                    },
                                  ]}

                                // blogsnames={blogsNames}
                                // setblogactivetitle={setBlogActiveTitle}
                                // blogactivetitle={blogActiveTitle}
                            />
                        </div>
                        <div className="blog_form_header">
                            {sliderSubheadingMemo}
                        </div>
                        <div className="blog_form_body"> 
                            {richtextMemo}
                            <ErrorMessage name="slider_description" />
                        </div>

                    </fieldset>

                    <fieldset>
                        <div className='blog_form_details'>
                            <div className='content_wrapper'>
                                <span> Publish status </span>
                                <button type='button' className='button button-publish' disabled={isLoading || Object.keys(formik.errors).length !== 0}
                                onClick={() => {publish.current.click()}}> Publish </button>
                            </div>



                            <div className='content_wrapper button-group'>
                            <ModalDuplicate record={formRef.current?.values} dbName={"sliders"}  />
                            <ModalDelete docId={id} dbName={"sliders"} redirect={true}/>
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

export default BlogformSlider