import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



 

const firebaseConfig = {
  apiKey: "AIzaSyC2xuof2JIhS7iP6Ty0CPBCPcdVPFXtGVQ",
  authDomain: "connelldev-425a8.firebaseapp.com",
  projectId: "connelldev-425a8",
  storageBucket: "connelldev-425a8.appspot.com",
  messagingSenderId: "205575222965",
  appId: "1:205575222965:web:be6c841468f7e0f20d70fc"
};

//codegym
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);
export const storage = getStorage(app);