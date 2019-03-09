import React from "react";
import {
  Doughnut
} from "react-chartjs-2";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import './portfolio.css';
import { Redirect } from 'react-router-dom';

import {
  dashboardEmailStatisticsChart,
} from "./variables/charts.jsx";

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

// const request = require('request');

class Portfolio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      setTargetOn: false,
      recommandOn: false,
      target1: 20,
      fundb: 0,
      toDashboard: false,
      allowedDeviation: 5,
      customerId: props.location.state.customerId,
      selectedPortfolioPreference: props.location.state.selectedPortfolioPreference,
      selectedPortfolio: props.location.state.selectedPortfolio
    }

    this.handleSetTargetClick = this.handleSetTargetClick.bind(this);
  }

  componentDidMount() {
  }

  changeAllowedAllocation = name => e => {
    this.setState({
      allowedDeviation: e.target.value,
    });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleSetTargetClick = (e) => {
    this.setState({
      setTargetOn: true
    })
  }

  handleReallocationClick = (e) => {
    this.setState({
      recommandOn: true,
      setTargetOn: false
    })
  }

  handleBack = (e) => {
    this.setState({
      toDashboard: true
    })
  }

  setTarget = (e) => {
    this.setState({
      setTargetOn: false,
      recommandOn: false
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
        pathname: '/dashboard',
        state: { 
          customerId: this.state.customerId 
        }
      }}
      />;
    }

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
              <Button variant="contained" onClick={this.handleSetTargetClick} color="default" className="TOPBUTTON">
                Set TARGET
              </Button>
              <Button variant="contained" onClick={this.handleReallocationClick} color="default" className="TOPBUTTON">
                Rebalance
              </Button>
            </Grid>            
            <Grid item xs={12}>
            {this.state.setTargetOn ? (
              <TextField
                id="outlined-number"
                label="Allowed Deviation"
                value={this.state.allowedDeviation}
                onChange={this.changeAllowedAllocation()}
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
            <Grid item xs={this.state.recommandOn ? 3 : 9}>
              <Paper className="fundCard">
                <div className="fund">
                  <Typography variant="display2" className="title">Fund A</Typography>
                  {this.state.setTargetOn ? (
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
            <Grid item xs={this.state.recommandOn ? 3 : 9}>
              <Paper className="fundCard">
                <div className="fund">
                  <Typography variant="display2" className="title">Fund B</Typography>
                  {this.state.setTargetOn ? (
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
            <Grid item xs={this.state.recommandOn ? 3 : 9}>
              <Paper className="fundCard">
                <div className="fund">
                  <Typography variant="display2" className="title">Fund C</Typography>
                  {this.state.setTargetOn ? (
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
            {this.state.setTargetOn && (
              <Grid item xs={12}>
                <Button onClick={this.setTarget} fullWidth={true} variant="contained" color="secondary" className="TOPBUTTON">
                  SAVE
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
