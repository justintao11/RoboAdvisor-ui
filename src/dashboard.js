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
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FolderIcon from '@material-ui/icons/Folder';
// import DeleteIcon from '@material-ui/icons/Delete';
import TuneIcon from '@material-ui/icons/Tune';
import { Redirect } from 'react-router-dom';
import './dashboard.css';

// import {
//   // dashboard24HoursPerformanceChart,
//   dashboardEmailStatisticsChart,
//   dashboardNASDAQChart
// } from "./variables/charts.jsx";

const request = require('request');

function Portfolio(props) {
  return (
    <div>
    <ListItem button onClick={props.onClick}>
      <ListItemAvatar>
        <Avatar>
          <FolderIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={"Portfolio: " + props.value}
      />
      <ListItemSecondaryAction>
        <IconButton aria-label="Tune">
          <TuneIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
    </div>
  );
}

class PortfolioList extends React.Component {
  renderPortfolios(i) {
    return (
      <div key={"portfolio " + i}>
      <Portfolio
        value={this.props.portfolioList[i].id}
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
      selected: null,
      toLogin: false,
      toPortfolio: false,
      totalAssets: 0,
      portfolioId: 24646784,
      userId: props.location.state.id,
      portfolioList: Array(2).fill(1)
    }
    this.handleClick = this.handleClick.bind(this);
    this.getPortfolio = this.getPortfolio.bind(this);
    this.getTotalAssets = this.getTotalAssets.bind(this);
    this.getPortfolioList = this.getPortfolioList.bind(this);
  }

  componentDidMount() {
    this.getTotalAssets(this.state.userId);
    this.getPortfolioList(this.state.userId);
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
        this.setState({
          portfolioList: info
        })
      } else {
        console.log(response.body);
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
          totalAssets: info
        })
      } else {
        console.log(response.body);
      }
    });
  }

  getPortfolio(custId, portfolioId) {
    console.log("getPortfolio " + custId + " " + portfolioId)
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
        console.log(info)
        this.setState({
          toPortfolio: true
        });
      } else {
        console.log(response.body);
      }
    });
  }

  handleClick(i) {
    console.log("this is handleClick: " + i)
    this.getPortfolio(this.state.userId, i);
  }

  handleLogout = (e) => {
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
            userId: this.state.userId,
            portfolioId: this.state.portfolioId
          }
        }
      }
      />;
    }

    return (
      <div className="dashboardContainer">
        <Button className="logoutButton" variant="contained" onClick={this.handleLogout} color="secondary" >
          Logout
      </Button>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <TCard className="UserInfo">
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Welcome! User {this.state.userId}
                </Typography>
              </CardContent>
            </TCard>
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
            < Typography variant="title" className="subheading" >
              My Portfolios
            </Typography>
            <PortfolioList
              portfolioList={this.state.portfolioList}
              onClick={i => this.handleClick(i)}
            />
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

export default Dashboard;