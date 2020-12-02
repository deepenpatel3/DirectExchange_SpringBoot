import React, { Component } from 'react';
import axios from "axios";
import Navbar from "../Reuse/Navbar";
import { Card, Col, Row, Layout, List, Tabs, Descriptions, Form, Input, Button, message, Select, Checkbox } from 'antd';
import { Link } from "react-router-dom";
import { ContainerFilled, ArrowRightOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
const { Header, Footer, Sider, Content } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;


export default class BrowseOffer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allOffers: [],
            selectedOffer: {},
            allMyOffers: [],
            holdOfferId: Number()
        }
    }

    componentDidMount() {
        this.getOffers();
    }

    formRef = React.createRef();

    getOffers = () => {
        console.log("called");
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/getAllOfferExceptUser/` + localStorage.getItem("id"))
            .then(response => {
                console.log("allOffers ", response.data);
                let allOffers = response.data;
                if (allOffers.length > 0) {
                    let selectedOffer = allOffers[0];
                    console.log("allOffers ", allOffers);
                    console.log("first offer ", selectedOffer);
                    this.setState({ allOffers: allOffers, selectedOffer: selectedOffer });
                }
            })
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/getAllOfferOfUser/` + localStorage.getItem("id"))
            .then(response => {
                let allMyOffers = response.data.map(offer => {
                    return { label: offer.amountToRemit, value: offer.id }
                });
                allMyOffers.push({ label: "None", value: "none" });
                this.setState({
                    allMyOffers: allMyOffers
                });
            });

    }
    postCounterOffer = (values) => {
        console.log("values ", values);
        if (values.holdOffer === "none") {
            let data = {
                amountToRemit: values.amount,
                user: {
                    id: localStorage.getItem("id"),
                },
                sourceCountry: this.state.selectedOffer.destinationCountry,
                destinationCountry: this.state.selectedOffer.sourceCountry,
                sourceCurrency: this.state.selectedOffer.destinationCurrency,
                destinationCurrency: this.state.selectedOffer.sourceCurrency,
                counterOfferOrNot: true
            };
            console.log("data ", data);
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/offer/counterOffer/${this.state.selectedOffer.id}`, data)
                .then(response => {
                    message.success(response.data);
                    // window.location.assign("/browseOffer");
                })
                .catch(error => {
                    // message.success(error);
                    console.log("error ", error);
                })

        } else {
            let data = {
                amountToRemit: values.amount,
                user: {
                    id: localStorage.getItem("id"),
                },
                sourceCountry: this.state.selectedOffer.destinationCountry,
                destinationCountry: this.state.selectedOffer.sourceCountry,
                sourceCurrency: this.state.selectedOffer.destinationCurrency,
                destinationCurrency: this.state.selectedOffer.sourceCurrency,
                counterOfferOrNot: true
            }
            console.log("data ", data);
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/offer/counterOffer/${this.state.selectedOffer.id}/${values.holdOffer}`, data)
                .then(response => {
                    message.success(response.data);
                    // window.location.assign("/browseOffer");
                })
                .catch(error => {
                    // message.success(error);
                    console.log("error ", error);
                })
        }

    }
    filterBySourceCurrency = (value) => {
        console.log("in filter source currency", value);
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/getAllOfferOfSourceCurrency/${localStorage.getItem("id")}/${value}`)
            .then(response => {
                // console.log("allOffers ", response.data);
                let allOffers = response.data;
                if (allOffers.length > 0) {
                    let selectedOffer = allOffers[0];
                    console.log("allOffers ", allOffers);
                    console.log("first offer ", selectedOffer);
                    this.setState({ allOffers: allOffers, selectedOffer: selectedOffer });
                }
                else {
                    this.setState({ allOffers: allOffers, selectedOffer: {} });
                }
            })
    }
    filterByDestinationCurrency = (value) => {
        console.log("in filter destination currency", value);
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/getAllOfferOfDestinationCurrency/${localStorage.getItem("id")}/${value}`)
            .then(response => {
                // console.log("allOffers ", response.data);
                let allOffers = response.data;
                if (allOffers.length > 0) {
                    let selectedOffer = allOffers[0];
                    console.log("allOffers ", allOffers);
                    console.log("first offer ", selectedOffer);
                    this.setState({ allOffers: allOffers, selectedOffer: selectedOffer });
                }
                else {
                    this.setState({ allOffers: allOffers, selectedOffer: {} });
                }
            })
    }
    render() {
        // console.log("selected offer ", this.state.selectedOffer);
        // console.log("my offer ids ", this.state.allMyOffers);
        // if (this.state.allOffers.length === 0) {
        //     return (
        //         <div>
        //             <Navbar />
        //             <h1>No offers to show...</h1>
        //         </div>
        //     )
        // } else {
        return (
            <div>
                <Navbar />
                <br />
                {this.state.allOffers.length > 0 ?
                    <Layout className="container" title="Browse Offers">
                        <Sider theme="light" title="Filters">
                            <Form
                            >
                                <Form.Item
                                    label="Source Currency"
                                    name="sourceCurrency">
                                    <Select
                                        placeholder="Select the source currency"
                                        allowClear
                                        onChange={this.filterBySourceCurrency}
                                    >
                                        <Option key="USD" value="USD">USD</Option>
                                        <Option key="EUR" value="EUR">EUR</Option>
                                        <Option key="INR" value="INR">INR</Option>
                                        <Option key="GBP" value="GBP">GBP</Option>
                                        <Option key="RMB" value="RMB">RMB</Option>
                                    </Select>
                                </Form.Item>
                            </Form>
                            <Form
                            >
                                <Form.Item
                                    label="Destination Currency"
                                    name="destinationCurrency">
                                    <Select
                                        placeholder="Select the destination currency"
                                        allowClear
                                        onChange={this.filterByDestinationCurrency}
                                    >
                                        <Option key="USD" value="USD">USD</Option>
                                        <Option key="EUR" value="EUR">EUR</Option>
                                        <Option key="INR" value="INR">INR</Option>
                                        <Option key="GBP" value="GBP">GBP</Option>
                                        <Option key="RMB" value="RMB">RMB</Option>
                                    </Select>
                                </Form.Item>
                            </Form>
                            {/* <Form ref={this.formRef}
                                onFinish={this.filter}
                            >
                                <Form.Item
                                    label="Source Currency"
                                    name="sourceCurrency"
                                    rules={[{ required: true, message: 'Please select source currency!' }]}>
                                    <Select
                                        placeholder="Select the source currency"
                                        allowClear
                                    // onChange={this.changeHold}
                                    >
                                        <Option key="USD" value="USD">USD</Option>
                                        <Option key="EUR" value="EUR">EUR</Option>
                                        <Option key="INR" value="INR">INR</Option>
                                        <Option key="GBP" value="GBP">GBP</Option>
                                        <Option key="RMB" value="RMB">RMB</Option>
                                    </Select>
                                </Form.Item>
                            </Form> */}
                        </Sider>
                        <Sider theme="light" width={300}>
                            <List
                                bordered
                                dataSource={this.state.allOffers}
                                renderItem={item => (
                                    <List.Item>
                                        <Card style={{ width: 300 }} bordered={false} onClick={() => this.setState({ selectedOffer: item })}>
                                            {item["amountToRemit"]}<br />
                                            {item["sourceCurrency"]}<ArrowRightOutlined />
                                            {item["destinationCurrency"]}
                                        </Card>
                                    </List.Item>
                                )}
                            />
                        </Sider>
                        <Content className="container">
                            <Tabs defaultActiveKey="1" >
                                <TabPane tab="Details" key="1">
                                    <Descriptions >
                                        <Descriptions.Item label="User">{this.state.selectedOffer.user.nickname}</Descriptions.Item>
                                        <Descriptions.Item label="Amount">{this.state.selectedOffer.amountToRemit}</Descriptions.Item>
                                        <Descriptions.Item label="Remaining Amount">{this.state.selectedOffer.remainingBalance}</Descriptions.Item>
                                        <Descriptions.Item label="Exchange Rate">{this.state.selectedOffer.exchangeRate}</Descriptions.Item>
                                        <Descriptions.Item label="Expiration Date">{this.state.selectedOffer.expirationDate}</Descriptions.Item>
                                        <Descriptions.Item label="Source Currency">{this.state.selectedOffer.sourceCurrency}</Descriptions.Item>
                                        <Descriptions.Item label="Status">{this.state.selectedOffer.status}</Descriptions.Item>
                                        <Descriptions.Item label="Destination Currency">{this.state.selectedOffer.destinationCurrency}</Descriptions.Item>
                                        <Descriptions.Item label="Source Country">{this.state.selectedOffer.sourceCountry}</Descriptions.Item>
                                        <Descriptions.Item label="Destination Country">{this.state.selectedOffer.destinationCountry}</Descriptions.Item>
                                        <Descriptions.Item label="Split">{this.state.selectedOffer.allowSplitExchange ? <CheckOutlined /> : <CloseOutlined />} </Descriptions.Item>
                                        <Descriptions.Item label="Counter Offer">{this.state.selectedOffer.allowCounterOffer ? <CheckOutlined /> : <CloseOutlined />}</Descriptions.Item>
                                    </Descriptions>
                                </TabPane>
                                <TabPane tab="Counter Offers" key="2">
                                    <List
                                        dataSource={this.state.selectedOffer.counterOffers || []}
                                        renderItem={item => (
                                            <List.Item>
                                                {item["amountToRemit"]}<br />
                                                {item["sourceCurrency"]}<ArrowRightOutlined />
                                                {item["destinationCurrency"]}
                                            </List.Item>
                                        )}
                                    />{this.state.selectedOffer.allowCounterOffer ?
                                        <Form ref={this.formRef}
                                            // initialValues={{ remember: true }}
                                            onFinish={this.postCounterOffer}
                                        // onSubmitCapture={(event) => this.postCounterOffer(event)}
                                        >
                                            <Form.Item
                                                label="Amount"
                                                name="amount"
                                                rules={[{ required: true, message: 'Please input your amount!' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Form.Item
                                                label="Reference Offer"
                                                name="holdOffer"
                                                rules={[{ required: true, message: 'Please input your amount!' }]}>
                                                <Select
                                                    placeholder="Select a option and change input text above"
                                                    // onChange={this.}
                                                    allowClear
                                                    // dataSource={this.state.allMyOffers}
                                                    options={this.state.allMyOffers}
                                                    onChange={this.changeHold}
                                                // dropdownRender={offer =>
                                                //     <Select.Option>{offer["amountToRemit"]}</Select.Option>
                                                // }
                                                >
                                                    {/* {this.state.allMyOffers.map(offer =>
                                                        <Option value={offer.id} key={offer.id} >{offer.amountToRemit}</Option>
                                                    )} */}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item >
                                                <Button type="primary" htmlType="submit">
                                                    Post
                                        </Button>
                                            </Form.Item>
                                        </Form>
                                        : null}
                                </TabPane>
                                <TabPane tab="Matching Offers" key="3">
                                    <List
                                        dataSource={this.state.selectedOffer.matchingOffers || []}
                                        renderItem={item => (
                                            <List.Item>
                                                {item["amountToRemit"]}<br />
                                                {item["sourceCurrency"]}<ArrowRightOutlined />
                                                {item["destinationCurrency"]}
                                            </List.Item>
                                        )}
                                    />
                                </TabPane>
                            </Tabs>
                        </Content>
                    </Layout>
                    :
                    <Layout className="container" title="Browse Offers">
                        <Sider theme="light" title="Filters">
                            <Form ref={this.formRef}
                            >
                                <Form.Item
                                    label="Source Currency"
                                    name="sourceCurrency"
                                    rules={[{ required: true, message: 'Please select source currency!' }]}>
                                    <Select
                                        placeholder="Select the source currency"
                                        allowClear
                                        onChange={this.filterBySourceCurrency}
                                    >
                                        <Option key="USD" value="USD">USD</Option>
                                        <Option key="EUR" value="EUR">EUR</Option>
                                        <Option key="INR" value="INR">INR</Option>
                                        <Option key="GBP" value="GBP">GBP</Option>
                                        <Option key="RMB" value="RMB">RMB</Option>
                                    </Select>
                                </Form.Item>
                            </Form>
                            <Form ref={this.formRef}
                            >
                                <Form.Item
                                    label="Destination Currency"
                                    name="destinationCurrency"
                                    rules={[{ required: true, message: 'Please select destination currency!' }]}>
                                    <Select
                                        placeholder="Select the destination currency"
                                        allowClear
                                        onChange={this.filterByDestinationCurrency}
                                    >
                                        <Option key="USD" value="USD">USD</Option>
                                        <Option key="EUR" value="EUR">EUR</Option>
                                        <Option key="INR" value="INR">INR</Option>
                                        <Option key="GBP" value="GBP">GBP</Option>
                                        <Option key="RMB" value="RMB">RMB</Option>
                                    </Select>
                                </Form.Item>
                            </Form>
                        </Sider>
                        <Sider theme="light" width={300}>

                        </Sider>
                        <Content className="container">
                            <Tabs defaultActiveKey="1" >
                                <TabPane tab="Details" key="1">

                                </TabPane>
                                <TabPane tab="Counter Offers" key="2">

                                </TabPane>
                                <TabPane tab="Matching Offers" key="3">

                                </TabPane>
                            </Tabs>
                        </Content>
                    </Layout>
                }
            </div>
        )
    }

    // }
}
