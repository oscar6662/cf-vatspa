import React, {useEffect, useState} from 'react';
import ReactLoading from 'react-loading';
import Moment, { deprecationHandler } from 'moment';
import { Divider, Card, Button } from 'antd';

import s from './TrainingMain.module.scss';
import './transition.scss';
const { Meta } = Card;

export default function TrainingOffers(){
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState([]);
    const [offersExist, isoffersExist] = useState(true);
    const [reload, doReaload] = useState(false);
     useEffect(() => {
      const fetchData = async () => {
        try {
            const r = await fetch('/api/training/offer');
            const j = await r.json();
            if(j === undefined || j.length === 0 || j.response === 'enrolled' || j.response === 'null') isoffersExist(false);
            setData(j);            
        } catch (error) {
            setIsError(true)
        }
        setIsLoading(false);
      };
      fetchData();
    },[isError]);

  async function handle(data){
    fetch('/api/training/schedule ', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: data.start,
        training: data.training,
        mentor: data.id
      })
    })
    doReaload(!reload);
  }
return(
  <>
    {isLoading ? (
      <ReactLoading type={'bubbles'} color={'black'}/>
    ):(
      isError ? (
        <h1>
            Unfortunatelly an Error Ocurred
        </h1>
      ):(
        !offersExist ? (
          data.response === "enrolled" ? <>Ya tienes un training programado </>:
          <h1>No hay ninguna oferta disponible</h1>
        ):(
          <div className = {`col-5 ${s.main__avl_trainings}`}>
            {data.map( i => (
              <Card style={{ width: 300, marginTop: 16 }}>
                <h2>Dia(s)</h2>
                <p>{Moment(i.start).format('DD MMMM')}</p>
                <Divider />
                <h2>Entre las horas</h2>
                <p>{Moment(i.start).format('HH:mm')} - {Moment(i.end).format('HH:mm')}</p>
                <Divider />
                <Button type="primary" onClick={()=>handle(i)}>Aceptar Oferta</Button>
              </Card>
            ))}
          </div>                  
        )
      )
    )}
  </>
);
}
