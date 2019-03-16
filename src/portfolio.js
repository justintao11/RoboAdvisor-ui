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
import classNames from 'classnames';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
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
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorderOutlined';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withStyles } from '@material-ui/core/styles';
import './dashboard.js';


// import {
//   dashboardEmailStatisticsChart,
// } from "./variables/charts.jsx";
// import transitions from "@material-ui/core/styles/transitions";
const request = require('request');
const styles = theme => ({
  button: {
    background: 'linear-gradient(45deg, #f50057 30%, #f50057 100%)',
    backgroundColor: '#f50057',
    //borderRadius: 3,
    //border: 1,
    color: 'white',
    //height: 42,
    width: 200,
    margin: '0px 10px',
    //padding: '0px 0px',
    //boxShadow: '0 3px 5px 2px rgba(245, 0 , 87, .3)',
  },
  buttonBlue: {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    backgroundColor: '#21CBF3',
    color: 'white' 
    //boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  },
  toggleContainer: {
    height: 56,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: `${theme.spacing.unit}px 0`,
    backgroundColor: 'white'
    // background: theme.palette.background.default,
  },
});


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
      preferencesSet: false,             // Preferences for portfolio exist in database
      preferencesExist: false,          // Preferences currently retrieved
      funds: [],                // TODO: not sure 
      fundBalances: {},         // dictionary of fundID:{balance, currency}
      totalBalance: 0,          // totalBalance balance of all funds
      allocationButtonColor: 'default',
      rebalanceButtonColor: 'default',
      buyOrSell: 'BUY',      


      // {customerId:{}, id:{portfolio Id}, holdings:{}} 
      selectedPortfolio: props.location.state.selectedPortfolio,      
      // {portfolioId:{}, deviation:{}, portfolioType:{}, allocations:{fundId:{},percentage:{}}}
      selectedPortfolioPreference: props.location.state.selectedPortfolioPreference,

      allowedDeviation: null,   // current max deviation for portfolio
      displayDeviation: null,   // displayed deviation on UI
      portfolioType: null,      // current portfolioType
      fundsTargets: [],         // array of {fundid/percentage} {0:{fundId:{},percentage:{}}, 1:{}...}

      targets: [],              // target % for each fund
      recommendationId: null,   // current recommendation ID
      recommendations: [],      // list of recommendations [{"action": "sell", "fundID": , "units": }, {}]
      recUnitsByFundId: {},     // fundId Index to Recommended Units (splitting this into 2 objects,
                                //    since JS doesn't deal with setState of nested objects)
      recActionByFundId: {},    // fundId Index to Recommended action 
      warningOpen: false,       // warning bar 
      warningMessage: ""        // warning bar error message
    }

    this.handleSetAllocationClick = this.handleSetAllocationClick.bind(this);
    this.handleRebalanceClick = this.handleRebalanceClick.bind(this);
    this.getRebalance = this.getRebalance.bind(this);
    this.populatePrefs = this.populatePrefs.bind(this);
    this.getCurrPortfolioPrefs = this.getCurrPortfolioPrefs.bind(this);
    this.handleTargetChange = this.handleTargetChange.bind(this);
    this.saveAllocation = this.saveAllocation.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleModifyRecClick = this.handleModifyRecClick.bind(this);
    this.handleExecuteRecClick = this.handleExecuteRecClick.bind(this);
    this.handleAllocationButtonChange = this.handleAllocationButtonChange.bind(this);
    this.handleRebalanceButtonChange = this.handleRebalanceButtonChange.bind(this);
    this.getFunds = this.getFunds.bind(this);
  }

   componentDidMount() { 
    this.getFunds(this.state.customerId);
    this.getCurrPortfolioPrefs(this.state.customerId);
  }

  getCurrPortfolioPrefs(custId) {
    let currPortfolioPref;    
    let portfolioId = this.state.portfolioId;
    let options = {
      url: "https://fund-rebalancer-dot-hsbc-roboadvisor.appspot.com/roboadvisor/portfolio/" + portfolioId,
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
      this.populatePrefs(); 
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
        displayDeviation: prefs.deviation,
        portfolioType: prefs.type,
        fundsTargets: fundsTargets,
        preferencesSet: true,
        preferencesExist: true
      });
      
    } else {
    // TODO: else highlight set allocation button 
      this.setState({
        preferencesExist: false,
        portfolioType: "fund"
      });
    }    
  }

  putCurrPortfolioPrefs(portfolioId, custID) {
    let updatedPrefs = this.state.fundsTargets;

    let options = {
      url: "https://fund-rebalancer-dot-hsbc-roboadvisor.appspot.com/roboadvisor/portfolio/"+ portfolioId +"/allocations",      
      method: 'PUT',
      json: updatedPrefs,      
      headers: {
        'x-custid': custID
      }
    }  
    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {        
        this.setState({
          warningMessage: "Succesfully updated new preferences!",
          warningOpen: true,
          preferencesSet: true
        });
        
      } else {
        this.setState({
          warningMessage: "Failed to update new preferences.",
          warningOpen: true,
        });
      }
    })
  }

  putCurrPortfolioDeviation (portfolioId, custID) {
    let updatedDeviation = {
      "deviation": this.state.displayDeviation
    };

    let options = {
      url: "https://fund-rebalancer-dot-hsbc-roboadvisor.appspot.com/roboadvisor/portfolio/"+ portfolioId +"/deviation",      
      method: 'PUT',
      json: updatedDeviation,      
      headers: {
        'x-custid': custID
      }
    }  
    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {        
        this.setState({
          warningMessage: "Succesfully updated new deviation!",
          warningOpen: true,
          preferencesSet: true,
          allowedDeviation: this.state.displayDeviation
        });
        
      } else {
        this.setState({
          warningMessage: "Failed to update new deviation.",
          warningOpen: true,
        });
      }
    })
  }

  // TODO: might not be working, need more test cases
  postCurrPortfolioPrefs(portfolioId, custID) {
    let allocationsClone = JSON.parse(JSON.stringify(this.state.fundsTargets));
    let portfolioRequest = 
      {
        "allocations": allocationsClone,
        "deviation": this.state.displayDeviation,
        "type": this.state.portfolioType
      };
    console.log("this is the post request obj "+ JSON.stringify(portfolioRequest));
    console.log(portfolioRequest.allocations);

    let options = {
      url: "https://fund-rebalancer-dot-hsbc-roboadvisor.appspot.com/roboadvisor/portfolio/"+ portfolioId,      
      method: 'POST',
      json: portfolioRequest,      
      headers: {
        'x-custid': custID
      }
    }  
    request(options, (error, response, body) => {
      if (!error && response.statusCode === 201) {        
        this.setState({
          warningMessage: "Succesfully posted new preferences!",
          warningOpen: true,
          preferencesSet: true,
          allowedDeviation: this.state.displayDeviation
        });
        
      } else {
        this.setState({
          warningMessage: "Failed to post new preferences.",
          warningOpen: true,
          preferencesSet: false
        });
        console.log(custID);
        console.log(portfolioId);
      }
    })
  }
  
  getRebalance(portfolioId, custID) {
    let options = {
      url: "https://fund-rebalancer-dot-hsbc-roboadvisor.appspot.com/roboadvisor/portfolio/"+portfolioId+"/rebalance",      
      method: 'POST',
      headers: {
        'x-custid': custID
      }
    }  
    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        let trans = JSON.parse(body)
        let recUnitsByFundId = {};
        let recActionByFundId = {};
        let recommendationId = trans.recommendationId;
        console.log("this is rec id" + recommendationId);
        for (let k = 0; k < trans.transactions.length; k++){
          let fundId = trans.transactions[k].fundId;
          let units = trans.transactions[k].units;
          let action = trans.transactions[k].action;
          recUnitsByFundId[fundId] = units;
          recActionByFundId[fundId] = action;
          // console.log("hi" + recUnitsByFundId[fundId].units);
          // console.log("hi" + recUnitsByFundId[fundId].action);
        }
        this.setState({
          recommendationId: recommendationId,
          recommendations: trans.transactions,
          recUnitsByFundId: recUnitsByFundId,
          recActionByFundId: recActionByFundId
        });
        
      } else {
        this.setState({
          //preferencesSet: false,
          //targets: temp
        });
        console.log(response.statusCode);
        console.log(custID);
        console.log(portfolioId);
      }
    })
  }

  // TODO: currently there is a bug since deviation / target % are saved
  // upon typing. You can enter 500% and cancel and it will still save to state.
  handleDeviationChange = (e) => {
    this.setState({
      displayDeviation: Number(e.target.value),
    });
  }

  handleTargetChange = index => event => {
    let fundsTargets = this.state.fundsTargets;
    let funds = this.state.funds;

    // if Allocation not availble, prepopulate target array
    if (!this.state.preferencesExist) {
      for (let i = 0; i < funds.length; i++){
        fundsTargets.push({"fundId" : funds[i].fundId, "percentage": 0});
      }
    }
    fundsTargets[index].percentage = Number(event.target.value);    

    this.setState({
      fundsTargets: fundsTargets,
      preferencesExist: true
    });
  }

  // TODO: able to modify recommendations
  handleRecommendationChange = index => event => {

  }

  handleAllocationButtonChange = (e) => {
    this.setState({ 
      allocationButtonColor: this.state.allocationButtonClicked ? 'blue' : 'default' });
  }


  handleRebalanceButtonChange = (e) => {
    this.setState({ 
      rebalanceButtonColor: this.state.rebalanceButtonClicked ? 'blue' : 'default' });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.allocationButtonClicked !== prevState.allocationButtonClicked) {
      this.handleAllocationButtonChange();      
    }
    if (this.state.rebalanceButtonClicked !== prevState.rebalanceButtonClicked){
      this.handleRebalanceButtonChange();
    }    
  }

  handleSetAllocationClick = (e) => {
    if (!this.state.rebalanceButtonClicked){
      this.setState({
        allocationButtonClicked: true,
        rebalanceButtonClicked: false,
        displayDeviation: this.state.allowedDeviation        
      })
    }
    if (this.state.allocationButtonClicked){
      this.handleCancelClick();
    }
  }

  handleRebalanceClick = (e) => {
    if (this.state.allocationButtonClicked){
      // do nothing
    } else if (this.state.rebalanceButtonClicked){
      this.handleCancelClick();
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
    let dev = this.state.displayDeviation;
    let fundsTargets = this.state.fundsTargets;

    if (fundsTargets.length > 0){
      for (let i = 0; i < fundsTargets.length; i++){
        sum += fundsTargets[i].percentage;
      }
      //sum = this.state.targets.reduce((partial_sum, a) => partial_sum + a);
    } 
    console.log(sum);

    if(dev < 0 || dev > 5 || dev === undefined || dev === null){
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
      if (!this.state.preferencesSet){
        this.postCurrPortfolioPrefs(this.state.portfolioId, this.state.customerId);
      } else {
        this.putCurrPortfolioPrefs(this.state.portfolioId, this.state.customerId);
        this.putCurrPortfolioDeviation(this.state.portfolioId, this.state.customerId);
      }

      this.setState({
        warningOpen: false,
        allocationButtonClicked: false,
        rebalanceButtonClicked: false,
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

  handleModifyRecClick = (e) => {
    // this.setState({
     
    // })
  }
  handleExecuteRecClick = (e) => {
    this.postExecuteRecommendation(this.state.portfolioId, this.state.customerId, this.state.recommendationId);
    this.setState({
      warningOpen: false
    })
  }

  postExecuteRecommendation(portfolioId, custId, recId) {
    let options = {
      url: "https://fund-rebalancer-dot-hsbc-roboadvisor.appspot.com/roboadvisor/portfolio/"+portfolioId+"/recommendation/"+recId+"/execute",      
      method: 'POST',   
      headers: {
        'x-custid': custId
      }
    }  
    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {        
        this.setState({
          warningMessage: "Succesfully executed recommendation " + recId,
          warningOpen: true,
          rebalanceButtonClicked: false,
          allocationButtonClicked: false,
          loading: false
        });
        this.componentDidMount();
        // Force reload to get current values to update, its hacky, but works
        window.location.reload();
        
      } else {
        this.setState({
          warningMessage: "Failed to execute recommendation " + recId,
          warningOpen: true,
        });
        console.log(custId);
        console.log(portfolioId);
      }
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
        //console.log(info);
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
            disabled id="filled-disabled"
            label="%"
            defaultValue={Math.round(this.state.funds[index].balance.amount * 100 / this.state.totalBalance)}
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
              label="%"
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

  handleBuyOrSell = (event, buyOrSell) => {
    this.setState({ buyOrSell });
  }

  createRecommendation(index) {
    const { classes } = this.props;
    return (      
        <Paper className="fundCard">
          <Typography variant="subtitle1">Recommendation:</Typography>
          <Grid item container direction="row" className="recommendCard">
            <Grid item className="percentColumn">
            {/* TODO: fix up buy sell buttons */}
            <div className={classes.toggleContainer}>
            <ToggleButtonGroup 
            value={this.state.recActionByFundId[this.state.funds[index].fundId] || ""} 
            //exclusive onChange={this.handleBuyOrSell}
            >
              <ToggleButton value="buy">
                BUY
              </ToggleButton>
                <ToggleButton value="sell">
                SELL
              </ToggleButton>
            </ToggleButtonGroup>
              {/* <Button variant="contained" color="default" className="sellButtonClass">
                Sell
              </Button>
            </Grid>
            <Grid item className="percentColumn">
              <Button variant="contained" color="secondary" className="sellButtonClass">
                Buy
              </Button> */}
            </div>
            </Grid>
            
            <Grid item className="percentColumn">
            <TextField
              disabled id="filled-disabled"
              //id="outlined-number"
              label="Units"
              value = {this.state.recUnitsByFundId[this.state.funds[index].fundId] || 0}
              onChange={this.handleRecommendationChange(index)}
              type="number"
              className="textField"
              margin="normal"
              variant="outlined"
              InputLabelProps={{ shrink: true }} 
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
              <Typography variant="body1" inline={true} color="secondary"> {'$' + currFund.amount.toFixed(2) + ' ' + currFund.currency} </Typography>
              <Typography variant="body1">Current: {portion + '%'}</Typography>
              <Typography variant="body1">Target: {this.state.fundsTargets[index].percentage + '%'}</Typography>
          </Grid>
        </Paper>
      
      )
  }


  render() {
    const { classes } = this.props;
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
              <Button variant="contained" onClick={this.handleBack} color="default" className="topButton">
                Back
              </Button>
              {/* <Button variant="contained" onClick={this.handleSetAllocationClick} color="default" className="topButton">
                Set Allocation
              </Button> */}
              <Button
                variant="contained"
                className={classNames(classes.button, {
                [classes.buttonBlue]: this.state.allocationButtonColor === 'blue',
                })}
                onClick={this.handleSetAllocationClick}>
              {!this.state.preferencesSet ? 'SET ALLOCATION':'UPDATE ALLOCATION'}
              </Button>
              <Button
                variant="contained"
                className={classNames(classes.button, {
                [classes.buttonBlue]: this.state.rebalanceButtonColor === 'blue',
                })}
                onClick={this.handleRebalanceClick}>
              {'REBALANCE'}
              </Button>
            </Grid>            
            <div xs={6} lg={8} className="allowedDeviationClass">
            <Grid container justify="flex-start">
            {this.state.allocationButtonClicked ? (
              <TextField
                id="outlined-number"
                label="Allowed Deviation"
                value={this.state.displayDeviation || ""}
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
            {(this.state.recommendationId !== null && this.state.rebalanceButtonClicked) ? (
              <Typography variant="subtitle1" inline={true} className="recommendationIdText">
              <BookmarkBorderIcon fontSize="inherit" className="assessmentIcon"/>                
              Recomendation ID: {this.state.recommendationId || "NOT AVAILABLE"}
              </Typography> 
            ):(
              <Typography></Typography>  // false item
            )}        
            </Grid> 
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
                  <Button onClick={this.handleModifyRecClick} variant="contained" color="secondary" className="topButton">
                    MODIFY
                  </Button>
                  <Button onClick={this.handleExecuteRecClick} variant="contained" color="secondary" className="topButton">
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

export default withStyles(styles)(Portfolio);