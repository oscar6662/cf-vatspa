import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';
import Index from "./views/Index/Index";
import Profile from './views/Profile/Profile';
import Schema from "./components/Layout/Schema";
import AdminPanel from './views/AdminPanel/AdminPanel';
import MentorPanel from './views/MentorPanel/MentorPanel';
import MentorPanelOffer from './views/MentorPanel/MentorPanelOffer';
import AdminUserPanel from './views/AdminPanel/AdminUserPanel';
import AprovedStations from './views/Profile/AprovedStations';
import './assets/styles/config.scss';
import './assets/styles/grid.scss';
import TrainingMain from './views/Training/TrainingMain';
import TrainingOffers from './views/Training/TrainingOffers';
import TrainingDescriptions from './views/AdminPanel/TrainingDescriptions';


export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [mentor, setMentor] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch('/api/authenticated');
      const json = await result.json();
      setLoggedIn(json.loggedIn);
      const r = await fetch('/api/user/admin');
      const j = await r.json();
      setAdmin(Boolean(j));
      const r2 = await fetch('/api/user/mentor');
      const j2 = await r2.json();
      setMentor(Boolean(j2));
      setIsLoading(false);
    };
    fetchData();
  }, [loggedIn]);

  return (
    isLoading ? (
      <ReactLoading type={'bubbles'} color={'black'} />
    ) : (

      <Switch>
        {loggedIn ? (
          <Schema admin = {admin} mentor = {mentor}>
            <Route exact path="/training" children={<TrainingMain />} />
            <Route exact path="/training/offers" children={<TrainingOffers />} />
            <Route exact path="/user/aprovedstations" children={<AprovedStations />} />
            <Route exact path="/admin">
              {!admin ? <Redirect to="/profile" /> : <AdminPanel />}
            </Route>
            <Route exact path="/admin/user">
              {!admin ? <Redirect to="/profile" /> : <AdminUserPanel />}
            </Route>
            <Route exact path="/admin/training">
              {!admin ? <Redirect to="/profile" /> : <TrainingDescriptions />}
            </Route>
            <Route exact path="/mentor">
              {!mentor ? <Redirect to="/profile" /> : <MentorPanel />}
            </Route>
            <Route exact path="/mentor/offer">
              {!mentor ? <Redirect to="/profile" /> : <MentorPanelOffer />}
            </Route>
            <Route path="/profile" children={<Profile />} />
            <Route exact path="/" >
              <Redirect to="/profile" />
            </Route>
          </Schema>
        ) : (
          <Route exact path="/" >
            <Index />
          </Route>
        )}

        <Redirect from="*" to="/" />
      </Switch>

    )
  );
}