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
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import './dashboard.css';

import {
  dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart
} from "./variables/charts.jsx";

class Portfolio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    }
  }

  render() {
    return (
      <div className="dashboardContainer">
      <div className="root">
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Button variant="contained" color="secondary" className="button">
              Back
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" className="title">
              Portfolio A
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper className="paper1">xs=12</Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className="paper1">xs=12</Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className="paper1">xs=12</Paper>
          </Grid>
        </Grid>
      </div>
      </div>
    );
  }
}

export default Portfolio;
