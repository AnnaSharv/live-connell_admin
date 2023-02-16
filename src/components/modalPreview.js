import React, { useState } from 'react';
import {  Modal, Row, Col } from 'antd';
import parse from 'html-react-parser';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import MailIcon from '../assets/icons/mail_icon.svg'


const ModalPreview = ({vals, img, cat, images, fullWidth}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="button button-no_active"
        onClick={() => setOpen(true)}
     style={{
      width: fullWidth ? '100%' : 'auto'
     }}
      >
        Preview
      </button>
      <Modal
        title={cat === "team" ? "Team member profile" : "Blog preview"}
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={cat === "team" ? 1180 : 2000}
      >
        {cat === "team" ? (
          <Row className='team-member-preview container-custom' gutter={80}>
            <Col sm={24} md={10}>
                {img && img.firebaseLink.length !== 0  && <img src={img.firebaseLink} width="220px" height="auto" alt="blog_img" className='team_member_img'/>} 
            </Col>
            <Col sm={24} md={14}>
                <h1 className='member_text-header'>{vals.member_name}</h1>
                <p className='member_text-subheader'>{vals.member_position}</p>
                <div className='text-regular'>{parse(vals.member_description)}</div>

                <div class="email-wrapper" style={{display: 'flex', gap: '15px', marginTop: 40}}>
                  <img src={MailIcon} width={22} height={18}/>
                  <p className='text-regular-bold'>{vals.member_contact}</p>
                </div>

            </Col>
          
          </Row>
          
        ) :
        (
          <div className='single-news container-custom'>
            <h1 className='title'>{vals.blog_title}</h1>
            <p className='meta-info'>{vals.blog_date}</p>
            {img && img.firebaseLink.length !== 0  && <img src={img.firebaseLink} width="100%" alt="blog_img" />}


            {images.length > 0 &&
            // <Carousel className='preview-carousel' width="100%">
            //   {
            //     images.map((singleImg,i) => {
            //       return (
            //         <img src={singleImg.blog_image} key={i} alt={singleImg.blog_image_name}/>
            //       );
            //     })
            //   }
            // </Carousel>
            <img src={images[0].blog_image} alt={images[0].blog_image_name} width="100%"/>
            }

            <div className='text-regular'>{parse(vals.blog_body)}</div>
          </div>
        )
        }
      </Modal>
    </>
  );
};

export default ModalPreview