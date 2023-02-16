import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { db } from "../pages/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

function Dashboard({ userStatus }) {
    const navigate = useNavigate()
    const location = useLocation()
  const [blog, setBlog] = useState([]);
  const [img, setImg] = useState("");
  const [img_link, setImg_link] = useState("");
  const [firebase_img, setfbimg] = useState("");

  const [progress, setProgress] = useState();

  const addData = async (vals) => {
    if (vals.title && vals.body) {
      try {
        const docRef = await addDoc(collection(db, "news"), {
          blog_title: vals.title,
          blog_body: vals.body,
          blog_image: firebase_img,
        });
        console.log("Document written with ID: ", docRef.id);
      
        navigate("/newslist")
        
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

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
          setProgress(progress);

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
      <button className="btn btn-danger">Sign out</button>

      <h1>add blog</h1>

      <Formik
        initialValues={{ 
            title: "", 
            body: "", 
            image: "" 
        }}
        onSubmit={(values, { setSubmitting }) => {
          addData(values);
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
              <img src={img_link} alt="logo" className="w-100" />
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
              className="btn btn-success mt-3 w-50"
              onClick={addData}
            //   disabled={ progress !== 0 && progress < 100}
            >
              add news
            </button>
          
          </Form>
        )}
      </Formik>
    </div>
  );
}

const imgContainer = {
  width: "100%",
  aspectRatio: "1/1",
  border: "1px solid black",
  marginBlock: "10px",
};

export default Dashboard;
