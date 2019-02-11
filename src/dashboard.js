import React from "react";
import {
  Card as TCard,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col
} from "reactstrap";
// react plugin used to create charts
import { Line, Pie } from "react-chartjs-2";
// function that returns a color based on an interval of numbers
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Stats from "./Stats.jsx";
import CardActions from '@material-ui/core/CardActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import './dashboard.css';

import {
  dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart
} from "./variables/charts.jsx";

const request = require('request');

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    }
    this.handleClick = this.handleClick.bind(this);
    this.getPortfolio = this.getPortfolio.bind(this);
  }

  

  getPortfolio(custId, portfolioId) {
    let baseURL = "http://fund-rebalancer.hsbc-roboadvisor.appspot.com/";

      let headers = {
        'x-custid': custId
      }
   
      let options = {
        url: baseURL + "roboadvisor/portfolio/" + portfolioId,
        //url: "http://fund-rebalancer.hsbc-roboadvisor.appspot.com/roboadvisor/portfolio/1x1",
        method: 'GET',
        headers: headers

      }
   
      request(options, function (error, response, body) {
          if (!error && response.statusCode == 200) {
              // Print out the response body
              let info = JSON.parse(body);
              console.log(info);
              // console.log(response);
              // console.log(error);
          }
            console.log(error);
          
        
          
      });   
  }

  handleClick = (e) => {
    console.log(e.target.value)
    this.getPortfolio(1,1);
  }

  render() {
    return (
      <div className="dashboardContainer">
      <div className="root">
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
                    Welcome! User 102488
                  </Typography>
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
                      <p className="card-category">Revenue</p>
                      <CardTitle tag="p">$ 1,345</CardTitle>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </TCard>
            <TCard>
              <CardHeader>
                <CardTitle>Email Statistics</CardTitle>
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
          </Grid>
          <Grid item xs={6}>
            <TCard className="card-chart">
              <CardHeader>
                <CardTitle>NASDAQ: AAPL</CardTitle>
                <p className="card-category">Line Chart With Points</p>
              </CardHeader>
              <CardBody>
                <Line
                  data={dashboardNASDAQChart.data}
                  options={dashboardNASDAQChart.options}
                  width={400}
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
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" className="title">
              My Portfolios
            </Typography>
            <div className="list">
              <List dense="false">
                  <ListItem button>
                    <ListItemAvatar>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Portfolio A"
                      secondary="some descriptions"
                    />
                    <ListItemSecondaryAction>
                      <IconButton value="2000" onClick={this.handleClick} aria-label="Delete">
                        <DeleteIcon />
                      </IconButton>
                      <IconButton aria-label="Delete">
                        <DeleteIcon />
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
                      primary="Portfolio A"
                      secondary="some descriptions"
                    />
                    <ListItemSecondaryAction>
                      <IconButton aria-label="Delete">
                        <DeleteIcon />
                      </IconButton>
                      <IconButton aria-label="Delete">
                        <DeleteIcon />
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
                      primary="Portfolio A"
                      secondary="some descriptions"
                    />
                    <ListItemSecondaryAction>
                      <IconButton aria-label="Delete">
                        <DeleteIcon />
                      </IconButton>
                      <IconButton aria-label="Delete">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
              </List>
            </div>
          </Grid>
        </Grid>
      </div>
      </div>
    );
  }
}

export default Dashboard;
