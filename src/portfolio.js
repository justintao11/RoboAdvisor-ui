import React from "react";

import {
  Card as TCard,
  // CardHeader,
  CardBody,
  // CardFooter,
  // CardTitle,
  Row,
  Col
} from "reactstrap";
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
import AssessmentIcon from '@material-ui/icons/AssessmentOutlined';
import InputAdornment from '@material-ui/core/InputAdornment';
import './dashboard.js';


// import {
//   dashboardEmailStatisticsChart,
// } from "./variables/charts.jsx";
// import transitions from "@material-ui/core/styles/transitions";
const request = require('request');


class Portfolio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customerId: props.location.state.customerId,
      portfolioId: props.location.state.selectedPortfolio.id,
      selected: null,                   // not being used right now
      toDashboard: false,               // back to dashboard page
      allocationButtonClicked: false,   // Set Allocation button clicked status
      rebalanceButtonClicked: false,    // Rebalance button clicked status
      preferencesSet: true,             // Preferences for portfolio exist in database
      preferencesExist: false,          // Preferences currently retrieved
      funds: [],                // TODO: not sure 
      fundBalances: {},         // dictionary of fundID:{balance, currency}
      totalBalance: 0,          // totalBalance balance of all funds

      // {customerId:{}, id:{portfolio Id}, holdings:{}} 
      selectedPortfolio: props.location.state.selectedPortfolio,      
      // {portfolioId:{}, deviation:{}, portfolioType:{}, allocations:{fundId:{},percentage:{}}}
      selectedPortfolioPreference: props.location.state.selectedPortfolioPreference,

      allowedDeviation: null,   // current max deviation for portfolio
      portfolioType: null,      // current portfolioType
      fundsTargets: [],         // array of {fundid/percentage} {0:{fundId:{},percentage:{}}, 1:{}...}

      targets: [],              // target % for each fund
      recommendations: [],      // list of recommendations
      indexRec: {},             // index of current recommendation? (not sure)
      warningOpen: false,       // warning bar 
      warningMessage: ""        // warning bar error message
    }

    this.handleSetAllocationClick = this.handleSetAllocationClick.bind(this);
    this.handleRebalanceClick = this.handleRebalanceClick.bind(this);
    this.getRebalance = this.getRebalance.bind(this);
    this.populatePrefs = this.populatePrefs.bind(this);
    //this.getCurrPortfolioPrefs = this.getCurrPortfolioPrefs.bind(this);
    this.handleTargetChange = this.handleTargetChange.bind(this);
    this.saveAllocation = this.saveAllocation.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.modifyRecommendation = this.modifyRecommendation.bind(this);
    this.executeRecommendation = this.executeRecommendation.bind(this);
    //this.setAllowedDeviation = this.setAllowedDeviation.bind(this);
  }

  componentDidMount() {
    this.getFunds(this.state.customerId);
    this.getCurrPortfolioPrefs(this.state.customerId);
    this.populatePrefs();  
  }


  getCurrPortfolioPrefs(custId) {
    let currPortfolioPref;    
    let portfolioId = this.state.portfolioId;

    let options = {
      url: "http://fund-rebalancer.hsbc-roboadvisor.appspot.com/roboadvisor/portfolio/" + portfolioId,
      method: 'GET',
      headers: {
        'x-custid': custId
      }
    }

    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        currPortfolioPref = JSON.parse(body); 
        console.log(body);       
      } else {
        currPortfolioPref = null;
      }

      this.setState({
        selectedPortfolioPreference: currPortfolioPref
      })
    });    


  }

  // Grab portfolio deviation & fund allocation if exists
  populatePrefs(){
    let prefs = this.state.selectedPortfolioPreference;
    if (prefs !== null){

      let fundsTargets = [];

      for (let i = 0; i < prefs.allocations.length; i++){
        fundsTargets.push(prefs.allocations[i]);
      }

      this.setState({
        allowedDeviation: prefs.deviation,
        portfolioType: prefs.type,
        fundsTargets: fundsTargets,
        preferencesSet: true,
        preferencesExist: true
      });

      
    } else {
    // TODO: else highlight set allocation button 
      this.setState({
        preferencesExist: false
      });
    }
    
  }

  // TODO: not fully set up
  getRebalance(selectedPortfolio, custID) {
    let options = {
      url: "http://fund-rebalancer.hsbc-roboadvisor.appspot.com/roboadvisor/portfolio/"+selectedPortfolio+"/rebalance",      
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
          //preferencesSet: false,
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
    let fundsTargets = this.state.fundsTargets;
    fundsTargets[index].percentage = Number(event.target.value);
    //console.log("hello" + fundsTargets[index].percentage);
    this.setState({
      fundsTargets: fundsTargets
    });
    //console.log("current standing" + this.state.fundsTargets);
    // let targets = this.state.targets;
    // targets[index] = Number(event.target.value);
    // this.setState({
    //   targets: targets
    // });
  };

  handleSetAllocationClick = (e) => {
    if (!this.state.rebalanceButtonClicked){
      this.setState({
        allocationButtonClicked: true,
        rebalanceButtonClicked: false
      })
    }
  }

  handleRebalanceClick = (e) => {
    if (this.state.allocationButtonClicked){

    } else if (this.state.preferencesSet && this.state.preferencesExist && !this.state.rebalanceButtonClicked){
      this.getRebalance(this.state.portfolioId, this.state.customerId);
      this.setState({
        rebalanceButtonClicked: true,
        allocationButtonClicked: false,
        warningOpen: false
      })
    } else if (!this.state.preferencesSet && !this.state.rebalanceButtonClicked){
      this.setState({
        warningMessage: "Allocation has not been set",
        warningOpen: true
      })
    } else {
      this.setState({
        rebalanceButtonClicked: false
      })
    }
  }

  handleBack = (e) => {
    this.setState({
      toDashboard: true
    })
  }

  handleCancelClick = (e) => {
    this.setState({
      allocationButtonClicked: false,
      rebalanceButtonClicked: false
    })
  }

  saveAllocation = (e) => {
    let sum = 0;
    let dev = this.state.allowedDeviation;
    let fundsTargets = this.state.fundsTargets;

    if (fundsTargets.length > 0){
      for (let i = 0; i < fundsTargets.length; i++){
        sum += fundsTargets[i].percentage;
      }
      //sum = this.state.targets.reduce((partial_sum, a) => partial_sum + a);
    } 
    console.log(sum);

    if(dev < 0 || dev > 5){
      this.setState({
        warningMessage: "Deviation must be between 0-5%",
        warningOpen: true
      })
    } else if(sum !== 100) {
      this.setState({
        warningMessage: "Target does not add up to 100",
        warningOpen: true
      })
    } else {
      this.setState({
        warningOpen: false,
        allocationButtonClicked: false,
        rebalanceButtonClicked: false,
        preferencesSet: true,
        preferencesExist: true,
        fundsTargets: fundsTargets
      })
    }
    
  }

  handleAlertClose = (e) => {
    this.setState({
      warningOpen: false
    })
  }

  modifyRecommendation = (e) => {
    // this.setState({
     
    // })
  }
  executeRecommendation = (e) => {
    // this.setState({
     
    // })
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
          if(info[i].id === this.state.portfolioId) {
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
          totalBalance: tempTotal
        });
      } else {
        console.log("getPortfolioList res code: " + response.statusCode)
        console.log(error);
      }
    });
  }


  createFund(index) {
    let portion = Math.round(this.state.funds[index].balance.amount * 100 / this.state.totalBalance);
    return (      
      <Paper className="fundCard"> 
        <Grid container direction="row">
          <Grid item xs={4} container direction="column" className="fundColumn">
            <Grid item>
              <Typography variant="subtitle1">Fund ID</Typography>
            </Grid>
            <Grid item>
              <Typography className="fundIDString" variant="subtitle1">{this.state.funds[index].fundId}</Typography>
            </Grid>
          </Grid>          
      
        <Grid item xs={4} container direction="column" className="percentColumn">
          <Grid item>
            <Typography variant="subtitle1">Current</Typography>
          </Grid>

          <Grid item>
            <TextField
            disabled
            id="filled-disabled"
            defaultValue={portion}
            className="textField"
            margin="normal"
            variant="outlined"
            style = {{width: 80}}                     
            />
          </Grid>
        </Grid> 
        {this.state.allocationButtonClicked ? (
          <Grid item xs = {4} container direction="column" className="percentColumn">
          <Grid item>
            <Typography variant="subtitle1" >Target </Typography>
          </Grid>
            <TextField
              id="outlined-number"
              label="%"
              value={(!this.state.preferencesExist) ? (0):(this.state.fundsTargets[index].percentage)}
              onChange={this.handleTargetChange(index)}
              type="number"
              className="textField"       
              margin="normal"
              variant="outlined"
              style = {{width: 80}}                          
            />                      
          </Grid> 
        ) : (
          <Grid item xs = {4} container direction="column" className="percentColumn">
            <Grid item>
            <Typography variant="subtitle1"> Target </Typography>
            </Grid>
            <Grid item>
            <TextField
              disabled
              id="filled-disabled"
              value={(!this.state.preferencesExist) ? ("N/A"):(this.state.fundsTargets[index].percentage)}
              className="textField"
              margin="normal"
              variant="outlined"              
              style = {{width: 80}}                                   
            />
            </Grid>
          </Grid>
        )}          
      </Grid>
    </Paper> 
    )}

  createChart(index) {
    // let portion = Math.round(this.state.funds[index].balance.amount * 100 / this.state.totalBalance);
    let graph = {
      datasets: [{
        data: [],
        backgroundColor: []
      }],
      labels: []
    };
    let funds = this.state.funds;
    for(let i=0; i<funds.length; i++) {      
      graph.labels.push(this.state.funds[i].fundId);
      graph.datasets[0].data.push(Math.round(this.state.funds[i].balance.amount * 100 / this.state.totalBalance));
      let color = (i === index) ? '#FF6384' : '#e0e0e0';
      graph.datasets[0].backgroundColor.push(color);
    }

    return (
        <Doughnut
          key={index}
          data={graph}          
          width={100}
          height={120}
          options={{
            padding:"0px",
            responsive: false,
            maintainAspectRatio: true,
            legend:{
              display:false,
            }
          }}         
          //options={dashboardEmailStatisticsChart.options}
        />
    )
  }

  createRecommendation(index) {
    return (      
        <Paper className="fundCard">
          <Typography variant="subtitle1">Recommendation:</Typography>
          <Grid item container direction="row" className="recommendCard">
            <Grid item className="percentColumn">
              <Button variant="contained" color="default" className="sellButtonClass">
                Sell
              </Button>
            </Grid>
            <Grid item className="percentColumn">
              <Button variant="contained" color="secondary" className="sellButtonClass">
                Buy
              </Button>
            </Grid>
            <Grid item className="percentColumn">
            <TextField
              id="outlined-number"
              label="Units"
              value = {this.state.indexRec[this.state.funds[index].fundId]}
              //onChange={this.handleTargetChange('bundb')}
              type="number"
              className="textField"
              margin="normal"
              variant="outlined"
              style = {{width: 100}}
            />
            </Grid>
          </Grid>
        </Paper>      
    )
  }

  createMiniFund(index) {
    let portion = Math.round(this.state.funds[index].balance.amount * 100 / this.state.totalBalance);
    let currFundID = this.state.funds[index].fundId;
    let currFund = this.state.fundBalances.get(currFundID);
    return (      
      
        <Paper className="fundCard">
          <Grid container direction="column" className="miniFundCard">
              <Typography variant="body1">Fund ID: {currFundID}</Typography>
              <Typography variant="body1" inline={true}>Balance: </Typography>
              <Typography variant="body1" inline={true} color="secondary"> {'$' + currFund.amount + ' ' + currFund.currency} </Typography>
              <Typography variant="body1">Current: {portion + '%'}</Typography>
              <Typography variant="body1">Target: {this.state.fundsTargets[index].percentage + '%'}</Typography>
          </Grid>
        </Paper>
      
      )
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
        <Grid container justify="flex-end" spacing={24}>
          <Grid item xs={12}>
            <TCard className="portfolioHeader">
              <CardBody>
                <Row>
                  <Col xs={8} md={6}>
                    <Typography gutterBottom variant="subtitle1" component="h2">
                      Portfolio ID: {this.state.portfolioId}
                    </Typography>
                  </Col>
                  <Col xs={8} md={6}>
                    <Typography gutterBottom variant="subtitle1" component="h2">
                      Customer ID: {this.state.customerId}
                    </Typography>
                  </Col>
                </Row>
              </CardBody>
            </TCard>         
            <Grid item xs={12}>
              <Button variant="contained" onClick={this.handleBack} color="secondary" className="topButton">
                Back
              </Button>
              <Button variant="contained" onClick={this.handleSetAllocationClick} color="default" className="topButton">
                Set Allocation
              </Button>
              <Button variant="contained" onClick={this.handleRebalanceClick} color="default" className="topButton">
                Rebalance
              </Button>
            </Grid>            
            <div xs={12} className="allowedDeviationClass">
            {this.state.allocationButtonClicked ? (
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
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                margin="normal"
                variant="outlined"
                style={{width: 200}}
              />
            ):(
              <Typography variant="subtitle1"  className="allowedDeviationText">
                <AssessmentIcon fontSize="inherit" className="assessmentIcon"/>                
                Allowed Deviation: {(this.state.allowedDeviation === null || this.state.allowedDeviation === undefined ) ?
                   ("NOT SET"):(this.state.allowedDeviation+"%")}
              </Typography>              
            )}
            </div>      
            {this.state.funds.map(function(object, i){
                return (
                  <div xs={12} key={i} className="fundsTable">    
                                            
                  <Grid container justify="flex-start" direction="row" spacing={24} className="fundsRow">  
                    <Grid item xs={that.state.rebalanceButtonClicked ? 5 : 9}>
                      {that.state.rebalanceButtonClicked? that.createMiniFund(i) : that.createFund(i)}
                    </Grid>
                    <Grid item>
                      {that.createChart(i)}
                    </Grid>
                    <Grid item>
                      {that.state.rebalanceButtonClicked && that.createRecommendation(i)} 
                    </Grid>              
                  </Grid>
                  </div> 
                );
            })}
            {this.state.allocationButtonClicked && (
              <Grid container spacing={24} className="bottomRow">
                <Grid item>
                <Button onClick={this.saveAllocation} variant="contained" color="secondary" className="topButton">
                  SAVE
                </Button>
                <Button onClick={this.handleCancelClick} variant="contained" color="default" className="topButton">
                  CANCEL
                </Button>
                </Grid>
              </Grid>
            )}
            {this.state.rebalanceButtonClicked && (
              <Grid container spacing={24} className="bottomRow">
                <Grid item>
                  <Button onClick={this.modifyRecommendation} variant="contained" color="secondary" className="topButton">
                    MODIFY
                  </Button>
                  <Button onClick={this.executeRecommendation} variant="contained" color="secondary" className="topButton">
                    EXECUTE
                  </Button>
                  <Button onClick={this.handleCancelClick} variant="contained" color="default" className="topButton">
                    CANCEL
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
                    {this.state.warningMessage}
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
          </Grid>
        </div>      
    );
  }
}

export default Portfolio;