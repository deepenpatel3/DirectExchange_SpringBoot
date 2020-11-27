import React, { Component } from 'react';
import { Menu , Layout} from 'antd';
import { UserOutlined} from '@ant-design/icons';
import {logout} from '../../helpers/authHelper'
const { Header } = Layout;
const { SubMenu } = Menu;

class Navbar extends Component {

  logoutUser = async ()=>{
    await logout();
    window.location.href='login';
  }
  render() {
    return (
    <Header >
    <div className="logo"><i>Direct Exchange</i></div>
    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
    <SubMenu key="SubMenu" style={{float:"right"}} icon={<UserOutlined />} title="Profile">
        <Menu.Item key="setting:1">My Offers</Menu.Item>
        <Menu.Item key="setting:2" onClick={()=>this.logoutUser()}>Logout</Menu.Item>
      {/* <Menu.ItemGroup title="Item 2">
        <Menu.Item key="setting:3">Option 3</Menu.Item>
        <Menu.Item key="setting:4">Option 4</Menu.Item>
      </Menu.ItemGroup> */}
    </SubMenu>
       {/* <Menu.Item key="login" style={{float:"right"}} >Login</Menu.Item> */}
      <Menu.Item key="1">Browse Offers</Menu.Item>
      <Menu.Item key="2">Prevailing rates</Menu.Item>
      
    </Menu>
  </Header>

    );
  }
}

export default Navbar;