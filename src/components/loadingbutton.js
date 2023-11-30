import React, { useState, useEffect } from 'react';
import { Button, Spin } from 'antd';

function LoadingButton(props) {
  return (
    props.loading === true ?
    <Spin /> :
    props.renderButton()
  )
}

export default LoadingButton;
