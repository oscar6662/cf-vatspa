import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';

// General
import Index from "./views/Index/Index";
import Profile from './views/Profile/Profile';
import Schema from "./components/Layout/Schema";

// Admin
import AdminPanel from './views/AdminPanel/Users/AdminPanel';
import AdminUserPanel from './views/AdminPanel/Users/EditUser/AdminUserPanel';
import EditTraining from './views/AdminPanel/Trainings/EditTraining/EditTraining';
import TrainingDescriptions from './views/AdminPanel/Trainings/TrainingDescriptions';
import NewTraining from './views/AdminPanel/Trainings/NewTraining/NewTraining';

// Mentor
import MentorOffers from './views/MentorPanel/Offers/Offers';
import MentorOffersNew from './views/MentorPanel/Offers/New/NewOffer';
import MentorDebrief from './views/MentorPanel/Debriefs/Debrief';
import MentorDebriefUser from './views/MentorPanel/Debriefs/User/DebriefUser';
import MentorRequests from './views/MentorPanel/Requests/Requests';

// Training
import TrainingMain from './views/Training/TrainingMain';
import TrainingScheduled from './views/Training/Scheduled/TrainingScheduled';
import TrainingHistory from './views/Training/History/TrainingHistory';
import TrainingOffers from './views/Training/Offers/TrainingOffers';

// ToDo
import AprovedStations from './views/Profile/AprovedStations';

import 'antd/dist/antd.css';
import './assets/styles/config.scss';
import './assets/styles/grid.scss';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [waitAdmin, waitForAdmin] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [mentor, setMentor] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch('/api/authenticated');
      const json = await result.json();
      setLoggedIn(json.loggedIn);
      setIsLoading(false);
    };
    fetchData();
  }, [loggedIn]);

  useEffect(() => {
    const fetchData = async () => {
      const r = await fetch('/api/user/admin');
      const j = await r.json();
      setAdmin(Boolean(j));
      const r2 = await fetch('/api/user/mentor');
      const j2 = await r2.json();
      setMentor(Boolean(j2));
      waitForAdmin(false);
    };
    if (loggedIn) {
      fetchData();
    }
  }, [loggedIn]);

  return (
    isLoading ? (
      <ReactLoading type={'bubbles'} color={'black'} />
    ) : (

      <Switch>
        {loggedIn ? (
          <Schema admin={admin} mentor={mentor}>
            <Route exact path="/training" children={<TrainingMain />} />
            <Route exact path="/training/scheduled" children={<TrainingScheduled />} />
            <Route exact path="/training/offers" children={<TrainingOffers />} />
            <Route exact path="/training/history" children={<TrainingHistory />} />
            <Route exact path="/user/aprovedstations" children={<AprovedStations />} />
            {!waitAdmin && (
              <>
                <Route exact path="/admin">
                  {!admin ? <Redirect to="/profile" /> : <AdminPanel />}
                </Route>
                <Route exact path="/admin/user">
                  {!admin ? <Redirect to="/profile" /> : <AdminUserPanel />}
                </Route>
                <Route exact path="/admin/training">
                  {!admin ? <Redirect to="/profile" /> : <TrainingDescriptions />}
                </Route>
                <Route exact path="/admin/training/edit">
                  {!admin ? <Redirect to="/profile" /> : <EditTraining />}
                </Route>
                <Route exact path="/admin/training/new">
                  {!admin ? <Redirect to="/profile" /> : <NewTraining />}
                </Route>
                <Route exact path="/mentor/offers">
                  {!mentor ? <Redirect to="/profile" /> : <MentorOffers />}
                </Route>
                <Route exact path="/mentor/offers/new">
                  {!mentor ? <Redirect to="/profile" /> : <MentorOffersNew />}
                </Route>
                <Route exact path="/mentor/requests">
                  {!mentor ? <Redirect to="/profile" /> : <MentorRequests />}
                </Route>
                <Route exact path="/mentor/debrief">
                  {!mentor ? <Redirect to="/profile" /> : <MentorDebrief />}
                </Route>
                <Route exact path="/mentor/debrief/user">
                  {!mentor ? <Redirect to="/profile" /> : <MentorDebriefUser />}
                </Route>
              </>
            )}

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