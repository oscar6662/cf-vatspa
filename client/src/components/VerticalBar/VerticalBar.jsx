import React from 'react';
import { useRouteMatch, Link } from "react-router-dom";

import s from './VerticalBar.module.scss';
import logo from '../../assets/img/VATSPA_LOGO.png';

export default function VerticalBar(){
  return(
    <div className = {s.nav}>
      <img className={s.nav__logo} src = { logo } alt = ""></img>
      <p>Reservar Posición</p>
    </div>
  );
}