import React, { Component } from 'react';
import { Statistic, Card, Row, Col , Table} from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
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
const data = [
    {
      currency: '1 Euro',
      value: '1.18 USD',
    },
    {
        currency: '1 Euro',
        value: '1.18 USD',
      },
      {
        currency: '1 Euro',
        value: '1.18 USD',
      },
      {
        currency: '1 Euro',
        value: '1.18 USD',
      }

  ];
class Dashboard extends Component {
    
  render() {
    return (
        <div>
        <Navbar/>
        <Table style={{margin: "50px"}} columns={columns} dataSource={data} />
      </div>

    );
  }
}

export default Dashboard;