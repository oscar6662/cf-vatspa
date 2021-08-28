import React, {useEffect, useState} from 'react';
import { Card, Col, Divider, Row } from 'antd';
import ReactLoading from 'react-loading';
import s from './Profile.module.scss';

export default function AprovedStations(){
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState([]);
  
     useEffect(() => {
      const fetchData = async () => {
        try {
            const r = await fetch('/api/user/aprovedstations');
            const j = await r.json();
            setData(j);
        } catch (error) {
          setIsError(true);
        }
        setIsLoading(false);
      };
      fetchData();
    },[isError,data]);

return(
  <>
    {isLoading ? (
      <ReactLoading type={'bubbles'} color={'black'}/>
    ):(
      isError ? (
        <p>Unfortunatelly an Error Ocurred</p>
      ):(
        <div>
        
        </div>
      )
    )}
  </> 
);
}
