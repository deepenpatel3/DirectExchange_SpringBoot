import React, { Component } from 'react';
import axios from "axios";
import Navbar from "../Reuse/Navbar";
import ReactPaginate from 'react-paginate';
import { Card, Col, Row, Layout, List, Tabs, Descriptions, Form, Input, Button, message, Select, Checkbox, Comment, PageHeader, Avatar, Result, Divider, Slider, Tooltip, Rate, Table } from 'antd';
import { Link } from "react-router-dom";
import { ContainerFilled, ArrowRightOutlined, CheckOutlined, CloseOutlined, SmileTwoTone, HeartOutlined } from '@ant-design/icons';
const { Header, Footer, Sider, Content } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

export default class BrowseOffer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allOffers: [],
            currentPageOffers : [],
            selectedOffer: {},
            allMyOffers: [],
            holdOfferId: Number(),
            selectedSourceCurrency: "",
            selectedDestinationCurrency: "",
            lowestSourceCurrencyAmount: Number.MAX_VALUE,
            highestSourceCurrencyAmount: Number.MIN_VALUE,
            lowestDestinationCurrencyAmount: Number.MAX_VALUE,
            highestDestinationCurrencyAmount: Number.MIN_VALUE,
            userTransactions: [],
            offset: 0,
            perPage: 5,
            currentPage: 0
        }
    }

    componentDidMount() {
        this.getOffers();
    }

    formRef = React.createRef();

    getOffers = () => {
        console.log("get offers called");
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/getAllOfferExceptUser/` + localStorage.getItem("id"))
            .then(async response => {
                console.log("allOffers ", response.data);
                let allOffers = response.data;
                if (allOffers.length > 0) {
                    let selectedOffer = allOffers[0];
                    let currentPageOffers = allOffers.slice(this.state.offset, this.state.offset + this.state.perPage)
                    await this.getTransactionsOfAUser(selectedOffer.user.id);
                    // console.log("allOffers ", allOffers);
                    // let lowestSourceCurrencyAmount = this.state.lowestSourceCurrencyAmount;
                    // console.log("lowest ", lowestSourceCurrencyAmount);

                    // console.log("first offer ", selectedOffer);
                    this.setState({ allOffers: allOffers, currentPageOffers, pageCount: Math.ceil(allOffers.length / this.state.perPage), selectedOffer: selectedOffer, selectedSourceCurrency: "", selectedDestinationCurrency: "" });
                }
            })
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/getAllOfferOfUser/` + localStorage.getItem("id"))
            .then(async response => {
                let allMyOffers = [];
                await response.data.forEach(offer => {
                    if (offer.status === "open" && !offer.counterOfferOrNot) {
                        allMyOffers.push({ label: `${offer.amountToRemit} @ ${offer.exchangeRate}`, value: offer.id })
                    }
                });
                allMyOffers.push({ label: "None", value: "none" });
                this.setState({
                    allMyOffers: allMyOffers
                });
            });
    }

    getTransactionsOfAUser = async (id) => {
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/transactionHistory/${id}`)
            .then(response => {

                this.setState({
                    userTransactions: response.data
                })
            })
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
                    message.error(error.response.data);
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
                    message.error(error.response.data);
                    console.log("error ", error);
                })
        }

    }
    filterBySourceCurrency = (value) => {
        console.log("in filter source currency", value);
        if (value == undefined) {

            this.getOffers();
        }
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/getAllOfferOfSourceCurrency/${localStorage.getItem("id")}/${value}`)
            .then(async response => {
                // console.log("allOffers ", response.data);
                let allOffers = response.data;

                if (allOffers.length > 0) {
                    let selectedOffer = allOffers[0];
                    await this.getTransactionsOfAUser(selectedOffer.user.id);
                    console.log("allOffers ", allOffers);
                    console.log("first offer ", selectedOffer);
                    let lowestSourceCurrencyAmount = Number.MAX_VALUE;
                    let highestSourceCurrencyAmount = Number.MIN_VALUE;
                    allOffers.forEach(offer => {
                        if (offer.amountToRemit < lowestSourceCurrencyAmount)
                            lowestSourceCurrencyAmount = offer.amountToRemit
                        if (offer.amountToRemit > highestSourceCurrencyAmount)
                            highestSourceCurrencyAmount = offer.amountToRemit
                    })
                    this.setState({ allOffers: allOffers, selectedOffer: selectedOffer, selectedSourceCurrency: value, highestSourceCurrencyAmount: highestSourceCurrencyAmount, lowestSourceCurrencyAmount: lowestSourceCurrencyAmount });
                }
                else {
                    this.setState({ allOffers: allOffers, selectedOffer: {} });
                }
            })
    }
    filterByDestinationCurrency = (value) => {
        console.log("in filter destination currency", value);
        if (value == undefined) {
            this.getOffers();
        }
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/getAllOfferOfDestinationCurrency/${localStorage.getItem("id")}/${value}`)
            .then(async response => {
                // console.log("allOffers ", response.data);
                let allOffers = response.data;
                if (allOffers.length > 0) {
                    let selectedOffer = allOffers[0];
                    await this.getTransactionsOfAUser(selectedOffer.user.id);
                    console.log("allOffers ", allOffers);
                    console.log("first offer ", selectedOffer);
                    let lowestDestinationCurrencyAmount = Number.MAX_VALUE;
                    let highestDestinationCurrencyAmount = Number.MIN_VALUE;
                    allOffers.forEach(offer => {
                        if (offer.amountToRemit * offer.exchangeRate < lowestDestinationCurrencyAmount)
                            lowestDestinationCurrencyAmount = offer.amountToRemit * offer.exchangeRate
                        if (offer.amountToRemit * offer.exchangeRate > highestDestinationCurrencyAmount)
                            highestDestinationCurrencyAmount = offer.amountToRemit * offer.exchangeRate
                    })
                    this.setState({ allOffers: allOffers, selectedOffer: selectedOffer, selectedDestinationCurrency: value, lowestDestinationCurrencyAmount: Math.floor(lowestDestinationCurrencyAmount), highestDestinationCurrencyAmount: Math.ceil(highestDestinationCurrencyAmount) });
                }
                else {
                    this.setState({ allOffers: allOffers, selectedOffer: {} });
                }
            })
    }
    filterBySourceCurrencyAmount = async (value) => {
        console.log("in filter source currency amount", value);
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getAllOfferOfSourceCurrencyAmount/${localStorage.getItem("id")}/${this.state.selectedSourceCurrency}/${value[0]}/${value[1]}`)
            .then(async response => {
                console.log("filtered offers ", response.data);
                let allOffers = response.data;
                // console.log("filtered offers ", allOffers);
                if (allOffers.length > 0) {
                    let selectedOffer = allOffers[0];
                    await this.getTransactionsOfAUser(selectedOffer.user.id);
                    // console.log("allOffers ", allOffers);
                    console.log("first offer ", selectedOffer);
                    this.setState({ allOffers: allOffers, selectedOffer: selectedOffer });
                }
                // else {
                //     this.setState({ allOffers: allOffers, selectedOffer: {} });
                // }
            })
    }
    filterByDestinationCurrencyAmount = async (value) => {
        console.log("in filter destination currency amount", value);
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getAllOfferOfDestinationCurrencyAmount/${localStorage.getItem("id")}/${this.state.selectedDestinationCurrency}/${value[0]}/${value[1]}`)
            .then(async response => {
                console.log("filtered offers ", response.data);
                let allOffers = response.data;
                if (allOffers.length > 0) {
                    let selectedOffer = allOffers[0];
                    await this.getTransactionsOfAUser(selectedOffer.user.id);
                    // console.log("allOffers ", allOffers);
                    console.log("first offer ", selectedOffer);
                    this.setState({ allOffers: allOffers, selectedOffer: selectedOffer });
                }
                // else {
                //     this.setState({ allOffers: allOffers, selectedOffer: {} });
                // }
            })
    }
    acceptOffer = (values) => {
        console.log("accept values ", values);
        if (values.postedOffer === "none") {
            let data = {
                amountToRemit: this.state.selectedOffer.remainingBalance * this.state.selectedOffer.exchangeRate,
                user: {
                    id: localStorage.getItem("id"),
                },
                exchangeRate: 1 / this.state.selectedOffer.exchangeRate,
                sourceCountry: this.state.selectedOffer.destinationCountry,
                destinationCountry: this.state.selectedOffer.sourceCountry,
                sourceCurrency: this.state.selectedOffer.destinationCurrency,
                destinationCurrency: this.state.selectedOffer.sourceCurrency,
                counterOfferOrNot: false
            };
            console.log("data ", data);
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/offer/matchingOffer/${this.state.selectedOffer.id}`, data)
                .then(response => {
                    message.success(response.data);
                })
                .catch(error => {
                    message.error(error.response.data);
                    console.log("error ", error);
                })

        } else {
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/offer/otherOffer/${this.state.selectedOffer.id}/${values.postedOffer}`)
                .then(response => {
                    message.success(response.data);
                })
                .catch(error => {
                    message.error(error.response.data);
                    console.log("error ", error);
                })
        }
    }
    sendMessage = (values) => {
        console.log("sending message ", values);
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/sendemail/`, { params: { "sender": localStorage.getItem("username"), "message": values.message, "receiver": values.receiver } })
            .then(response => {
                // console.log("allOffers ", response.data);
                message.success(response.data);
            })
    }
    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;
        let currentPageOffers = this.state.allOffers.slice(offset, offset + this.state.perPage)
        this.setState({
            currentPage: selectedPage,
            offset,
            currentPageOffers
        });

    };
    render() {
        // console.log("sc ", this.state.selectedSourceCurrency, " dc ", this.state.selectedDestinationCurrency);
        // console.log("lowest sc ", this.state.lowestSourceCurrencyAmount, " highest sc amount: ", this.state.highestSourceCurrencyAmount);
        // console.log("lowest dc ", this.state.lowestDestinationCurrencyAmount, " highest dc amount: ", this.state.highestDestinationCurrencyAmount);
        console.log("trans -------> ", this.state.userTransactions);

        const columns = [
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
            },
            {
                title: 'User-1',
                key: 'user1',
                render: (text) => (<p>{text.mainOffer.user.username}</p>)
            },
            {
                title: 'User-2',
                key: 'user2',
                render: (text) => (<p>{text.otherOffer.user.username}</p>)
            },
        ]
        return (
            <div>
                <Navbar />
                <br />
                {this.state.allOffers.length > 0 ?
                    <div >
                        <Row>
                            <Form layout="inline" style={{ float: 'left' }}>
                                <Form.Item
                                    label="Source Currency"
                                    name="sourceCurrency">
                                    <Select
                                        style={{ width: "150px" }}
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
                            <Form layout="inline">
                                <Form.Item
                                    label="Destination Currency"
                                    name="destinationCurrency">
                                    <Select
                                        style={{ width: "150px" }}
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

                            {this.state.selectedSourceCurrency === "" ? <Tooltip title="Please select a source currency first">Source currency amount<Slider
                                style={{ width: "150px" }}
                                range
                                disabled
                            /></Tooltip> : <>Source currency amount<Slider
                                style={{ width: "150px" }}
                                range
                                defaultValue={[this.state.lowestSourceCurrencyAmount, this.state.highestSourceCurrencyAmount]}
                                max={this.state.highestSourceCurrencyAmount}
                                min={this.state.lowestSourceCurrencyAmount}
                                onAfterChange={this.filterBySourceCurrencyAmount}
                            /></>}
                            {this.state.selectedDestinationCurrency === "" ? <Tooltip title="Please select a destination currency first">Destination Currency amount<Slider
                                style={{ width: "150px" }}
                                range
                                disabled
                            /></Tooltip> : <>Destination currency amount<Slider
                                style={{ width: "150px" }}
                                range
                                defaultValue={[this.state.lowestDestinationCurrencyAmount, this.state.highestDestinationCurrencyAmount]}
                                min={this.state.lowestDestinationCurrencyAmount}
                                max={this.state.highestDestinationCurrencyAmount}
                                onAfterChange={this.filterByDestinationCurrencyAmount}
                            /></>}

                        </Row>
                        <Layout title="Browse Offers">
                            <Sider theme="light" width={350}>
                                {/* <div className="settings-tray" >
                                    <div style={{ textAlign: "center" }}>
                                        <span className="h5">Offers</span>
                                    </div>

                                </div> */}
                                <PageHeader
                                    ghost={false}
                                    title="Offers"
                                >
                                    {/* <List
                                        bordered
                                        dataSource={this.state.allOffers}
                                        renderItem={item => (
                                            <List.Item> */}
                                    {this.state.allOffers.length > 0 ?
                                        (
                                            <>
                                            {this.state.currentPageOffers.map(item =>
                                            <>
                                                <Comment
                                                    className={"friend-drawer friend-drawer--onhover " + item.className}
                                                    author={item.amountToRemit + " @ " + item.exchangeRate}
                                                    // author={conversation.receiver.fname + " " + conversation.receiver.lname}
                                                    avatar={
                                                        <Avatar
                                                            size="large"
                                                            icon={item.sourceCurrency}
                                                        />
                                                    }
                                                    content={
                                                        <span>
                                                            Send to {item.destinationCountry}
                                                        </span>
                                                    }
                                                    datetime={
                                                        <span>{item.expirationDate}</span>
                                                    }
                                                    onClick={async () => { await this.getTransactionsOfAUser(item.user.id); this.setState({ selectedOffer: item }) }}
                                                />
                                                <Divider />
                                            </>
                                        )}
                                        <ReactPaginate
                                            previousLabel={"prev"}
                                            nextLabel={"next"}
                                            breakLabel={"..."}
                                            breakClassName={"break-me"}
                                            pageCount={this.state.pageCount}
                                            marginPagesDisplayed={2}
                                            pageRangeDisplayed={5}
                                            onPageChange={this.handlePageClick}
                                            containerClassName={"pagination"}
                                            subContainerClassName={"pages pagination"}
                                            activeClassName={"active"}/>
                                        </>
                                        )
                                        :
                                        <Result
                                            className="start-conversation-result"
                                            icon={<SmileTwoTone />}
                                            title="Please select a transaction to view details!"
                                        />}

                                    {/* </List.Item>
                                            // <List.Item>
                                            //     <Card className={"friend-drawer friend-drawer--onhover "} style={{ width: 300 }} bordered={false} onClick={() => this.setState({ selectedOffer: item })}>
                                            //         {item["amountToRemit"]}<br />
                                            //         {item["sourceCurrency"]}<ArrowRightOutlined />
                                            //         {item["destinationCurrency"]}<br />
                                            //         {item["accepted"] ? <p>Accepted: <CheckOutlined /> </p> : item["status"]}
                                            //     </Card>
                                            // </List.Item>
                                        )}
                                    /> */}
                                </PageHeader>
                            </Sider>
                            <Content >
                                <PageHeader
                                    // ghost={false}
                                    title="Offer Details"
                                >
                                    <Tabs defaultActiveKey="1" >
                                        <TabPane tab="Details" key="1">
                                            <Descriptions bordered>
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
                                            <br />
                                            <Divider />
                                            <Form
                                                ref={this.formRef}
                                                layout="inline"
                                                onFinish={this.acceptOffer}
                                                style={{ marginTop: "20px" }}
                                            >
                                                <Form.Item
                                                    label="Reference Offer"
                                                    name="postedOffer"
                                                    rules={[{ required: true, message: 'Please input your amount!' }]}>
                                                    <Select
                                                        placeholder="Select a option and change input text above"
                                                        allowClear
                                                        options={this.state.allMyOffers}
                                                    // onChange={this.changeHold}
                                                    >
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item >
                                                    <Button type="primary" htmlType="submit">
                                                        Accept
                                                    </Button>
                                                </Form.Item>
                                            </Form>
                                        </TabPane>
                                        <TabPane tab="Counter Offers" key="2">
                                            <List
                                                dataSource={this.state.selectedOffer.counterOffers || []}
                                                renderItem={item => (
                                                    <List.Item>
                                                        {item["amountToRemit"]}<br />
                                                        {item["sourceCurrency"]}<ArrowRightOutlined />
                                                        {item["destinationCurrency"]}
                                                        {item["accepted"]}
                                                    </List.Item>
                                                )}
                                            />{this.state.selectedOffer.allowCounterOffer ?
                                                <Form ref={this.formRef}
                                                    onFinish={this.postCounterOffer}
                                                    layout="inline"
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
                                        <TabPane tab="Message" key="4">
                                            <Form ref={this.formRef}
                                                onFinish={(values) => this.sendMessage(values)}
                                                layout="vertical"
                                                initialValues={{
                                                    receiver: this.state.selectedOffer.user.username,
                                                }}
                                            >
                                                <Form.Item
                                                    label="Message"
                                                    name="message"
                                                    rules={[{ required: true, message: 'Please type your message!' }]}
                                                >
                                                    <TextArea rows={4} />
                                                </Form.Item>
                                                <Form.Item
                                                    name="receiver"
                                                    rules={[{ required: true }]}>
                                                    <Input hidden aria-disabled value={this.state.selectedOffer.user.username} />
                                                </Form.Item>
                                                <Form.Item >
                                                    <Button type="primary" htmlType="submit">
                                                        Send
                                                    </Button>
                                                </Form.Item>
                                            </Form>
                                        </TabPane>
                                        <TabPane tab="User info" key="5">
                                            User rating:
                                            <Rate allowHalf disabled value={Number(this.state.selectedOffer.user.reputation)} style={{ backgroundColor: "white" }} /><br /><br /><br />
                                            <Table columns={columns} dataSource={this.state.userTransactions} pagination={{ defaultPageSize: 5 }} title={() => 'Transactions:'} />
                                        </TabPane>
                                    </Tabs>
                                </PageHeader>
                            </Content>
                        </Layout></div>
                    : <>
                        <Form layout="inline" style={{ float: 'left' }}>
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
                        <Form layout="inline">
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
                        <Layout title="Browse Offers">
                            <Content >
                                <Result
                                    className="start-conversation-result"
                                    icon={<SmileTwoTone />}
                                    title="There are no offers to show!"
                                />
                            </Content>
                        </Layout></>
                }
            </div>
        )
    }

    // }
}
