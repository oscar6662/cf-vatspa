import React, {useEffect, useState} from 'react';
import ReactLoading from 'react-loading';
import Moment from 'moment';
import { Divider, Card, Button } from 'antd';

import s from '../TrainingMain.module.scss';
import '../transition.scss';

export default function TrainingOffers(){
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState([]);

     useEffect(() => {
      const fetchData = async () => {
        try {
            const id = await fetch('/api/user/id');
            const idj = await id.json();
            const r = await fetch(`/api/training/offers/${idj}`);
            const j = await r.json();
            setData(j);            
        } catch (error) {
            setIsError(true)
        }
        setIsLoading(false);
      };
      fetchData();
    },[isError]);

  async function handle(data){
    const r = await fetch('/api/training/schedule ', {
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
    if (r.status === 200) {
      window.location = "/admin"
  }
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
        data.response === 'null' ? (
          <p>No hay ningún training disponible o bien ya tienes un training programado.</p>
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
