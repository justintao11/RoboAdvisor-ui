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
import './dashboard.css';

import {
  dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart
} from "./variables/charts.jsx";

class Dashboard extends React.Component {
  render() {
    return (
      <div className="dashboardContainer">
      <div className="root">
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Paper className="paper1">xs=12</Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className="paper1">xs=6</Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className="paper1">xs=6</Paper>
          </Grid>
          <Grid item xs={3}>
            <Card className="card">
                <CardMedia
                  style={{height: 0, paddingTop: '76%'}}
                  className="media"
                  image={require("./assets/img/faces/kaci-baum-2.jpg")}
                  title="Contemplative Reptile"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Welcome! User 102488
                  </Typography>
                  <Typography component="p">
                    Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                    across all continents except Antarctica
                  </Typography>
                </CardContent>
            </Card>
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
                <p className="card-category">Last Campaign Performance</p>
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
          <Grid item xs={3}>
            <Paper className="paper1">xs=3</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className="paper1">xs=3</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className="paper1">xs=3</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className="paper1">xs=3</Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className="paper1">xs=3</Paper>
          </Grid>
        </Grid>
      </div>
      </div>
    );
  }
}

export default Dashboard;
