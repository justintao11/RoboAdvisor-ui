import React from 'react';
import './login.css';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Redirect } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toDashboard: false,
      customerId: "",
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
      return <Redirect to={
        {
          pathname: '/dashboard',
          state: {
            customerId: this.state.customerId
          }
        }} />;
    } else {
      return (
        <div className="loginContainer">
          <Grid container justify="flex-end" spacing={24}>          
            <Grid item xs={12} className="title">
              <Typography component="h1" variant="h3" gutterBottom>
                RoboAdvisor
              </Typography>
              <Typography component="h1" variant="h4" gutterBottom>
                Portfolio Rebalancer Service
              </Typography>
            </Grid>
          </Grid>
          <Grid container  justify="flex-end">
            <Grid item xs={9} sm={6} className="login">            
              <TextField
                placeholder="Enter Customer ID"
                label="Customer ID"
                fullWidth={true}
                margin="normal"
                onChange={this.handleCustomerIdChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={9} className="login">
              <Button
                className="login_button"
                variant="contained"
                onClick={this.handleLogin}
                color="secondary">
                Login
              </Button>
            </Grid>
          </Grid>
        </div>
      );
    }
  }
}

export default Login;
