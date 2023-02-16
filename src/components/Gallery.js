import React, { useState, useEffect, useRef, useCallback } from "react";
import { DeleteFilled, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { Modal as ModalAntd, Image, Button} from "antd";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { doc, deleteDoc} from "firebase/firestore";

import { db } from "../pages/firebase";
//import { motion } from "framer-motion";
import { uploadImageAsPromise, deleteFromStorage } from "./c";
//import ProgressBar from "./Progress";



import GalleryTest from 'react-photo-gallery';
import Carousel, { Modal, ModalGateway } from "react-images";
import { LazyLoadImage } from "react-lazy-load-image-component";


const Gallery = () => {
  const types = ['image/png', 'image/jpeg']
  const galleryImg = useRef();
  const [open, setOpen] = useState(false);
  const [num, setnum] = useState(null);
  const [currentImg, setCurrentImg] = useState({
    img:null,
    id:null
  })
  const [isUploading, setIsUploading] = useState({
    status: false,
    progress: 0
  })
  const [blogsAll, setBlogsAll] = useState([]);
  const [loading, isLoading] = useState(false);
 

  useEffect(() => {
    const blogsRef = collection(db, "images");
    let queryAll = query(blogsRef, orderBy("timeStamp", "desc"));
    const unsub = onSnapshot(queryAll, (snapShot) => {
      let list = [];

      snapShot.docs.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setBlogsAll(list);
    });
    return () => unsub();
  }, []);

  const showModal = () => {
    setOpen(true);
  };
  const hideModal = () => {
    setOpen(false);
  };
 


 
  const photos = blogsAll.map(blog => ({
    id: blog.id,
    src: blog.blog_image,
    imgForStorage: blog.blog_image_name,
    isSelected: false,
    
  }));

  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };
  const deletePhoto = (photo) => {
    setCurrentImg({...currentImg, img:photo.imgForStorage, id:photo.id})
    showModal()
  };

  const imageRenderer = ({ index, onClick, photo, margin}) => {
  
    return (
      <div key={photo.key} style={{ margin, width: photo.width, height: photo.height, position: 'relative' }}>
        <LazyLoadImage effect="blur" src={photo.src} alt={photo.title} style={{ display: 'block', width: '220px', aspectRatio:1/1, borderRadius: '8px', objectFit:'cover' }} onClick={e => onClick(e, { index })} />
        <Button type="primary" 
          style={{ padding: '0 !important', display:'grid', placeContent:'center', position: 'absolute', top: '5px', right: '5px', color: 'black', cursor: 'pointer', width:'30px', height:'30px'}}
          onClick={(e) =>  deletePhoto(photo)}
        >
          <DeleteFilled style={{ color: 'white' }}/>
        </Button>
      </div>
    );
  };

  return (
    <>
      {/* <ProgressBar data={isUploading}/> */}
      <div className="gallery-wrapper">
        <Button className="upload-button" onClick={() => galleryImg.current.click()} loading={isUploading.status}>
         
          {
            isUploading.status ? <div>Uploading, please wait...</div> 
            :  <div>Upload image </div>
          }
        </Button>
      
        <input
          type="file"
          ref={galleryImg}
          hidden
          multiple
          onChange={(e) => {
            setnum(e.target.files.length);
        
          if(e.target.files) {
            for (var i = 0; i < e.target.files.length; i++) {
              var imageFile = e.target.files[i];
              uploadImageAsPromise(imageFile, isLoading, "gallery", setIsUploading, isUploading);
            }
          }
          }}
        />

          <GalleryTest photos={photos} onClick={openLightbox} renderImage={imageRenderer} margin="10px"/>
          <ModalGateway>
            {viewerIsOpen ? (
              <Modal onClose={closeLightbox}>
                <Carousel
                  currentIndex={currentImage}
                  views={photos.map(x => ({
                    ...x,
                    srcset: x.srcSet,
                    caption: x.title
                  }))}
                />
              </Modal>
            ) : null}
          </ModalGateway>

          <ModalAntd
            style={{"boxShadow": "none"}}
            title={`Delete ${currentImg.img} ?`}
            open={open}
            onOk={() => {
              hideModal()
              deleteFromStorage(currentImg.img)
                async function del() {
                  await deleteDoc(doc(db, "images", currentImg.id));
                }
                del()
            }}
            
            onCancel={hideModal}
            okText="Delete"
            cancelText="Cancel"
            >
              <p>This action will delete file permanently</p>
          </ModalAntd>
      </div>
    </>
  );
};
export default Gallery;
