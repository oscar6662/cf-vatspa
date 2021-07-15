import React, { useState, useEffect  } from 'react';

import s from './TrainingButton.module.scss';

export default function TrainingButton(data){
    const [isValid, setIsValid] = useState(false);
    if (data.vatsim.subdivision.code == 'SPA'){
        setIsValid(true);
    }

  return(
    <a className={s.button}>
        {isValid ? (
            <>Empieza tu formación</>
        ):(
            <>No puedes empezar tu formación</>
        )}
    </a>
  );
}
