import React from "react";
// import {
//   Card as TCard,
//   CardHeader,
//   CardBody,
//   CardFooter,
//   CardTitle,
//   Row,
//   Col
// } from "reactstrap";
// react plugin used to create charts
import {
  Doughnut
} from "react-chartjs-2";
// import {
//   Line,
//   Pie,
//   Doughnut
// } from "react-chartjs-2";

// function that returns a color based on an interval of numbers
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import './portfolio.css';
// import Stats from "./Stats.jsx";
import { Redirect} from 'react-router-dom';

import {
  // dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  // dashboardNASDAQChart
} from "./variables/charts.jsx";

// var myDoughnutChart = new Chart(ctx, {
//     type: 'doughnut',
//     data: data,
//     options: options
// });

const data = {
  labels: [
    'Red',
    'Green',
    'Yellow'
  ],
  datasets: [{
    data: [300, 50, 100],
    backgroundColor: [
    '#FF6384',
    '#e0e0e0',
    '#e0e0e0'
    ],
    hoverBackgroundColor: [
    '#FF6384',
    '#e0e0e0',
    '#e0e0e0'
    ]
  }]
};

const data1 = {
  labels: [
    'Red',
    'Green',
    'Yellow'
  ],
  datasets: [{
    data: [300, 50, 100],
    backgroundColor: [
    '#e0e0e0',
    '#FF6384',
    '#e0e0e0'
    ],
    hoverBackgroundColor: [
    '#e0e0e0',
    '#FF6384',
    '#e0e0e0'
    ]
  }]
};

const data2 = {
  labels: [
    'Red',
    'Green',
    'Yellow'
  ],
  datasets: [{
    data: [300, 50, 100],
    backgroundColor: [
    '#e0e0e0',
    '#e0e0e0',
    '#FF6384'
    ],
    hoverBackgroundColor: [
    '#e0e0e0',
    '#e0e0e0',
    '#FF6384'
    ]
  }]
};

const request = require('request');
class Portfolio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      reallocationOn: false,
      recommandOn:false,
      target1: 20,
      fundb: 0,
      toDashboard: false,
      portfolioId: props.location.state.portfolioId,
      userId: props.location.state.userId,
      selectedPortfolioJSON: null
    }

    this.handleReallocationClick = this.handleReallocationClick.bind(this);
  }

  componentDidMount() {
    this.getPortfolioPreferenceDetails(this.state.userId, this.state.portfolioId);
  }

  getPortfolioPreferenceDetails(custId, portfolioId) {
    let options = {
      url: "https://fund-rebalancer-dot-hsbc-roboadvisor.appspot.com/roboadvisor/portfolio/" + portfolioId,
      method: 'GET',
      headers: {
        'x-custid': custId
      }
    }

    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        this.setState({
          selectedPortfolioJSON : JSON.parse(body)
        })
      } else {
        console.log(response.body);
      }
    });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleReallocationClick = (e) => {
    this.setState({
      reallocationOn: true
    })
  }

  handleBack = (e) => {
    this.setState({
      toDashboard: true
    })
  }

  setTarget = (e) => {
    this.setState({
      reallocationOn: false,
      recommandOn: true
    })
  }

  executeRecommend = (e) => {
    this.setState({
      recommandOn: false
    })
  }


  render() {
    if (this.state.toDashboard === true) {
      return <Redirect to={{
                pathname:'/dashboard',
                state: {id: this.state.userId} 
          }}
      />;
    }

    return (
      <div className="dashboardContainer">
      <div className="root">
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Button variant="contained" onClick={this.handleBack} color="secondary" className="TOPBUTTON">
              Back
            </Button>
            <Button variant="contained" onClick={this.handleReallocationClick} color="default" className="TOPBUTTON">
              Reallocate
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h2" className="title">
              Portfolio ID: {this.state.portfolioId}
            </Typography>
          </Grid>
          <Grid item xs={this.state.recommandOn? 3 : 9}>
            <Paper className="fundCard">
              <div className="fund">
                <Typography variant="display2" className="title">Fund A</Typography>
                {this.state.reallocationOn ? (
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
                
                <Typography variant="h6" className="title">Current %: {20}</Typography>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Doughnut
              data={data}
              options={dashboardEmailStatisticsChart.options}
            />
          </Grid>
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
          <Grid item xs={this.state.recommandOn? 3 : 9}>
            <Paper className="fundCard">
              <div className="fund">
                <Typography variant="display2" className="title">Fund B</Typography>
                {this.state.reallocationOn ? (
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
                  <Typography variant="h6" className="title">Target %: {20}</Typography>
                )}
                <Typography variant="h6" className="title">Current %: {20}</Typography>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={3} className="doughnutChart">
            <Doughnut
              data={data1}
              options={dashboardEmailStatisticsChart.options}
            />
          </Grid>
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
          <Grid item xs={this.state.recommandOn? 3 : 9}>
            <Paper className="fundCard">
              <div className="fund">
                <Typography variant="display2" className="title">Fund C</Typography>
                {this.state.reallocationOn ? (
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
                  <Typography variant="h6" className="title">Target %: {20}</Typography>
                )}
                <Typography variant="h6" className="title">Current %: {20}</Typography>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Doughnut
              data={data2}
              options={dashboardEmailStatisticsChart.options}
            />
          </Grid>
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
          {this.state.reallocationOn && (
            <Grid item xs={12}>
              <Button onClick={this.setTarget} fullWidth={true} variant="contained" color="secondary" className="TOPBUTTON">
                SET TARGET
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
