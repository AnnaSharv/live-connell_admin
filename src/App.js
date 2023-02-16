import React from 'react'
import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import GridLoader from "react-spinners/GridLoader";
import { onAuthStateChanged } from "firebase/auth";
import { auth} from "./pages/firebase";

import { collection, getDocs } from "firebase/firestore";
import { db } from "./pages/firebase";
import {useDispatch} from 'react-redux'
import {getBlogData} from '../src/redux/reducers/blogs/blogs.actions'

//pages
import 'antd/dist/reset.css';
import './App.css';
import 'react-lazy-load-image-component/src/effects/blur.css'

// recent
import BlogList from './pages/blogList.js'
import BlogInside from './pages/bloginside'
import Sidebar from "./components/Sidebar";

//Context
import { UserContext } from './pages/UserContext';
import { AuthContextProvider, DataContextProvider, ModContextProvider } from './context';

import Pages from '../src/pages/pages.js'
import Login from '../src/pages/login.js'
import Gallery from '../src/pages/gallery.js'
//import Sliders from './pages/sliders';



export const adminDomain = 'admin.connell-consulting.com'
export const websiteDomain = 'test.connell-consulting.com'

// export const adminDomain = 'http://localhost:3001'
// export const websiteDomain = 'http://localhost:3000'

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [userStatus, setUserStatus] = useState(false)
  const [loading, setLoading] = useState(false)
  const [blogslength, setblogsLength] = useState(null)
  const ProtectedRoute = ({ children }) => {
    return userStatus ? children : <Navigate to="/login" />;
  };

  function updateGlobalSearchArray(...searchedArray) { 
    // console.log("first", searchedArray) 
    return searchedArray
  }

  

useEffect(() => {
  setLoading(true)
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserStatus(true)
      navigate()
    } else {
      setUserStatus(false)
    }
    setLoading(false)
  });

  

 
}, [])


useEffect(() => {
  async function getData() {
    const querySnapshot = await getDocs(collection(db, "blogs"));
    const list = [];
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, data: doc.data() });
    });
    dispatch(getBlogData(list));
  }
  getData();
}, [dispatch]);

  return (
      <UserContext.Provider value={{ userStatus, setUserStatus }}>
        <AuthContextProvider>
          <DataContextProvider>
            <ModContextProvider>
              {loading ? (
                <GridLoader
                  color="#1D4696"
                  cssOverride={{
                    left: "50%",
                    position: "absolute",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ) : (
                <div className="App">
                  {userStatus ? (
                    <Sidebar blogslength={blogslength} updateGlobalSearchArray={updateGlobalSearchArray}>
                      <Routes>
                        <Route path="/" element={<Navigate to={"/sliders"} />}/>
                        <Route
                          path="/sliders"
                          element={
                            <ProtectedRoute>
                              <BlogList
                                cat={"sliders"}
                                title={"Sliders"}
                                hasCategories={false}
                                setblogsLength={setblogsLength}
                                blogslength={blogslength}
                                updateGlobalSearchArray={updateGlobalSearchArray}
                              />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path={"/sliders/*"}
                          element={
                            <ProtectedRoute>
                              <BlogInside cat={"sliders"} />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path={"edit-slider/*"}
                          element={
                            <ProtectedRoute>
                              <BlogInside cat={"sliders"} />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/bloglist/*"
                          element={
                            <ProtectedRoute>
                              <BlogList
                                cat={"blogs"}
                                hasCategories={true}
                                setblogsLength={setblogsLength}
                                blogslength={blogslength}
                                updateGlobalSearchArray={updateGlobalSearchArray}
                              />{" "}
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/blogInside/*"
                          element={
                            <ProtectedRoute>
                              <BlogInside cat={"blogs"} />{" "}
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/members"
                          element={
                            <ProtectedRoute>
                              <BlogList
                                cat={"team"}
                                title={"Team members"}
                                hasCategories={false}
                                setblogsLength={setblogsLength}
                                blogslength={blogslength}
                              />{" "}
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/members/*"
                          element={
                            <ProtectedRoute>
                              <BlogInside cat={"team"} />{" "}
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/addMember"
                          element={
                            <ProtectedRoute>
                              <BlogInside cat={"team"} />{" "}
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/transactions/*"
                          element={
                            <ProtectedRoute>
                              <BlogList
                                cat={"transactions"}
                                title={"Recent transactions"}
                                hasCategories={false}
                                setblogsLength={setblogsLength}
                                blogslength={blogslength}
                              />{" "}
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/addTransaction/*"
                          element={
                            <ProtectedRoute>
                              <BlogInside cat={"transactions"} />{" "}
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/pages"
                          element={
                            <ProtectedRoute>
                              <Pages />{" "}
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/gallery"
                          element={
                            <ProtectedRoute>
                              <Gallery
                                setblogsLength={setblogsLength}
                                blogslength={blogslength}
                              />{" "}
                            </ProtectedRoute>
                          }
                        />
                      </Routes>
                    </Sidebar>
                  ) : (
                    <Routes>
                      <Route path="login" element={<Login />} />
                      <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                  )}
                </div>
              )}
            </ModContextProvider>
          </DataContextProvider>
        </AuthContextProvider>
      </UserContext.Provider>
  );
}

export default App;
