import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import { CSSTransition } from 'react-transition-group';
import MultipleDatePicker from "react-multiple-datepicker";
import { Divider, Card, Button } from 'antd';

import s from './TrainingMain.module.scss';
import './transition.scss';

export default function TrainingMain() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState();
  const [tPanel, toggleTPanel] = useState(false);
  const [training, setTraining] = useState('');
  const [dates, setDates] = useState([]);

  async function Handle() {
    await fetch('/api/training/trainingrequest ', {
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
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const r = await fetch('/api/training/availabletrainings');
        const j = await r.json();
        console.log(j);
        setData(j);
      } catch (error) {
        setIsError(true)
      }
      setIsLoading(false);
    };
    fetchData();
  }, [isError]);

  const handleClick = id => () => {
    setTraining(id);
    toggleTPanel(!tPanel);
  }

  const close = () => () => {
    toggleTPanel(!tPanel)
  }

  return (
    <div className={`${s.main__content} row`}>
      {isLoading ? (
        <ReactLoading type={'bubbles'} color={'black'} />
      ) : (
        isError ? (
          <h1>
            Unfortunatelly an Error Ocurred
          </h1>
        ) : (
          data.trainings === 'Nothing' ? (
            <h1>No hay ningún Training Disponible.</h1>
          ) : (
            data.trainings === 'requested' ? (
              <Card>
                Ya has solicitado el training que tenías disponible. Consulta en <a href='/training/offers'> ofertas</a>.
              </Card>
            ) : (
              data.trainings === 'enrolled' ? (
                <Card>
                  Ya has ASD el training que tenías disponible. Consulta en <a href='/training/offers'> ofertas</a>.
                </Card>
              ) : (
                <>
                  <div className={`${s.main__avl_trainings}`}>
                    {data.trainings.map(i => (
                      <div key={i} className={s.main__box}>
                        <Card style={{ width: 300, margin: 16 }}>
                          {i}
                          <Divider />
                          <Button onClick={handleClick(i)} type="primary">Solicitar Training</Button>
                        </Card>
                        <Divider />
                      </div>
                    ))}
                  </div>
                  <CSSTransition in={tPanel} timeout={200} classNames={"my-node"} unmountOnExit>
                    <Card style={{ margin: 16 }}>
                      <div className={`${s.main__date_selection__close}`}>
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
