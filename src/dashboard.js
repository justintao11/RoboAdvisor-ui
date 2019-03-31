import React from "react";
import {
  Card as TCard,
  // CardHeader,
  CardBody,
  // CardFooter,
  CardTitle,
  Row,
  Col
} from "reactstrap";
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import FolderIcon from '@material-ui/icons/Folder';
import { Redirect } from 'react-router-dom';
import MyChart from './barChart.js';
import MyChart2 from './areaChart.js';
import './dashboard.css';

const request = require('request');

// const data = [
//   {
//     name: 'Fund A', 'purchase price': 4000, 'current price': 2400,
//   },
//   {
//     name: 'Fund B', 'purchase price': 3000, 'current price': 1398,
//   },
//   {
//     name: 'Fund C', 'purchase price': 2000, 'current price': 9800,
//   },
//   {
//     name: 'Fund D', 'purchase price': 2780, 'current price': 3908,
//   },
//   {
//     name: 'Fund E', 'purchase price': 1890, 'current price': 4800,
//   },
//   {
//     name: 'Fund F', 'purchase price': 2390, 'current price': 3800,
//   },
// ];



function Portfolio(props) {
  return (
    <div className="portfolioItem">
      <ListItem button onClick={props.onClick}>
        <ListItemAvatar>
          <Avatar>
            <FolderIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={"Portfolio: " + props.portfolioId} />
      </ListItem>
    </div>
  );
}

class PortfolioList extends React.Component {
  renderPortfolios(i) {
    return (
      <div key={"portfolio " + i}>
        <Portfolio
          customerId={this.props.customerId}
          portfolioId={this.props.portfolioList[i].id}
          onClick={() => this.props.onClick(this.props.portfolioList[i].id)}
        />
      </div>
    );
  }

  render() {
    let portfolioArray = []
    for (let i = 0; i < this.props.portfolioList.length; i++) {
      portfolioArray.push(this.renderPortfolios(i))
    }
    return (
      <div>
        <List dense={false}>
          {portfolioArray}
        </List>
      </div>
    );
  }
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toLogin: false,
      toPortfolio: false,
      customerId: props.location.state.customerId,
      totalAssets: 0,
      portfolioPreferenceDict: {},
      rebalanceRequiredDict: {}, //TODO: Need backend API to determine if deviation exceeded
      portfolioDict: {},
      selectedPortfolioPreference: null,
      selectedPortfolio: null,
      portfolioList: Array(1).fill(1),
      isTotalAssetsLoaded: false,
      isPortfoliosLoaded: false,
      isPortfolioPreferencesLoaded: false,
      isInvalidCustomer: false,
      data: [],
      yearData: [],
      fundNames: []
    }
  }

  componentDidMount() {
    this.getPortfolioList(this.state.customerId);
    this.getTotalAssets(this.state.customerId);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.portfolioList.length !== prevState.portfolioList.length) {
      this.getPortfolioPreferences(this.state.customerId, this.state.portfolioList)
    }
  }

  calculateData() {
    let data = [];
    let yearData = [];
    let times = ["current", "3 month", "5 month", "1 year", "3 year", "5 year", "10 year"];
    let indexing = ["3m", "3m", "6m", "1y", "3y", "5y", "10y"];
    let weight = [0, 0.25, 0.5, 1, 3, 5, 10];
    let fundNames = [];

    let portList = this.state.portfolioList;
    for(let i =0 ; i<portList.length; i++) {
      data = data.concat(portList[i].holdings);
    }

    console.log(this.state.portfolioList);
    let promises = [];
    let uniqueData = [];
    let ids = [];

    
    for(let i=0; i<data.length; i++) {
      let temp = data[i].balance.amount/data[i].units;
      data[i]['purchase price']= temp.toFixed(2);
      // 
    }
    console.log('data',data);

    for(let i =0; i<data.length; i++) {
      if(ids.indexOf(data[i].fundId) === -1) {
        ids.push(data[i].fundId);
        uniqueData.push(data[i])
        promises.push(this.getFundDetail(data[i].fundId));
      }
    }
    data = uniqueData;

    Promise.all(promises).then((values) => {
      for(let i=0; i<values.length; i++) {
        fundNames.push(values[i].fundName);
        data[i]['current price'] = values[i].price.amount;
        data[i].name = values[i].fundName;
      }
      console.log("values", values);
      console.log(data);
      console.log(fundNames);




      for(let i=0; i<times.length; i++) {
        let element = {"name": times[i]};
        for(let j=0; j<fundNames.length; j++) {
          let basePrice = values[j].price.amount;
          let temp = basePrice * (1 + 0.01*weight[i]*Number(values[j].averageReturns[indexing[i]]));
          element[fundNames[j]] = temp.toFixed(2);
        }
        yearData.push(element);
      }
      console.log(yearData);

      this.setState({
        data: data,
        fundNames: fundNames,
        yearData: yearData,
      })
    });
    
  }

  getFundDetail(fundId) {
    let options = {
      url: "https://fund-rebalancer-dot-hsbc-roboadvisor.appspot.com/roboadvisor/fundsystem/funds/"+fundId,
      method: 'GET',
      headers: {
        'x-custid': this.state.customerId
      }
    }

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          resolve(JSON.parse(body));
        } else {
          reject();
          console.log(error);
        }
      })
    });
  }

  getPortfolioList(custId) {
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
        let portfolioDict = {}
        for (let key = 0; key < info.length; key++) {
          portfolioDict[info[key].id] = info[key]
        }
        this.setState({
          portfolioList: info,
          portfolioDict: portfolioDict,
          isPortfoliosLoaded: true
        })
        this.calculateData();
      } else {
        this.setState({
          isInvalidCustomer: true
        })
        console.log("getPortfolioList res code: " + response.statusCode)
        console.log(error);
      }
    });
  }

  getTotalAssets(custId) {
    let options = {
      url: "https://fund-rebalancer-dot-hsbc-roboadvisor.appspot.com/roboadvisor/fundsystem/funds/total",
      method: 'GET',
      headers: {
        'x-custid': custId
      }
    }

    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        let info = JSON.parse(body)
        this.setState({
          totalAssets: info,
          isTotalAssetsLoaded: true
        })
      } else {
        console.log("getTotalAssets res code: " + response.statusCode)
        console.log(error);
      }
    });
  }

  getPortfolioPreferences(custId, portfolioList) {
    let portfolioPreferenceDict = {}
    
    for (var i = 0; i < portfolioList.length; i++) {
      let portfolioId = portfolioList[i].id;
      let options = {
        url: "https://fund-rebalancer-dot-hsbc-roboadvisor.appspot.com/roboadvisor/portfolio/" + portfolioId,
        method: 'GET',
        headers: {
          'x-custid': custId
        }
      }
  
      request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          let info = JSON.parse(body);
          portfolioPreferenceDict[portfolioId] = info;
        } else {
          portfolioPreferenceDict[portfolioId] = null;
          console.log(response.body);
        }
      });
    }

    this.setState({
      portfolioPreferenceDict: portfolioPreferenceDict
    })
  }

  handleClick = (i) => {
    this.setState({
      selectedPortfolioPreference : this.state.portfolioPreferenceDict[i],
      selectedPortfolio: this.state.portfolioDict[i],
      toPortfolio : true
    })
  }

  handleLogout = () => {
    this.setState({
      toLogin: true
    })
  }

  render() {
    if (this.state.toLogin === true) {
      return <Redirect to={
        {
          pathname: '/'
        }
      }
      />;
    } else if (this.state.toPortfolio === true) {
      return <Redirect to={
        {
          pathname: '/portfolio',
          state: {
            customerId: this.state.customerId,
            selectedPortfolioPreference: this.state.selectedPortfolioPreference,
            selectedPortfolio: this.state.selectedPortfolio
          }
        }
      }
      />;
    } else if (this.state.isInvalidCustomer) {
      return (
        <div className="loginErrorPage">
          <Typography gutterBottom variant="h5" component="h2">
            Incorrect Customer ID, please try login in again.
          </Typography>
          
          <Button className="logoutButton" variant="contained" onClick={this.handleLogout} color="secondary" >
            Logout
          </Button>
        </div>
      )
    } else if (!this.state.isPortfoliosLoaded || !this.state.isTotalAssetsLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="dashboardContainer">
          <div className="header">
            <Button className="logoutButton" variant="contained" onClick={this.handleLogout} color="secondary" >
              Logout
            </Button>
          </div>
          <div className="userInfo">
            <Typography gutterBottom variant="h5" component="h2">
              Welcome back, {this.state.customerId}!
            </Typography>
          </div>
          <Grid container justify="flex-end" spacing={16}>
            <Grid item xs={12}>
              <TCard className="card-stats">
                <CardBody >
                  <Row>
                    <Col xs={5} md={4}>
                      <div className="icon-big text-center">
                        <i className="nc-icon nc-money-coins text-success" />
                      </div>
                    </Col>
                    <Col xs={7} md={8}>
                      <div className="numbers">
                        <p className="card-category">Total Assets</p>
                        <CardTitle tag="p">
                          <Typography component="a">
                            ${this.state.totalAssets.toFixed(2)}
                          </Typography>
                        </CardTitle>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </TCard>
            </Grid>
            <Grid item xs={12}>
              <TCard className="UserInfo">
                <CardContent>
                  <Typography variant="title" className="subheading">
                    <b>My Portfolios</b>
                  </Typography>
                  <PortfolioList
                    customerId={this.state.customerId}
                    portfolioList={this.state.portfolioList}
                    onClick={(i) => this.handleClick(i)}
                  />
                </CardContent>
              </TCard>
            </Grid>
            <Grid item xs={12}>
              <TCard className="charts">
                  <CardContent>
                    <MyChart2 data={this.state.yearData} keys={this.state.fundNames}/>
                  </CardContent>
                </TCard>
            </Grid>
            <Grid item xs={12}>
              <TCard className="charts">
                  <CardContent>
                    <MyChart data={this.state.data}/>
                    
                  </CardContent>
                </TCard>
            </Grid>
          </Grid>
        </div>
      );
    }
  }
}

export default Dashboard