import React, {useEffect, useState} from 'react';
import { Card, Col, Divider, Row } from 'antd';
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
        try {
            const r1 = await fetch('/api/user');
            const j1 = await r1.json();
            const r2 = await fetch('/api/training/isallowedtorequest');
            const j2 = await r2.json();
            const r3 = await fetch('/api/training/completedtrainings');
            const j3 = await r3.json();
            setData(j1);
            isValidTraining(j2);
            setTrainings(j3);
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
                  {!trainings.length ? <>Ninguno</> : trainings[trainings.length-1].date}
                </Card>
              </Col>
            </Row>
          </div>
          <div className="row">
            <div className="col-7">
              <div className = {s.main__trainings}>
                <h2>Mis Trainings</h2>
                {!trainings.length? <>No has hecho ningún training </>:
                (
                  <table>
                    <tr>
                      <th>Training</th>
                      <th>Fecha</th>
                      <th>Resultado</th>
                      <th>Comentarios</th>
                    </tr>
                  {trainings.map(i => (
                    <tr>
                      <td>{i.training}</td>
                      <td>{i.date}</td>
                      <td>{i.passed}</td>
                      <td></td>
                    </tr> 
                  ))}
                  </table>
                ) } 
                </div>
              </div>
            <div className="col-5">
              <div className = {s.main__req}>
                <h2>Solicitar Training</h2>
                <div  href ="#" className={s.main__req__box}>
                  {validTraining ? (
                    data.vatsim.rating.id < 5 &&<a href = "/req/training">Solicita Formación</a>
                  ):(
                    <div>
                      <a href ="https://vatspa.es/normativa/transferencia-VACC">Transferirte a VATSPA</a>    
                        <Divider></Divider>
                        {data.vatsim.rating.id > 2 && <a href = "/training">Solicitar entrenamiento para ser Visitante</a> }  
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
