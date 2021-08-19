import React, {useEffect, useState} from 'react';
import ReactLoading from 'react-loading';
import {CSSTransition} from 'react-transition-group';
import TrainingReqPanel from '../../components/TrainingReqPanel/TrainingReqPanel';

import s from './TrainingMain.module.scss';
import './transition.scss';

export default function TrainingMain(){
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState([]);
    const [validTraining, isValidTraining] = useState(true);
    const [tPanel, toggleTPanel] = useState(false);
    const [training, setTraining] = useState('');

     useEffect(() => {
      const fetchData = async () => {
        try {
            const r = await fetch('/api/user/availtrainings');
            const j = await r.json();
            if(j === null) isValidTraining(false);
            setData(j.trainings);            
        } catch (error) {
            setIsError(true)
        }
        setIsLoading(false);
      };
      fetchData();
    },[isError]);

    const handleClick = id => () => {
        setTraining(id);
        toggleTPanel(!tPanel);
      }
    
    const close = () => () => {
      toggleTPanel(!tPanel)
    }

return(
   <div className={s.main}>       
       {isLoading ? (
           <div className={s.main__title}>
                <ReactLoading type={'bubbles'} color={'black'}/>
            </div>
       ):(
            isError ? (
                <div className={s.main__title}>
                    <h1>
                        Unfortunatelly an Error Ocurred
                    </h1>
                </div>
           ):(
                !validTraining ? (
                    <div className={s.main__title}>
                        <h1>No hay ningún Training Disponible.</h1>
                    </div>
                ):(
                    <>
                    <div className={s.main__title}>
                        <h1>Siguientes trainings disponibles:</h1>
                    </div>
                    <div className  = {`${s.main__content} row`}>
                        <div className = {`col-5 ${s.main__avl_trainings}`}>
                            {data.map( i => (
                                <div key = {i} className = {s.main__box}>
                                    <h2>{i}</h2>
                                    <button onClick = {handleClick(i)} >Solicitar Training</button>
                                </div>
                            ))}
                        </div>
                            <CSSTransition in={tPanel} timeout={200} classNames={"my-node"} unmountOnExit>

                            <div className = {`col-5 ${s.main__date_selection}`}>
                                <div  className = {`${s.main__date_selection__close}`}>
                                    <button className={s.main__date_selection__button} onClick={close()}>Cerrar</button>
                                </div>
                                <TrainingReqPanel training = {training}/>
                            </div>  
                        </CSSTransition>                            
                    </div>     
                </>
           )
       )
    )}
   </div> 
);
}
