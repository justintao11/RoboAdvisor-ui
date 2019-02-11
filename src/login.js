import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Redirect} from 'react-router-dom';

const styles = theme => ({
  // button: {
  //   display: "flex",
  //   margin: 20
  // },
  // input: {
  //   display: "flex"
  // },
  // textField: {
  //   display: "flex",
  //   margin: 20,
  //   padding: 30,
  //   width: 200
  // },
  // root: {
  //   flexGrow: 1,
  // }

});


const uid = 3000;


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toDashboard: false,
      idValue: ''
    }
    this.handleLogin = this.handleLogin.bind(this);
    this.handleUserIDChange = this.handleUserIDChange.bind(this);
  }

  handleLogin() {
    console.log("???");
    this.setState({
      toDashboard: true
    });
  }

  handleUserIDChange = (e) => {
    this.setState({
      idValue: e.target.value
    })
  }

  render() {
    if (this.state.toDashboard === true) {
      this.setState({
        toDashboard: false
      })
      return <Redirect to={{
                      pathname:'/dashboard',
                      state: {id: this.state.idValue} 
          }}
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
                      placeholder="Plase enter User ID"
                      value={this.state.idValue}
                      id="outlined-dense"
                      label="User ID"
                      className="dense"
                      margin="dense"
                      onChange={this.handleUserIDChange}
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

