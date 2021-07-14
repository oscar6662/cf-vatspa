import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import Index from "./views/Index/Index";
import Profile from './views/Profile/Profile';
import Layout from "./components/Layout/Layout"

import './assets/styles/config.scss';
import './assets/styles/grid.scss';



export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await fetch('/api/authenticated');
      const json = await result.json();
      setLoggedIn(json.loggedIn);
      setIsLoading(false);
    };
    fetchData();
  },[loggedIn]);

  return (
    isLoading ? (
      <p>Loading Content</p>
    ) : (
      
      <Router>
        <Switch>
          <Route exact path="/" >
            { console.log('hola'),loggedIn ? <Redirect to="/profile" /> : <Index></Index> }
          </Route>
          {loggedIn && (console.log('holas'),
          <Layout>
            <Route exact path="/profile" children={ <Profile/> } />
            </Layout>
          )
          }
          <Redirect from="*" to="/"/>
        </Switch> 
      </Router> 
    
    )
  );
}