import React from 'react';
import { Progress } from 'antd';
const ProgressBar = ({data}) => (
  <>
    <Progress
     hidden={data.status ? false : true}
     percent={Math.floor(data.progress)}
      status="active"
      strokeColor={{
        from: 'rgb(40 69 145)',
        to: '#f9f9fc',
      }}
    />
  </>
);
export default ProgressBar;