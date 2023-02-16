import React, {useEffect, useState, useRef} from 'react'
import Searchicon from "../assets/icons/search.svg"
import {AllData} from '../context.js'
import parse from 'html-react-parser';
import {Divider, List, Skeleton} from 'antd'

import InfiniteScroll from 'react-infinite-scroll-component';
function Searchbar() {
  const rawData = AllData()
  const ref = useRef()
  const [data, setData] = useState([])
  const [open, isOpen] = useState(false)



  useEffect(() => {
    setData(rawData?.data)
  }, [rawData])

  useEffect(() => {
    function checkClickOutsideDropdown (e) {
      if(open && !ref.current?.contains(e.target)) {
        isOpen(false)
      }
    }

    document.addEventListener("click", checkClickOutsideDropdown)
  }, [open])


  
  return (
    <div className='searchBar' ref={ref}
    onClick={() => isOpen(!open)}
    >
      
      <div style={{"position":"relative"}}>
        <img src={Searchicon} width={16} alt="search_icon" />
        <input placeholder='Search in Admin panel' type="text" onChange={(e) => {
         // setSearchword(e.target.value)
         
          let list = rawData.data.filter((filt) => {
            return    filt.blog_title?.includes(e.target.value) 
                  ||  filt.blog_body?.includes(e.target.value) 
                  ||  filt.transactions_title?.includes(e.target.value) 
                  ||  filt.member_name?.includes(e.target.value) 
                  ||  filt.member_description?.includes(e.target.value) 
          })
          setData(list)
          isOpen(true)

        }}/>
      </div>
        



  <div
      id="scrollableDiv"
      style={{
        maxHeight: 300,
        overflow: 'auto',
        marginTop: "5px",
        boxShadow: "0 0 20px 0px #d9d9d9",
        display: open ? "block" : "none"
      }}
    >
      {/* <InfiniteScroll
        dataLength={data?.length}
       // next={loadMoreData}
        // hasMore={data.length > 3}
        loader={
          <Skeleton
            paragraph={{
              rows: 1,
            }}
            active
          />
        }
        endMessage={<Divider plain>No more posts match your search</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List
        itemLayout="horizontal"
          dataSource={data}
          renderItem={(item,i) => (
            <List.Item key={i}>
              <List.Item.Meta
                title={<a href="https://ant.design" className='text-elipse'>{item.blog_title || item.member_name}</a>}
                description={<div className='text-elipse'> {item.blog_body && parse(item.blog_body) || item.member_description && parse(item.member_description)} </div>}
              />
            </List.Item>
          )}
        />
      </InfiniteScroll> */}
    </div>
    </div>
   
  )
}

export default Searchbar