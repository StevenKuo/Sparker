import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './index.scss';
import 'AppRoot/App.less';
import { Input, Form, Button, message, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/context';
import axios from 'axios';
import logo from '../../assets/logo.png';

function Signin() {
  const [logging, setLogging] = useState(false);
  const auth = useAuth();
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation();

  const goToSignup = () => {
    history.replace('/signup');
  };
  const onFinish = (values) => {
    setLogging(true)
    axios.get('https://sheltered-garden-95685.herokuapp.com/signin', { params: { ...values } })
    .then((response) => {
      setLogging(false)
      auth.signin(response.data, () => {
        const { from } = location.state || { from: { pathname: '/home' } };
        history.replace(from);
      });
    }).catch((error) => {
      setLogging(false)
      message.error(error.response.data);
    })
  };
  const renderSubmitAction = () => {
    if (logging === true) {
      return (
        <Spin />
      )
    }
    return (
      <Button htmlType="submit" className="signin-button" size="large" type="primary">{t('signin_action')}</Button>
    )
  }
  return (
    <div className="signin-background">
      <img src={logo} alt="Logo" />
      <div className="signin-container">
        <h1 className="signin-title">{t('signin')}</h1>
        <Form name="signin" onFinish={onFinish}>
          <Form.Item name="email" rules={[{ required: true, message: t('email_required') }]}>
            <Input className="signin-input" size="large" placeholder={t('email')} />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: t('password_required') }]}>
            <Input.Password
              className="signin-input"
              size="large"
              placeholder={t('password')}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          <Form.Item>
            <div>
              {renderSubmitAction()}
            </div>
            <Button
              className="go-signup"
              type="text"
              onClick={() => {
                goToSignup();
              }}
            >
              {t('go_to_signup')}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Signin;
