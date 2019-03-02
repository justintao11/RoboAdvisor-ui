import React from "react";
import {
  Card as TCard,
  CardHeader,
  CardBody,
  // CardFooter,
  CardTitle,
  Row,
  Col
} from "reactstrap";
// react plugin used to create charts
import { Line, Pie, Bar } from "react-chartjs-2";
// function that returns a color based on an interval of numbers
// import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
// import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
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
import { Redirect} from 'react-router-dom';
import Example from './barChart.js';
import './dashboard.css';

import {
  // dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart
} from "./variables/charts.jsx";

const request = require('request');

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      toLogin: false,
      toPortfolio: false,
      totalAssets: 0,
      portfolioId: 24646784,
      userId: props.location.state.id
    }
    this.handleClick = this.handleClick.bind(this);
    this.getPortfolio = this.getPortfolio.bind(this);
    this.getTotalAssets = this.getTotalAssets.bind(this);
  }

  componentDidMount(){
    this.getTotalAssets(this.state.userId);
  }

  getTotalAssets(custId){
    let baseURL = "http://fund-rebalancer.hsbc-roboadvisor.appspot.com";
    let headers = {
      'x-custid': custId
    }
    let options = {
      url: baseURL + "/roboadvisor/fundsystem/funds/total",
      method: 'GET',
      headers: headers
    }
  
    request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          let info = JSON.parse(body)
          this.setState({
            totalAssets: info
          })
        } else {
          console.log(error);
        }
      });   
  }
  
  getPortfolio(custId, portfolioId) {
    let baseURL = "https://fund-rebalancer-dot-hsbc-roboadvisor.appspot.com/";

    let headers = {
      'x-custid': custId
    }

    let options = {
      url: baseURL + "roboadvisor/portfolio/" + portfolioId,
      method: 'GET',
      headers: headers
    }

    let that = this;

    request(options, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        let info = JSON.parse(body);
        that.setState({
          toPortfolio: true
        });
        console.log(info);
      } else {
        console.log(error);
      }
    });
  }

  handleClick = (e) => {
    this.getPortfolio(this.state.userId, 1784575);
  }

  handleLogout = (e) => {
    this.setState({
      toLogin: true
    })
  }

  render() {
      if (this.state.toLogin === true) {
        return <Redirect to = {
          {
            pathname: '/'
          }
        }
        />;
      } else if (this.state.toPortfolio === true) {
        return <Redirect to = {
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
        <Grid container spacing={24}>
          <Grid item xs={3}>
            <TCard className="card">
                <CardMedia
                  style={{height: 0, paddingTop: '82%'}}
                  className="media"
                  image={require("./assets/img/logo-small.png")}
                  title="Contemplative Reptile"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Welcome! User {this.state.userId}
                  </Typography>
                  <Button variant="contained" onClick={this.handleLogout} color="secondary" className="TOPBUTTON">
                    Logout
                  </Button>
                </CardContent>
            </TCard>
          </Grid>
          <Grid item xs={3}>
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
              {/* <CardFooter>
                <div className="legend">
                  <i className="fa fa-circle text-primary" /> Opened{" "}
                  <i className="fa fa-circle text-warning" /> Read{" "}
                  <i className="fa fa-circle text-danger" /> Deleted{" "}
                  <i className="fa fa-circle text-gray" /> Unopened
                </div>
              </CardFooter> */}
            </TCard>
          </Grid>
          <Grid item xs={6}>
            <TCard className="card-chart">
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
              </CardHeader>
              <CardBody>
                <Example/>
              </CardBody>
              {/* <CardFooter>
                <div className="chart-legend">
                  <i className="fa fa-circle text-info" /> Tesla Model S{" "}
                  <i className="fa fa-circle text-warning" /> BMW 5 Series
                </div>
                <hr />
                {/* <Stats>
                  {[
                    {
                      i: "fas fa-check",
                      t: " Data information certified"
                    }
                  ]}
                </Stats>
              </CardFooter> */}
            </TCard>
          </Grid>
          <Grid item xs={12}>
            <Typography variant = "title" className = "subheading">
              My Portfolios
            </Typography>
            <div className="list">
              <List dense={false}>
                  <ListItem button value="500" onClick={this.handleClick}>
                    <ListItemAvatar>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Portfolio A"
                      // secondary="some descriptions"
                    />
                    <ListItemSecondaryAction>
                      <IconButton aria-label="Tune">
                        <TuneIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem button>
                    <ListItemAvatar>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Portfolio B"
                      // secondary="some descriptions"
                    />
                    <ListItemSecondaryAction>
                      <IconButton aria-label="Tune">
                        <TuneIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem button>
                    <ListItemAvatar>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Portfolio C"
                      // secondary="some descriptions"
                    />
                    <ListItemSecondaryAction>
                      <IconButton aria-label="Tune">
                        <TuneIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
              </List>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;
