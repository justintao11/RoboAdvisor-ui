import React, { Component } from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

class MyChart extends Component {
  // static jsfiddleUrl = 'https://jsfiddle.net/alidingling/30763kr7/';

  render() {
    return (
      <BarChart
        width={1200}
        height={350}
        data={this.props.data}
        margin={{
          top: 50, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="purchase price" fill="#C0C0C0" />
        <Bar dataKey="current price" fill="#EF241C" />
      </BarChart>
    );
  }
}

export default MyChart;
