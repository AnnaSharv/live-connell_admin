import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Tag, Switch,Dropdown, Space, Menu, message } from 'antd';
import { db } from '../pages/firebase';
import {  doc, updateDoc } from "firebase/firestore";
import Copy from '../assets/icons/copy.svg'
import Dots from '../assets/icons/dots.svg'
import ModalDelete from './modalDelete';
import ModalDuplicate from './modalDuplicate';
import parse from 'html-react-parser';
import {websiteDomain} from '../App.js'
import {formatBlogType} from '../utils/formatBlogType'


import formatDate from '../utils/formatDate';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const MyTable = ({blogsAll, cat, loading}) => {

  const totalRows = blogsAll?.length || 0;


  const [messageApi, contextHolder] = message.useMessage();


  const success = (data) => {
    const {blog_title,id} = data
    let url = `${websiteDomain}/#/news/blogs/${blog_title.toLowerCase().split(" ").join("-").substring(0, 50)}?id=${id}`

    async function copyTextToClipboard() {
      if ('clipboard' in navigator) {
        return await navigator.clipboard.writeText(url);
      } else {
        return document.execCommand('copy', true, url);
      }
    }
    copyTextToClipboard()

  
    messageApi.open({
      type: 'success',
      content: 'Copied',
    });
  };

let convertTimeStamp = (timeStamp) => {

  var diff = Date.now() - timeStamp;
  var seconds = Math.floor(diff / 1000),
      minutes = Math.floor(seconds / 60),
      hours   = Math.floor(minutes / 60),
      days    = Math.floor(hours / 24),
      months  = Math.floor(days / 30);
     // years   = Math.floor(days / 365);
      seconds %= 60;
      minutes %= 60;
      hours %= 24;
      days %= 30;
      months %= 12;
 

    
  return (
    <>
      {months >= 1 && <span>{months} month(s) ago</span>}
      {months === 0 && days >= 1 &&  <span>{days} d ago</span>}
      {months === 0 && days === 0 && hours !== 0 && <span>{hours} h ago</span>}
      {months === 0 && days === 0 && hours === 0 && minutes > 0 &&<span>{minutes} mins {seconds} sec ago</span>}
      {months === 0 && days === 0 && hours === 0 && minutes === 0 && <span> {seconds} s ago</span>}
      
    </>
  );

 
}

  const handleStatusChange = async (record) => {
    const doc_Status_ref = doc(db, cat, record.id);

if (cat === "blogs") {
    if(record.blog_status === "active") {
      await updateDoc(doc_Status_ref, {
        blog_status: "archived"
      });
    }
    if(record.blog_status === "archived") {
      await updateDoc(doc_Status_ref, {
        blog_status: "active"
      });
    }
}
if (cat === "sliders") {
  // console.log("action here", record.slider_status)
    if(record.slider_status === "active") {
      await updateDoc(doc_Status_ref, {
        slider_status: "archived"
      });
    }
    if(record.slider_status === "archived") {
      await updateDoc(doc_Status_ref, {
        slider_status: "active"
      });
    }
}
if (cat === "transactions") {
  if(record.transactions_status === "active") {
    await updateDoc(doc_Status_ref, {
      transactions_status: "archived"
    });
  }
  if(record.transactions_status === "archived") {
    await updateDoc(doc_Status_ref, {
      transactions_status: "active"
    });
  }
} 
  //  NO REAL TIME
  // if(record.data.blog_status === "archived") {
  //   await updateDoc(doc_Status_ref, {
  //     blog_status: "active"
  //   });
  //   //window.location.reload()
  // }
}
 
 let columns;
 let dataid;
 

 if (cat === "sliders") {
  columns = [
   
    {
      title: 'No.',
      align: 'center',
      // dataIndex: 'id',
      width: "7%",
      render: (data, record, index) => {
        return <Link to={`/edit-slider/edit?slider_id=${data.id}`}  className={data?.slider_name?.length > 35 ? "text-elipse" : null}> 
            {totalRows - (tableParams.pagination.current - 1) * tableParams.pagination.pageSize - index}.
        </Link> 
      },
    },
    {
      title: "Name",
      // sorter: true,
      render: (data) => (
        <Link
          to={`/edit-slider/edit?slider_id=${data.id}`}
          className={data?.slider_name?.length > 35 ? "text-elipse" : null}
        >
          {" "}
          {data.slider_name}{" "}
        </Link>
      ),
      width: "16%",
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Button",
      // dataIndex:  "slider_button",
      width: "16%",
      // sorter:true,
      render: (data) => {
        let text =
          data.slider_button?.charAt(0)?.toUpperCase() +
          data.slider_button?.slice(1);
        return (
          <Link
            to={`/edit-slider/edit?slider_id=${data.id}`}
            className={data?.slider_name?.length > 35 ? "text-elipse" : null}
          >
            {" "}
            {text}{" "}
          </Link>
        );
      },
    },
    {
      title: "Status",
      //  dataIndex: "slider_status",
      width: "16%",
      render: (_) => (
        <Link
          to={`/edit-slider/edit?slider_id=${_.id}`}
          className={_?.slider_name?.length > 35 ? "text-elipse" : null}
        >
          <Tag
            className={
              _.slider_status === "active"
                ? "list_status lsactive"
                : "archived"
                ? "list_status lsarchived"
                : "list_status ls404"
            }
          >
            {_.slider_status}
          </Tag>
        </Link>
      ),
      // render: (_) => (<Tag className={_ === "active" ? "list_status lsactive" : "archived" ? "list_status lsarchived" : "list_status ls404"}>{_}</Tag>),
    },

    {
      title: "Update date",
      width: "16%",
      // dataIndex: "timeStamp",
      render: (data) => (
        <Link
          to={`/edit-slider/edit?slider_id=${data.id}`}
          className={data?.slider_name?.length > 35 ? "text-elipse" : null}
        >
          <div> {convertTimeStamp(data.timeStamp)} </div>
        </Link>
      ),
    },
    {
      title: "Settings",
      width: "16%",
      dataIndex: "slider_status",
      render: (_, record) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "50px",
            }}
          >
            <Switch
              defaultChecked={record.slider_status === "active" ? true : false}
              size="small"
              style={{ marginRight: "30px" }}
              onChange={() => handleStatusChange(record)}
            />
            <Dropdown
              dropdownRender={() => (
                <div className="dropdown-content my-dropdown my-dropdown-for-table">
                  <Menu>
                    <Menu.Item
                      key="ad"
                      className="my-dropdown-list-item"
                      onClick={() => {
                        handleStatusChange(record);
                      }}
                      style={{ height: "30px !important" }}
                    >
                      Activate/Deactivate
                    </Menu.Item>
                    <Menu.Item
                      key="dupl"
                      className="my-dropdown-list-item"
                    >
                      <ModalDuplicate
                        record={record}
                        dbName={"sliders"}
                        db={blogsAll}
                      />
                    </Menu.Item>
                    <Menu.Item
                      key="del"
                      className="my-dropdown-list-item"
                    >
                      <ModalDelete
                        docId={record.id}
                        dbName={"sliders"}
                        db={blogsAll}
                      />
                    </Menu.Item>
                  </Menu>
                </div>
              )}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <img src={Dots} alt="" />
                </Space>
              </a>
            </Dropdown>
          </div>
      ),
    },
  ];
}
  if (cat === "blogs") {
    columns = [ 
      {
        title: 'No.',
        align: 'center',
        // dataIndex: 'id',
        width: "7%",
        render: (data, record, index) => {
          return <Link to={`/bloginside/edit/blog_id=${data.id}`} className={data?.blog_title?.length > 35 ? "text-elipse text-center" : null}> 
              {totalRows - (tableParams.pagination.current - 1) * tableParams.pagination.pageSize - index}.
          </Link> 
        },
      },
      {
        title: 'Name',
        // sorter: true,
        render: (data) => <Link to={`/bloginside/edit/blog_id=${data.id}`} className={data?.blog_title?.length > 35 ? "text-elipse" : null}> {data?.blog_title} </Link> ,
        width: "25%",
        ellipsis: {
            showTitle: false,
          }
      },
      {
        title: 'Link',
        //dataIndex:  "blog_permalink",
        width: "7%",
        // sorter:true,
        render: (data) => <div onClick={() => success(data)} style={{"cursor":"pointer"}}> {contextHolder} <img src={Copy} alt=""/></div> 
      },
      {
        title: 'Type',
        //dataIndex: "blog_type",
        render: (data) => <Link to={`/bloginside/edit/blog_id=${data.id}`}> 
                              <div className='table-blog_type blog_type_multiwords'> {formatBlogType(data?.blog_type)} </div> 
                           </Link>
      },
      {
        title: 'Status',
       // dataIndex: "blog_status",
        // sorter:true,
        render: (_) => (
            <>
              <Link to={`/bloginside/edit/blog_id=${_.id}`} className={_?.blog_title?.length > 35 ? "text-elipse" : null}> 
                <Tag className={_.blog_status=== "active" ? "list_status lsactive" : "archived" ? "list_status lsarchived" : "list_status ls404"}>{_.blog_status}</Tag>
              </Link>
            </>
          ),
      },
      {
        title: 'Create date',
       // dataIndex: "blog_date",
        render: (data) => <Link to={`/bloginside/edit/blog_id=${data.id}`} className={data?.blog_title?.length > 35 ? "text-elipse" : null}>
           <div>{formatDate(data?.blog_date)}</div>
          </Link> ,
      },
      {
        title: 'Update date',
        // dataIndex: "timeStamp",
     
        render: (data) => <Link to={`/bloginside/edit/blog_id=${data.id}`} >
          <div> {convertTimeStamp(data.timeStamp)} </div>
          </Link>,
      },
      {
        title: 'Settings',
        dataIndex:  "blog_status",
        render: (_, record) => <div>
        <Switch defaultChecked={record.blog_status === "active" ? true : false} size="small" style={{"marginRight" : "30px"}}
        onChange={() =>  handleStatusChange(record)}
        />
        <Dropdown
        
         dropdownRender={() => (
           <div className="dropdown-content my-dropdown">
          
            <Menu>
              <Menu.Item key="ad" className='my-dropdown-list-item' onClick={() => handleStatusChange(record)}>Activate/Deactivate</Menu.Item>
              <Menu.Item key="dupl" className='my-dropdown-list-item'>
                 <ModalDuplicate record={record} dbName={"blogs"} db={blogsAll} />
              </Menu.Item>
              <Menu.Item key="del" className='my-dropdown-list-item'>
                <ModalDelete docId={record.id} dbName={"blogs"} db={blogsAll} />
              </Menu.Item>
            </Menu>
         
          </div>
        )}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
           <img src={Dots} alt=""/>
          </Space>
        </a>
      </Dropdown>
        </div> 
      },
   
    ];
  }
  if (cat === "transactions") {
    columns = [
      {
        title: 'No.',
        // dataIndex: 'id',
        width: "7%",
        align: 'center',
        render: (data, _, index) => {
          return <Link  to={`/addTransaction/edit/transaction_id=${data.id}`}  className={data?.transactions_title?.length >= 35 ? "text-elipse" : null}>  
                  {totalRows - (tableParams.pagination.current - 1) * tableParams.pagination.pageSize - index}.
           </Link> 
        },
      },
      {
        title: 'Image',
        // sorter:true,
        render: (data) => <Link  to={`/addTransaction/edit/transaction_id=${data.id}`}  className={data?.transactions_title?.length >= 35 ? "text-elipse" : null}>  
            <div style={{"cursor":"pointer"}}> 
              {contextHolder} <img src={data.transactions_image} width="50px" alt=""/> 
            </div>
        </Link> 
, 
        responsive: ['sm']
      },
      {
        title: 'Year',
        // sorter: true,
        render: (data) => <Link  to={`/addTransaction/edit/transaction_id=${data.id}`}  className={data?.transactions_title?.length >= 35 ? "text-elipse" : null}>  <span>{data.transactions_year}</span> </Link>,
        ellipsis: {
            showTitle: false,
          }
      },
      {
        title: 'Description',
        width: "30%",
        render: (data) => <Link  to={`/addTransaction/edit/transaction_id=${data.id}`}  className={data?.transactions_title?.length >= 35 ? "text-elipse" : null}>  {data.transactions_title} </Link> 
      },
      {
        title: 'Create date',
        render: (data) => <Link  to={`/addTransaction/edit/transaction_id=${data.id}`}  className={data?.transactions_title?.length >= 35 ? "text-elipse" : null}>  <div>  {data.transactions_date} </div> </Link>
      },
      {
        title: 'Update date',
         dataIndex: "timeStamp",
     
        render: (data) => <Link  to={`/addTransaction/edit/transaction_id=${data.id}`}  className={data?.transactions_title?.length >= 35 ? "text-elipse" : null}>  <div> {convertTimeStamp(data)} </div> </Link>,
      },
      {
        title: 'Settings',
        dataIndex:  "transactions_status",
        render: (_, record) => <div>
        <Switch defaultChecked={record.transactions_status === "active" ? true : false} size="small" style={{"marginRight" : "30px"}}
        onChange={() =>  handleStatusChange(record)}
        />
        <Dropdown
        
         dropdownRender={() => (
           <div className="dropdown-content my-dropdown">
          
            <Menu>
              <Menu.Item key="ad"  onClick={() => handleStatusChange(record)}>Activate/Deactivate</Menu.Item>
              <Menu.Item key="dupl">
                 <ModalDuplicate record={record} dbName={"transactions"} db={blogsAll} />
              </Menu.Item>
              <Menu.Item key="del">
                <ModalDelete docId={record.id} dbName={"transactions"} db={blogsAll} />
              </Menu.Item>
            </Menu>
         
          </div>
        )}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
           <img src={Dots} alt=""/>
          </Space>
        </a>
      </Dropdown>
        </div> 
      },
   
    ];
  }
  if (cat === "team") {
   columns = [
      {
        title: 'No.',
        dataIndex: 'id',
        align: 'center',
        width: "7%",
        render: (data, _, index) => <Link to={`/members/edit/blog_id=${data.id}`}> {totalRows - (tableParams.pagination.current - 1) * tableParams.pagination.pageSize - index}.</Link>
      },
      {
        title: 'Image',
        width: "10%",
      //   dataIndex: "member_img",
        render: (data) => <LazyLoadImage effect='blur' src={data.blog_image} alt="" style={{"width":"50px"}} />,
      },
      {
        title: 'Name',
        width: "15%",
      //   dataIndex:  "member_name",
        render: (data) => {
          dataid = data.id
          return <Link to={`/members/edit/blog_id=${data.id}`}> {data.member_name}</Link>
        }
      },
      {
        title: 'Description',
       // dataIndex: "member_description",
        width: "25%",
        render: (data) =>  <Link to={`/members/edit/blog_id=${data.id}`}> 
                              <span className={data.member_description?.length >= 35 ? "text-elipse" : null}> {parse(data.member_description)} </span> 
                          </Link>
      },
      {
        title: 'Contact',
       // dataIndex: "member_contact",
        width: "10%",
        render: (data) => <Link to={`/members/edit/blog_id=${data.id}`}> <div>{data.member_contact?.length > 0 ? data.member_contact : "-"}</div> </Link>
        // render: (data) => <div>{data.length > 0 ? data : "-"}</div>
      },
      {
        title: 'Create date',
      //   dataIndex: "member_date",
        render: (data) => <Link to={`/members/edit/blog_id=${data.id}`}> <div> {data.member_date} </div> </Link>
      },
      {
        title: 'Update date',
        //dataIndex: "timeStamp",
     
        render: (data) => <Link to={`/members/edit/blog_id=${data.id}`}> <div> {convertTimeStamp(data.timeStamp)} </div> </Link>
      },
      {
        title: 'Settings',
        dataIndex:  "member_status",
        width: "10%",
        render: (_, record) => <div>
        <Switch defaultChecked={record.member_status == "active" ? true : false} size="small" style={{"marginRight" : "30px"}}
        onChange={() =>  handleStatusChange(record)}
        />
        <Dropdown
        
         dropdownRender={() => (
           <div className="dropdown-content my-dropdown">
          
            <Menu>
              <Menu.Item key="ad"  className='my-dropdown-list-item'  onClick={() => handleStatusChange(record)}>Activate/Deactivate</Menu.Item>
              <Menu.Item key="dupl" className='my-dropdown-list-item' >
                 <ModalDuplicate record={record} dbName={"team"} db={blogsAll} />
              </Menu.Item>
              <Menu.Item key="del" className='my-dropdown-list-item' >
                <ModalDelete docId={record.id} dbName={"team"} db={blogsAll} />
              </Menu.Item>
            </Menu>
         
          </div>
        )}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
           <img src={Dots} alt=""/>
          </Space>
        </a>
      </Dropdown>
        </div> 
      },
   
    ];
  }
 
    
 


  
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const onRow = (record, rowIndex) => {
    return {
      onClick: (event) => {
       // console.log(record, rowIndex);
      },
    };
  };

  return (
    <>

    <Table
        columns={columns}
        rowKey={(record) => record.id + Math.random()}
        onRow={onRow}
        dataSource={blogsAll || null}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      /> 
    </>
    
  );
};
export default MyTable;