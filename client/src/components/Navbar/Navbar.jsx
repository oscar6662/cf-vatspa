import React, { useState, useEffect  } from 'react';

import ReactLoading from 'react-loading';
import s from './Navbar.module.scss';

export default function Navbar(){
  const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState('');
  
     useEffect(() => {
      const fetchData = async () => {
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
          <ReactLoading type={'bubbles'} color={'black'}/>
        ):(
          isError ?(
          <p>An error occurred</p>
          ):(
            <a href='/api/logout'>{data}</a>
          )
        )}
      </div>
    </div>
  );
}
