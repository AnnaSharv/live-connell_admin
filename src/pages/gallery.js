import React from 'react'
import Blogheader from '../components/Blogheader'
import Gallery from '../components/Gallery'

function gallery({ setblogsLength, blogslength}) {
  return (
    <div className='gallery'>
        <Blogheader cat={"gallery"} title={"Gallery"}/>
        <Gallery  setblogsLength={setblogsLength} blogslength={blogslength}/>
    </div>
  )
}

export default gallery