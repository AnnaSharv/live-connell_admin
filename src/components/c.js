import { db } from "../pages/firebase";
import { collection, addDoc, doc, updateDoc, increment } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, getStorage,  deleteObject  } from "firebase/storage";
import { storage } from "../pages/firebase";
export const uploadImageAsPromise = function (img,  dbName, setIsUploading, isUploading) {

    return new Promise(function (resolve, reject) {
      const image_name = img.name + new Date().getTime();
      const storageRef = ref(storage, image_name);
      const uploadTask = uploadBytesResumable(storageRef, img);
    

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setIsUploading({...isUploading, status: true, progress: progress})
          switch (snapshot.state) {
            case "paused":
              // console.log("Upload is paused");
              break;
            case "running":
               console.log("Upload is running");
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
                let list = []
                let pushToImageDB = async () => {
              
                const docRef = await addDoc(collection(db, "images"), {
                    timeStamp: Date.now(),
                    blog_image: downloadURL,
                    blog_image_name: image_name,
                    blog_image_size: img.size,
                });

                const countRef = doc(db, "length", "length");
                 await updateDoc(countRef, {
                    [dbName]: increment(1)
                });
              console.log("Document written with ID: ", docRef.id);
             setIsUploading({isUploading, status: false})
              list.push(downloadURL)
            };
            pushToImageDB();
            
          });
        }
      );
    });
}


export const deleteFromStorage = async function (file) {
  console.log(file)
  const storage = getStorage();
  const imgref = ref(storage, `${file}`);

// Delete the file
deleteObject(imgref).then(() => {
 // console.log("File deleted successfully", file)
}).catch((error) => {
  console.log("error", error)
});



// 
 //deleteDoc(doc(db, "images", file));

}

