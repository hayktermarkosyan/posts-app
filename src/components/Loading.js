import React from 'react';
import {LoadingOutlined} from '@ant-design/icons';

const Loading = ({marginTop=0}) => {
  return (
    <LoadingOutlined 
      style={{
        fontSize: "100px", 
        marginTop: `${marginTop}`
      }} 
    />
  )
}

export default Loading