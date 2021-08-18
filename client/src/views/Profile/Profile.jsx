import React, {useEffect, useState} from 'react';

import ReactLoading from 'react-loading';
import s from './Profile.module.scss';

export default function Profile(){
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState([]);
    const [validTraining, isValidTraining] = useState(false);
  
     useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
            const r = await fetch('/api/user');
            const j = await r.json();
            const r2 = await fetch('/api/user/reqtraining');
            const j2 = await r2.json();
            isValidTraining(j2);
            setData(j);
        } catch (error) {
            console.log(error);
            setIsError(true);
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
                <ReactLoading type={'bubble'} color={'black'} height={'20%'} width={'20%'} />
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
                                     <div  href ="#" className={s.main__req__box}>
                                        {validTraining ? (
                                            <a href = "/req/training">Empieza tu formación</a>
                                        ):(
                                            <div>
                                                <a href ="https://vatspa.es/normativa/transferencia-VACC">Transferirte a VATSPA</a>    
                                                <a href = "/req/training/visitor">Solicitar entrenamiento para ser Visitante</a>    
                                            </div>
                                        )}
                                    </div>
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
