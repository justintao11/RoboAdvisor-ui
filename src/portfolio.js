import React from "react";
import {
  Doughnut
} from "react-chartjs-2";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import './portfolio.css';
import { Redirect } from 'react-router-dom';

import {
  dashboardEmailStatisticsChart,
} from "./variables/charts.jsx";
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
      target1: 20,
      fundb: 0,
      funds: [],
      total: 1,
      toDashboard: false,
      allowedDeviation: 5,
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
      }else{
        console.log("error!!!");
        console.log("getRebalance res code: " + response.statusCode);
        console.log(customerId);
        console.log(selectedPortfolio);
      }
    });
  }

  changeAllowedAllocation = name => e => {
    this.setState({
      allowedDeviation: e.target.value,
    });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
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
    this.setState({
      setTargetOn: false,
      recommandOn: false
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
                <Typography variant="h6" className="title">Target %: </Typography>
                <TextField
                  id="outlined-number"
                  label="Number"
                  value={this.state.target1}
                  onChange={this.handleChange('target1')}
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
                <Typography variant="h6" className="title">Target %: {this.state.target1}</Typography>
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
              value={this.state.target1}
              onChange={this.handleChange('target1')}
              type="number"
              className="textField"
              InputLabelProps={{
              shrink: true,
              }}
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
              defaultValue={this.state.target1}
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
          data={graph}
          options={dashboardEmailStatisticsChart.options}
        />
      )
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
                      {that.createFund(i)}
                    </Grid>
                    <Grid item xs={3}>
                      {that.createChart(i)}
                    </Grid>
                    </Grid>
                  </Grid>
                );
            })}    
            
            


            {this.state.recommandOn && (
              <Grid item xs={6}>
                <Paper className="fundCard">
                  <Typography variant="h6" className="title">Recommendation: fund{"B"} :</Typography>
                  <div className="rellocationRow">
                    <Button variant="contained" color="default" className="TOPBUTTON">
                      Sell
                </Button>
                    <Button variant="contained" color="secondary" className="TOPBUTTON">
                      Buy
                </Button>
                    <TextField
                      id="outlined-number"
                      label="Number"
                      value={this.state.fundb}
                      onChange={this.handleChange('bundb')}
                      type="number"
                      className="textField"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                      variant="outlined"
                    />
                    <Typography> UNITS</Typography>
                  </div>
                </Paper>
              </Grid>
            )}
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

          </Grid>
        </div>
      </div>
    );
  }
}

export default Portfolio;
