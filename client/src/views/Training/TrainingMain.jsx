import React, {useEffect, useState} from 'react';
import ReactLoading from 'react-loading';
import {CSSTransition} from 'react-transition-group';
import MultipleDatePicker from "react-multiple-datepicker";
import { Divider, Card, Button } from 'antd';

import s from './TrainingMain.module.scss';
import './transition.scss';

export default function TrainingMain(){
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState();
    const [validTraining, isValidTraining] = useState(true);
    const [tPanel, toggleTPanel] = useState(false);
    const [training, setTraining] = useState('');
    const [isTraining, setIsTraining] = useState(false);
    const [hasTraining, setHasTraining] = useState(false);
    const [dates, setDates] = useState([]);
    const [reload, doReaload] = useState(false);

    async function Handle(){
        await fetch('/api/user/trainingrequest ', {
            credentials: 'include',
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              dates: dates,
              training: training,
            })
        })
        doReaload(!reload);
    }

     useEffect(() => {
      const fetchData = async () => {
        try {
            const r = await fetch('/api/user/availtrainings');
            const j = await r.json();
            if(j.trainings === null) isValidTraining(false);
            if(j.trainings === 'requested'){
              setIsTraining(true);
              const r1 = await fetch('/api/user/training/requested');
              const j1 = await r1.json();
              setData(j1);
            } 
            else if (j.trainings === 'enrolled'){
              setHasTraining(true);
              const r1 = await fetch('/api/user/training/confirmed');
              const j1 = await r1.json();
              console.log(j1);
              setData(j1);
            }
            else{
              setData(j.trainings);            
            }
        } catch (error) {
            setIsError(true)
        }
        console.log(data);
        setIsLoading(false);
      };
      fetchData();
    },[isError,reload]);

    const handleClick = id => () => {
        setTraining(id);
        toggleTPanel(!tPanel);
      }
    
    const close = () => () => {
      toggleTPanel(!tPanel)
    }

return(
  <div className  = {`${s.main__content} row`}>    
       {isLoading ? (
          <ReactLoading type={'bubbles'} color={'black'}/>
       ):(
          isError ? (
            <h1>
              Unfortunatelly an Error Ocurred
            </h1>
           ):(
              !validTraining ? (
                <h1>No hay ningún Training Disponible.</h1>
              ):(
                isTraining ? (
                    <Card>
                      Ya has solicitado el training que tenías disponible. Consulta en <a href ='/training/offers'> ofertas</a>.
                    </Card>
                ) : (
                  hasTraining ? (
                    <Card>
                      Ya has ASD el training que tenías disponible. Consulta en <a href ='/training/offers'> ofertas</a>.
                    </Card>
                  ) : ( 
                    <>
                      <div className = {`${s.main__avl_trainings}`}>
                          {data.map( i => (
                              <div key = {i} className = {s.main__box}>                                    
                                  <Card style={{ width: 300, margin: 16 }}>
                                    {i.length > 3 && <>Habilitación de {i.charAt(0).toUpperCase() + i.slice(1)}</>}
                                    {i.length < 3 && i.charAt(0).toUpperCase() + i.slice(1)}
                                    <Divider />
                                    <Button onClick= {handleClick(i)} type="primary">Solicitar Training</Button>
                                  </Card>
                                  <Divider />
                              </div>
                          ))}
                      </div>
                      <CSSTransition in={tPanel} timeout={200} classNames={"my-node"} unmountOnExit>
                        <Card style={{ margin: 16 }}>
                          <div  className = {`${s.main__date_selection__close}`}>
                            <button className={s.main__date_selection__button} onClick={close()}>Cerrar</button>
                          </div>
                          Selecciona las fechas en que estés disponible
                          <MultipleDatePicker
                              onSubmit={dates => setDates(dates)}
                          />
                          <Divider></Divider>
                          <Button onClick={Handle}>Confirmar</Button>
                        </Card>
                      </CSSTransition>                            
                    </>
                )
              )
           )
        )
      )}
   </div> 
);
}
