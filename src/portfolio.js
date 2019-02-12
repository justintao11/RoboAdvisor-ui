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
import { Line, Pie, Doughnut} from "react-chartjs-2";
// function that returns a color based on an interval of numbers
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import './portfolio.css';
import Stats from "./Stats.jsx";

import {
  dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart
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

class Portfolio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      reallocationOn: false,
      recommandOn:false,
      target1: 20,
      fundb: 0
    }
    this.handleReallocationClick = this.handleReallocationClick.bind(this);
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

  setTarget = (e) => {
    this.setState({
      reallocationOn: false,
      recommandOn: true
    })
  }


  render() {
    return (
      <div className="dashboardContainer">
      <div className="root">
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Button variant="contained" color="secondary" className="TOPBUTTON">
              Back
            </Button>
            <Button variant="contained" onClick={this.handleReallocationClick} color="default" className="TOPBUTTON">
              Reallocate
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h2" className="title">
              Portfolio A
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Paper className="paper1">
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
          <Grid item xs={6}>
            <Paper className="paper1">xs=12</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className="paper1">
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
          <Grid item xs={6}>
            <Paper className="paper1">
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
          <Grid item xs={3}>
            <Paper className="paper1">
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
          <Grid item xs={6}>
            <Paper className="paper1">xs=12</Paper>
          </Grid>
          {this.state.reallocationOn && (
            <Grid item xs={12}>
              <Button onClick={this.setTarget} fullWidth="true" variant="contained" color="secondary" className="TOPBUTTON">
                SET TARGET
              </Button>
            </Grid>
          )}
          {this.state.recommandOn && (
            <Grid container spacing={24}>
            <Grid item xs={6}>
              <Button onClick={this.setTarget} fullWidth="true" variant="contained" color="secondary" className="TOPBUTTON">
                MODIFY
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button onClick={this.setTarget} fullWidth="true" variant="contained" color="secondary" className="TOPBUTTON">
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
