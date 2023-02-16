import React, { useState } from 'react';
import { Modal } from 'antd';
import icon4 from "../assets/icons/Vector-3.svg"
const LogoutModal = (props) => {
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const hideModal = () => {
    setOpen(false);
  };
  return (
    <>
      <div onClick={showModal}>
        <img src={icon4} style={{marginRight: "0.8rem"}}/> 
        <span>Log out</span> 
      </div>
      <Modal
        // title="Modal"
        open={open}
        onOk={() => {
          hideModal()
          props.logout()
        }}
        onCancel={hideModal}
        okText="Sign out"
        cancelText="Cancel"
       
      >
        <p> Log out?</p>
      </Modal>
    </>
  );
};


export default LogoutModal;