import React, { useState, useEffect, useRef, useCallback } from "react";
import { DeleteFilled } from "@ant-design/icons";
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
import GallerySearchPanel from "./GallerySearchPanel";


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
  const [blogsAllfilter, setBlogsAllfilter] = useState([]);
 

  function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return null
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

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
 

const link = ""
 
  const photos = blogsAllfilter.length > 0 
  ? blogsAllfilter.map(blog => ({
    id: blog.id,
    src: blog.blog_image || link,
    imgForStorage: blog.blog_image_name,
    isSelected: false,
    timeStamp: blog.timeStamp,
    blog_image: blog.blog_image,
    blog_image_name: blog.blog_image_name,
    blog_image_size: blog.blog_image_size,
    
  }))
  : blogsAll.map(blog => ({
    id: blog.id,
    src: blog.blog_image || link,
    imgForStorage: blog.blog_image_name,
    isSelected: false,
    timeStamp: blog.timeStamp,
    blog_image: blog.blog_image,
    blog_image_name: blog.blog_image_name,
    blog_image_size: blog.blog_image_size,
  }));

 
  

  const [currentImageGallery, setCurrentImageGallery] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImageGallery(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImageGallery(0);
    setViewerIsOpen(false);
  };
  const deletePhoto = (photo) => {
    
    // if(blogsAllfilter.length !== 0) {
    //   setCurrentImg({...currentImg, img:photo.imgForStorage, id:photo.id})
    // }else {
    //   setCurrentImg({...currentImg, img:photo.imgForStorage, id:photo.id})
    // }
    
    
      setCurrentImg({...currentImg, img:photo.imgForStorage, id:photo.id})
    
    
    showModal()
  };

  const imageRenderer = ({ index, onClick, photo, margin}) => {
    const formattedImgSize = formatBytes(photo.blog_image_size)
    
  
    return (
      <div key={photo.key} style={{ margin, width: photo.width,  position: 'relative' }}>
        <LazyLoadImage effect="blur" title={`${photo.blog_image_name} ${formattedImgSize}`} src={photo.src} alt={photo.title} style={{ display: 'block', width: '220px', aspectRatio:1/1, borderRadius: '8px', objectFit:'cover' }} onClick={e => onClick(e, { index })} />
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
      <GallerySearchPanel gallery={blogsAll} filteredGallery={blogsAllfilter} setFilteredGallery={setBlogsAllfilter}/>

      <div className="gallery-wrapper">
        <Button className="upload-button" onClick={() => galleryImg.current.click()} loading={isUploading.status}>
         
          {
            isUploading.status ? <div>Uploading, please wait...</div> 
            :  <div>Upload Media </div>
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
              uploadImageAsPromise(imageFile, "gallery", setIsUploading, isUploading);
            }
          }
          }}
        />

          <GalleryTest photos={photos} onClick={openLightbox} renderImage={imageRenderer} margin="10px"/>
          <ModalGateway>
            {viewerIsOpen ? (
              <Modal onClose={closeLightbox}>
                <Carousel
                  currentIndex={currentImageGallery}
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
