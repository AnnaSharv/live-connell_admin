import React, { useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Button, Modal, Empty, Checkbox } from "antd";
import { db } from "../pages/firebase";
import { LazyLoadImage } from "react-lazy-load-image-component";

function UploadfromGallery({ classnm, icon, setimgarray, docid, setufd, setufg, ufg, vals, cat, setimgfield, imgfield }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [activeImages, setActiveImages] = useState([]);


  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    try {
      setIsModalOpen(false);
    // console.log("THESE IMAGES WILL BE SENT", activeImages, docid);
    const imgrefblogs = doc(db, "blogs", docid);
    
    setimgarray(activeImages);
    setufd(false)
    setufg(true)


    if(!cat && vals.imgArr.length !== 0) {
      console.log("run1")
        let updateImgArr = async () => {
            await updateDoc(imgrefblogs, {
              imgArr: activeImages,
            });
          };
          updateImgArr();
          //setDoc(imgref, { fromwhere: "gallery" });
    }
    if(cat !== undefined) {
      console.log("run2")
      //const imgrefbycat = doc(db, cat, docid)
     
        // let updateImgArr = async () => {
        //   await updateDoc(imgrefbycat, {
        //     blog_image: activeImages[0].blog_image,
        //     blog_image_name: activeImages[0].blog_image_name,
        //     blog_image_size: activeImages[0].blog_image_size,
  
        //   });
        // };
        setimgfield({...imgfield,
          firebaseLink: activeImages[0].blog_image,
          name:activeImages[0].blog_image_name,
          size:activeImages[0].blog_image_size
        })
       
    }
  
  }
  catch (err) {
    console.log(err, "try catch")
    }
   
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  

  const onChange = (e, img) => {
    e.target.checked === true &&  setActiveImages((prevVal) => [...prevVal, img])
    e.target.checked === false &&  setActiveImages(activeImages.filter(item => item.id !== img.id) )
   };

  let getImages = async () => {
    let list = [];
    const querySnapshot = await getDocs(collection(db, "images"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      let data = doc.data();
      list.push({
        id: doc.id,
        blog_image: data.blog_image,
        blog_image_name: data.blog_image_name,
        blog_image_size: data.blog_image_size,
      });
    });
    setGallery(list);
  };

  return (
    <div className={classnm}>
      <div>
        <img src={icon} alt=""/>

        {ufg === true && activeImages.length > 0 ? 
        <div style={{"display": "grid"}}>
         { activeImages.map((activeImg, i) => {
            return <span key={i} className="span-ellipse">{activeImg.blog_image_name}</span>
          })}
        </div>
         : <span>Select from gallery</span>
        }
      </div>

      <Button
        className="button-no_outline_primary"
        style={{ width: "auto" }}
        type="button"
        onClick={() => {
          showModal();
          getImages();
        }}>
        SELECT
      </Button>
      <Modal
        title="Upload from Gallery"
        okText="Upload"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1500}
        className="modal_upload_from_gallery"
        style={{ top: 0 }}
        maskStyle={{ backgroundColor: '#cecece' }}

      >
        {gallery.length > 0 ? (
          gallery.map((img, i) => {
            return (
              <div className="upload_from_gallery_wrapper" key={i}>
                <Checkbox onChange={(e) => onChange(e, img)}></Checkbox>
                <LazyLoadImage
                width={'100%'}
                  effect="blur"
                  src={img.blog_image}
                  key={i}
                  alt="img"
                  title={img.blog_image_name}
                />
              </div>
            );
          })
        ) : (
          <Empty />
        )}
      </Modal>
    </div>
  );
}

export default UploadfromGallery;
