import React, { Component } from 'react';
import { Statistic, Card, Row, Col, Table } from 'antd';
// import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import axios from "axios";
import Navbar from './Reuse/Navbar';
const columns = [
  {
    title: 'Currency',
    dataIndex: 'currency',
    key: 'currency',
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
  }
];
// const data = [
//     {
//       currency: '1 Euro',
//       value: '1.18 USD',
//     },
//     {
//         currency: '1 Euro',
//         value: '1.18 USD',
//       },
//       {
//         currency: '1 Euro',
//         value: '1.18 USD',
//       },
//       {
//         currency: '1 Euro',
//         value: '1.18 USD',
//       }

//   ];
class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currency: []
    }
  }

  async componentDidMount() {

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/rates`)
      .then(response => {
        console.log(response.data);
        let currency = [];
        for (let i in response.data) {

          let data = {
            currency: "1 " + i,
            value: response.data[i] + " USD"
          }
          currency.push(data);
        }
        this.setState({
          currency: currency
        })
      })
  }
  render() {
    return (
      <div>
        <Navbar />
        <Table style={{ margin: "50px" }} columns={columns} dataSource={this.state.currency} />
      </div>

    );
  }
}

export default Dashboard;