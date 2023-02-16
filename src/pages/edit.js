import React, {useState, useEffect} from 'react'
import { Formik, Field, Form, ErrorMessage } from "formik";
import { db } from "../pages/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import { useLocation } from "react-router-dom";




function Edit({blogData}) {

    const [img, setImg] = useState("");
    const [img_link, setImg_link] = useState("");
    const [firebase_img, setfbimg] = useState("");
  
    const [progress, setProgress] = useState();
    const location = useLocation()


    const [retrievedData, setretrievedData] = useState([])

    const editData = async  (record) => {
        await setDoc(doc(db, "news", location.state.id), {
            blog_title: record.title,
            blog_body: record.body,
            blog_image: firebase_img
          });
        console.log(record)
    }

   useEffect(() => {
    const getData = async () => {
        const docRef = doc(db, "news", location.state.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
       // console.log("Document data:", docSnap.data(), docSnap.id);
        setretrievedData({id: docSnap.id, ...docSnap.data()})
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
     }
    }
        location.state.id && getData()
        console.log("test")
   }, [])




   useEffect(() => {
    const uploadImage = () => {
      const image_name = img.name + new Date().getTime();
      const storageRef = ref(storage, image_name);
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          //setProgress(progress);

          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
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
            console.log("File available at", downloadURL);
            setfbimg(downloadURL);
          });
        }
      );
    };

    img && uploadImage();
  }, [img]);

  return (
    <div>
        <h1>edit</h1>

        <span>post id </span>
        {retrievedData.length !== 0  && console.log(retrievedData)}

     {  retrievedData.length !== 0 ? <Formik
        initialValues={{ 
            title: retrievedData.blog_title, 
            body:  retrievedData.blog_body, 
            image: retrievedData.blog_image
        }}
        onSubmit={(values, { setSubmitting }) => {
          editData(values);
          setSubmitting(false);

        }}
      >
        {(formProps) => (
          <Form   className="mx-auto">
            <label htmlFor="title">blog title</label>
            <Field name="title" type="text" className="form-control w-100" />
            <ErrorMessage name="title" />

            <label htmlFor="body">blog body</label>
            <Field
              name="body"
              type="text"
              className="form-control"
              as="textarea"
            />
            <ErrorMessage name="body" />

            <div className="image-container d-grid align-items-center justify-content-center position-relative" style={imgContainer}>
              <img src={img_link || retrievedData.blog_image} alt="logo" className="w-100" />
            </div>

            <label htmlFor="image">blog image</label>
            <input
              id="image"
              name="image"
              type="file"
              className="form-control"
              onChange={(event) => {
                // just set image preview
                let reader = new FileReader();
                reader.onload = () => {
                  if (reader.readyState === 2) {
                    setImg_link(reader.result);
                  }
                };
                reader.readAsDataURL(event.target.files[0]);

                //prepare for firebase upload and insert image into formik
                setImg(event.target.files[0]);
                formProps.setFieldValue("image", img);
              }}
            />
            <ErrorMessage name="image" />

            <button
              type="submit"
              className="btn btn-warning mt-3 w-50"
              onClick={() => editData(formProps.values)}
            //   disabled={ progress !== 0 && progress < 100}
            >
              edit
            </button>
          
          </Form>
        )}
      </Formik> : <h1>loading data</h1>}
    </div>
  )
}

const imgContainer = {
    width: "100%",
    aspectRatio: "1/1",
    border: "1px solid black",
    marginBlock: "10px",
  };

export default Edit