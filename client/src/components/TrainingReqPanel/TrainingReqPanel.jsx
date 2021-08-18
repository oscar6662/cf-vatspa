import React, { useState, useEffect, useRef, useCallback } from 'react';
import MultipleDatePicker from "react-multiple-datepicker";
//TODO FIGURE OUT WHY THE FUCK DATES DOES NOT GET SENT
export default function TrainingReqPanel(training){
    const [dates, setDates] = useState([]);
    async function Handle(){
        fetch('/api/user/trainingrequest ', {
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

    return(
        <div>
            <p>Selecciona las fechas en que estés disponible</p>
            <MultipleDatePicker
            onSubmit={dates => setDates(dates)}
        />
        <button type="button" onClick={Handle}>Confirmar</button>
        </div>
        

    );
}