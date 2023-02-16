import React, {useRef, useState, useEffect} from 'react'

import { Formik, Field, Form} from 'formik';
import { v4 as uuid } from 'uuid';
import { db } from "../pages/firebase";
import { collection, addDoc, doc,  setDoc, getDoc, getDocs, deleteDoc, increment, updateDoc, query, orderBy, where } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../pages/firebase";

import { Button, Divider } from 'antd';

import Photo from '../assets/icons/upload.svg'
import Edit from '../assets/icons/edit.svg'
import ModalDelete from './modalDelete';
import ModalDuplicate from './modalDuplicate';
import ModalPreview from './modalPreview';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import SelectwithSearch from './SelectwithSearch';
import UploadfromGallery from './UploadfromGallery';




function BlogformTransactions() {
 const {pathname} = useLocation()

    let navigate = useNavigate();
    const [myid, setmyid] = useState(uuid())
    const [blogsAll, setBlogsAll] = useState([])
    const [blogActiveTitle, setBlogActiveTitle] = useState([])
    const [blogActive, setBlogActive] = useState([])
    const [blogsNames, setBlogsNames] = useState([])
    const [ufd, setUFD] = useState(true)
    const [ufg, setUFG] = useState(true)
    const [imgArray,setImgArray] = useState([])
    const formRef = useRef()
   

    function formatBytes(bytes, decimals = 2) {
        // if (!+bytes) return '0 Bytes'
        if (!+bytes) return null
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    
        const i = Math.floor(Math.log(bytes) / Math.log(k))
    
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }
    const [docId, setDocId] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [transactionsImg, settransactionsImg] = useState({
        base64: "",
        firebaseLink: "",
        name:"",
        size:""
    })
    const [isDraft, setIsDraft] = useState(true)
    const [currentDoc, setCurrentDoc] = useState([])
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
            console.log("firsxt")
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
            
            settransactionsImg({
                ...transactionsImg,
                base64: img,
                firebaseLink: downloadURL,
                name: img.name,
                size: img.size
            })

            });
        }
        );
    };

    const UploadImage = (props) => {
        const upload = useRef()

        return (
            <div>
                <input hidden type="file" ref={upload} onChange={(e) => { 
                    uploadImage(e.target.files[0]) 
                }}/>
                <div className='upload_image_wrapper'>
                    <div>
                        <img src={Photo} alt="upload_img" />
                        <span> {transactionsImg.name || formRef.current?.values.transactions_image_name  || "Upload main image..."} {formatBytes(formRef.current?.values.transactions_image_size) || formatBytes(transactionsImg.size)}</span>
                    </div>
    
                    <Button loading={isLoading} className='button-no_outline_primary' type='button' onClick={() => upload.current.click()}> UPLOAD </Button>
                </div>
            </div>
      
        )
    }

    const addTransaction = async (vals) => {
      let docId = pathname.split("=") 
       
      let data, merge;
      if(pathname.includes("addTransaction/edit")) {
        console.log("edit")
        docId = docId[docId.length-1]
        data = {
            timeStamp: Date.now(),
            transactions_status: vals.transactions_status ,
            transactions_title: vals.transactions_title ,
            transactions_year: vals.transactions_year ,
            transactions_image: transactionsImg.firebaseLink ,
            transactions_image_name: transactionsImg.name ,
            transactions_image_size: transactionsImg.size ,
            transactions_date: vals.transactions_date ,
        }
        merge = true
      } else {
        console.log("no edit")
        docId = myid
        data = {
            timeStamp: Date.now(),
            id: docId ,
            draft_id: blogActive[0]?.data.draft_id ,
            blog_title: blogActive[0]?.data.blog_title ,
            blog_body: blogActive[0]?.data.blog_body ,
            blog_date: blogActive[0]?.data.blog_date ,
            blog_type: blogActive[0]?.data.blog_type ,
            transactions_status: vals.transactions_status ,
            transactions_title: vals.transactions_title ,
            transactions_year: vals.transactions_year ,
            transactions_image: transactionsImg.firebaseLink ,
            transactions_image_name: transactionsImg.name ,
            transactions_image_size: transactionsImg.size ,
            transactions_date: vals.transactions_date ,
        }
        const countRef = doc(db, "length", "length");
        await updateDoc(countRef, {
           transactions: increment(1)
       }) ;
        merge = false
      }
       
       
        try {
            await setDoc(doc(db, "transactions", docId ), data, {merge:merge}); 
            setIsDraft(false)
            //window.location.href = adminDomain + "/transactions";
            //window.location.href = "https://annasharv.github.io/transactions";
            navigate(-1)
           


            //draftidan amoshla
            const del = async () => {await deleteDoc(doc(db, "drafts", docId))}
            del()
            console.log("del", myid)
            } catch (e) {
                console.error("Error adding document: ", e);
            }
       
    };

  
 
  
//     const sendDraft = (vals, endpoint) => {
//         const addDraft = async () => {
//             if (isDraft === true && docId.length === 0) {
//                 try {
//                     await setDoc(doc(db, "drafts", myid), {
//                         draft_id: myid,
//                         blog_title: vals.blog_title,
//                         blog_body: vals.blog_body,
//                         transactions_image: transactionsImg.firebaseLink,
//                         transactions_image_name: transactionsImg.name,
//                         transactions_image_size: transactionsImg.size,
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
        const docRef = doc(db, "transactions", docId);
         const getCurrentDoc = async () => {

            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
              arr_temp.push({id: docId, data: docSnap.data()})

              setDocId(arr_temp[0]?.id)
              if (formRef.current) {
                formRef.current.setFieldValue("id", docId);
                formRef.current.setFieldValue("draft_id", arr_temp[0].data?.draft_id);
                formRef.current.setFieldValue("transactions_status", arr_temp[0].data?.transactions_status);
                formRef.current.setFieldValue("transactions_title", arr_temp[0].data?.transactions_title);
                formRef.current.setFieldValue("transactions_date", arr_temp[0].data?.transactions_date);
                formRef.current.setFieldValue("transactions_year", arr_temp[0].data?.transactions_year);
                formRef.current.setFieldValue("transactions_image", arr_temp[0].data?.transactions_image);
                formRef.current.setFieldValue("transactions_image_name", arr_temp[0].data?.transactions_image_name);
                formRef.current.setFieldValue("transactions_image_size", arr_temp[0].data?.transactions_image_size);
                settransactionsImg({...transactionsImg, firebaseLink: arr_temp[0].data?.transactions_image, name:arr_temp[0].data?.transactions_image_name, size:arr_temp[0].data?.transactions_image_size })
              
            }


            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }

            setCurrentDoc(arr_temp)
           
           
        }

         getCurrentDoc()
        
       
         const getAllBlogs = async () => {
            let list = []
            let postNames = []
            const q = query(collection(db, "blogs"), where("blog_type", "array-contains", "deals"));
            const querySnapshot = await getDocs(q);
              querySnapshot.forEach((doc) => {
                  list.push({id: doc.id, data: doc.data()})
                  postNames.push({key:  uuid(), value: doc.data().blog_title, label: doc.data().blog_title})
              });  
      
               setBlogsAll(list)
               setBlogsNames(postNames)
          }
      
          getAllBlogs()
      
    }, [])


    useEffect(() => {
      // DON'T DELETE
        let filteredblog = blogsAll.filter((blog) => {
            return blog.data.blog_title.includes(blogActiveTitle)
        })
        setBlogActive(filteredblog)
    }, [blogActiveTitle])
        
     return (
        <>
         <div className="blog_form">
            <Formik
            innerRef={formRef}
            initialValues={{
                timeStamp: Date.now(),
                transactions_date: mydate,
                draft_id:"",
                id: "",
                transactions_title: null,
                transactions_status: "active",
                transactions_year: "",
                transactions_image: "",
                transactions_image_name: "",
                transactions_image_size: "",
            }}
            
            onSubmit={(values, { setSubmitting }) => {
                 setSubmitting(false)
                 addTransaction(values)
            }}>

                {(formik) => (
                <Form onSubmit={formik.handleSubmit} className="blog_form">
                    <fieldset>
                        <div className="blog_form_header">
                            <UploadImage  className="upload_image" />
                            <Divider orientation='left'>or</Divider>
                            <UploadfromGallery classnm="upload_image_wrapper" icon={Photo} setimgarray={setImgArray} docid={docId || myid}
                            setufd={setUFD} ufg={ufg} setufg={setUFG} vals={formRef.current?.values} cat={"transactions"} setimgfield={settransactionsImg}
                            imgfield={transactionsImg} /> 
                            
                        </div>
                        <div className="blog_form_header blog_form_header_transactions">
                            <SelectwithSearch 
                                name="transactions_title" 
                                blogsnames={blogsNames}
                                setblogactivetitle={setBlogActiveTitle}
                                blogactivetitle={blogActiveTitle}
                            />

                            <Field type="number"  name="transactions_year" placeholder="year" defaultValue={year}/>
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
                                <ModalDuplicate record={formRef.current?.values} dbName={"transactions"}  />
                                <ModalDelete docId={docId} dbName={"transactions"} redirect={true}/>
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

export default BlogformTransactions