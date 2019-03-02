import React, {
  Component
} from 'react';
// import logo from './logo.svg';
import './App.css';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {
  Redirect
} from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toDashboard: false,
      customerId: ""
    }
    this.handleLogin = this.handleLogin.bind(this);
    this.handleCustomerIdChange = this.handleCustomerIdChange.bind(this);
  }

  handleLogin() {
    this.setState({
      toDashboard: true
    });
  }

  handleCustomerIdChange = (e) => {
    this.setState({
      customerId: e.target.value
    })
  }
  
  render() {
    if (this.state.toDashboard === true) {
      return <Redirect to = {
        {
          pathname: '/dashboard',
          state: {
            id: this.state.customerId
          }
        }
      }
      />;
    }

    return (
      <div className="App">
        <header className="header">
            <Paper className="paper">
              <div style={{ padding: 20}}>
                <Grid container spacing={24}>
                  <Grid item xs={12}>
                    <Typography component="h1" variant="title" gutterBottom>
                      HSBC RoboAdvisor Portfolio Rebalancer
                    </Typography>
                  </Grid>
                </Grid>
              </div>
              <div style={{ paddingTop: 160}}>
                <Grid container spacing={24}>
                  <Grid item xs={12}>
                      <TextField
                      placeholder="Enter Customer ID"
                      value={this.state.idValue}
                      id="outlined-dense"
                      label="Customer ID"
                      className="dense"
                      margin="dense"
                      onChange={this.handleCustomerIdChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" color="primary"
                      onClick={this.handleLogin}
                      className="button">
                        Login
                    </Button>
                  </Grid>
                </Grid>
              </div>
          </Paper>
        </header>
      </div>
    );
  }
}

export default Login;
