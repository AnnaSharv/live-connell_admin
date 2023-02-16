import React, { useEffect, useRef, useState, useContext } from "react";
import { useLocation } from 'react-router-dom'
import { collection,  onSnapshot } from "firebase/firestore";
import { auth } from "../pages/firebase";
import LogoutModal from '../components/LogoutModal.js'
import {db} from '../pages/firebase'
import icon1 from "../assets/icons/Group 8.svg"
import icon2 from "../assets/icons/Vector-1.svg"
import icon3 from "../assets/icons/Vector-2.svg"
import icon4 from "../assets/icons/Vector-3.svg"
import icon5 from "../assets/icons/Vector-4.svg"
import icon6 from "../assets/icons/Vector-5.svg"
import icon7 from "../assets/icons/Vector.svg"
import icon8 from '../assets/icons/members.svg'
import sliderIcon from '../assets/icons/slider_icon.svg'

import { Link } from "react-router-dom";


import { Layout, Menu } from "antd";
import Searchbar from "./Searchbar";
import { signOut } from "firebase/auth";
import { UserContext } from "../pages/UserContext";
const { Header, Content, Footer, Sider } = Layout;










function Sidebar(props) {
  const sidebar = useRef()
  const {useStatus, setUserStatus} = useContext(UserContext)
  const [length, setLength] = useState([])
  const [gl,setgl] = useState(null)
  const {pathname} = useLocation()
  const [collapsed, setcollapsed] = useState(false)
  useEffect(() => {
  
      
    const countRef = collection(db, "length");
    const unsub = onSnapshot(countRef, (snapShot) => {
        let list = [];
        
        snapShot.docs.forEach((doc) => {
          list.push({
            blogs: doc.data().blogs,
            team: doc.data().team,
            transactions: doc.data().transactions,
            gallery: doc.data().gallery,
            sliders: doc.data().sliders
          });
        })
        setLength(list)
      });


     
      return () =>  unsub() 
  }, [])
  useEffect(() => {
  
      
    const countRef = collection(db, "images");
    const unsub = onSnapshot(countRef, (snapShot) => {
        let list = [];
        
        snapShot.docs.forEach((doc) => {
          list.push(doc);
        })
        setgl(list)
      
      });

      return () =>  unsub() 
  }, [])


  const logout = async () => {
    signOut(auth)
    setUserStatus(false)
    console.log("LOGOUT")
  }




const items = [
  // {
    //     label: (
      //       <Link to="pages"  rel="noopener noreferrer">
      //        <span> <img src={icon7} /> </span>  
      //        <span>Website pages</span> 
      //        <span className="number_container">?</span>
      //       </Link>
      //     ),
      //     key: '1',
      // },
      // {
        //     label: (
          //       <Link to="editors"  rel="noopener noreferrer">
          //        <span><img src={icon2} /></span>  
          //        <span>Editors</span> 
          //        <span className="number_container">?</span>
          //       </Link>
          //     ),
          //     key: '2',
          // },

          //PAGES
      // {
      //       label: (
      //         <Link to="pages" rel="noopener noreferrer" className={pathname.includes("pages") ?  "my-active-link" : null}>
      //      <span><img src={icon6} /></span>  
      //      <span>Pages</span> 
      //      <span className="number_container">?</span>
      //     </Link>
      //   ),
      //   key: '3',
      // },
      {
        label: (
          <Link to="sliders"  rel="noopener noreferrer" className={pathname.toLocaleLowerCase().includes("slider")  ?  "my-active-link" : null} >
           <span><img src={sliderIcon} /></span>  
           <span>Sliders</span> 
           <span className="number_container"> { length[0]?.sliders || 0 } </span>
          </Link>
        ),
        key: '3',
      },
      {
        label: (
          <Link to="bloglist/all"  rel="noopener noreferrer" className={pathname.toLocaleLowerCase().includes("bloglist")  ?  "my-active-link" : null} >
           <span><img src={icon1} /></span>  
           <span>Blogs</span> 
           <span className="number_container"> { length[0]?.blogs || 0 } </span>
          </Link>
        ),
        key: '4',
      },
      {
        label: (
          <Link to="members"  rel="noopener noreferrer" className={pathname.toLocaleLowerCase().includes("member") ?  "my-active-link" : null}>
           <span><img src={icon8} /></span>  
           {/* <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 16C3.5816 16 0 12.4184 0 8C0 3.5816 3.5816 0 8 0C12.4184 0 16 3.5816 16 8C16 12.4184 12.4184 16 8 16ZM8 14.4C9.69739 14.4 11.3253 13.7257 12.5255 12.5255C13.7257 11.3253 14.4 9.69739 14.4 8C14.4 6.30261 13.7257 4.67475 12.5255 3.47452C11.3253 2.27428 9.69739 1.6 8 1.6C6.30261 1.6 4.67475 2.27428 3.47452 3.47452C2.27428 4.67475 1.6 6.30261 1.6 8C1.6 9.69739 2.27428 11.3253 3.47452 12.5255C4.67475 13.7257 6.30261 14.4 8 14.4ZM8 3.2C8.84869 3.2 9.66263 3.53714 10.2627 4.13726C10.8629 4.73737 11.2 5.55131 11.2 6.4V8C11.2 8.84869 10.8629 9.66263 10.2627 10.2627C9.66263 10.8629 8.84869 11.2 8 11.2C7.15131 11.2 6.33737 10.8629 5.73726 10.2627C5.13714 9.66263 4.8 8.84869 4.8 8V6.4C4.8 5.55131 5.13714 4.73737 5.73726 4.13726C6.33737 3.53714 7.15131 3.2 8 3.2ZM8 4.8C7.57565 4.8 7.16869 4.96857 6.86863 5.26863C6.56857 5.56869 6.4 5.97565 6.4 6.4V8C6.4 8.42435 6.56857 8.83131 6.86863 9.13137C7.16869 9.43143 7.57565 9.6 8 9.6C8.42435 9.6 8.83131 9.43143 9.13137 9.13137C9.43143 8.83131 9.6 8.42435 9.6 8V6.4C9.6 5.97565 9.43143 5.56869 9.13137 5.26863C8.83131 4.96857 8.42435 4.8 8 4.8ZM4.728 13.5008C4.26719 13.2263 3.84255 12.8952 3.464 12.5152C3.93918 11.9568 4.54482 11.5243 5.2272 11.256C5.32556 11.214 5.43133 11.1922 5.53826 11.1918C5.6452 11.1914 5.75112 11.2125 5.84978 11.2537C5.94844 11.295 6.03783 11.3556 6.11265 11.432C6.18748 11.5084 6.24624 11.599 6.28545 11.6985C6.32465 11.798 6.34352 11.9043 6.34092 12.0112C6.33833 12.1181 6.31432 12.2234 6.27034 12.3209C6.22635 12.4184 6.16326 12.506 6.08481 12.5787C6.00636 12.6514 5.91414 12.7076 5.8136 12.744C5.388 12.912 5.0192 13.1744 4.7272 13.5008H4.728ZM11.2432 13.5184C10.9334 13.1758 10.5469 12.9115 10.1152 12.7472C10.014 12.7121 9.92094 12.657 9.84145 12.5853C9.76195 12.5135 9.69768 12.4265 9.65242 12.3295C9.60717 12.2324 9.58186 12.1273 9.57799 12.0203C9.57413 11.9133 9.59179 11.8065 9.62994 11.7065C9.66807 11.6064 9.72592 11.515 9.80003 11.4377C9.87415 11.3604 9.96302 11.2988 10.0614 11.2565C10.1598 11.2142 10.2656 11.1921 10.3727 11.1914C10.4798 11.1908 10.5859 11.2117 10.6848 11.2528C11.3918 11.5217 12.0201 11.9637 12.512 12.5384C12.1316 12.9168 11.7054 13.246 11.2432 13.5184Z" fill="#9BA5B5"/>
            </svg> */}
           <span>Team members</span> 
           <span className="number_container"> { length[0]?.team || 0 } </span>
          </Link>
        ),
        key: '5',
      },
    {
        label: (
          <Link to="transactions"  rel="noopener noreferrer" className={pathname.toLocaleLowerCase().includes("transaction") ?  "my-active-link" : null}>
           <span><img src={icon5} /></span>  
           <span>Transactions</span> 
           <span className="number_container">{ length[0]?.transactions || 0 }</span>
          </Link>
        ),
        key: '6',
      },
      {
        label: (
          <Link to="gallery"  rel="noopener noreferrer" className={pathname.toLocaleLowerCase().includes("gallery") ?  "my-active-link" : null}>
           <span><img src={icon3} /></span>  
           <span>Gallery</span> 
           <span className="number_container">{ gl?.length || 0 }</span>
          </Link>
        ),
        key: '7',
      },
      {
        label: (
          <div className="logoutWrapper">
           {/* <span><img src={icon4} /></span>   */}
           {/* <span>Log out </span>  */}
           <LogoutModal logout={logout}/>
          </div>
        ),
        key: '8',
      },
      
    ];

    return (
      <div>
        
        <Layout hasSider>
    <Sider collapsible  width={240} ref={sidebar} className={collapsed === true ? "my-collapsed-sidebar" : "my-sider"}
            onCollapse={(collapsed, type) => {
              setcollapsed(collapsed)
            }}
    
    style={{
      overflow: "auto",
      height: "100vh",
      position: "fixed",
      zIndex: 2,
      left: 0,
      top: 0,
      bottom: 0,
    }}
    >
      <div className="logo" />
      <Menu
      
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={items}
        className="menu-custom"
      />


    </Sider>
    <Layout
      className="site-layout"
      style={{
        marginLeft: 240,
        transition: "0.4s"

      }}
    >
      <Header
        className="site-layout-background"
        style={{
          padding: 0,
          borderRadius: "4px"
        }}>
            <Searchbar updateGlobalSearchArray={props.updateGlobalSearchArray} hi={"hi22"}/>
      </Header>
      <Content
        style={{
          marginLeft: "20px",
          // marginTop: "50px",
          overflow: "initial",
        }}
      >
        <div className="site-layout-background content">
          {props.children} 
        </div>
      </Content>

    
    </Layout>
        </Layout>
    </div>
  )
}

export default Sidebar
