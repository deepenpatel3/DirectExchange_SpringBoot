import React, { Component } from 'react';
import { Menu, Layout } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { logout , getloggedInUser } from '../../helpers/authHelper';
import { Link } from 'react-router-dom';
const { Header } = Layout;
const { SubMenu } = Menu;

class Navbar extends Component {

  logoutUser = async () => {
    await logout();
    window.location.href = 'login';
  }
  render() {
    let { selectedKey } = this.props;
    return (
      <Header >
        <div className="logo"><i>Direct Exchange</i></div>
        <Menu theme="dark" mode="horizontal" selectedKeys={[selectedKey]} defaultSelectedKeys={["1"]}>
          <SubMenu key="SubMenu" style={{ float: "right" }} icon={<UserOutlined />} title={getloggedInUser().displayName}>
            <Menu.Item key="profile:1"><Link to="/myOffers">My Offers</Link></Menu.Item>
            <Menu.Item key="profile:2"><Link to="/accounts">My Bank Accounts</Link></Menu.Item>
            <Menu.Item key="profile:3"><Link to="/transactionHistory">My Transaction History</Link></Menu.Item>
            <Menu.Item key="profile:4" onClick={() => this.logoutUser()}>Logout</Menu.Item>

          </SubMenu>
          <Menu.Item key="1"><Link to="/browseOffer">Browse Offers</Link></Menu.Item>
          <Menu.Item key="2"><Link to="/home">Prevailing rates</Link></Menu.Item>
        </Menu>
      </Header>

    );
  }
}

export default Navbar;