import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import ReactLoading from 'react-loading';
import Index from "./views/Index/Index";
import Profile from './views/Profile/Profile';
import Layout from "./components/Layout/Layout";

import './assets/styles/config.scss';
import './assets/styles/grid.scss';
import TrainingMain from './views/Training/TrainingMain';



export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await fetch('/api/authenticated');
      const json = await result.json();
      console.log(json);
      setLoggedIn(json.loggedIn);
      setIsLoading(false);
    };
    fetchData();
  },[loggedIn]);

  return (
    isLoading ? (
      <ReactLoading type={'bubble'} color={'black'} height={'20%'} width={'20%'} />
    ) : (
      
        <Switch>
        {loggedIn ? (
            <Layout>
              <Route path="/training" children={ <TrainingMain/> } />
              <Route path="/profile" children={ <Profile/> } />
              <Route exact path="/" >
                <Redirect to="/profile" />
             </Route>
            </Layout>
          ) : (
            <Route exact path="/" >
                <Index/>
             </Route>
          )}
          
          <Redirect from="*" to="/"/>
        </Switch> 
    
    )
  );
}