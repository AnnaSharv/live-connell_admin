import React from 'react';
import { useField, useFormikContext } from 'formik';


import { db } from "../pages/firebase";
import { doc, updateDoc} from "firebase/firestore";


import { Select } from 'antd';



function SelectwithSearch(props) {
  const {clearinfo} = props

  const { setFieldValue } = useFormikContext()
  const [field, meta] = useField(props);



  const onChange = (value) => {
    setFieldValue(props.name, value)
    props.setblogactivetitle?.(value)
  };

  



  const onClear = () => {
    async function clearTransactionTitle() {
      const {id} = clearinfo
      const docref = doc(db, "transactions", id);
      await updateDoc(docref, {
          transactions_title: null,
          blog_title:"",
          blog_body:""
      });
    }

    clearTransactionTitle()
  };

  
  


  
  return (
    <Select
      showSearch
      allowClear
      {...props}
      {...field}
      className="filter_w_search"
      placeholder={props.cat === "sliders" ? "Select button" : "Select news"}
      optionFilterProp="children"
      onChange={onChange}
      onClear={onClear}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={
        props.cat === "sliders" 
        ? props.sliderOptions 
        : props.blogsnames
      }
  />
  )
}

export default SelectwithSearch