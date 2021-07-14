import React, { useState, useEffect  } from 'react';

import s from './Index.module.scss';
import logo from '../../assets/img/VATSPA_LOGO.png';

export default function Index(){
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  {/** 
    useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await fetch('/api/user');
      const json = await result.json();
      console.log(json);
      setData(json);
      setIsLoading(false);
    };
    fetchData();
  },[true]);
*/}

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