import React from "react";

import {
  Card as TCard,
  CardBody,
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
import PropTypes from 'prop-types';
import './portfolio.css';
import { Redirect } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import WarningIcon from '@material-ui/icons/WarningRounded';
import { withSnackbar } from 'notistack';
import AssessmentIcon from '@material-ui/icons/AssessmentOutlined';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';
import CheckIcon from '@material-ui/icons/CheckOutlined';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorderOutlined';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import Chip from '@material-ui/core/Chip';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './dashboard.js';
const request = require('request');

const colorTheme = createMuiTheme({
  palette: {
    primary: { main: '#EF241C' }, // This is HSBC red 
    secondary: { main: '#404040' }, // This is dark gray 404040
    error: { main: '#ffffff'}
  },
  typography: { 
    useNextVariants: true,
    fontSize: 14,
    
  },
});

const textfieldTheme = createMuiTheme({
  palette: {
    primary: { main: '#404040' }, 
    secondary: { main: '#EF241C' }, 
    error: { main: '#ffffff'}
  },
  typography: { 
    useNextVariants: true,
    fontSize: 14,
    
  },
});

const styles = theme => ({
  button: {
    background: 'linear-gradient(45deg, #EF241C 30%, #EF241C 100%)',
    backgroundColor: '#EF241C',
    color: 'white',
    width: 220,
    margin: '0px 10px'
  },
  buttonBlue: {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    backgroundColor: '#21CBF3',
    color: 'white' 
  },
  buttonDisabled:{
    backgroundColor: '#e0e0e0',
    width: 220,
    margin: '0px 10px'
  },
  toggleContainer: {
    height: 56,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: `${theme.spacing.unit}px 0`,
    backgroundColor: 'white',

  },
  notBalancedChip:{
    background: '#feefb3',
    borderColor:'#996600',
    color:'#996600'
  },
  warningIcon:{
    color: '#996600'
  },
  yesBalancedChip:{
    background: '#e4f5e4',
    borderColor:'#38a238',
    color:'#38a238'
  },
  checkIcon:{
    color:'#38a238'
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
      modifyButtonClicked: false,       // Modify button clicked status
      isExecuteButtonDisabled: false,          // prevent API buttons from being clicked more than once
      isSaveAllocationButtonDisabled: false,
      preferencesSet: false,             // Preferences for portfolio exist in database
      preferencesExist: false,          // Preferences currently retrieved
      funds: [],                // Information of funds
      fundBalances: {},         // dictionary of fundID:{balance, currency}
      totalBalance: 0,          // totalBalance balance of all funds
      allocationButtonColor: 'default',
      rebalanceButtonColor: 'default',
      buyOrSell: 'BUY',
      checked: false,
      loading: false,
      isDeviated: false,        // a boolean value indicating whether current percentage is deviated from target ones.


      // {customerId:{}, id:{portfolio Id}, holdings:{}} 
      selectedPortfolio: props.location.state.selectedPortfolio,      
      // {portfolioId:{}, deviation:{}, portfolioType:{}, allocations:{fundId:{},percentage:{}}}
      selectedPortfolioPreference: props.location.state.selectedPortfolioPreference,

      allowedDeviation: null,   // current max deviation for portfolio
      displayDeviation: null,   // displayed deviation on UI
      portfolioType: null,      // current portfolioType
      // fundsTargets: [],         // array of {fundid/percentage} {0:{fundId:{},percentage:{}}, 1:{}...}
      // displayTargets: [],       // displayed array of {fundid/percentage}

      //targets: [],              // target % for each fund
      recommendationId: null,   // current recommendation ID
      recommendations: [],      // list of recommendations [{"action": "sell", "fundID": , "units": }, {}]
      recUnitsByFundId: {},     // fundId Index to Recommended Units (splitting this into 2 objects,
                                //    since JS doesn't deal with setState of nested objects)
      recActionByFundId: {},    // fundId Index to Recommended action 
      // warningOpen: false,       // warning bar 
      // warningMessage: ""        // warning bar error message
    }

    this.handleSetAllocationClick = this.handleSetAllocationClick.bind(this);
    this.handleRebalanceClick = this.handleRebalanceClick.bind(this);
    this.getRebalance = this.getRebalance.bind(this);
    this.populatePrefs = this.populatePrefs.bind(this);
    this.getCurrPortfolioPrefs = this.getCurrPortfolioPrefs.bind(this);
    this.handleTargetChange = this.handleTargetChange.bind(this);
    this.handleSaveAllocation = this.handleSaveAllocation.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleModifyRecClick = this.handleModifyRecClick.bind(this);
    this.handleExecuteRecClick = this.handleExecuteRecClick.bind(this);
    this.handleAllocationButtonChange = this.handleAllocationButtonChange.bind(this);
    this.handleRebalanceButtonChange = this.handleRebalanceButtonChange.bind(this);
    this.handleBuyOrSell = this.handleBuyOrSell.bind(this);
    this.getFunds = this.getFunds.bind(this);
    this.handleTransitionSlide = this.handleTransitionSlide.bind(this);
    this.handleSnackBarMessage = this.handleSnackBarMessage.bind(this);
    this.setFundTarget = this.setFundTarget.bind(this);
    this.getFundIndex = this.getFundIndex.bind(this);
    this.resetFundDisplayTarget = this.resetFundDisplayTarget.bind(this);
    this.saveFundDisplayTarget = this.saveFundDisplayTarget.bind(this);
    this.updateCurrPortfolioPrefs = this.updateCurrPortfolioPrefs.bind(this);
    this.calculateAllocations = this.calculateAllocations.bind(this);
    this.resetRecommendations = this.resetRecommendations.bind(this);
    this.updateRecommendations = this.updateRecommendations.bind(this);
    this.updateRecommendAction = this.updateRecommendAction.bind(this);
    this.updateRecommendUnit = this.updateRecommendUnit.bind(this);
    this.getRecommend = this.getRecommend.bind(this);
  }



  componentDidMount() { 
    let promise1 = this.getFunds(this.state.customerId);
    promise1.then(() => this.getCurrPortfolioPrefs(this.state.customerId));
    this.handleTransitionSlide();
    //this.populatePrefs();
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
    let that = this;

    return new Promise(function(resolve, reject) {
      request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          currPortfolioPref = JSON.parse(body);
          console.log( "getCurrPortfolioPrefs",body);
          that.setState({
            selectedPortfolioPreference: currPortfolioPref
          },resolve(body))
        } else {
          currPortfolioPref = null;
          reject();       
        }
      });
    }).then(value => {
      this.populatePrefs(); 
    }) 
  }

  getFundIndex(id) {
    let funds = this.state.funds;
    for(let i =0; i<funds.length; i++) {
      if(funds[i].fundId === id) {
        return i;
      }
    }
    return -1;
  }

  setFundTarget(index, target) {
    if(index !== -1) {
      let fundsCopy = this.state.funds;
      fundsCopy[index].target = target;
      this.setState({
        funds: fundsCopy
      })
    }
  }

  resetFundDisplayTarget() {
    let fundsCopy = this.state.funds;
    for(let i=0; i<fundsCopy.length; i++) {
      if(fundsCopy[i].target !== undefined) {
        fundsCopy[i].displayTarget = fundsCopy[i].target;
      }
    }
    this.setState({
      funds: fundsCopy
    });
  }

  resetDisplayRecommendations(){
    // let recActionsCopy = this.state.recActionByFundId;
    // let recUnitsCopy = this.state.recUnitsByFundId;

 

  }

  saveFundDisplayTarget() {
    let fundsCopy = this.state.funds;
    for(let i=0; i<fundsCopy.length; i++) {
      if(fundsCopy[i].displayTarget !== undefined) {
        fundsCopy[i].target = fundsCopy[i].displayTarget;
      }
    }
    this.setState({
      funds: fundsCopy
    });
  }

  setFundDisplayTarget(index, displayTarget) {
    if(index !== -1) {
      let fundsCopy = this.state.funds;
      fundsCopy[index].displayTarget = displayTarget;
      this.setState({
        funds: fundsCopy
      })
    }
  }

  // Grab portfolio deviation & fund allocation if exists
  populatePrefs(){
    let prefs = this.state.selectedPortfolioPreference;
    if (prefs !== null){
      for (let i = 0; i < prefs.allocations.length; i++){
        this.setFundTarget(this.getFundIndex(prefs.allocations[i].fundId), prefs.allocations[i].percentage);
      }
      this.resetFundDisplayTarget();
      console.log("AFTER", this.state.funds);
      this.setState({
        allowedDeviation: prefs.deviation,
        displayDeviation: prefs.deviation,
        portfolioType: prefs.portfolioType,
        preferencesSet: true,
        preferencesExist: true
      });
      this.checkDeviation();
      console.log("HELLO MY TYPE IS: " + this.state.portfolioType);
      
    } else {
    // TODO: else highlight set allocation button 
      this.setState({
        preferencesExist: false,
        portfolioType: "fund"
      });
    }    
  }

  checkDeviation() {
    let fundsCopy = this.state.funds;
    let maxDev = 0;
    for(let i=0; i<fundsCopy.length; i++) {
      let tempTarget = fundsCopy[i].target;
      let tempPercent = Math.round(fundsCopy[i].balance.amount * 100 / this.state.totalBalance);
      let tempDev = Math.abs(tempTarget - tempPercent);
      if(tempDev>maxDev) {
        maxDev = tempDev;
      }
    }
    if(maxDev>this.state.allowedDeviation) {
      this.setState({
        isDeviated: true
      });
    }else{
      this.setState({
        isDeviated: false
      })
    }
    console.log("CHECKING DEVIATION~!");
    
  }


  calculateAllocations() {
    let allocationsClone = [];
    let fundsCopy = this.state.funds;
    for(let i=0; i<fundsCopy.length; i++) {
      if(fundsCopy[i].target !== undefined) {
        allocationsClone.push({
          fundId: fundsCopy[i].fundId,
          percentage: fundsCopy[i].target
        })
      }
    }
    return allocationsClone;
  }

  updateCurrPortfolioPrefs() {
    let portfolioRequest = {
      "allocations": this.calculateAllocations(),
      "deviation": this.state.displayDeviation
    };

    let options = {
      url: "https://fund-rebalancer-dot-hsbc-roboadvisor.appspot.com/roboadvisor/portfolio/"+ this.state.portfolioId,      
      method: 'PUT',
      json: portfolioRequest,      
      headers: {
        'x-custid': this.state.customerId
      }
    }

    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {        
        this.setState({
          preferencesSet: true,
          allowedDeviation: this.state.displayDeviation
        });
        this.handleSnackBarMessage("Succesfully updated preferences!", "success");
        this.checkDeviation();
      } else {
        this.handleSnackBarMessage("Failed to update preferences", "error");
      }
    })
  }


  // TODO: might not be working, need more test cases
  postCurrPortfolioPrefs(portfolioId, custID) {
    let allocationsClone = [];
    let fundsCopy = this.state.funds;
    for(let i=0; i<fundsCopy.length; i++) {
      if(fundsCopy[i].target !== undefined) {
        allocationsClone.push({
          fundId: fundsCopy[i].fundId,
          percentage: fundsCopy[i].target
        })
      }
    }
    console.log(allocationsClone);
    let portfolioRequest = 
      {
        "allocations": allocationsClone,
        "deviation": this.state.displayDeviation,
        "type": this.state.portfolioType || "fund"
      };
    // if (this.state.funds.length !== this.state.fundsTargets.length){
    //   throw new Error ("Number of funds " + this.state.funds.length + "mismatch with number of target percents " + this.state.fundsTargets.length);
    // }
    console.log(portfolioRequest);

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
          preferencesSet: true,
          allowedDeviation: this.state.displayDeviation
        });
        this.handleSnackBarMessage("Succesfully posted new preferences!", "success");
        this.checkDeviation();
      } else {
        this.setState({
          preferencesSet: false
        });
        this.handleSnackBarMessage("Failed to post new preferences", "error");
        
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
        this.resetRecommendations();
        console.log(this.state.recommendations);
        
      } else {
        this.setState({
          preferencesSet: false,
          //targets: temp
        });
        console.log(response.statusCode);        
        console.log(custID);
        console.log(portfolioId);
      }
    })
  }

  resetRecommendations() {
    let recomm = this.state.recommendations;
    for(let i =0; i<recomm.length; i++) {
      recomm[i].displayAction = recomm[i].action;
      recomm[i].displayUnits = recomm[i].units;
    }
    this.setState({
      recommendations: recomm
    })
  }

  updateRecommendations() {
    let recomm = this.state.recommendations;
    for(let i =0; i<recomm.length; i++) {
      recomm[i].action = recomm[i].displayAction;
      recomm[i].units = recomm[i].displayUnits;
    }
    this.setState({
      recommendations: recomm
    });
    let promise = this.postModifyRecommendation(this.state.portfolioId, this.state.customerId, this.state.recommendationId);
    promise.then(() => {
      console.log("sucess!!!!!");
      this.handleSnackBarMessage("Succesfully updated recommendations", "success");
    })

  }

  //action: "buy" | "sell"
  updateRecommendAction(fundId, action) {
    let recomm = this.state.recommendations;
    let isExist = false;
    for(let i =0; i<recomm.length; i++) {
      if(recomm[i].fundId === fundId) {
        isExist = true;
        recomm[i].displayAction = action;
      }
    }
    if(!isExist) {
      recomm.push({
        fundId: fundId,
        displayAction: action
      })
    }
    this.setState({
      recommendations: recomm
    });
  }

  updateRecommendUnit(fundId, unit) {
    let recomm = this.state.recommendations;
    let isExist = false;
    for(let i =0; i<recomm.length; i++) {
      if(recomm[i].fundId === fundId) {
        isExist = true;
        recomm[i].displayUnits = unit;
      }
    }
    if(!isExist) {
      recomm.push({
        fundId: fundId,
        displayUnits: unit
      })
    }
    this.setState({
      recommendations: recomm
    });
  }

  getRecommend(index) {
    let fundId = this.state.funds[index].fundId;
    let recomm = this.state.recommendations;
    for(let i =0; i<recomm.length; i++) {
      
      if(recomm[i].fundId === fundId) {
        return recomm[i];
      }
    }
    //return undefined;
  }



  handleDeviationChange = (e) => {
    this.setState({
      displayDeviation: Number(e.target.value),
    });
  }

  handleTargetChange = index => event => {
    // let funds = this.state.funds;
    // let curDisplayTarget = this.state.funds[index].displayTarget;
    console.log(Number(event.target.value));
    this.setFundDisplayTarget(index, Number(event.target.value)); 
    console.log("Current display target for index " + index + "=" + this.state.funds[index].displayTarget)
    console.log("Current actual target for index " + index + "=" + this.state.funds[index].target)
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
      this.handleTransitionSlide();
    }    
  }

  handleSetAllocationClick = (e) => {
    if (!this.state.rebalanceButtonClicked){
      // let fundsTargets = JSON.parse(JSON.stringify(this.state.fundsTargets));
      this.setState({
        allocationButtonClicked: true,
        rebalanceButtonClicked: false,
        displayDeviation: this.state.allowedDeviation
      })
      this.resetFundDisplayTarget();
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
      })
    } else if (!this.state.preferencesSet && !this.state.rebalanceButtonClicked){
      this.handleSnackBarMessage("Allocation has not been set", "error");
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
      rebalanceButtonClicked: false,
    })    
    
  }

  // barstyle can be success, error, warning, info, or left blank for default
  handleSnackBarMessage = (message, barStyle) => {   
    this.props.enqueueSnackbar(message, { 
      variant: barStyle,
      autoHideDuration: 3000,
      preventDuplicate: true,
      action: (
        <Button size="small">
          <MuiThemeProvider theme={colorTheme}>
            <CloseIcon color="error" />
          </MuiThemeProvider>
        </Button>
      )               
    });
  };

  handleSaveAllocation = (e) => {
    let sum = 0;
    let dev = this.state.displayDeviation;
    let fundsCopy = this.state.funds;
    for (let i = 0; i < fundsCopy.length; i++){
      sum += fundsCopy[i].displayTarget || 0;
    }
    console.log("sum", sum);

    if(dev < 0 || dev > 5 || dev === undefined || dev === null){
      this.handleSnackBarMessage("Deviation must be between 0-5%", "error");
    } else if(sum !== 100) {
      this.handleSnackBarMessage("Target % does not add up to 100", "error");
    } else {
      this.setState({
        isSaveAllocationButtonDisabled:true
      })
      this.saveFundDisplayTarget();
      if (!this.state.preferencesSet){
        this.postCurrPortfolioPrefs(this.state.portfolioId, this.state.customerId);
      } else {
        this.updateCurrPortfolioPrefs();
      }
      
      this.setState({
        //warningOpen: false,
        allocationButtonClicked: false,
        rebalanceButtonClicked: false,
        preferencesExist: true,
        isSaveAllocationButtonDisabled: false
      })
    }
    
  }

  handleModifyRecClick = (e) => {
    this.handleSnackBarMessage('modify not implemented yet');
    this.setState({
      modifyButtonClicked: true,
    })
  }
  handleExecuteRecClick = (e) => {
    this.setState({
      isExecuteButtonDisabled:true
    })

    let that = this;
    let promise1 = this.postExecuteRecommendation(this.state.portfolioId, this.state.customerId, this.state.recommendationId);


    promise1.then( value => { 
      that.handleCancelClick();
      window.location.reload();
      this.handleSnackBarMessage("Succesfully executed recommendation", "success");
    })
    
  }

  handleCancelModifyClick = (e) => {
    //this.handleSnackBarMessage('modifications not saved', 'warning');
    this.resetRecommendations();
    this.setState({
      modifyButtonClicked: false,
    })
  }

  handleSaveModifyClick = (e) => {
    // this.handleSnackBarMessage('save modify not implemented yet');
    this.updateRecommendations();
    this.setState({
      modifyButtonClicked: false,
    })
  }

  postModifyRecommendation(portfolioId, custId, recId) {
    let that = this;
    let transactionList = [];
    let recomm = this.state.recommendations;
    for(let i=0 ; i<recomm.length; i++) {
      transactionList.push({
        "action": recomm[i].action,
        "fundId": recomm[i].fundId,
        "units": recomm[i].units
      })
    }
    console.log(transactionList)
    return new Promise(function(resolve, reject) {    
      let options = {
        url: "https://fund-rebalancer-dot-hsbc-roboadvisor.appspot.com/roboadvisor/portfolio/"+portfolioId+"/recommendation/"+recId+"/modify",      
        method: 'PUT',
        json: transactionList,
        headers: {
          'x-custid': custId
        }
      }  
      request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) { 
          resolve(body);      
          // Force reload to get current values to update, its hacky, but works
          //window.location.reload();   
        } else {
          that.handleSnackBarMessage("Failed to save recommendation " + recId, "error");
          console.log(custId);
          console.log(portfolioId);
          reject(error);   
        }
      })
    })
  }

  postExecuteRecommendation(portfolioId, custId, recId) {
    let that = this;
    return new Promise(function(resolve, reject) {    
      let options = {
        url: "https://fund-rebalancer-dot-hsbc-roboadvisor.appspot.com/roboadvisor/portfolio/"+portfolioId+"/recommendation/"+recId+"/execute",      
        method: 'POST',   
        headers: {
          'x-custid': custId
        }
      }  
      request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) { 

          that.setState({
            isExecuteButtonDisabled: false
          })
          resolve(body);      
          // Force reload to get current values to update, its hacky, but works
          //window.location.reload();   
        } else {
          that.handleSnackBarMessage("Failed to execute recommendation " + recId, "error");
          console.log(custId);
          console.log(portfolioId);
          reject(error);   
        }
      })
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
    let that = this;

    return new Promise(function(resolve, reject) {
      request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          let info = JSON.parse(body);
          //console.log(info);
          let tempFunds;
          let tempFundBalances = new Map();
          for (let i = 0; i<info.length; i++) {
            if(info[i].id === that.state.portfolioId) {
              tempFunds = info[i].holdings;
            }
          }
          let tempTotal = 0;
          for(let i =0; i<tempFunds.length; i++) {
            tempFundBalances.set(tempFunds[i].fundId, tempFunds[i].balance);
            tempTotal += tempFunds[i].balance.amount;
          }

          let funds = JSON.parse(JSON.stringify(tempFunds)); 
          console.log("getFunds");
          that.setState({
            funds: funds,
            fundBalances: tempFundBalances,
            totalBalance: tempTotal
          }, resolve());
        } else {
          console.log("getPortfolioList res code: " + response.statusCode)
          console.log(error);
          reject(error);
        }
      });
  })
  }


  createFund(index, checked) {
    let portion = Math.round(this.state.funds[index].balance.amount * 100 / this.state.totalBalance);
    let currFundID = this.state.funds[index].fundId;
    let currFund = this.state.fundBalances.get(currFundID);
     return (
      <Slide direction="right" in={true} mountOnEnter unmountOnExit>      
        <Paper className="fundCard"> 
          <Grid container direction="row" className="fundRow">
            {/* <Grid item xs={4} container direction="column" className="percentColumn">
              <Grid item>
                <Typography variant="subtitle1">Fund ID</Typography>
              </Grid>
              <Grid item>
                <Typography className="fundIDString" variant="subtitle1">{this.state.funds[index].fundId}</Typography>
              </Grid>
            </Grid>           */}

            <Grid xs={4} container direction="column" className="fundInfoColumn">
              <Grid item>
              <MuiThemeProvider theme={colorTheme}>
              <Typography variant="body1"><b>Fund ID: {currFundID}</b></Typography>
              <Typography variant="body1" inline={true}>Balance: </Typography>
              <Typography variant="body1" inline={true} color="primary"> {'$' + currFund.amount.toFixed(2) + ' ' + currFund.currency} </Typography>
              </MuiThemeProvider>
              </Grid>
            </Grid>
        
          <Grid xs={4} container direction="column" className="percentColumn">
            {/* <Grid item>
              <Typography variant="subtitle1">Current</Typography>
            </Grid> */}

            <Grid item>
              <MuiThemeProvider theme={textfieldTheme}>
                <TextField
                disabled id="filled-disabled"
                // label="Current %"
                defaultValue={portion}
                inputProps={{
                  style: { fontSize: 14, textAlign: "center", color:"white", backgroundColor:"#9e9e9e", overflow:"hidden", borderColor: '#9e9e9e', borderWidth: 2, borderRadius: 3,}
                }}
                margin="normal"
                variant="outlined"
                style = {{width: '80px'}}                     
                />
              </MuiThemeProvider>
            </Grid>
          </Grid> 
          {this.state.allocationButtonClicked ? (
            <Grid xs = {4} container direction="column" className="percentColumn">
            {/* <Grid item>
              <Typography variant="subtitle1" >Target </Typography>
            </Grid> */}
              <MuiThemeProvider theme={textfieldTheme}>
              <TextField
                id="outlined-number"
                // label="Target %"
                value={(!!this.state.funds[index].displayTarget) ? (this.state.funds[index].displayTarget) : 0}
                onChange={this.handleTargetChange(index)}
                type="number"
                inputProps={{
                  style: { fontSize: 14, textAlign: "center", color:"black", backgroundColor:"white", overflow:"hidden", borderColor: '#9e9e9e', borderWidth: 2, borderRadius: 3,}
                }}
                className="textField"       
                margin="normal"
                variant="outlined"
                style = {{width: 80}}                          
              />       
            </MuiThemeProvider>                
            </Grid> 
          ) : (
            <Grid xs = {4} container direction="column" className="percentColumn">
              {/* <Grid item>
              <Typography variant="subtitle1"> Target </Typography>
              </Grid> */}
              <Grid item>
              <MuiThemeProvider theme={textfieldTheme}>
              <TextField
                disabled
                // label="Target %"
                id="filled-disabled"
                value={(this.state.funds[index].target !== undefined) ? (this.state.funds[index].target):("N/A")}
                inputProps={{
                  style: { fontSize: 14, textAlign: "center", color:"white", backgroundColor:"#9e9e9e", overflow:"hidden", borderColor: '#9e9e9e', borderWidth: 2, borderRadius: 3,}
                }}
                className="textField"
                margin="normal"
                variant="outlined"              
                style = {{width: 80}}                                   
              />
              </MuiThemeProvider>
              </Grid>
            </Grid>
          )}          
        </Grid>
      </Paper> 
    </Slide>
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
    let myColors = [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4caf50',
      '#ff9100',
      '#9c27b0',
      '#1de9b6'
      ];
    for(let i=0; i<funds.length; i++) { 
      //let random = i + Math.round(Math.random()*100);
      //console.log("heres my number" + random);     
      graph.labels.push(this.state.funds[i].fundId);
      graph.datasets[0].data.push(Math.round(this.state.funds[i].balance.amount * 100 / this.state.totalBalance));
      //let color = (i === index) ? '#FF6384' : '#e0e0e0';
      let color = (i !== index) ? '#e0e0e0' : 
      (myColors[(i%myColors.length)]);
      
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

  handleBuyOrSell = index => (event, buyOrSell) => {
    // console.log(index);
    this.updateRecommendAction(this.state.funds[index].fundId, buyOrSell);
    // this.setState({ buyOrSell });
  }

  // TODO: able to modify recommendations
  handleUnitChange = index => (event) => {
    console.log(index);
    this.updateRecommendUnit(this.state.funds[index].fundId, event.target.value);
  }

  createDynamicRecommendation(index) {
    const { classes } = this.props;
    return (      
        <Paper className="fundCard">
          <Typography variant="subtitle1">Recommendation:</Typography>
          <Grid container direction="row" className="recommendCard">
            <Grid item className="percentColumn">
            <div className={classes.toggleContainer}>            
              <ToggleButtonGroup 
              value={this.state.modifyButtonClicked? 
                (this.getRecommend(index) && this.getRecommend(index).displayAction)
                : (this.getRecommend(index) && this.getRecommend(index).action)} 
              exclusive onChange={this.handleBuyOrSell(index)}
              >                            
                <ToggleButton 
                value="buy" 
                disableRipple= {this.state.modifyButtonClicked? "false" : "true"} 
                disableFocusRipple={this.state.modifyButtonClicked? "false" : "true"}>
                  BUY1
                </ToggleButton>
                  <ToggleButton 
                  value="sell"
                  disableRipple= {this.state.modifyButtonClicked? "false" : "true"} 
                  disableFocusRipple={this.state.modifyButtonClicked? "false" : "true"}>
                  SELL1
                </ToggleButton>                
              </ToggleButtonGroup>            
            </div>
            </Grid>
            
            <Grid item className="percentColumn">
            <MuiThemeProvider theme={textfieldTheme}>
            <TextField
              disabled = {this.state.modifyButtonClicked? false : true}
              id= {this.state.modifyButtonClicked? "outlined-number" : "filled-disabled"}
              label="Units"
              value = {this.state.modifyButtonClicked? 
                ((this.getRecommend(index) && this.getRecommend(index).displayUnits) || 0)
                : ((this.getRecommend(index) && this.getRecommend(index).units) || 0)}
              onChange={this.handleUnitChange(index)}
              type="number"
              className="textField"
              margin="normal"
              variant="outlined"
              InputLabelProps={{ shrink: true }} 
              style = {{width: 100}}
            />
            </MuiThemeProvider>
            </Grid>
          </Grid>
        </Paper>      
    )
  }

  handleTransitionSlide = () => {
    this.setState(state => ({ checked: !state.checked }));
  };

  createMiniFund(index) {
    let portion = Math.round(this.state.funds[index].balance.amount * 100 / this.state.totalBalance);
    let currFundID = this.state.funds[index].fundId;
    let currFund = this.state.fundBalances.get(currFundID);
    
    return (      
        <Paper className="fundCard">
          <Grid container direction="column" className="miniFundCard">
              <MuiThemeProvider theme={colorTheme}>
              <Typography variant="body1"><b>Fund ID: {currFundID}</b></Typography>
              <Typography variant="body1" inline={true}>Balance: </Typography>
              <Typography variant="body1" inline={true} color="primary"> {'$' + currFund.amount.toFixed(2) + ' ' + currFund.currency} </Typography>
              <Typography variant="body1">Current: {portion + '%'}</Typography>
              <Typography variant="body1">Target: {(this.state.funds[index].target !== undefined) ? this.state.funds[index].target + '%' : "N/A"}</Typography>
              </MuiThemeProvider>
          </Grid>
        </Paper>
      )
  }


  render() {
    const { classes } = this.props;
    const { checked } = this.state;
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
      <div className="portfolioContainer">
        <div className = "backButtonRow">
          <Button variant="contained" onClick={this.handleBack} color="default" className="backButton">
            Back
          </Button>  
        </div>    
        <Grid container justify="flex-end">
          <Grid xs={12} item>
            <TCard className="portfolioHeader">
              <CardBody>
                <Row>
                  <Col xs={6} md={6}>
                    <Typography gutterBottom variant="subtitle1" component="h2">
                      Portfolio ID: {this.state.portfolioId}
                    </Typography>
                  </Col>
                  <Col xs={6} md={6}>
                    <Typography gutterBottom variant="subtitle1" component="h2">
                      Customer ID: {this.state.customerId}
                    </Typography>
                  </Col>
                </Row>
              </CardBody>
            </TCard>            
            <Grid item xs={12}>
              <MuiThemeProvider theme={colorTheme}>        
              {!this.state.rebalanceButtonClicked? (
                <Button
                  variant="contained" 
                  className={classNames(classes.button, {
                  [classes.buttonBlue]: this.state.allocationButtonColor === 'blue',
                  })}
                  onClick={this.handleSetAllocationClick}>
                  {!this.state.preferencesSet ? 'SET ALLOCATION':'UPDATE ALLOCATION'}
                </Button>                
              ):(
                <Button disabled className={classes.buttonDisabled}>                    
                  {!this.state.preferencesSet ? 'SET ALLOCATION':'UPDATE ALLOCATION'}
                </Button>)              
              }              
              {this.state.isDeviated && (
                !this.state.allocationButtonClicked? 
                  (<Button
                    variant="contained"
                    className={classNames(classes.button, {
                    [classes.buttonBlue]: this.state.rebalanceButtonColor === 'blue',
                    })}
                    onClick={this.handleRebalanceClick}>
                    {'REBALANCE'}
                  </Button>):(
                  <Button disabled className={classes.buttonDisabled}>                    
                    {'REBALANCE'}
                  </Button>)
                )
              }
              </MuiThemeProvider>
            </Grid>         
            <div xs={6} lg={8} className="allowedDeviationClass">
              <Grid container alignItems="center" justify="flex-start" spacing={24} className="myAssetTitle">
                <Grid item xs={6} md={2}>
                  <Typography variant="h4" component="h2">
                    <b>My Assets</b>
                  </Typography>
                </Grid>
                <Grid item xs={6} md={4}>
                {this.state.isDeviated &&(<MuiThemeProvider theme={textfieldTheme}>
                  <Chip 
                    className={classes.notBalancedChip}
                    label="Portfolio due for rebalancing"
                    icon={<WarningIcon className={classes.warningIcon}/>}
                    variant={"outlined"}
                  />
                </MuiThemeProvider>)}
                {!this.state.isDeviated && this.state.preferencesSet &&(<MuiThemeProvider theme={textfieldTheme}>
                  <Chip 
                    className={classes.yesBalancedChip}
                    label="Your portfolio is balanced!"
                    icon={<CheckIcon className={classes.checkIcon}/>}
                    variant={"outlined"}
                  />
                </MuiThemeProvider>)}
                </Grid>
              </Grid>   
            <Divider variant="fullWidth" className="myDivider"/>
            <Grid container justify="flex-start" alignItems="center">
            {this.state.allocationButtonClicked ? (
              <MuiThemeProvider theme={textfieldTheme}>
                <TextField
                  id="outlined-number"
                  label="Allowed Deviation"
                  value={this.state.displayDeviation || 0}
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
              </MuiThemeProvider>
            ):(
              <React.Fragment>            
                <Typography variant="subtitle1"  className="allowedDeviationText">
                  <AssessmentIcon fontSize="inherit" className="assessmentIcon"/>                
                  Allowed Deviation: {(this.state.allowedDeviation === null || this.state.allowedDeviation === undefined ) ?
                    ("NOT SET"):(this.state.allowedDeviation+"%")}
                </Typography>
                <Typography variant="subtitle1" className="portfolioTypeText">
                  <WorkOutlineIcon fontSize="inherit" className="assessmentIcon"/>                
                  Portfolio Type: {(this.state.portfolioType === null || this.state.portfolioType === undefined ) ?
                    ("N/A"):(this.state.portfolioType)}
                </Typography>  
              </React.Fragment>             
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
            {!that.state.rebalanceButtonClicked ? (  // Header row
            <Slide direction="right" in={checked} mountOnEnter unmountOnExit>
              <div xs={12}>   
                <Grid container justify="flex-start" direction="row" spacing={16} className="tableHeader">
                  <Grid item lg = {10}>
                    <div> 
                      <Grid container >
                        <Grid item xs={4}>
                          <Typography></Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography gutterBottom variant="subtitle1" component="h2">
                            <b>Current %</b>
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography gutterBottom variant="subtitle1" component="h2">
                            <b>Target %</b>
                          </Typography>
                        </Grid>
                      </Grid>
                    </div>                  
                  </Grid>
                </Grid>
              </div>
            </Slide>
            ):(<div></div>)
            }
            {this.state.funds.map(function(object, i){
                return (
                  <div xs={12} key={i} className="fundsTable">
                    <Grid container justify="flex-start" direction="row" spacing={16}>  
                      <Grid item lg ={that.state.rebalanceButtonClicked ? 6 : 10}>
                        {that.state.rebalanceButtonClicked? 
                          that.createMiniFund(i) :
                          that.createFund(i, checked)}    
                      </Grid>
                      <Grid item >
                        <Grid container className="donut">
                          <Grid item>
                            {that.createChart(i)}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid lg={4} item>
                        {that.state.rebalanceButtonClicked? (
                          // !that.state.modifyButtonClicked? (
                          //   that.createStaticRecommendation(i)
                          // ):(
                            
                          // )
                          that.createDynamicRecommendation(i)
                        ):(<div></div>)} 
                      </Grid>              
                    </Grid>
                  </div> 
                );
            })}
            {this.state.allocationButtonClicked && (
              <Grid container spacing={24} className="bottomRow">
                <Grid item>
                <MuiThemeProvider theme={colorTheme}>
                  <Button onClick={this.handleSaveAllocation} 
                    disabled={this.state.isSaveAllocationButtonDisabled}
                    variant="contained" color="secondary" className="topButton">
                    SAVE
                  </Button>
                  <Button onClick={this.handleCancelClick} variant="contained" color="default" className="topButton">
                    CANCEL
                  </Button>
                </MuiThemeProvider>
                </Grid>
              </Grid>
            )}
            {this.state.rebalanceButtonClicked && (
              <MuiThemeProvider theme={colorTheme}>
                <Grid container spacing={24} className="bottomRow">
                  <Grid item>
                    {!this.state.modifyButtonClicked? 
                      (<React.Fragment>
                        <Button onClick={this.handleModifyRecClick} variant="contained" color="secondary" className="topButton">
                          MODIFY
                        </Button>
                        <Button onClick={this.handleExecuteRecClick}
                          disabled={this.state.isExecuteButtonDisabled} 
                          variant="contained" color="secondary" className="topButton">
                          EXECUTE
                        </Button>
                        <Button onClick={this.handleCancelClick} variant="contained" color="default" className="topButton">
                          CANCEL
                        </Button>
                      </React.Fragment>):(
                        (<React.Fragment>
                          <Button onClick={this.handleSaveModifyClick} variant="contained" color="secondary" className="topButton">
                            SAVE MODIFICATION
                          </Button>
                          <Button onClick={this.handleCancelModifyClick} variant="contained" color="default" className="topButton">
                            CANCEL
                          </Button>
                        </React.Fragment>)
                      )
                    }

                  </Grid>
                </Grid>
              </MuiThemeProvider>
            )}
          </Grid>
          </Grid>
        </div>      
    );
  }
}

// //const MyApp = withSnackbar(Portfolio);


//     <SnackbarProvider maxSnack={3}>
//       <Portfolio />
//     </SnackbarProvider>


//export default withStyles(styles)(Portfolio);
// // export const hello = MyApp;
// export default withSnackbar(Portfolio);

Portfolio.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
};

// const MyApp = withSnackbar(Portfolio);

// function IntegrationNotistack() {
//   return (
//     <SnackbarProvider maxSnack={2}>
//       <MyApp />
//     </SnackbarProvider>
//   );
// }

export default withStyles(styles)(withSnackbar(Portfolio));