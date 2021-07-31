import React, { useState, useEffect, useRef, useCallback } from 'react';
import MultipleDatePicker from "react-multiple-datepicker";

export default function TrainingReqPanel(training){
    const [dates, setDates] = useState([])

    async function Handle(){
        fetch('http://localhost:5000/api/user/trainingrequest ', {
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

    const [isSending, setIsSending] = useState(false)
    const isMounted = useRef(true)

    // set isMounted to false when we unmount the component
    useEffect(() => {
      return () => {
        isMounted.current = false
      }
    }, [])

    const sendRequest = useCallback(async () => {
      // don't send again while we are sending
      if (isSending) return;
      // update state
      setIsSending(true)
      // send the actual request
      await Handle();
      // once the request is sent, update state again
      if (isMounted.current) // only update if we are still mounted
        setIsSending(false)
    }, [isSending]) // upzdate the callback if the state changes


    return(
        <div>
            <p>Selecciona las fechas en que estés disponible</p>
            <MultipleDatePicker
            onSubmit={dates => setDates(dates)}
            
        />
        <button type="button" onClick={sendRequest} disabled={isSending}>Confirmar</button>
        </div>
        

    );
}