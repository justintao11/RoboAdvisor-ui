import React from "react";
import {
  Doughnut
} from "react-chartjs-2";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import './portfolio.css';
import { Redirect } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';

import {
  dashboardEmailStatisticsChart,
} from "./variables/charts.jsx";
import transitions from "@material-ui/core/styles/transitions";
const request = require('request');

const styles = theme => ({
  multilineColor:{
      color:'red'
  }
});

class Portfolio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      setTargetOn: false,
      recommandOn: false,
      funds: [],
      targets: [25, 25, 25],
      total: 1,
      recommendations: [],
      indexrec:{},
      warningOpen: false,
      toDashboard: false,
      allowedDeviation: 5,
      errorMessage: "Bla bla",
      customerId: props.location.state.customerId,
      selectedPortfolioPreference: props.location.state.selectedPortfolioPreference,
      selectedPortfolio: props.location.state.selectedPortfolio
    }

    this.handleSetTargetClick = this.handleSetTargetClick.bind(this);
    this.getRebalance = this.getRebalance(this.state.selectedPortfolio.id, this.state.customerId);
  }

  componentDidMount() {
    this.getFunds(this.state.customerId);
  }

  getRebalance = (selectedPortfolio, customerId) =>{
    request.post({url: 'http://fund-rebalancer.hsbc-roboadvisor.appspot.com/roboadvisor/portfolio/'+selectedPortfolio+'/rebalance', 
                  headers: {'x-custid':customerId}}, function(error, response, body){
      if(!error&&response.statusCode===200){
        console.log(body);
        let trans = JSON.parse(body);
        this.setState({
          recommendations:trans.transactions
        });
        for (let k = 0; k<this.state.recommendations.length; k++){
            let index = this.state.recommendations[k].fundId;
            let value = this.state.recommendations[k].units;
            this.state.indexrec[index] = value;
        }
      }else{
        console.log("error!!!");
        console.log("getRebalance res code: " + response.statusCode);
        console.log(customerId);
        console.log(selectedPortfolio);
      }
    }.bind(this));
  }

  // getrecommendationByIndex = index =>{
  //   this.getRebalance(this.state.selectedPortfolio.id, this.state.customerId);
  //   let listoffundID = []
  //   for (let k = 0; k<this.state.recommendations.length; k++){
  //     index = this.state.recommendations[k].fundId;
  //     let value = this.state.recommendations[k].units;
  //     this.state.indexrec[index] = value;
  //   }
  // }
  

  changeAllowedAllocation = name => e => {
    this.setState({
      allowedDeviation: Number(e.target.value),
    });
  }

  handleChange = index => event => {
    let targets = this.state.targets;
    targets[index] = Number(event.target.value);
    this.setState({
      targets: targets
    });
  };

  handleSetTargetClick = (e) => {
    this.setState({
      setTargetOn: true
    })
  }

  handleReallocationClick = (e) => {
    this.setState({
      recommandOn: true,
      setTargetOn: false
    })
  }

  handleBack = (e) => {
    this.setState({
      toDashboard: true
    })
  }

  setTarget = (e) => {
    let sum = this.state.targets.reduce((partial_sum, a) => partial_sum + a);
    console.log(sum);
    if(sum !== 100) {
      this.setState({
        errorMessage: "Target is not add up to 100",
        warningOpen: true
      })
    } else {
      this.setState({
        warningOpen: false,
        setTargetOn: false,
        recommandOn: false
      })
    }
    
  }

  handleAlertClose = (e) => {
    this.setState({
      warningOpen: false
    })
  }

  executeRecommend = (e) => {
    this.setState({
      recommandOn: false
    })
  }

  getFunds(custId) {
    let options = {
      url: "https://fund-rebalancer-dot-hsbc-roboadvisor.appspot.com/roboadvisor/fundsystem/portfolios",
      method: 'GET',
      headers: {
        'x-custid': custId
      }
    }

    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        let info = JSON.parse(body);
        console.log(info);
        let funds;
        for (let i = 0; i<info.length; i++) {
          if(info[i].id === this.state.selectedPortfolio.id) {
            funds = info[i].holdings;
          }
        }
        let total = 0;
        for(let i =0; i<funds.length; i++) {
          total += funds[i].balance.amount;
        }
        this.setState({
          funds: funds,
          total: total
        });
      } else {
        console.log("getPortfolioList res code: " + response.statusCode)
        console.log(error);
      }
    });
  }



  createFund(index) {
    let portion = Math.round(this.state.funds[index].balance.amount * 100 / this.state.total);
    return (
    /*
        <Paper className="fundCard">
          <div className="fund">
            <Typography variant="display2" className="title">Fund ID: {this.state.funds[index].fundId}</Typography>
            {this.state.setTargetOn ? (
              <div className="rellocationRow">
                <Typography variant="h6" className="title">Target %:</Typography>
                <TextField
                  id="outlined-number"
                  label="Number"
                  value={this.state.targets[index]}
                  onChange={this.handleChange(index)}
                  type="number"
                  className="textField"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                  variant="outlined"
                />
              </div>
            ) : (
                <Typography variant="h6" className="title">Target %: {this.state.targets[index]}</Typography>
              )}
            <Typography variant="h6" className="title">Current %: {portion}</Typography>
          </div>
        </Paper>)
  */

      <Paper className="fundCard"> 
        <Grid container direction="row">
          <Grid item xs = {4} container direction="column" className="fundColumn">
            <Grid item>
              <Typography variant="display1">Fund ID</Typography>
            </Grid>
            <Grid item>
              <Typography className="fundIDString" variant="h4">{this.state.funds[index].fundId}</Typography>
            </Grid>
          </Grid>          
      
        <Grid item xs = {4} container direction="column" className="percentColumn">
          <Grid item>
            <Typography variant="display1">Current</Typography>
          </Grid>

          <Grid item>
            <TextField
            disabled
            id="filled-disabled"
            defaultValue={portion}
            className="textField"
            margin="normal"
            variant="outlined"
            style = {{width: 60}}                     
            />
          </Grid>
        </Grid>
      
      
        {this.state.setTargetOn ? (
          <Grid item xs = {4} container direction="column" className="percentColumn">
          <Grid item>
            <Typography variant="display1" >Target </Typography>
          </Grid>
            <TextField
              id="outlined-number"
              label="%"
              value={this.state.targets[index]}
              onChange={this.handleChange(index)}
              type="number"
              className="textField"
              InputLabelProps={{
                shrink: true,
              }}
              inputStyle={{ backgroundColor: 'red' }}
              margin="normal"
              variant="outlined"
              style = {{width: 60}}
                          
            />                      
          </Grid> 
        ) : (
          <Grid item xs = {4} container direction="column" className="percentColumn">
            <Grid item>
            <Typography variant="display1"> Target </Typography>
            </Grid>
            <Grid item>
            <TextField
              disabled
              id="filled-disabled"
              defaultValue={this.state.targets[index]}
              className="textField"
              margin="normal"
              variant="outlined"
              style = {{width: 60}}
                                   
            />
            </Grid>
          </Grid>
          )}
          
      </Grid>
    </Paper>
  
    )}

  createChart(index) {
    let portion = Math.round(this.state.funds[index].balance.amount * 100 / this.state.total);
    let graph = {
      datasets: [{
        data: [],
        backgroundColor: []
      }]
    };
    let funds = this.state.funds;
    for(let i=0; i<funds.length; i++) {
      graph.datasets[0].data.push(Math.round(this.state.funds[i].balance.amount * 100 / this.state.total));
      let color = (i == index) ? '#FF6384' : '#e0e0e0';
      graph.datasets[0].backgroundColor.push(color);
    }

    return (
        <Doughnut
          key={index}
          data={graph}
          options={dashboardEmailStatisticsChart.options}
        />
      )
  }

  createRecommand(index) {
    return (
      <Grid item xs={6}>
        <Paper className="fundCard">
          <Typography variant="h6">Recommendation: Fund {this.state.funds[index].fundId}:</Typography>
          <Grid item container direction="row" className="recommendCard">
            <Grid item className="percentColumn">
              <Button variant="contained" color="default" className="TOPBUTTON">
                Sell
              </Button>
            </Grid>
            <Grid item className="percentColumn">
              <Button variant="contained" color="secondary" className="TOPBUTTON">
                Buy
              </Button>
            </Grid>
            <Grid item className="percentColumn">
            <TextField
              id="outlined-number"
              label="Number"
              value = {this.state.indexrec[this.state.funds[index].fundId]}
              onChange={this.handleChange('bundb')}
              type="number"
              className="textField"
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              variant="outlined"
              style = {{width: 100}}
            />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    )
  }

  createMiniFund(index) {
    let portion = Math.round(this.state.funds[index].balance.amount * 100 / this.state.total);
    return (
        <Paper key={index} className="fundCard">
          <Grid container wrap="nowrap" direction="column" className="miniFundCard">
            <Grid item className="fundCardText">
              <Typography variant="subtitle2">Fund ID: {this.state.funds[index].fundId}</Typography>
            </Grid>
            {this.state.setTargetOn ? (
              <Grid item className="fundCardText">
                <Typography variant="h6">Target: </Typography>
                <TextField
                  id="outlined-number"
                  label="Number"
                  value={this.state.targets[index]}
                  onChange={this.handleChange(index)}
                  type="number"
                  className="textField"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
            ) : (
                <Grid item className="fundCardText">
                  <Typography variant="h6">Target: {this.state.targets[index] + '%'}</Typography>
                </Grid>
              )}
            <Grid item className="fundCardText">
              <Typography variant="h6">Current: {portion + '%'}</Typography>
            </Grid>
          </Grid>
        </Paper>)
  }




  render() {
    if (this.state.toDashboard === true) {
      return <Redirect to={{
        pathname: '/dashboard',
        state: { 
          customerId: this.state.customerId 
        }
      }}
      />;
    }
    let that = this;

    return (
      <div className="dashboardContainer">
        <div className="root">
          <Grid container spacing={24}>
            <Grid item xs={6}>
              <Typography variant="h5" className="Portfolio Title">
                Portfolio ID: {this.state.selectedPortfolio.id}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5" className="Customer Title">
                Customer ID: {this.state.customerId}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={this.handleBack} color="secondary" className="TOPBUTTON">
                Back
              </Button>
              <Button variant="contained" onClick={this.handleSetTargetClick} color="default" className="TOPBUTTON">
                Set TARGET
              </Button>
              <Button variant="contained" onClick={this.handleReallocationClick} color="default" className="TOPBUTTON">
                Rebalance
              </Button>
            </Grid>            
            <Grid item xs={12}>
            {this.state.setTargetOn ? (
              <TextField
                id="outlined-number"
                label="Allowed Deviation"
                value={this.state.allowedDeviation}
                onChange={this.changeAllowedAllocation()}
                type="number"
                className="textField"
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                variant="outlined"
              />
            ):(
              <Typography variant="h6" className="title">Allowed Deviation: {this.state.allowedDeviation}</Typography>
            )}
            </Grid>      
            {this.state.funds.map(function(object, i){
                return (
                  <Grid item xs={12}>
                    <Grid container spacing={24}>
                    <Grid item xs={that.state.recommandOn ? 3 : 9}>
                      {that.state.recommandOn? that.createMiniFund(i) : that.createFund(i)}
                    </Grid>
                    {that.state.recommandOn && that.createRecommand(i)}
                    <Grid item xs={3}>
                      {that.createChart(i)}
                    </Grid>
                    </Grid>
                  </Grid>
                );
            })}
            {this.state.setTargetOn && (
              <Grid item xs={12}>
                <Button onClick={this.setTarget} fullWidth={true} variant="contained" color="secondary" className="TOPBUTTON">
                  SAVE
              </Button>
              </Grid>
            )}
            {this.state.recommandOn && (
              <Grid container spacing={24}>
                <Grid item xs={6}>
                  <Button onClick={this.setTarget} fullWidth={true} variant="contained" color="secondary" className="TOPBUTTON">
                    MODIFY
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={this.executeRecommend} fullWidth={true} variant="contained" color="secondary" className="TOPBUTTON">
                    EXECUTE
                  </Button>
                </Grid>
              </Grid>
            )}
            <Snackbar
              className="Snackbar"
              open={this.state.warningOpen}
              autoHideDuration={3000}
              onClose={this.handleAlertClose}>
              <SnackbarContent
                className="SnackbarContent"
                aria-describedby="client-snackbar"
                message={
                  <span id="client-snackbar" className="message">
                    <ErrorIcon className="icon" />
                    {this.state.errorMessage}
                  </span>
                }
                action={[
                  <IconButton
                    className="close"
                    onClick={this.handleAlertClose}
                  >
                    <CloseIcon className="closeIcon" />
                  </IconButton>
                ]}
              />
            </Snackbar>
          </Grid>
        </div>
      </div>
    );
  }
}

export default Portfolio;
