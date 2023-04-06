import React, {useRef, useEffect, useState} from 'react'
import { getStorage, ref, uploadBytesResumable,  getDownloadURL } from "firebase/storage";

import { Button } from 'antd'
import Embed from '../assets/icons/embed.svg'

function EmbedArticle({setPdf, pdf}) {
  const inputRef = useRef()
  const [loading, setLoading] = useState(false)
  const [pdfInfo, setPdfInfo] = useState({
    name:'Embed article',
    size:'0'
  })


  function uploadFile(file) {
     const storage = getStorage();
    const storageRef = ref(storage, file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setLoading(true)

    uploadTask.on(
        "state_changed",
        (snapshot) => {
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
              setPdf({
                firebaseLink:downloadURL,
                name:file.name,
                size:file.size
              })
              setLoading(false)
              console.log("PDF uploaded")
            
        });
        }
    );
  }
   

  function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return null
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

  return (

    <>
    <div className='upload_image_wrapper' style={styles.wrapper}>
        <div>
            <img loading='lazy' src={Embed} width={18} height={20} alt="embed_icon"/>
            <span style={styles.span}> 
                {pdf?.name ? pdf.name : pdfInfo.name}  {pdf?.size ? formatBytes(pdf.size) : formatBytes(pdfInfo.size)}
            </span>
       
            
        </div>


        <input ref={inputRef} hidden type='file' accept=".pdf" 
        onChange={(e) => {
            uploadFile(e.target.files[0])
            setPdfInfo({...pdfInfo, name: e.target.files[0].name, size: e.target.files[0].size})
        }}/>
        <Button loading={loading} className="button-no_outline_primary" style={{ width: "auto" }} type="button" onClick={() => inputRef.current.click()}> EMBED</Button> 
    </div>

    </>
  )
}

export default EmbedArticle

const styles = {
    wrapper: {
        margin: '30px 0',
    },
    span: {
        fontFamily: 'PoppinsReg'
    }
}