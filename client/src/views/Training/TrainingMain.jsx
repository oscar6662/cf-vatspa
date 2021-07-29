import React, {useEffect, useState} from 'react';
import ReactLoading from 'react-loading';

import s from './TrainingMain.module.scss';

export default function TrainingMain(){
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState([]);
    const [validTraining, isValidTraining] = useState(false);
  
     useEffect(() => {
      const fetchData = async () => {
          console.log("estem");
        setIsLoading(true);
        try {
            const r = await fetch('/api/user/reqtraining');
            const j = await r.json();
            if (j.vatsim.subdivision.code === 'SPA'){
                isValidTraining(true);
            }
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
                         <p>hola</p> 
                     </div>
                </div>
           )
       )}
   </div> 
);
}
