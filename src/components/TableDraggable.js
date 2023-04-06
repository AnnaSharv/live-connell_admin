import React, { useEffect, useState, useCallback, useRef } from 'react';

import { Link } from 'react-router-dom';
import { Table, Switch,Dropdown, Space,  Menu, message } from 'antd';

import { db } from '../pages/firebase';
import { collection, query, doc, updateDoc, onSnapshot,  orderBy } from "firebase/firestore";
import parse from 'html-react-parser';

import Dots from '../assets/icons/dots.svg'
import ModalDelete from './modalDelete';
import ModalDuplicate from './modalDuplicate';
import 'firebase/compat/firestore';

import update from 'immutability-helper';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import formatDate from '../utils/formatDate';
const type = 'DraggableBodyRow';


const TableDraggable = ({loading,cat, blogtransactions}) => {
  let tableRef = useRef()
  const messageApi = message.useMessage();
  const [blogsAll, setBlogsAll] = useState([])
  const success = (data) => {
    async function copyTextToClipboard() {
      if ('clipboard' in navigator) {
        return await navigator.clipboard.writeText(data);
      } else {
        return document.execCommand('copy', true, data);
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
      months  = Math.floor(days / 30),
      years   = Math.floor(days / 365);
      seconds %= 60;
      minutes %= 60;
      hours %= 24;
      days %= 30;
      months %= 12;
 

    
  return (
    <>
      {months > 1 &&  <span>{months} month ago</span>}
      {days >= 1 &&  <span>{days} d ago</span>}
      {months === 0 && days === 0 && hours !== 0 && <span>{hours} h ago</span>}
      {months === 0 && days === 0 && hours === 0 && minutes > 0 &&<span>{minutes} mins {seconds} sec ago</span>}
      {months === 0 && days === 0 && hours === 0 && minutes === 0 && <span> {seconds} s ago</span>}
    </>
  );

 
  }

  const handleStatusChange = async (record) => {
    let doc_Status_ref;

    if(cat === "team") {
       doc_Status_ref = doc(db, "team", record.id);

      if(record.member_status === "active") {
        await updateDoc(doc_Status_ref, {
          member_status: "archived"
        });
      }
      if(record.member_status === "archived") {
        await updateDoc(doc_Status_ref, {
          member_status: "active"
        });
      }
    }
    if(cat === "transactions") {
       doc_Status_ref = doc(db, "transactions", record.id);

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
  }
    
 


  useEffect(() => {
    if(cat === "team") {
      const blogsRef = collection(db, "team");
      let q = query(blogsRef, orderBy("orderId", "asc"));
      const unsub = onSnapshot(q, (snapShot) => {
          let list = [];
          
          snapShot.docs.forEach((doc) => {
            list.push({id: doc.id, ...doc.data()})  
          })
          setBlogsAll(list)
        });


        return () =>  unsub() 
    }
    if(cat === "transactions") {
      const blogsRef = collection(db, "transactions");
      // let q = blogsRef;
      // let q = query(blogsRef, orderBy("timeStamp", "desc"));
       let q = query(blogsRef, orderBy("orderId", "asc"));
      const unsub = onSnapshot(q, (snapShot) => {
          let list = [];
          
          snapShot.docs.forEach((doc) => {
            list.push({id: doc.id, ...doc.data()})  
          })
          setBlogsAll(list)
        });


        return () =>  unsub() 
    }
    
     console.log("render times")
  }, [])

  let c = 1
  let columns;
  if (cat === "team") {
  columns = [
    {
      title: 'No.',
      dataIndex: 'id',
      align: 'center',
      width: "7%",
      render: (data, _, index) => <Link to={`/members/edit/blog_id=${data.id}`}> {c++}.</Link>
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
  if (cat === "transactions") {
    columns = [
      {
        title: 'No.',
        // dataIndex: 'id',
        width: "7%",
        align: 'center',
        render: (data, _, index) => {
          return <div title={c++} onClick={() => {
            let id = data.id
            let itemRef = doc(db, "transactions", data.id);
            async function updateOrderId() {
              await updateDoc(itemRef, {
                orderId: index
              });
            }
            updateOrderId()
            console.log("updating", data.id, index)
            
          }}
          >  
                  {c-1}.
           </div> 
          // return <Link  to={`/addTransaction/edit/transaction_id=${data.id}`}  target="_blank" state={{orderId: blogsAll?.length + 1}} className={data?.transactions_title?.length >= 35 ? "text-elipse" : null}>  
          //         {c++}.
          //  </Link> 
        },
      },
      {
        title: 'Image',
        // sorter:true,
        render: (data) => <Link  to={`/addTransaction/edit/transaction_id=${data.id}`}  className={data?.transactions_title?.length >= 35 ? "text-elipse" : null}>  
            <div style={{"cursor":"pointer"}} title={data.draft_id || data.id}> 
              <LazyLoadImage effect='blur' src={data.transactions_image} width="50px" alt="transaction_tombstone"/>  
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
        render: (data) => <Link  to={`/addTransaction/edit/transaction_id=${data.id}`}  className={data?.transactions_title?.length >= 35 ? "text-elipse" : null}>  <span title={data?.transactions_title}>{data.transactions_title}</span> </Link> 
      },
      {
        title: 'Create date',
        render: (data) => <Link  to={`/addTransaction/edit/transaction_id=${data.id}`}  className={data?.transactions_title?.length >= 35 ? "text-elipse" : null}>  
          {/* <div>  {data.transactions_date}  </div>  */}
          <div>
            {
            /[a-zA-Z]/.test(data.transactions_date)
              ? data.transactions_date
              : formatDate(data.transactions_date)
            }
          </div>
        </Link>
      },
      {
        title: 'Update date',
         dataIndex: "timeStamp",
     
        render: (data) => <Link  to={`/addTransaction/edit/transaction_id=${data.id}`}  className={data?.transactions_title?.length >= 35 ? "text-elipse" : null}>  <div> {convertTimeStamp(data)}  </div> </Link>,
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




  const DraggableBodyRow = ({ index, moveRow, className, style, ...restProps }) => {
    const ref = useRef(null);
    const [{ isOver, dropClassName }, drop] = useDrop({
      accept: type,
      collect: (monitor) => {
        const { index: dragIndex } = monitor.getItem() || {};
        if (dragIndex === index) {
          return {};
        }
        return {
          isOver: monitor.isOver(),
          dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
        };
      },
      drop: (item) => {
        moveRow(item.index, index);
      },
    });
    const [, drag] = useDrag({
      type,
      item: {
        index,
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
    drop(drag(ref));
    return (
      <tr
        ref={ref}
        className={`${className}${isOver ? dropClassName : ''}`}
        style={{
          cursor: 'move',
          ...style,
        }}
        {...restProps}
      />
    );
  };
  const components = {
    body: {
      row: DraggableBodyRow,
    },
  };

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
     
     

      
      let dragRow;
      let orderItem1;
      let orderItem2;

      if(cat === "team") {
        dragRow = blogsAll[dragIndex];
        orderItem1 = doc(db, "team", dragRow.id);
        orderItem2 = doc(db, "team", blogsAll[hoverIndex].id)
      }
      if(cat === "transactions") {
        console.log("hohoho")
        dragRow = blogsAll[dragIndex];
        orderItem1 = doc(db, "transactions", dragRow.id);
        orderItem2 = doc(db, "transactions", blogsAll[hoverIndex].id)
      }
     
      async function updateOrderId() {
        console.log("updating",orderItem1,orderItem2)
        const update1 = updateDoc(orderItem1, { orderId: hoverIndex });
        const update2 = updateDoc(orderItem2, { orderId: dragIndex });
        await Promise.all([update1, update2]);
      }

      updateOrderId()
      setBlogsAll(
        update(blogsAll, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      );
console.log("xxx",dragIndex, hoverIndex)
     
    },
    [blogsAll],
  );



  return (
    <>


      <DndProvider backend={HTML5Backend}>
        <Table
        style={{
          paddingBottom: '120px'
        }}
         pagination={false}
          loading={loading}
          ref={tableRef}
          columns={columns}
          rowKey={(record) => record.id + Math.random()}
          dataSource={blogsAll || null}
          components={components}
          onRow={(_, index) => {
            
            const attr = {
              index,
              moveRow,
            };
            return attr;
          }}
        />
      </DndProvider>
    </>
  );
};
export default TableDraggable;