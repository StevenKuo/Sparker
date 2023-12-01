import React, { useState } from "react";
import "./index.scss";
import "AppRoot/App.less";
import { Input, Form, Button, Spin, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/context";
import axios from "axios";
import logo from "../../assets/logo.png";

function Signup() {
  const [logging, setLogging] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const auth = useAuth();
  const { t } = useTranslation();

  const goToSignin = () => {
    history.replace("/signin");
  };
  const onFinish = (values) => {
    setLogging(true);
    axios
      .post("https://sparker-api.onrender.com/signup", values)
      .then(function (response) {
        setLogging(false);
        message.success(t("signup_success"), 2.5);
        history.replace("/signin");
      })
      .catch(function (error) {
        setLogging(false);
        auth.signout(() => {});
      });
  };

  const renderSubmitAction = () => {
    if (logging === true) {
      return <Spin />;
    }
    return (
      <Button
        htmlType="submit"
        className="signin-button"
        size="large"
        type="primary"
      >
        {t("signup_action")}
      </Button>
    );
  };

  return (
    <div className="signin-background">
      <img src={logo} alt="Logo" />
      <div className="signin-container">
        <h1 className="signin-title">{t("signup")}</h1>
        <Form name="signup" onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: t("email_required") }]}
          >
            <Input
              className="signin-input"
              size="large"
              placeholder={t("email")}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: t("password_required") }]}
          >
            <Input.Password
              className="signin-input"
              size="large"
              placeholder={t("password")}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item
            name="confrim"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: t("password_confirm") },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t("password_mismatch")));
                },
              }),
            ]}
          >
            <Input.Password
              className="signin-input"
              size="large"
              placeholder={t("password_confirm")}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item>
            <div>{renderSubmitAction()}</div>
            <Button
              className="go-signup"
              type="text"
              onClick={() => {
                goToSignin();
              }}
            >
              {t("go_to_signin")}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Signup;
