import React, { Component } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,Legend
} from 'recharts';

const myColors = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4caf50',
  '#ff9100',
  '#9c27b0',
  '#1de9b6'
];

class MyChart2 extends Component {
  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/c1rLyqj1/';

  render() {
    return (
      <LineChart
        width={1200}
        height={300}
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
        {this.props.keys.map((value, index) => {
          return (<Line key={index} type="natural" dataKey={value} activeDot={{ r: 10 }} stroke={myColors[index]} fill={myColors[index]}/>)
        })}
      </LineChart>
    );
  }
}

export default MyChart2
