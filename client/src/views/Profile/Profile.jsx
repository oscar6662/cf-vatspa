import React from 'react';

import s from './Profile.module.scss';

export default function Profile(){
return(
   <div className={s.main}>
       <div className={s.main__title}>
            <h1>Centro de Formación</h1>
       </div>
       <div className="">
            <div className={s.main__content}>
                 <div className={s.main__stats}>
                     <div className={s.main__stats__box}>
                         <p>Rango actual</p>
                         <h2>S1 Trainee</h2>
                     </div>
                     <div className={s.main__stats__box}>
                         <p>vACC ascrito</p>
                         <h2>Spain (VATSPA)</h2>
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
                        </div>
                        
                    </div>
                 </div>
                 
                 
            </div>
       </div>
       
       
   </div> 
);
}
