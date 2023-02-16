import React, {useState} from 'react'
import Blogheader from '../components/Blogheader'
import BlogformSlider from '../components/BlogformSlider'
import Blogform from '../components/Blogform'
import BlogformTeam from '../components/BlogformTeam'
import BlogformTransactions from '../components/BlogformTransactions'

function Bloginside({cat}) {
  const [permaLink, setPermaLink] = useState("")


  return (
    <div>
        {cat === "sliders" && 
        <>
          <Blogheader title={"Slider"} permaLink={permaLink} hasPermaLink={false} cat={cat}/>
          <BlogformSlider setPermaLink={setPermaLink} permaLink={permaLink} cat={cat}/>
        </>
        }
        {cat === "blogs" && 
        <>
          <Blogheader title="Blog" permaLink={permaLink} hasPermaLink={true} cat={cat}/>
          <Blogform setPermaLink={setPermaLink} permaLink={permaLink} cat={cat}/>
        </>
        }
        {cat === "team" &&   
        <>
         <Blogheader title="Team member" cat={cat}/>
         <BlogformTeam cat={cat}/>
        </>
        }

        {cat === "transactions" &&   
        <>
         <Blogheader title="Transaction" cat={cat}/>
         <BlogformTransactions cat={cat}/>
        </>
        }
      
    </div>
  )
}

export default Bloginside