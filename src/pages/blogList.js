import React, { useEffect, useState, useRef } from "react";
import Header from "../components/Blogheader.js";
import MyTable from "../components/Table.js";
import { useLocation } from "react-router-dom";
import { collection,  onSnapshot, orderBy, query, where } from "firebase/firestore";

import { db } from "../pages/firebase";
//import TableDraggable from "../components/TableDraggable.js";



//{blogsAll, setmyQuery, myQuery}
function BlogList(props) {
  const { pathname } = useLocation();
  const [blogsAll, setBlogsAll] = useState([]);
  const [blogsTransactions, setBlogsTransactions] = useState([]);
  const [myQuery, setmyQuery] = useState(pathname);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    setLoading(true)
    let locationRaw = pathname.split("/");
    locationRaw = locationRaw[locationRaw.length - 1];

  


    let category;
    if(props.cat === "blogs") {
      category = "blogs"
    }
    if(props.cat === "sliders") {
      category = "sliders"
    }
    if(props.cat === "team") {
      category = "team"
    }
    // !!!
    if(props.cat === "transactions") {
      category = "transactions"
    }
    if(props.cat === "gallery") {
      category = "gallery"
    }


    const blogsRef = collection(db, category);
    let queryAll = query(blogsRef, orderBy("timeStamp", "desc"));



    if (props.cat === "sliders") {
      queryAll = query(blogsRef, orderBy("timeStamp", "desc"));
    }
    if (props.cat === "team") {
      queryAll = query(blogsRef, orderBy("member_name", "asc"));
    }
    if (myQuery.includes("all") || myQuery.includes("transactions")) {
      queryAll = query(blogsRef, orderBy("timeStamp", "desc"));
    }
    if (myQuery.includes("awards")) {
      queryAll = query(
        blogsRef,
        orderBy("timeStamp", "desc"),
        where("blog_type", "array-contains", "awards")
      );
    }
    if (myQuery.includes("deals")) {
      queryAll = query(
        blogsRef,
        orderBy("timeStamp", "desc"),
        where("blog_type", "array-contains", "deals")
      );
    }
    if (myQuery.includes("articles")) {
      queryAll = query(
        blogsRef,
        orderBy("timeStamp", "desc"),
        where("blog_type", "array-contains", "articles")
      );
    }


      const unsub = onSnapshot(queryAll, (snapShot) => {
        let list = [];

        snapShot.docs.forEach((doc) => {
          list.push({id: doc.id, ...doc.data()})  
        })
  

        if(props.cat === "team") {
          let sortedTeamArray = []
          let clareAndGoncalo = []
          list.map((l) => {
            if( l.member_name.includes("Clare Connel") || l.member_name.includes("Gonçalo Silva")  ) {
              const clare = l.member_name.includes("Clare Connel")
              const goncalo = l.member_name.includes("Gonçalo Silva")
              
              clare && clareAndGoncalo.push(l)
              goncalo && clareAndGoncalo.push(l)
          
            } 
            else {
              sortedTeamArray.push(l)
            }

          })
          let final = clareAndGoncalo.concat(sortedTeamArray)
          setBlogsAll(final)
      
          
        } else {
          setBlogsAll(list)
        }
          
          setLoading(false)
        });
      
        return () =>  unsub() 
 
  }, [pathname]);


  //TRANSACTIONS AR CHANS ROCA MYQUERY IS ACTIVE

  useEffect(() => {


    let locationRaw = pathname.split("/");
    locationRaw = locationRaw[locationRaw.length - 1];

  

    const blogsRef = collection(db, "blogs");
    let queryAll = query(blogsRef, orderBy("timeStamp", "desc"));

      // FILTERS
    if (pathname.includes("bloglist")) {
      if (myQuery.includes("archived")&& locationRaw !== "all") {
            queryAll = query(
              blogsRef,
              orderBy("timeStamp", "desc"),
              where("blog_status", "==", "archived"),
              where("blog_type", "array-contains", locationRaw)
            );
          }
          if (myQuery.includes("archived")&& locationRaw === "all") {
            queryAll = query(
              blogsRef,
              orderBy("timeStamp", "desc"),
              where("blog_status", "==", "archived")
            );
          }

          if (myQuery.includes("active") && locationRaw !== "all") {
            queryAll = query(
              blogsRef,
              orderBy("timeStamp", "desc"),
              where("blog_status", "==", "active"),
              where("blog_type", "array-contains", locationRaw)
            );
          }
          if (myQuery.includes("active") && locationRaw === "all") {
            queryAll = query(
              blogsRef,
              orderBy("timeStamp", "desc"),
              where("blog_status", "==", "active"),
            );
          }

          if (myQuery.includes("clear") && locationRaw !== "all") {
            queryAll = query(blogsRef,orderBy("timeStamp", "desc"),where("blog_type", "array-contains", locationRaw));
          }

          if (myQuery.includes("clear") && locationRaw === "all") {
            queryAll = query(blogsRef,orderBy("timeStamp", "desc")
          )}


        const unsub = onSnapshot(queryAll, (snapShot) => {
          let list = [];

          snapShot.docs.forEach((doc) => {
            list.push({id: doc.id, ...doc.data()})  
          })
          setBlogsAll(list)
        });


        return () =>  unsub() 
    }
      

  }, [myQuery])


 




  return (
    <>
      <div>

        <Header
          title="Blogs"
          hasCategories={props.hasCategories}
          category={props.cat}
          page="blogs"
          blogsAll={blogsAll}
          setmyQuery={setmyQuery}
          myQuery={myQuery}
          setFilterKeyword={setFilterKeyword}
        />

        {props.cat === "team" && (
          <MyTable
            blogsAll={blogsAll}
            setBlogsAll={setBlogsAll}
            cat={props.cat}
            loading={loading}
          />
        )}

        {props.cat === "sliders" && (
          <MyTable
            blogsAll={blogsAll}
            setBlogsAll={setBlogsAll}
            cat={props.cat}
            loading={loading}
          />
        )}
        {props.cat === "blogs" && (
          <MyTable
            blogsAll={blogsAll}
            setBlogsAll={setBlogsAll}
            cat={props.cat}
            loading={loading}
          />
        )}

        {props.cat === "transactions" && (
          <MyTable
            blogsAll={blogsAll}
            setBlogsAll={blogsTransactions}
            cat={props.cat}
            filter={"transactions"}
            loading={loading}
          />
        )}
      </div>
    </>
  );
}

export default BlogList;