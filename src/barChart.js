import React, { PureComponent } from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const data = [
  {
    name: 'Fund A', 'bid price': 4000, 'current price': 2400, amt: 2400,
  },
  {
    name: 'Fund B', 'bid price': 3000, 'current price': 1398, amt: 2210,
  },
  {
    name: 'Fund C', 'bid price': 2000, 'current price': 9800, amt: 2290,
  },
  {
    name: 'Fund D', 'bid price': 2780, 'current price': 3908, amt: 2000,
  },
  {
    name: 'Fund E', 'bid price': 1890, 'current price': 4800, amt: 2181,
  },
  {
    name: 'Fund F', 'bid price': 2390, 'current price': 3800, amt: 2500,
  },
];

export default class Example extends PureComponent {
  // static jsfiddleUrl = 'https://jsfiddle.net/alidingling/30763kr7/';

  render() {
    return (
      <BarChart
        width={750}
        height={300}
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="bid price" fill="#36a2eb" />
        <Bar dataKey="current price" fill="#ffce56" />
      </BarChart>
    );
  }
}
