import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import login from './pages/login';
import signup from './pages/signup';
import home from './pages/home';


function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={home}/>
          <Route exact path="/login" component={login}/>
          <Route exact path="/signup" component={signup}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
