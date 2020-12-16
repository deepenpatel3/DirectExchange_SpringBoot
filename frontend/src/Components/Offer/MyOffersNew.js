import React, { Component } from "react";
import {
    Form, Collapse, Row, Col, Badge, Result, Button, Divider,
    Comment, Avatar, Checkbox, Input, Table, Descriptions, Select, DatePicker, message, Modal, Space, Tooltip, Tag, Switch
} from "antd";
import { SmileTwoTone, CloseOutlined, CheckOutlined, ClockCircleOutlined } from "@ant-design/icons";
import Navbar from '../Reuse/Navbar';
// import "../../../media/css/message.css";
//import DesktoChatWindow from './ChatWindow/Desktop'
import axios from "axios";
import MyOffers from "./MyOffers";
import ReactPaginate from 'react-paginate';

const { Search } = Input;
const { Panel } = Collapse;
const { Option } = Select;

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};


class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ticketId: this.props.match.params.id,
            userId: "",
            conversations: [],
            copyConversations: [],
            currentConversation: {},
            currentIndex: -1,
            newMessage: "",
            loading: false,
            add: false,
            update: false,
            text: {},
            allMyOffers: [],
            countries: [],
            currencies: [],
            currentOffer: {},
            matchingOffers: {},
            counterOfferValue: 0,
            prevalingRatesCheckBox: true,
            currencyRates: {},
            showSplitMatches: true,
            offset: 0,
            perPage: 5,
            currentPage: 0,
            currentPageOffers : [],
        }
    }

    async componentDidMount() {
        await this.getOffers();
    }

    changeConversation = async (index) => {
        if (this.state.currentIndex === index) return;
        console.log(index);
        this.setState({
            currentIndex: index,
            currentOffer: this.state.allMyOffers[index],
            matchingOffers: {}
        })
    }

    onInputChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    getOffers = async () => {
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getAllOfferOfUser/` + localStorage.getItem("id"))
            .then(async response => {
                let currentPageOffers = response.data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    
                this.setState({
                    allMyOffers: response.data,
                    currentPageOffers,
                     pageCount: Math.ceil(response.data.length / this.state.perPage)
                });
            });
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/rates`)
            .then(response => {
                console.log(response.data);
                this.setState({ currencyRates: response.data })
            })
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/bankAccount/` + localStorage.getItem("id"))
            .then(async (response) => {
                console.log("accounts ", response.data);
                let currencies = await response.data.map(bankAccount => bankAccount.primaryCurrency)
                let countries = await response.data.map(bankAccount => bankAccount.country);
                console.log("countries ", countries);
                console.log("currencies ", currencies);
                this.setState({
                    countries: countries,
                    currencies: currencies
                });
            });
    }

    acceptCounterOffer = (counterOfferId) => {
        console.log("accepting counter off");
        console.log(counterOfferId);
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/offer/counterOffer/accept/` + counterOfferId)
            .then(response => {
                message.success(response.data);
                this.getOffers();
            })
    }

    rejectCounterOffer = (counterOfferId) => {
        console.log("deleting counter off");
        // axios.delete(`${process.env.REACT_APP_BACKEND_URL}/offer/counterOffer/` + counterOfferId)
        //     .then(response => {
        //         message.success(response.data);
        //         this.getOffers();
        //     })
    }

    postOffer = async (text) => {

        let data = {
            amountToRemit: text["amount"],
            sourceCurrency: text["sourceCurrency"],
            sourceCountry: text["sourceCountry"],
            // exchangeRate: text["exchangeRate"],
            destinationCurrency: text["destinationCurrency"],
            destinationCountry: text["destinationCountry"],
            expirationDate: text["expirationDate"].format("YYYY-MM-DD"),
            allowSplitExchange: text["splitOffers"],
            allowCounterOffer: text["counterOffers"],
            user: {
                "id": localStorage.getItem("id")
            }
        }
        if (this.state.prevalingRatesCheckBox) {
            if (data.sourceCurrency === "USD")
                data.exchangeRate = Number(this.state.currencyRates[data.destinationCurrency])
            else if (data.destinationCurrency === "USD")
                data.exchangeRate = 1 / Number(this.state.currencyRates[data.sourceCurrency])
            else {
                console.log(this.state.currencyRates[data.sourceCurrency], " -> ", this.state.currencyRates[data.destinationCurrency])
                data.exchangeRate = Number(this.state.currencyRates[data.destinationCurrency]) / Number(this.state.currencyRates[data.sourceCurrency])
            }
        } else {
            data.exchangeRate = Number(text["exchangeRate"])
        }

        console.log("data ", data);
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/offer`, data)
            .then(response => {
                message.success(response.data);
                this.getOffers();
            })
            .catch(error => {
                message.error(error.response.data);
            })
    }

    deleteOffer = async (value) => {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/offer/` + value["id"])
            .then(response => {
                message.success(response.data);
                this.getOffers();
            })
    }

    update = (text) => {
        console.log(text)
        this.setState({
            update: true,
            text: text
        })
    }

    updateOffer = async (value) => {
        let offer = this.state.text;
        offer.amountToRemit = value["amount"]
        offer.exchangeRate = value["exchangeRate"]
        offer.expirationDate = value["expirationDate"]
        offer.allowCounterOffer = value["counterOffers"]
        offer.allowSplitExchange = value["splitOffers"]

        console.log("offer ", offer);
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/offer`, offer)
            .then(response => {
                message.success(response.data);
                this.getOffers();
            })
    }

    getMatchingOffers = async (id) => {
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getMatchingOffer/` + id)
            .then(response => {
                console.log(response.data);
                this.setState({
                    matchingOffers: response.data
                });
            });
    }

    postMatchingCounterOffer = async () => {

        let text = this.state.matchingCounterOffer;
        let data = {
            amountToRemit: this.state.counterOfferValue,
            sourceCurrency: text["destinationCurrency"],
            sourceCountry: text["destinationCountry"],
            exchangeRate: text["exchangeRate"],
            destinationCurrency: text["sourceCurrency"],
            destinationCountry: text["sourceCountry"],
            counterOfferOrNot: true,
            remainingBalance: this.state.counterOfferValue,
            user: {
                "id": localStorage.getItem("id")
            }
        }
        console.log(data);

        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/offer/counterOffer/${text.id}/${this.state.currentOffer.id}`, data)
            .then(response => {
                message.success(response.data);
                this.getOffers();
            })
            .catch(error => { message.error(error.response.data) })
    }


    acceptMatchingOffer = async (id) => {
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/offer/otherOffer/${id}/${this.state.currentOffer.id}`, {})
                .then(response => {
                    message.success("Offer Fulfilled, Please Complete the transaction");
                    this.getOffers();
                });
        }
        catch (e) {
            message.error(e.message);
        }

    }

    acceptSplitMatchingOffer = async (offers) => {
        await this.acceptMatchingOffer(offers[0].id)
        await this.acceptMatchingOffer(offers[1].id)
    }

    selectMatchingOffer = (offer) => {

        this.setState({
            matchingCounterOffer: offer,
            matchingCounterOfferVisible: true
        }, () => { console.log(" matching counter offer ", this.state.matchingCounterOffer) })
    }

    pay = async (id) => {
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/transactionPay/${id}`, {})
                .then(async response => {
                    message.success("Transaction successful");
                    await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sendemail`, { params: { sender: "directexchange.cmpe275@gmail.com", message: "Transaction successful", receiver: localStorage.getItem("username") } })
                        .then(() => {
                            message.success("Email sent");
                        });
                    this.getOffers();
                });
        }
        catch (e) {
            message.error(e.message);
        }
    }

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;
        let currentPageOffers = this.state.allMyOffers.slice(offset, offset + this.state.perPage)
        this.setState({
            currentPage: selectedPage,
            offset,
            currentPageOffers
        });

    };

    render() {
        const { currentOffer, matchingOffers } = this.state;
        const columns = [
            {
                title: 'Ammount to Remit',
                dataIndex: 'amountToRemit',
                key: 'amountToRemit',
            },
            {
                title: 'Exchange rate',
                dataIndex: 'exchangeRate',
                key: 'exchangeRate',
            },
            {
                title: 'Expiration Date',
                dataIndex: 'expirationDate',
                key: 'exchangeRate',
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    text.accepted ? "Accepted" :
                        <Space size="middle">
                            <Button type="primary" onClick={() => { this.acceptCounterOffer(text.id) }} icon={<CheckOutlined />} />
                            <Button type="danger" onClick={() => { this.deleteOffer(text) }} icon={<CloseOutlined />} />
                        </Space>
                )
            }
        ]


        const singleMathingOffers = [
            {
                title: 'Ammount to Remit',
                dataIndex: 'amountToRemit',
                key: 'amountToRemit',
            },
            {
                title: 'Exchange rate',
                dataIndex: 'exchangeRate',
                key: 'exchangeRate',
            },
            {
                title: 'Expiration Date',
                dataIndex: 'expirationDate',
                key: 'exchangeRate',
            },
            {
                title: 'Accept',
                key: 'action',
                render: (text, record) => (
                    <Button type="primary" onClick={() => { this.acceptMatchingOffer(text.id) }} icon={<CheckOutlined />} />
                )
            },
            {
                title: 'Counter Offer',
                key: 'action',
                render: (text, record) => {
                    if (text.allowCounterOffer) {
                        return <Button type="primary" onClick={() => { this.selectMatchingOffer(text) }}>Post</Button>
                    }
                }
            }
        ]


        const splitMatchingOffers = [
            {
                title: 'Ammount to Remit',
                dataIndex: 'amountToRemit',
                key: 'amountToRemit',
            },
            {
                title: 'Exchange rate',
                dataIndex: 'exchangeRate',
                key: 'exchangeRate',
            },
            {
                title: 'Accept',
                key: 'action',
                render: (text, record) => (
                    <Button type="primary" onClick={() => { this.acceptSplitMatchingOffer(text.offers) }} icon={<CheckOutlined />} />
                )
            },
            // {
            //     title: 'Counter Offer',
            //     key: 'counterOffer',
            //     render: (text, record) => (
            //         <Space size="middle">
            //             {text.offers[0].allowCounterOffer ? <Button type="primary" onClick={() => { this.selectMatchingOffer(text.offers[0]) }}>Against {text.offers[0].amountToRemit}</Button> : null}
            //             {text.offers[1].allowCounterOffer ? <Button type="primary" onClick={() => { this.selectMatchingOffer(text.offers[1]) }}>Against {text.offers[1].amountToRemit}</Button> : null}
            //         </Space>
            //     )
            // }
        ]

        const oppositeMatchingOffers = [
            {
                title: 'Ammount to Remit',
                dataIndex: 'amountToRemit',
                key: 'amountToRemit',
            },
            {
                title: 'Exchange rate',
                dataIndex: 'exchangeRate',
                key: 'exchangeRate',
            },
            {
                title: 'Accept',
                key: 'action',
                render: (text, record) => (
                    <Button type="primary" onClick={() => { this.acceptMatchingOffer(text.offers[0].id) }} icon={<CheckOutlined />} />
                )
            },
            {
                title: 'Counter Offer',
                key: 'counterOffer',
                render: (text, record) => (
                    <Space size="middle">
                        <Button type="primary" onClick={() => { this.selectMatchingOffer(text.offers[0]) }}>Against {text.offers[0].amountToRemit}</Button>
                    </Space>
                )
            }
        ]

        let exact = matchingOffers.Exact;
        let opposite = [];
        if (matchingOffers && matchingOffers.Opposite && matchingOffers.Opposite.length > 0) {
            matchingOffers.Opposite.forEach(offers => {
                let obj = {};
                obj.amountToRemit = offers[0].amountToRemit + " " + offers[0].sourceCurrency + " - " + offers[1].amountToRemit + " " + offers[1].sourceCurrency;
                obj.exchangeRate = offers[0].exchangeRate;
                obj.offers = offers;
                opposite.push(obj);
            });
        }
        let range = matchingOffers.Range;
        let split = [];
        if (matchingOffers && matchingOffers.Split && matchingOffers.Split.length > 0) {
            matchingOffers.Split.forEach(offers => {
                if (offers.length == 2) {
                    let obj = {};
                    obj.amountToRemit = offers[0].amountToRemit + " + " + offers[1].amountToRemit;
                    obj.exchangeRate = offers[0].exchangeRate;
                    obj.offers = offers;
                    split.push(obj);
                }
            });
        }
        // console.log(" ", this.state.matchingCounterOffer);
        // console.log("refereceOffers ", this.state.referenceOffers);
        return (
            <div >
                <Navbar selectedKey="profile:1" />
                <Row style={{
                    margin: "20px"
                }}>
                    {this.state.countries.length > 1 ? <Button type="primary" htmlType="button" onClick={() => { this.setState({ add: !this.state.add }) }}>Post an Offer</Button> : <Tooltip title="Please register at least 2 accounts"><Button type="primary" htmlType="button" disabled >Post an Offer</Button></Tooltip>}

                </Row>
                <Row
                    className="message"
                    style={{
                        padding: "0px 20px"
                    }}>
                    <Col
                        md={6}
                        xs={24}
                        className={`message-list border`}
                        style={{ height: "90vh" }}>
                        <div className="settings-tray" >
                            {/* <div style={{ float: "right" }}>
                                <a onClick={()=>this.getConversations()}><RedoOutlined spin={this.state.loading} /></a>
                            </div> */}
                            <div style={{ textAlign: "center" }}>
                                <span className="h5">My offers</span>
                            </div>

                        </div>
                        <div className="people-list">
                            {this.state.currentPageOffers.map((offer, index) => {
                                return (
                                    <>
                                        <Comment
                                            className={"friend-drawer friend-drawer--onhover " + offer.className}
                                            author={offer.amountToRemit + " @ " + offer.exchangeRate}
                                            // author={conversation.receiver.fname + " " + conversation.receiver.lname}
                                            avatar={
                                                <Avatar
                                                    size="large"
                                                    icon={offer.sourceCurrency}
                                                />
                                            }
                                            content={
                                                <span>
                                                    Send to {offer.destinationCountry}
                                                </span>
                                            }
                                            datetime={
                                                <span>{offer.expirationDate}</span>
                                            }
                                            onClick={
                                                () =>
                                                    this.changeConversation(index)
                                            }
                                        />
                                        <Divider />
                                    </>
                                )
                            })}
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
                        </div>
                    </Col>
                    <Col
                        md={18}
                        className={`border`}
                    >
                        {currentOffer.amountToRemit ?
                            (<>
                                <div className="settings-tray">
                                    <div style={{ float: "right" }}>
                                        <Space direction="horizontal">
                                            {currentOffer.status == "inTransaction" && !currentOffer.sent && <Button type="success" onClick={() => { this.pay(currentOffer.id) }}> Pay </Button>}
                                            {currentOffer.counterOfferOrNot || currentOffer.status !== "open" ? null : <><Button type="primary" onClick={() => { this.update(currentOffer) }}> Edit </Button> <Button type="danger" onClick={() => { this.deleteOffer(currentOffer) }} > Delete </Button></>}

                                        </Space>
                                    </div>
                                    <div className="friend-drawer no-gutters friend-drawer--black" style={{ textAlign: "center" }}>
                                        <Avatar
                                            size="small"
                                            icon={currentOffer.sourceCurrency}
                                        />
                                        <span className="ant-comment-content-author-name--white">{currentOffer.amountToRemit + " @ " + currentOffer.exchangeRate}</span>
                                        {currentOffer.counterOfferOrNot ? <Tag style={{ marginLeft: "50px" }} color="#2db7f5" icon={<ClockCircleOutlined />} ><span style={{ height: "30px", fontSize: "15px" }}>Counter Offer</span></Tag> : null}

                                    </div>
                                </div>
                                <div className="chat-panel">
                                    <div className="desktop-chat-window" id="scroll-desktop">
                                        <div style={{ margin: "20px" }} >

                                            <Descriptions title="Offer details" bordered>
                                                <Descriptions.Item label="Ammount to Remit">{currentOffer.amountToRemit}</Descriptions.Item>
                                                <Descriptions.Item label="Remaining Balanceß">{currentOffer.remainingBalance}</Descriptions.Item>
                                                <Descriptions.Item label="Source Currency">{currentOffer.sourceCurrency}</Descriptions.Item>
                                                <Descriptions.Item label="Source Country">{currentOffer.sourceCountry}</Descriptions.Item>
                                                <Descriptions.Item label="Destination Currency">{currentOffer.destinationCurrency}</Descriptions.Item>
                                                <Descriptions.Item label="Destination Country">
                                                    {currentOffer.destinationCountry}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Expiration Date">
                                                    {currentOffer.expirationDate}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Status" >
                                                    {currentOffer.status}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Counter Offer">
                                                    <Badge status={currentOffer.allowCounterOffer ? "success" : "error"} text={currentOffer.allowCounterOffer ? "Allowed" : "Not Allowed"} />
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Split Exchange">
                                                    <Badge status={currentOffer.allowSplitExchange ? "success" : "error"} text={currentOffer.allowSplitExchange ? "Allowed" : "Not Allowed"} />
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Exchange rate">{currentOffer.exchangeRate}</Descriptions.Item>
                                            </Descriptions>
                                            <br />
                                            {currentOffer.counterOfferOrNot ? null : <><span className="ant-descriptions-title">Counter offers </span> <Table columns={columns} dataSource={currentOffer.counterOffers} pagination={{ defaultPageSize: 5 }} /></>}


                                            {currentOffer.counterOfferOrNot || currentOffer.status !== "open" ? null : <><span className="ant-descriptions-title">Matching offers </span><Button onClick={() => this.getMatchingOffers(currentOffer.id)}>Fetch Matching offers</Button> <span style={{ float: "right" }}>Split Matches<Switch defaultChecked={this.state.showSplitMatches} checkedChildren="Show" unCheckedChildren="Hide" onChange={() => { this.setState({ showSplitMatches: !this.state.showSplitMatches }) }} /></span></>}
                                            {exact && exact.length > 0 && <>
                                                <br />
                                                <span className="ant-descriptions-title">Exact</span>
                                                <Table columns={singleMathingOffers} dataSource={exact} pagination={{ defaultPageSize: 5 }} />
                                            </>}

                                            {range && range.length > 0 && <>
                                                <br />
                                                <span className="ant-descriptions-title">In Range</span>
                                                <Table columns={singleMathingOffers} dataSource={range} pagination={{ defaultPageSize: 5 }} />
                                            </>}

                                            {this.state.showSplitMatches && split && split.length > 0 && <>
                                                <br />
                                                <span className="ant-descriptions-title">Split Offers(A = B + C)</span>
                                                <Table columns={splitMatchingOffers} dataSource={split} pagination={{ defaultPageSize: 5 }} />
                                            </>}

                                            {this.state.showSplitMatches && opposite && opposite.length > 0 && <>
                                                <br />
                                                <span className="ant-descriptions-title">Split Offers( A = C - B)</span>
                                                <Table columns={oppositeMatchingOffers} dataSource={opposite} pagination={{ defaultPageSize: 5 }} />
                                            </>}
                                        </div>
                                    </div>
                                </div>
                            </>) :
                            <Result
                                className="start-conversation-result"
                                icon={<SmileTwoTone />}
                                title="Please post an offer!"
                            />}
                    </Col>
                </Row>

                <Modal
                    title="Post an Offer"
                    visible={this.state.add}
                    onCancel={async () => await this.setState({ add: false, text: {} })}

                    footer={[
                        <Button form="insertForm" type="primary" htmlType="submit">Submit</Button>
                    ]}
                    destroyOnClose={true}
                >
                    <Form
                        {...layout}
                        name="basic"
                        id="insertForm"
                        initialValues={{
                            splitOffers: true,
                            counterOffers: true
                        }}
                        onFinish={this.postOffer}>
                        <Form.Item
                            label="Amount to Remit"
                            name="amount"
                            rules={[
                                {
                                    required: true,
                                    message: 'Amount to Remit !',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Source Currency"
                            name="sourceCurrency"
                            rules={[
                                {
                                    required: true,
                                    message: 'Source Currency!',
                                },
                            ]}
                        >
                            <Select style={{ width: "150px" }}>
                                {this.state.currencies.map(currency => <option value={currency}>{currency}</option>)}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Destination Currency"
                            name="destinationCurrency"
                            rules={[
                                {
                                    required: true,
                                    message: 'Destination Currency!',
                                },
                            ]}
                        >
                            <Select style={{ width: "150px" }}>
                                {this.state.currencies.map(currency => <option value={currency}>{currency}</option>)}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Exchange Rate"
                            rules={[
                                {
                                    required: true
                                },
                            ]}>
                            <Checkbox checked={this.state.prevalingRatesCheckBox} onChange={() => { this.setState({ prevalingRatesCheckBox: !this.state.prevalingRatesCheckBox }) }}>Prevailing rate</Checkbox>
                        </Form.Item>

                        {!this.state.prevalingRatesCheckBox ?
                            <Form.Item
                                label="Custom rate"
                                name="exchangeRate"
                                rules={[
                                    {
                                        message: 'Exchange Rate!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item> : null}

                        <Form.Item
                            label="Source Country"
                            name="sourceCountry"
                            rules={[
                                {
                                    required: true,
                                    message: 'Source Country!',
                                },
                            ]}
                        >
                            <Select>
                                {this.state.countries.map(country => <option value={country}>{country}</option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Desitination Country"
                            name="destinationCountry"
                            rules={[
                                {
                                    required: true,
                                    message: 'Destination Country!',
                                },
                            ]}
                        >
                            <Select>
                                {this.state.countries.map(country => <option value={country}>{country}</option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Expiration Date"
                            name="expirationDate"
                            rules={[
                                {
                                    required: true,
                                    message: 'Expiration Date mm/dd/yyyy!',
                                },
                            ]}
                        >
                            <DatePicker />
                        </Form.Item>

                        <Form.Item {...tailLayout} name="splitOffers" valuePropName="checked" >
                            <Checkbox checked="checked">Split Offer</Checkbox>
                        </Form.Item>
                        <Form.Item {...tailLayout} name="counterOffers" valuePropName="checked">
                            <Checkbox checked="true">Counter Offer</Checkbox>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="Update Offer"
                    visible={this.state.update}
                    onCancel={async () => await this.setState({ update: false, text: {} })}
                    footer={[
                        <Button form="updateForm" type="primary" htmlType="submit">Submit</Button>
                    ]}
                    destroyOnClose={true}
                >
                    {/* <Form
                        {...layout}

                        id="updateForm"
                        name="basic"
                        initialValues={{
                            id: this.state.text["id"],
                            amount: this.state.text["amountToRemit"],
                            exchangeRate: this.state.text['exchangeRate'],
                            expirationDate: this.state.text['expirationDate'],
                            splitOffers: this.state.text['splitOffers'],
                            counterOffers: this.state.text['counterOffers'],

                        }}
                        onFinish={this.updateOffer}
                    >
                        <Form.Item
                            label="Amount to Remit"
                            name="amount"
                            rules={[
                                {
                                    required: true,
                                    message: 'Amount to Remit !',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Exchange Rate"
                            name="exchangeRate"
                            rules={[
                                {
                                    required: true,
                                    message: 'Exchange Rate!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>


                        <Form.Item
                            label="Expiration Date"
                            name="expirationDate"
                            rules={[
                                {
                                    required: true,
                                    message: 'Expiration Date mm/dd/yyyy!',
                                },
                            ]}
                        > */}
                    <Form
                        {...layout}

                        id="updateForm"
                        name="basic"
                        initialValues={{
                            id: this.state.text["id"],
                            amount: this.state.text["amountToRemit"],
                            exchangeRate: this.state.text['exchangeRate'],
                            expirationDate: this.state.text['expirationDate'],
                            splitOffers: this.state.text['allowSplitExchange'],
                            counterOffers: this.state.text['allowCounterOffer'],
                        }}
                        onFinish={this.updateOffer}>
                        <Form.Item
                            label="Amount to Remit"
                            name="amount"
                            rules={[
                                {
                                    required: true,
                                    message: 'Amount to Remit !',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Exchange Rate"
                            name="exchangeRate"
                            rules={[
                                {
                                    required: true,
                                    message: 'Exchange Rate!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Expiration Date"
                            name="expirationDate"
                            rules={[
                                {
                                    required: true,
                                    message: 'Expiration Date mm/dd/yyyy!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item {...tailLayout} name="splitOffers" valuePropName="checked" >
                            <Checkbox>Split Offer</Checkbox>
                        </Form.Item>
                        <Form.Item {...tailLayout} name="counterOffers" valuePropName="checked">
                            <Checkbox>Counter Offer</Checkbox>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="Post Counter offers (in original offer's source currency)"
                    visible={this.state.matchingCounterOfferVisible}
                    onCancel={async () => await this.setState({ matchingCounterOfferVisible: false, text: {} })}
                    onOk={() => this.postMatchingCounterOffer()}
                    destroyOnClose={true}
                >
                    <Input name="counterOfferValue" value={this.state.counterOfferValue} onChange={(e) => this.onInputChange(e)} />
                </Modal>

            </div>
        )
    }
}


export default Message;