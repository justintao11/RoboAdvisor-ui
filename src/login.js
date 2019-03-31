import React from 'react';
import './login.css';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Redirect } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#EF241C' }, // This is HSBC red 
    secondary: { main: '#404040', contrastText: "#fff" }, // This is dark gray 404040
   
  },
  typography: { 
    useNextVariants: true, 
    fontSize: 12,},
});

const textTheme = createMuiTheme({
  palette: {
    primary: { main: '#fff' }, // This is HSBC red 
    secondary: { main: '#404040', contrastText: "#fff" }, // This is dark gray 404040
   
  },
  typography: { 
    useNextVariants: true, 
    },
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toDashboard: false,
      customerId: "",
    }
    this.handleLogin = this.handleLogin.bind(this);
    this.handleCustomerIdChange = this.handleCustomerIdChange.bind(this);
    this.keyPress = this.keyPress.bind(this);
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

  keyPress(e){
    if(e.keyCode === 13){
       this.handleLogin(); // enter key clicks login
    }
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
          <div className="innerContents">
          <Grid container justify="flex-start" className="mainGridContainer">       
            <MuiThemeProvider theme={textTheme}>    
            <Grid item xs={12} className="title">
              <Typography variant="h2" color="primary" gutterBottom>
                RoboAdvisor
              </Typography>
              <Typography variant="h4" color="primary" gutterBottom>
                Portfolio Rebalancer Service
              </Typography>
            </Grid>
            </MuiThemeProvider>
          </Grid>
          <Grid container  justify="flex-end">
            <Grid item xs={9} sm={6} className="login"> 
            <MuiThemeProvider theme={theme}>           
              <TextField
                onKeyDown={this.keyPress} 
                name="customer_login_textfield"
                placeholder="Enter Customer ID"
                inputProps={{
                  style: { backgroundColor:"#ffffff", overflow:"hidden", borderColor: '#EF241C', borderWidth: 1, borderRadius: 4,}
                }}
                fullWidth={true}
                margin="normal"
                onChange={this.handleCustomerIdChange}
                variant="outlined"
              />
              </MuiThemeProvider>
            </Grid>
            <Grid item xs={9} className="loginButton">
              <MuiThemeProvider theme={theme}>
                <Button
                  className="login_button"
                  variant="contained"
                  onClick={this.handleLogin}
                  color="primary">
                  Login
                </Button>
              </MuiThemeProvider>
            </Grid>
          </Grid>
          </div>
        </div>
      );
    }
  }
}

export default Login;
