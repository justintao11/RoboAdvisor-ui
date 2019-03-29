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
// react plugin used to create charts
// import { Line, Pie } from "react-chartjs-2";
// function that returns a color based on an interval of numbers
// import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
// import Card from '@material-ui/core/Card';
// import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// import Stats from "./Stats.jsx";
// import CardActions from '@material-ui/core/CardActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
//import IconButton from '@material-ui/core/IconButton';
import FolderIcon from '@material-ui/icons/Folder';
// import DeleteIcon from '@material-ui/icons/Delete';
// import TuneIcon from '@material-ui/icons/Tune';
// import AssessmentIcon from '@material-ui/icons/Assessment'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import './dashboard.css';

// import {
//   // dashboard24HoursPerformanceChart,
//   dashboardEmailStatisticsChart,
//   dashboardNASDAQChart
// } from "./variables/charts.jsx";
const request = require('request');
const theme = createMuiTheme({
  palette: {
    primary: { main: '#EF241C' }, // This is HSBC red 
    secondary: { main: '#404040' }, // This is dark gray 404040
  },
  typography: { 
    useNextVariants: true,
    fontSize: 12,
  },
});

class PortfolioIconsShown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPreferenceSet: false,
      isRebalanceRequired: false
    }
  }

  // componentDidMount() {
  //   this.getPortfolioPreference(this.props.customerId, this.props.portfolioId)
  // }

  // getPortfolioPreference(custId, portfolioId) {
  //   let options = {
  //     url: "https://fund-rebalancer-dot-hsbc-roboadvisor.appspot.com/roboadvisor/portfolio/" + portfolioId,
  //     method: 'GET',
  //     headers: {
  //       'x-custid': custId
  //     }
  //   }

  //   request(options, (error, response, body) => {
  //     if (!error && response.statusCode === 200) {
  //       this.setState({
  //         isPreferenceSet: true
  //       })
  //     } else {
  //       console.log(response.body);
  //     }
  //   });
  // }

  render() {
    return (
      <div>
        {/* <IconButton aria-label="Rebalance" disabled={true} color="secondary">
          <AssessmentIcon />
        </IconButton>
        <IconButton aria-label="Tune" disabled={this.state.isPreferenceSet} color="secondary">
          <TuneIcon />
        </IconButton> */}
      </div>
    )
  }
}

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
        <PortfolioIconsShown
          portfolioId={props.portfolioId}
          customerId={props.customerId} />
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
      isInvalidCustomer: false
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
        <div>
          Incorrect Customer ID, please try login in again.
          <MuiThemeProvider theme={theme}>
            <Button className="logoutButton" variant="contained" onClick={this.handleLogout} color="primary" >
              Logout
            </Button>
          </MuiThemeProvider>
        </div>
      )
    } else if (!this.state.isPortfoliosLoaded || !this.state.isTotalAssetsLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="dashboardContainer">
          <div className="header">
            <MuiThemeProvider theme={theme}>
              <Button className="logoutButton" variant="contained" onClick={this.handleLogout} color="primary" >
                Logout
              </Button>
            </MuiThemeProvider>
          </div>
          <div className="userInfo">
            <Typography gutterBottom variant="h5" component="h2">
              Welcome back, {this.state.customerId}!
                </Typography>
          </div>
          <Grid container justify="flex-end" spacing={16}>
            <Grid item xs={12}>
              <TCard className="card-stats">
                <CardBody>
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
            {/* 
          <Grid item xs={6}>
            <TCard>
              <CardHeader>
                <CardTitle>Funds Percentage</CardTitle>
              </CardHeader>
              <CardBody>
                <Pie
                  data={dashboardEmailStatisticsChart.data}
                  options={dashboardEmailStatisticsChart.options}
                />
              </CardBody>
              <CardFooter>
                <div className="legend">
                  <i className="fa fa-circle text-primary" /> Opened{" "}
                  <i className="fa fa-circle text-warning" /> Read{" "}
                  <i className="fa fa-circle text-danger" /> Deleted{" "}
                  <i className="fa fa-circle text-gray" /> Unopened
                </div>
              </CardFooter>
            </TCard>
          </Grid> */}

            {/* <Grid item xs={6}>
            <TCard className="card-chart">
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
              </CardHeader>
              <CardBody>
                <Line
                  data={dashboardNASDAQChart.data}
                  options={dashboardNASDAQChart.options}
                  width={250}
                  height={100}
                />
              </CardBody>
              <CardFooter>
                <div className="chart-legend">
                  <i className="fa fa-circle text-info" /> Tesla Model S{" "}
                  <i className="fa fa-circle text-warning" /> BMW 5 Series
                </div>
                <hr />
                <Stats>
                  {[
                    {
                      i: "fas fa-check",
                      t: " Data information certified"
                    }
                  ]}
                </Stats>
              </CardFooter>
            </TCard>
          </Grid> */}
          </Grid>
        </div>
      );
    }
  }
}

export default Dashboard