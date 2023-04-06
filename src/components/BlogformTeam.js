import React, {useRef, useState, useEffect} from 'react'

import { Formik, Form, ErrorMessage, useField, useFormikContext } from 'formik';
import { v4 as uuid } from 'uuid';
import { db } from "../pages/firebase";
import { collection, addDoc, doc,  setDoc, getDoc, deleteDoc, increment, updateDoc, getDocs, } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import { storage } from "../pages/firebase";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Select, Input, Button, Divider, Modal, Empty, Checkbox } from 'antd';

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
 const location = useLocation();
 const orderId = location.state?.blogLength + 1

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
    const MemberName = (props) => {
        const {setFieldValue} = useFormikContext()
        const [field] = useField(props)

        return (
            <input 
            {...props}
            {...field}
            placeholder="Name of Team member"
            onChange={(e) => {
                setFieldValue(props.name, e.target.value)
                setgo((prevVal) => !prevVal)
            }}/>
        )
    }
    const MemberContact = (props) => {
        const {setFieldValue} = useFormikContext()
        const [field] = useField(props)

        return (
            <input 
            {...props}
            {...field}
            placeholder="Email of Team member"
            onChange={(e) => {
                setFieldValue(props.name, e.target.value)
                setgo((prevVal) => !prevVal)
            }}
            />
        )
    }
    const MemberPosition = (props) => {
        const {setFieldValue} = useFormikContext()
        const [field] = useField(props)

        return (
            <input 
            {...props}
            {...field}
            placeholder="Position of Team member"
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
            console.log("File available at", downloadURL);
            let pushToImageDB = async () => {
                
                const docRef = await addDoc(collection(db, "images"), {
                    timeStamp: Date.now(),
                    blog_image: downloadURL,
                    blog_image_name: img.name,
                    blog_image_size: img.size
                  });
                  console.log("Document written with ID: ", docRef.id);
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
                                {/* <span> Upload from </span>
                                <span className='button-no_outline_primary'
                                    onClick={() => upload.current.click()}
                                    style={{
                                        "padding": "4px",
                                        "textDecoration": "underline",
                                        "cursor": "pointer"
                                    }}> Device
                                </span>
                                <span> or </span>
                                <span className='button-no_outline_primary'
                                onClick={() => {
                                    setIsModalOpen(true)
                                    getModalImages()
                                }}
                                 style={{
                                    "padding": "4px",
                                    "textDecoration": "underline",
                                    "cursor": "pointer"
                                }}
                                > Gallery</span> */}
                                {memberImg.name || formRef.current?.values.blog_image_name || "Upload from device"}
                            </div>
                       
                        </div>
        
                        <Button loading={isLoading} className='button-no_outline_primary' type='button' onClick={() => upload.current.click()} style={{"width":"auto"}}> UPLOAD </Button>
                    </div>
                </div>

                {/* <Divider>Uploaded image(s)</Divider>
                {
                    memberImg.name || formRef.current?.values.blog_image_name ?
                    <div className='upload_image_wrapper' style={{"marginTop": "10px", "fontSize": "12px"}}>
                      {memberImg.name || formRef.current?.values.blog_image_name}
                    </div>
                    : null
                } */}

                      
                
            </div>
      
        )
    }

    const addMember = async (vals) => {
        let currId = pathname.split("blog_id=")[1]
        
     
          try {
            await setDoc(doc(db, "team", currId || myid), {
                draft_id: myid,
                id: currId || myid,
                orderId: vals.orderId,
                timeStamp: Date.now(),
                member_name: vals.member_name,
                member_position: vals.member_position,
                member_contact: vals.member_contact ,
                member_description: vals.member_description ,
                blog_image: memberImg.firebaseLink,
                blog_image_name: memberImg.name,
                blog_image_size: memberImg.size,
                member_status: vals.member_status ,
                member_date: vals.member_date,
            }); 
            setIsDraft(false)
            const countRef = doc(db, "length", "length");
            !currId && await updateDoc(countRef, {
                team: increment(1)
            });
           // window.location.href = adminDomain + "/members";
           // window.location.href = "https://annasharv.github.io/members";
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

    let richtextMemo = React.useMemo( () =>  <RichText name="member_description"/>, [] )
    let memberNameMemo = React.useMemo( () => <MemberName name="member_name" />, [] )
    let memberPositionMemo = React.useMemo( () => <MemberPosition name="member_position" />, [] )
    let memberContactMemo = React.useMemo( () => <MemberContact name="member_contact" />, [] )
  
    async function getModalImages() {
        const list = []
        const querySnapshot = await getDocs(collection(db, "images"));
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
            list.push({id: doc.id, data: doc.data()})
        });

        setModalGallery(list)

    }



    //DEL
    // const activeImgList = []
    // function handleImageGallery(img) {
    //     activeImgList.push(img)
    //     setModalActiveImagesArray((prevVal) => [...prevVal, activeImgList])
    // }

    // useEffect(() => {
    //     setModalActiveImagesArray((prevVal) => [...prevVal, activeImgList])
    //     console.log("dddddd")
    // }, [activeImgList])
  
//     const sendDraft = (vals, endpoint) => {
//         const addDraft = async () => {
//             if (isDraft === true && docId.length === 0) {
//                 try {
//                     await setDoc(doc(db, "drafts", myid), {
//                         draft_id: myid,
//                         blog_title: vals.blog_title,
//                         blog_body: vals.blog_body,
//                         blog_image: memberImg.firebaseLink,
//                         blog_image_name: memberImg.name,
//                         blog_image_size: memberImg.size,
//                         blog_status: vals.blog_status,
//                         blog_type: vals.blog_type,
//                         blog_date: vals.blog_date,
//                         permalink: vals.blog_permaLink
//                     });
//                     console.log("written", myid)
                  
//                 } catch (e) {
//                   console.error("Error adding document: ", e);
//                 }
//             }
//         }
//         addDraft()
//     }
//    const debounce = (func) => {
//      let timer;
//      return function (...args) {
//        const context = this;
//        if (timer) clearTimeout(timer);
//        timer = setTimeout(() => {
//          timer = null;
//          func.apply(context, args);
//        }, 2000);
//      };
//    };
//    const optimizedSendDraft = useCallback(debounce(sendDraft), [])
   
    // useEffect(() => {

    //     optimizedSendDraft(formRef?.current?.values, "/drafts")
    //    // console.log(formRef?.current?.values.blog_body, formRef?.current?.values.blog_body.length)

    // }, [formRef?.current?.values.blog_body.length, isDraft, go])


    useEffect(() => {

       
        let arr_temp = []
        let docId = pathname.split("=") 
   
        docId = docId[docId.length-1]
        setDocId(docId)

        const docRef = doc(db, "team", docId);
         const getCurrentDoc = async () => {

            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
              
              arr_temp.push({id: docId, data: docSnap.data()})
              setDocId(arr_temp[0]?.id)
              if (formRef.current) {
                formRef.current.setFieldValue("orderId", arr_temp[0].data?.orderId);
                formRef.current.setFieldValue("member_name", arr_temp[0].data?.member_name);
                formRef.current.setFieldValue("member_position", arr_temp[0].data?.member_position);
                formRef.current.setFieldValue("member_contact", arr_temp[0].data?.member_contact);
                formRef.current.setFieldValue("member_description", arr_temp[0].data?.member_description);
                 formRef.current.setFieldValue("blog_image", arr_temp[0].data?.blog_image);
                 formRef.current.setFieldValue("blog_image_name", arr_temp[0].data?.blog_image_name);
                 formRef.current.setFieldValue("blog_image_size", arr_temp[0].data?.blog_image_size);
                // formRef.current.setFieldValue("blog_type", arr_temp[0].data?.blog_type);
                 formRef.current.setFieldValue("member_date", arr_temp[0].data?.member_date);
                 formRef.current.setFieldValue("member_status", arr_temp[0].data?.member_status);
                 setmemberImg({...memberImg, firebaseLink: arr_temp[0].data?.blog_image, name:arr_temp[0].data?.blog_image_name, size:arr_temp[0].data?.blog_image_size })
              
            }


            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }

            setCurrentDoc(arr_temp)
           
           
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
                orderId: orderId,
                draft_id:"",
                member_name: "",
                member_position:"",
                member_contact: "" ,
                member_description: "" ,
                member_status: "active",
                member_date: mydate,
                blog_image: "",
                blog_image_name: "",
                blog_image_size: "",
            }}
            
            onSubmit={(values, { setSubmitting }) => {
                setSubmitting(false)
                addMember(values)
            }}>

                {(formik) => (
                <Form onSubmit={formik.handleSubmit} className="blog_form">
                    <fieldset>
                        <div className="blog_form_header">
                            {memberNameMemo}
                        </div>
                        <div className="blog_form_header">
                            {memberPositionMemo}
                        </div>
                        <div className="blog_form_header">
                            {memberContactMemo}
                        </div>
                        <div className="blog_form_body"> 
                            {richtextMemo}
                            <ErrorMessage name="member_description" />
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
                                <ModalPreview cat={"team"} vals={formik.values} img={memberImg} fullWidth={true}/>
                            </div>

                            <div className='content_wrapper' id='blog_form_dropdowns'>
                                <div>
                                    <label htmlFor="status">Status:</label>
                                    <SelectStatus name="member_status" />
                                    <span onClick={() => {
                                        setStatusOpen(!statusopen)
                                    }} style={{cursor:"pointer"}}>
                                        <img src={Edit} alr="edit" />
                                    </span>
                                </div>
                            
                            </div>

                            <div className='upload_image' >
                                <UploadImage  className="upload_image" />
                                <Divider orientation='left'>or</Divider>
                                <UploadfromGallery classnm="upload_image_wrapper" icon={Photo} setimgarray={setImgArray} docid={docId || myid}
                                setufd={setUFD} ufg={ufg} setufg={setUFG} vals={formRef.current?.values} cat={"team"} setimgfield={setmemberImg}
                                imgfield={memberImg}
                               />
                            
                            </div>

                            <div className='content_wrapper button-group'>
                            <ModalDuplicate record={formRef.current?.values} dbName={"team"}  />
                            <ModalDelete docId={docId} dbName={"team"} redirect={true}/>
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