import React, {useEffect, useState} from 'react';
import ReactLoading from 'react-loading';
import Moment from 'moment';

import s from './TrainingMain.module.scss';
import './transition.scss';

export default function TrainingOffers(){
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState([]);
    const [offersExist, isoffersExist] = useState(true);

     useEffect(() => {
      const fetchData = async () => {
        try {
            const r = await fetch('/api/availtrainingoffers');
            const j = await r.json();
            if(j === null) isoffersExist(false);
            setData(j);            
        } catch (error) {
            setIsError(true)
        }
        setIsLoading(false);
      };
      fetchData();
    },[isError]);

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
                !offersExist ? (
                    <div className={s.main__title}>
                        <h1>No hay ninguna oferta disponible</h1>
                    </div>
                ):(
                    <>
                    <div className={s.main__title}>
                        <h1>Siguientes ofertas disponibles:</h1>
                    </div>
                    <div className  = {`${s.main__content} row`}>
                        <div className = {`col-5 ${s.main__avl_trainings}`}>
                            {data.map( i => (
                                <div key = {i.id} className = {s.main__box}>
                                    <h2>Dia(s)</h2>
                                    <p>{Moment(i.availabledate[0]).format('DD MMMM')}</p>
                                    <h2>Entre las horas</h2>
                                    <p>{Moment(i.availabledate[0]).format('HH mm')} y {Moment(i.availabledate[1]).format('HH mm')}</p>
                                </div>
                            ))}
                        </div>                  
                    </div>     
                </>
           )
       )
    )}
   </div> 
);
}
