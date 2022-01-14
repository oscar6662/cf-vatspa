import React from 'react';

import s from './Index.module.scss';
import logo from '../../assets/img/VATSPA_LOGO.png';

export default function Index(){
  return(
    <div className = {s.root}>
      <div className = {s.root__box}>
        <div className = {s.root__title}>
          <h1>Centro de Formación</h1>
          <h2>Vatsim España</h2>
        </div>
        <a className = {s.root__button} href = "/api/auth" >Acceder</a>
      </div>
      <div className = {s.root__logo}>
        <a href="/"><img src={logo} alt=""></img></a>
      </div>
    </div>
  );
}