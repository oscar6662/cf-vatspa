import React, {useState, useEffect} from 'react';

import s from './VerticalBar.module.scss';
import logo from '../../assets/img/VATSPA_LOGO.png';

export default function VerticalBar(){
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [mentor, setMentor] = useState(false);
  

   useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
          const r = await fetch('/api/user/admin');
          const j = await r.json();
          console.log(j);
          setAdmin(Boolean(j));
          const r2 = await fetch('/api/user/mentor');
          const j2 = await r2.json();
          console.log(j2);
          setMentor(Boolean(j2));
      } catch (error) {
          setIsError(true)
      }
      setIsLoading(false);
    };
    fetchData();
  },[admin, mentor]);
  
  return(
    <div className = {s.nav}>
      <img className={s.nav__logo} src = { logo } alt = ""></img>
      <p>Reservar Posición</p>
      {!isLoading && (
        isError ? (
          <p>Error. No se sabe si eres mentor y/o admin</p>
        ) : (
          <>
          <>{
          admin && (
            <a href="/admin">Editar Usuarios</a>
          )}
          </>
          <>
          {
          mentor && (
            <a href="/mentor">Panel de Mentor</a>
          )}
          </></>
      ))}
    </div>
  );
}