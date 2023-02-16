import React, { useState } from 'react';
import {db} from '../pages/firebase'
import { doc, deleteDoc, increment, updateDoc } from "firebase/firestore";

import {  Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import {adminDomain} from '../App.js'



const ModalDelete = ({docId, dbName, setBlogsAll, redirect, decrementfield}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()
  const admin_domain = adminDomain
  return (
    <>
      <button type='button' disabled={false} className='button button-no_outline_no' style={{"fontWeight":"bold"}} onClick={() => setOpen(true)}>
        Delete
      </button>
      <Modal
        title="Delete?"
        centered
        open={open}
        onOk={() => {
          let field = decrementfield
          // console.log(decrementfield, field, dbName, "o")
          setOpen(false)
          const del = async () => {
            await deleteDoc(doc(db, dbName, docId));
          //  if(redirect) {
          //   dbName === "team" 
          //   ? window.location.href = adminDomain + "/members"
          //   : dbName === "transactions" ? window.location.href = adminDomain + "/transactions" 
          //   : window.location.href = adminDomain + "/bloglist/all"
          //  }
           if(redirect) {
            dbName === "team" 
            ? navigate(-1)
            : dbName === "transactions" ? window.location.href = admin_domain + "/transactions" 
            : navigate(-1)
           }
            
          }
          del()

          const decr = async () => {
            const countRef = doc(db, "length", "length");
            // dbName === "blogs" && await updateDoc(countRef, {
            //   blogs: increment(-1)
            // });
            // dbName === "team" && await updateDoc(countRef, {
            //   members: increment(-1)
            // });
            // dbName === "transactions" && await updateDoc(countRef, {
            //   transactions: increment(-1)
            // });
             await updateDoc(countRef, {
              [dbName]: increment(-1)
            });
          }

          decr()
        }}
        onCancel={() => setOpen(false)}
        width={1000}
      >
        <p> Document will be permanently deleted </p>
      </Modal>
    </>
  );
};
export default ModalDelete;
