import React, {useEffect, useState} from 'react';
import { Card, Col, Row } from 'antd';
import ReactLoading from 'react-loading';
import s from './Profile.module.scss';

export default function Profile(){
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState([]);
    const [validTraining, isValidTraining] = useState(false);
    const [trainings, setTrainings] = useState([]);
  
     useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
            const r = await fetch('/api/user');
            const j = await r.json();
            const r2 = await fetch('/api/user/reqtraining');
            const j2 = await r2.json();
            const r3 = await fetch('/api/user/completedtrainings');
            const j3 = await r3.json();
            isValidTraining(j2);
            setData(j);
            setTrainings(j3)
        } catch (error) {
            console.log(error);
            setIsError(true);
        }
        setIsLoading(false);
      };
      fetchData();
    },[!data]);

return(
  <>
    {isLoading ? (
      <ReactLoading type={'bubbles'} color={'black'}/>
    ):(
      isError ? (
        <p>Unfortunatelly an Error Ocurred</p>
      ):(
        <div>
          <div className={s.main__stats}>
            <Row gutter={16} justify={'space-between'} wrap={true}>
              <Col span={8} xs ={24} sm={8} style={{'margin-bottom': '10px'}}>
                <Card title="Rango Actual" bordered={false}>
                  {data.vatsim.rating.short}
                </Card>
              </Col>
              <Col span={8} xs ={24} sm={8} style={{'margin-bottom': '10px'}}>
                <Card title="vACC Ascrito" bordered={false}>
                  {data.vatsim.subdivision.name}
                </Card>
              </Col>
              <Col span={8} xs ={24} sm={8} style={{'margin-bottom': '10px'}}>
                <Card title="Último Training" bordered={false}>
                  28 de Agosto
                </Card>
              </Col>
            </Row>
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
                        <br></br><br></br>
                      <a href = "/training">Solicitar entrenamiento para ser Visitante</a>    
                    </div>
                  )}
                </div>
              </div>
            </div>
         </div>
        </div>
      )
    )}
  </> 
);
}
