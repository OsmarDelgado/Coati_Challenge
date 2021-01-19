import React, { Fragment } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './App.css';

/**
 * Components
 */

// Header
import Header from './components/header/Header';

// Sign In component
import Home from './components/home/Home';

// Sign Up component
import SignUp from './components/auth/SignUp';

// Sign In component
import SignIn from './components/auth/SignIn';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />

        <div className="container d-flex flex-column">
          <Switch>
            
            <Route path="/" exact={true}>
              <Home />
            </Route>

            <Route path="/signup" exact={true}>
              <SignUp />
            </Route>

            <Route path="/signin" exact={true}>
              <SignIn />
            </Route>

          </Switch>
       </div>

      </div>
    </Router> 
  );
}

export default App;
