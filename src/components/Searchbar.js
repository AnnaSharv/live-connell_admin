import React, {useEffect, useState, useRef} from 'react'
import Searchicon from "../assets/icons/search.svg"
import {AllData} from '../context.js'
import parse from 'html-react-parser';
import {Divider, List, Skeleton} from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component';
import lunr from 'lunr'
import { Link } from 'react-router-dom';
import {useSelector} from 'react-redux'
import {adminDomain} from '../App.js'

function Searchbar({searchBloglist}) {
  const blogsAllRedux = useSelector(state => state.blogList.blogsAll)
  const rawData = AllData()
  const ref = useRef()
  const inputRef = useRef()
  const [data, setData] = useState([])
  const [open, isOpen] = useState(false)

const url = adminDomain
 const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
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

  

  useEffect(() => {
    const idx = lunr(function () {
      this.ref("id");
      this.field("blog_title");
      this.field("blog_body");
    

      blogsAllRedux?.forEach(function (doc) {
        this.add(doc.data);
      }, this);

    
    });
   
    if (searchTerm.length === 0) {
      return 
    } else {
       const result = idx.search(searchTerm)
    setSearchResults(result);
    }
   
  }, [searchTerm]);

  function highlightSearchedTerm(words) {
    const splitTitle = words.split(" ")
   let res = splitTitle.map((splitWord,i) => {
      if(splitWord.toLowerCase().includes(searchTerm)) {
        return `<mark class="highlight">${splitWord}</mark>`
      } else {
        return splitWord
      }

    }).join(" ")

    return parse(res)
  }
  

  return (
    <div className="searchBar" ref={ref} onClick={() => isOpen(!open)}>
      <div style={{ position: "relative" }}>
        <img src={Searchicon} width={16} alt="search_icon" />
        <input
          type="text"
          placeholder="Search in Admin panel"
          ref={inputRef}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            // isOpen(true)
          }}
        />
      </div>

      <div
        id="scrollableDiv"
        style={{
          maxHeight: 300,
          overflow: "auto",
          marginTop: "5px",
          boxShadow: "0 0 20px 0px #d9d9d9",
          display: open ? "block" : "none",
        }}
  
      >

    <InfiniteScroll
        dataLength={searchResults?.length}
       // next={loadMoreData}
        //  hasMore={searchResults?.length > 3}
        loader={
          <Skeleton
            paragraph={{
              rows: 1,
            }}
            active
          />
        }
        scrollableTarget="scrollableDiv"
      >
        <List
        itemLayout="horizontal"
          dataSource={blogsAllRedux?.filter((blog) => searchResults.find((result) => result.ref === blog.id))}
          renderItem={(item,i) => (
            
          <Link to={`//${url}/bloginside/edit/blog_id=${item.id}`}>
            <List.Item key={i} className="search-list-item">
              <List.Item.Meta
                title={<span className='text-elipse'>{highlightSearchedTerm(item.data.blog_title)}</span>}
                description={<div className='text-elipse'>{highlightSearchedTerm(item.data.blog_body)} </div>}
              />
            </List.Item>
          </Link> 
            
          )}
        />
      </InfiniteScroll> 
      </div>
    </div>
  );
}

export default Searchbar