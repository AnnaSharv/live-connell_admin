import React from 'react';
import { useField, useFormikContext } from 'formik';

import { Select } from 'antd';



function SelectwithSearch(props) {

  const { setFieldValue } = useFormikContext()
  const [field, meta] = useField(props);



  const onChange = (value) => {
    setFieldValue(props.name, value)
    props.setblogactivetitle?.(value)
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };
  
  return (
    <Select
      showSearch
      {...props}
      {...field}
      className="filter_w_search"
      placeholder={props.cat === "sliders" ? "Select button" : "Select news"}
      optionFilterProp="children"
      onChange={onChange}
      onSearch={onSearch}
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