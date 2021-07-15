import React, { useState, useEffect  } from 'react';

import Load from '../Load/NavLoad';
import s from './Navbar.module.scss';

export default function Navbar(){
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
      <div className = {s.nav__text}>
        {isLoading ? (
          <Load/>
        ):(
          isError ?(
          <p>An error occurred</p>
          ):(
            <p>{data}</p>
          )
        )}
      </div>
    </div>
  );
}
