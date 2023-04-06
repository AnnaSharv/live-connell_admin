import { getStorage, ref, uploadBytesResumable,  getDownloadURL } from "firebase/storage";


function uploadFile(file) {
    const storage = getStorage();
    const storageRef = ref(storage, file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    let result = ''

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
              result = downloadURL
              console.log("downloaded")
            
        });
        }
    );


    return result
}

export default uploadFile