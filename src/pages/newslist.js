import React from "react";

import { doc, deleteDoc } from "firebase/firestore";
import {db} from './firebase'
import { useNavigate, Link } from "react-router-dom";


function NewsList({ news }) {
    const navigate = useNavigate()

    const deletePost = (id) => {
        const del = async () => {
            await deleteDoc(doc(db, "news", id));
        }
        del()

    }
    const editPost = (docs) => {
      navigate("/edit", {
        state: {
            id: docs.id
        }
      })

    }

  return (
    <div>
      <h1>news</h1>
      <Link to="/dashboard" className="btn btn-primary">ADD NEW POST</Link>
        <div style={newsContainer}>
            {news ? (
                news.map((n) => {
                return (
                    <div className="card" key={n.id}>
                        <img src={n.blog_image} alt="img" className="card-img " style={{width: "200px"}}/>
                        <h3 className="card-title title"> {n.blog_title} </h3>
                        <div className="card-body"> {n.blog_body} </div>

                        <button className="btn btn-group btn-danger w-50" onClick={() => deletePost(n.id)}>del post</button>
                        <button className="btn btn-group btn-success w-50" onClick={() => editPost(n)}>edit post</button>
                    </div>
                )})
            ) : (
                <h1>loading news</h1>
            )}
        </div>
     
    </div>
  );
}

const newsContainer = {
   "display": "flex",
   "flexWrap": "wrap"
}

export default NewsList;
