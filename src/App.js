import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './login.js';
import Dashboard from './dashboard.js';
import Portfolio from './portfolio.js';


import { BrowserRouter as Router,Switch, Link, Route } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Router>
      	<Switch>
      		<Route exact path='/' component={Login}/>
        	<Route path='/dashboard' component={Dashboard}/>
          <Route path='/portfolio' component={Portfolio}/>
      	</Switch>
        
      </Router>
    );
  }
}

export default App;
