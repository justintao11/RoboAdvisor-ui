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
// import WarningIcon from '@material-ui/icons/Warning';
import './portfolio.css';
import { Redirect } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';

import {
  dashboardEmailStatisticsChart,
} from "./variables/charts.jsx";
// import transitions from "@material-ui/core/styles/transitions";
const request = require('request');


class Portfolio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,       // not being used right now//
      toDashboard: false,
      setAllocationOn: false,
      recommendOn: false,
      recommendationSet: false,
      funds: [],   
      fundBalances:{},     // dictionary of fundID:{balance, currency}    // 
      total: 1,             // total balance of all funds//
      targets: [],          // target % for each fund//
      allowedDeviation: 5,  // max deviation for portfolio//
      recommendations: [],  // list of recommendations//
      indexRec:{},         // index of current recommendation? (not sure)//
      warningOpen: false,   // warning bar if allocation != add to 100//
      errorMessage: "bla bla",     // warning bar error message//
      customerId: props.location.state.customerId,
      selectedPortfolioPreference: props.location.state.selectedPortfolioPreference,
      selectedPortfolio: props.location.state.selectedPortfolio
    }

    this.handleSetAllocationClick = this.handleSetAllocationClick.bind(this);
    this.handleRebalanceClick = this.handleRebalanceClick.bind(this);
    this.getRebalance = this.getRebalance.bind(this);
    //this.setAllowedDeviation = this.setAllowedDeviation.bind(this);
  }

  componentDidMount() {
    this.getFunds(this.state.customerId);
  }


  getRebalance(selectedPortfolio, custID) {
    let options = {
      url: 'http://fund-rebalancer.hsbc-roboadvisor.appspot.com/roboadvisor/portfolio/'+selectedPortfolio+'/rebalance',      
      method: 'GET',
      headers: {
        'x-custid': custID
      }
    }
  
    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        let trans = JSON.parse(body)
        let tempIndexRec = {};
        for (let k = 0; k < trans.transactions.length; k++){
          let index = trans.transactions[k].fundId;
          let value = trans.transactions[k].units;
          tempIndexRec[index] = value;
        }
        this.setState({
          recommendations: trans.transactions,
          indexRec: tempIndexRec
        });
        
      } else {
        // let temp = [];
        // for (let i = 0; i < this.state.funds.length; i++){
        //   temp[i] = 20;
        // }
        this.setState({
          recommendationSet: false,
          //targets: temp
        });
        // console.log(response.statusCode);
        console.log(custID);
        console.log(selectedPortfolio);
      }
    })
    }

  handleDeviationChange = (e) => {
    this.setState({
      allowedDeviation: Number(e.target.value),
    });
  }

  handleTargetChange = index => event => {
    let targets = this.state.targets;
    targets[index] = Number(event.target.value);
    this.setState({
      targets: targets
    });
  };

  handleSetAllocationClick = (e) => {
    this.setState({
      setAllocationOn: true
    })
  }

  handleRebalanceClick = (e) => {
    if (this.state.recommendationSet){
      this.getRebalance(this.state.selectedPortfolio.id, this.state.customerId);
      this.setState({
        recommendOn: true,
        setAllocationOn: false,
        warningOpen: false
      })
    } else {
      this.setState({
        errorMessage: "Allocation has not been set",
        warningOpen: true
      })
    }
  }

  handleBack = (e) => {
    this.setState({
      toDashboard: true
    })
  }

  saveAllocation = (e) => {
    let sum = 0;
    let dev = this.state.allowedDeviation;
    if (this.state.targets.length > 0){
      sum = this.state.targets.reduce((partial_sum, a) => partial_sum + a);
    } 
    console.log(sum);

    if(dev < 0 || dev > 5){
      this.setState({
        errorMessage: "Deviation must be between 0-5%",
        warningOpen: true
      })
    } else if(sum !== 100) {
      this.setState({
        errorMessage: "Target does not add up to 100",
        warningOpen: true
      })
    } else {
      this.setState({
        warningOpen: false,
        setAllocationOn: false,
        recommendOn: false,
        recommendationSet: true
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
      recommendOn: false
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
        let tempFunds;
        let tempFundBalances = new Map();
        for (let i = 0; i<info.length; i++) {
          if(info[i].id === this.state.selectedPortfolio.id) {
            tempFunds = info[i].holdings;
          }
        }
        let tempTotal = 0;
        for(let i =0; i<tempFunds.length; i++) {
          tempFundBalances.set(tempFunds[i].fundId, tempFunds[i].balance);
          tempTotal += tempFunds[i].balance.amount;
        }
        this.setState({
          funds: tempFunds,
          fundBalances: tempFundBalances,
          total: tempTotal
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
      <Paper className="fundCard"> 
        <Grid container direction="row">
          <Grid item xs={4} container direction="column" className="fundColumn">
            <Grid item>
              <Typography variant="display1">Fund ID</Typography>
            </Grid>
            <Grid item>
              <Typography className="fundIDString" variant="h4">{this.state.funds[index].fundId}</Typography>
            </Grid>
          </Grid>          
      
        <Grid item xs={4} container direction="column" className="percentColumn">
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
        {this.state.setAllocationOn ? (
          <Grid item xs = {4} container direction="column" className="percentColumn">
          <Grid item>
            <Typography variant="display1" >Target </Typography>
          </Grid>
            <TextField
              id="outlined-number"
              label="%"
              value={this.state.targets[index]}
              onChange={this.handleTargetChange(index)}
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
    // let portion = Math.round(this.state.funds[index].balance.amount * 100 / this.state.total);
    let graph = {
      datasets: [{
        data: [],
        backgroundColor: []
      }]
    };
    let funds = this.state.funds;
    for(let i=0; i<funds.length; i++) {
      graph.datasets[0].data.push(Math.round(this.state.funds[i].balance.amount * 100 / this.state.total));
      let color = (i === index) ? '#FF6384' : '#e0e0e0';
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

  createRecommendation(index) {
    return (
      <Grid item xs={5}>
        <Paper className="fundCard">
          <Typography variant="h6">Recommendation:</Typography>
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
              label="Units"
              value = {this.state.indexRec[this.state.funds[index].fundId]}
              onChange={this.handleTargetChange('bundb')}
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
    let currFundID = this.state.funds[index].fundId;
    let currFund = this.state.fundBalances.get(currFundID);
    return (      
        
      <Paper key={index} className="fundCard">
        <Grid container wrap="nowrap" direction="column" className="miniFundCard">
          <Grid item className="fundCardText">
            <Typography variant="subtitle2">Fund ID: {currFundID}</Typography>
          </Grid>
          <Grid item className="fundCardText">
            <Typography variant="h6" inline="true">Balance: </Typography>
            <Typography variant="h6" inline="true" color="secondary"> {'$' + currFund.amount + ' ' + currFund.currency} </Typography>
          </Grid>
          <Grid item className="fundCardText">
            <Typography variant="h6">Current: {portion + '%'}</Typography>
          </Grid>
          {this.state.setAllocationOn ? (
            <Grid item className="fundCardText">
              <Typography variant="h6">Target: </Typography>
              <TextField
                id="outlined-number"
                label="Number"
                value={this.state.targets[index]}
                onChange={this.handleTargetChange(index)}
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
        </Grid>
      </Paper>)
  }


  render() {
    if (this.state.toDashboard === true) {
      return <Redirect to= {
        {
          pathname: '/dashboard',
          state: { 
            customerId: this.state.customerId 
          }
        }
      }
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
              <Button variant="contained" onClick={this.handleSetAllocationClick} color="default" className="TOPBUTTON">
                Set Allocation
              </Button>
              <Button variant="contained" onClick={this.handleRebalanceClick} color="default" className="TOPBUTTON">
                Rebalance
              </Button>
            </Grid>            
            <Grid item xs={12}>
            {this.state.setAllocationOn ? (
              <TextField
                id="outlined-number"
                label="Allowed Deviation"
                value={this.state.allowedDeviation}
                onChange={this.handleDeviationChange}
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
                  <Grid item xs={12} key={i}>
                    <Grid spacing={24} container direction="row">
                    
                    <Grid item xs={that.state.recommendOn ? 4 : 9}>
                      {that.state.recommendOn? that.createMiniFund(i) : that.createFund(i)}
                    </Grid>
                    <Grid item xs={3} className="donutCharts">
                      {that.createChart(i)}
                    </Grid>
                    {that.state.recommendOn && that.createRecommendation(i)}
                    </Grid>
                  </Grid>
                );
            })}
            {this.state.setAllocationOn && (
              <Grid item xs={12}>
                <Button onClick={this.saveAllocation} fullWidth={true} variant="contained" color="secondary" className="TOPBUTTON">
                  SAVE
              </Button>
              </Grid>
            )}
            {this.state.recommendOn && (
              <Grid container spacing={24} className="bottomRow">
                <Grid item>
                  <Button onClick={this.saveAllocation} variant="contained" color="secondary" className="TOPBUTTON">
                    MODIFY
                  </Button>
                  <Button onClick={this.executeRecommend} variant="contained" color="secondary" className="TOPBUTTON">
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