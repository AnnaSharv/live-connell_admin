import React, {useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { UserAuth } from '../context';

import { UserContext } from '../pages/UserContext';

export const SignIn = () => {
  const navigate = useNavigate()
  const {userStatus, setUserStatus} = useContext(UserContext)
  const [errorMessage, setErrorMessage] = useState(null)
  const {signIn} = UserAuth()
  
 

  const login = async (email, password) => {
    try {
      await signIn(email, password)
      setUserStatus(true)
      navigate("/bloglist/all")
    } catch(err) {
      setErrorMessage(err.message)
    }
   
  }
  

  return (
    <Formik 
       initialValues={{ password: '', email: '' }}
       validationSchema={Yup.object({
         password: Yup.string()
           .max(15, 'Must be 15 characters or less')
           .required('Required'),
         password: Yup.string()
           .max(20, 'Must be 20 characters or less')
           .required('Required'),
         email: Yup.string().email('Invalid email address').required('Required'),
       })}
       onSubmit={(values, { setSubmitting }) => {
        const {email, password} = values;
        login(email, password)
       }}
     >
       <Form>
         <label htmlFor="password">Admin email</label>
         <Field name="email" type="email" className="form-control w-100" placeholder="admin@admin.com" />
         <ErrorMessage name="email" />
 
         <label htmlFor="password">Admin password</label>
         <Field name="password" type="password" className="form-control" placeholder="123456"/>
         <ErrorMessage name="password" />
 

         <div className='text-danger'>{errorMessage}</div>
         <button type="submit" className='btn btn-primary mt-3 w-100 fs-4'>Log in</button>

         
       </Form>
     </Formik>
  );
};