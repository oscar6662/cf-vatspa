import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { Menu, Layout } from 'antd';
import ReactLoading from 'react-loading';
import logo from '../../assets/img/VATSPA_LOGO.png';
import 'antd/dist/antd.css';
//import HealthBar from '../Navbars/HealthBar';
//import Footer from "../Footers/Footer";

import s from './Layout.module.scss';

import { 
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  ApartmentOutlined,
  MediumOutlined,
  LogoutOutlined,
  BankOutlined,
 } from '@ant-design/icons';
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const pagetitle = {
  '/profile' : 'Centro de Formación',
  '/training' : 'Trainings Disponibles',
  '/mentor' : 'Panel de Mentor',
  '/mentor/offer' : 'Crear Oferta',
  '/training/offers' : 'Ofertas Disponibles',
}

export default function Schema({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [mentor, setMentor] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
          const r = await fetch('/api/user/admin');
          const j = await r.json();
          console.log(j);
          setAdmin(Boolean(j));
          const r2 = await fetch('/api/user/mentor');
          const j2 = await r2.json();
          console.log(j2);
          setMentor(Boolean(j2));
          const r3 = await fetch('/api/user/name');
          const j3 = await r3.json();
          setData(String(j3));
      } catch (error) {
          setIsError(true)
      }
      setIsLoading(false);
    };
    fetchData();
  },[admin, mentor, data]);


  let path = useLocation();
  if(path.pathname === '/'){
    return (children);
  }

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className={s.logo}>
            <img src = { logo } alt = ""></img>
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={[path.pathname]}>
            <SubMenu key="/profile" icon={<UserOutlined />} title="Perfil">
              <Menu.Item key="/profile">
                <a href="/">Perfil</a>
              </Menu.Item>
              <Menu.Item key="/user/aprovedstations">
                <a href="/user/aprovedstations">Posiciones</a>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="/training" icon={<BankOutlined />} title="Training">
              <Menu.Item key="/training"><a href="/training">Training</a></Menu.Item>
              <Menu.Item key="/training/offers"><a href="/training/offers">Ofertas</a></Menu.Item>

            </SubMenu>
            {!isLoading && (
              isError ? (
                <Menu.Item key="/error" icon={<MediumOutlined />}>
                  Ha habido un error.
                </Menu.Item>
              ) : (
              <>
                <>{
                  admin && (
                    <Menu.Item key="/admin" icon={<ApartmentOutlined />}>
                      <a href="/admin">Editar Usuarios</a>
                    </Menu.Item>      
                  )}
                </>
              <>
              {
                mentor && (
                  <Menu.Item key="/mentor" icon={<MediumOutlined />}>
                    <a href="/mentor">Panel de Mentor</a>
                  </Menu.Item> 
                )}
            </></>
            ))}     
          </Menu>
        </Sider>
        <Layout className={s.site__layout}>
          <Header className={s.site__layout__background} style={{ padding: 0 }}>
            <Menu theme="light" mode="horizontal" selectable={false} className={s.site__layout__navbar}>
              <Menu.Item key="button">
                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                  className: s.trigger,
                  onClick: toggle,
                })}
              </Menu.Item>  
              <Menu.Item key="name" icon = {(!isLoading&&!isError) && <LogoutOutlined/>}>
                {isLoading ? (
                  <ReactLoading type={'bubbles'} color={'black'}/>
                ):(
                  isError ?(
                    <p>An error occurred</p>
                  ):(
                    <a href='/api/logout'>{data}</a>
                  )
                )}
              </Menu.Item>
            </Menu>
          </Header>
          <Content >
            <div className={s.site__layout__content__title}>
              <h1>
                  {pagetitle[path.pathname]}
              </h1>
            </div>
            <div className={s.site__layout__content}>
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
  );
}