import React, {useState, useEffect} from 'react';

import s from './VerticalBar.module.scss';
import logo from '../../assets/img/VATSPA_LOGO.png';

export default function VerticalBar(){
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState('');

   useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
          const r = await fetch('/api/user/name');
          const j = await r.json();
          setData(String(j));
      } catch (error) {
          setIsError(true)
      }
      setIsLoading(false);
    };
    fetchData();
  },[!data]);
  return(
    <div className = {s.nav}>
      <img className={s.nav__logo} src = { logo } alt = ""></img>
      <p>Reservar Posición</p>
    </div>
  );
}