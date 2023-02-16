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
const type = 'DraggableBodyRow';



const TableDraggable = ({loading}) => {
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

    const doc_Status_ref = doc(db, "team", record.id);

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
 


  useEffect(() => {
    const blogsRef = collection(db, "team");
    let q = query(blogsRef, orderBy("member_name", "asc"));
    const unsub = onSnapshot(q, (snapShot) => {
        let list = [];
        
        snapShot.docs.forEach((doc) => {
          list.push({id: doc.id, ...doc.data()})  
        })
        setBlogsAll(list)
      });
    
      return () =>  unsub() 
  }, [])

  let c = 1
  const columns = [
    {
      title: 'ID',
       dataIndex: 'id',
      width: "7%",
      render: (data) => <span> {c++}</span>,
    },
    {
      title: 'Image',
    //   dataIndex: "member_img",
      render: (data) => <img src={data.blog_image} alt="" style={{"width":"50px"}} />,
    },
    {
      title: 'Name',
    //   dataIndex:  "member_name",
      render: (data) => <Link to={`/members/edit/blog_id=${data.id}`} > {data.member_name} </Link>
    },
    {
      title: 'Description',
      dataIndex: "member_description",
      width: "25%",
      render: (data) => <span className={data.length >= 35 ? "text-elipse" : null}> {parse(data)} </span> 
    },
    {
      title: 'Contact',
      dataIndex: "member_contact",
      width: "10%",
      render: (data) => <div>{data.length > 0 ? data : "-"}</div>
    },
    {
      title: 'Create date',
    //   dataIndex: "member_date",
      render: (data) => <div> {data.member_date} </div>,
    },
    {
      title: 'Update date',
       dataIndex: "timeStamp",
   
      render: (data) => <div> {convertTimeStamp(data)} </div>,
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
      const dragRow = blogsAll[dragIndex];
      setBlogsAll(
        update(blogsAll, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      );
    },
    [blogsAll],
  );



  return (
    <>


      <DndProvider backend={HTML5Backend}>
        <Table
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