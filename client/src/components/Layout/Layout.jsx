import React from 'react';
import { useLocation } from "react-router-dom";


import Navbar from '../Navbar/Navbar';
import VerticalBar from '../VerticalBar/VerticalBar';

//import HealthBar from '../Navbars/HealthBar';
//import Footer from "../Footers/Footer";
import ScrollArea from 'react-scrollbar';

import s from './Layout.module.scss';

export default function Layout({ children }) {
  let path = useLocation();
  if(path.pathname === '/'){
    return (children);
  }
  return (
    <ScrollArea>
      <div className={s.layout}>
          <div className="col-2"><VerticalBar></VerticalBar></div>
          <div className="col-10">
            <Navbar></Navbar>
            <main className={s.layout__main}>
              {children}
            </main>
          </div>  
      </div>
    </ScrollArea>
  );
}