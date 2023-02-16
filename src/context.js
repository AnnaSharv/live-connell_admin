import { createContext, useContext, useState, useEffect } from "react";
import {signInWithEmailAndPassword, signOut} from 'firebase/auth'
import { auth, db } from "../src/pages/firebase";
import { collection, getDocs} from "firebase/firestore";



//Auth
const UserAuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const user = auth
    const signIn =  (email, password) => signInWithEmailAndPassword(auth, email, password)
    const logOut = (auth) => signOut(auth)

    return(
        <UserAuthContext.Provider value={{signIn, logOut, user}}>
            {children}
        </UserAuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(UserAuthContext)
}


//Get data
const DataContext = createContext()


export const DataContextProvider = ({children}) => {
    const [data, setData] = useState([])

   

    useEffect(() => {
      const fullData = async() => {
        let list = []
        const querySnapshotBlogs = await getDocs(collection(db, "blogs"));
        querySnapshotBlogs.forEach((doc) => {
            list.push(doc.data())
        });

        const querySnapshotTransactions = await getDocs(collection(db, "transactions"));
        querySnapshotTransactions.forEach((doc) => {
            list.push(doc.data())
        });

        const querySnapshotTeam = await getDocs(collection(db, "team"));
        querySnapshotTeam.forEach((doc) => {
            list.push(doc.data())
        });
     
        setData(list)
      
      }

      fullData()
    }, [])

    
    return(
        <DataContext.Provider value={{data}}>
            {children}
        </DataContext.Provider>
    )
}

export const AllData = () => {
    return useContext(DataContext)
}





// MOD DATA
const ModContext = createContext()

export const ModContextProvider = ({children}) => {
    const [moddata, setmoddata] = useState({
        blogs: [],
        transactions: [],
        team: []
    })


    useEffect(() => {
        let blogsarr = []
        let transactionsarr = []
        let teamarr = []
       const getmoddata = async () => {

            const querySnapshotModbl = await getDocs(collection(db, "blogs"));
            querySnapshotModbl.forEach((doc) => {
                blogsarr.push(doc.data())
            });
            const querySnapshotModtr = await getDocs(collection(db, "transactions"));
            querySnapshotModtr.forEach((doc) => {
            transactionsarr.push(doc.data())
            });
            const querySnapshotModte = await getDocs(collection(db, "team"));
            querySnapshotModte.forEach((doc) => {
            teamarr.push(doc.data())
            });
       
        }

        getmoddata()
        setmoddata({...moddata, blogs: blogsarr, transactions: transactionsarr, team: teamarr })


    }, [])

    return(
        <ModContext.Provider value={{moddata}}>
            {children}
        </ModContext.Provider>
    )
}

export const Mod = () => {
    return useContext(ModContext)
}