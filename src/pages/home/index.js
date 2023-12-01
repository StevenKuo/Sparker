import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Layout, Menu, Button, Modal, Input, Skeleton, message } from "antd";
import "./index.scss";
import "AppRoot/App.less";
import { useAuth } from "../../auth/context";
import logo from "../../assets/logo.png";
import axios from "axios";
import { refreshAppList } from "./duck";
import AppLayout from "../applayout";
import AppModal from "../appmodal";

function Home() {
  const apps = useSelector(({ home }) => home.apps);
  const dispatch = useDispatch();
  const [createModal, setCreateModal] = useState(false);
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(false);
  const { Header, Content, Sider } = Layout;
  const { SubMenu } = Menu;
  const auth = useAuth();
  const { t } = useTranslation();

  const getApps = () => {
    setLoading(true);
    axios
      .get("https://sparker-api.onrender.com/apps")
      .then((response) => {
        setLoading(false);
        dispatch(refreshAppList(response.data.apps));
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 401) {
          auth.signout(() => {});
        }
      });
  };
  const createApp = (name) => {
    axios
      .post("https://sparker-api.onrender.com/apps", { name })
      .then(function (response) {
        setCreateModal(false);
        getApps();
      })
      .catch(function (error) {
        auth.signout(() => {});
      });
  };

  const publishLayout = (layout) => {
    const publishing = message.loading(t("publishing"), 0);
    axios
      .post("https://sparker-api.onrender.com/layout", {
        id: app.id,
        layout: JSON.stringify(layout),
      })
      .then(function (response) {
        publishing();
        message.success(t("publish_success"), 2.5);
        setApp({
          ...app,
          layout,
        });
      })
      .catch(function (error) {
        publishing();
        message.error(t("publish_fail"), 2.5);
        console.log(error);
      });
  };

  const goToApp = (id) => {
    const app = apps.filter((app) => app.id === id);
    setApp(app[0]);
  };

  const showAppCode = (id) => {
    const app = apps.filter((app) => app.id === id);
    if (app[0] === undefined) {
      return;
    }
    Modal.info({
      content: (
        <div className="code-notification">
          <p>{t("app_code_title")}</p>
          <span>{`https://liff.line.me/1657009564-OWeBGjJL/lineapp?code=${app[0].code}`}</span>
        </div>
      ),
      onOk() {},
    });
  };

  useEffect(() => {
    getApps();
  }, [dispatch]);

  return (
    <Layout style={{ position: "relative" }}>
      {createModal === true && (
        <AppModal onClose={() => setCreateModal(false)} onCreate={createApp} />
      )}
      <Header>
        <img className="header-logo" src={logo} alt="Logo" />
      </Header>
      <Layout>
        <Sider>
          <Menu
            mode="inline"
            onClick={(e) => {
              if (e.key.includes("detail")) {
                const detail = e.key.split("#");
                showAppCode(detail[0]);
                return;
              }
              goToApp(e.key);
            }}
          >
            <Menu.ItemGroup title={t("apps")}>
              {apps.map((app) => (
                <SubMenu key={`app_${app.id}`} title={app.name}>
                  <Menu.Item key={app.id}>{t("layout")}</Menu.Item>
                  <Menu.Item key={`${app.id}#detail`}>
                    {t("get_app_code")}
                  </Menu.Item>
                </SubMenu>
              ))}
              <Skeleton loading={loading} active />
            </Menu.ItemGroup>
          </Menu>
          <Button
            type="primary"
            className="home-createapp"
            onClick={() => setCreateModal(true)}
          >
            {t("create_new_app")}
          </Button>
        </Sider>
        <Layout>
          <Content>
            <AppLayout app={app} onPublish={publishLayout} />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Home;
