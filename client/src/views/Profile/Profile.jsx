import React, {useEffect, useState} from 'react';

import TrainingButton from '../../components/Buttons/TrainingButton/TrainingButton';
import Load from '../../components/Load/Load';
import s from './Profile.module.scss';

export default function Profile(){
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState('');
  
     useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
            const r = await fetch('/api/user');
            const j = await r.json();
            console.log(j);
            setData(j);
        } catch (error) {
            setIsError(true)
        }
        setIsLoading(false);
      };
      fetchData();
    },[!data]);

return(
   <div className={s.main}>
       <div className={s.main__title}>
            <h1>Centro de Formación</h1>
       </div>
       {isLoading ? (
           <div className={s.main__loading}>
            <Load/>
           </div>
       ):(
           isError ? (
               <div>
                   Unfortunatelly an Error Ocurred
                </div>
           ):(
                <div className="">
                     <div className={s.main__content}>
                          <div className={s.main__stats}>
                              <div className={s.main__stats__box}>
                                  <p>Rango actual</p>
                                  <h2>{data.vatsim.rating.short+' '+data.vatsim.rating.long}</h2>
                              </div>
                              <div className={s.main__stats__box}>
                                  <p>vACC ascrito</p>
                                  <h2>{data.vatsim.subdivision.name}</h2>
                              </div>
                              <div className={s.main__stats__box}>
                                  <p>Último Training</p>
                                  <h2>28 de Agosto</h2>
                              </div>
                          </div>
                          <div className="row">
                             <div className="col-7">
                                <div className = {s.main__trainings}>
                                    <h2>Mis Trainings</h2>
                                    <table>
                                        <tr>
                                            <th>Training</th>
                                            <th>Fecha</th>
                                            <th>Resultado</th>
                                            <th>Comentarios</th>
                                        </tr>
                                        <tr>
                                            <td>Introducción S1</td>
                                            <td>28 de Agosto</td>
                                            <td>Aprovado</td>
                                            <td></td>
                                        </tr>
                                    </table>
                                </div>
                             </div>
                             <div className="col-5">
                                 <div className = {s.main__req}>
                                     <h2>Solicitar Training</h2>
                                     <TrainingButton data = {data}></TrainingButton>
                                 </div>

                             </div>
                          </div>
                     </div>
                </div>
           )
       )}
   </div> 
);
}
