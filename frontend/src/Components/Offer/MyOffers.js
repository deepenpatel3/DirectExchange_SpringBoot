import React, { Component } from 'react';
import Navbar from '../Reuse/Navbar';
import axios from "axios";
// import { Col, Row, Card,Modal,Header, Footer, Content,Layout } from 'antd';
import { Form, Input, Button, Checkbox, Layout, message, Table, Space, Modal, Divider, Select, DatePicker } from 'antd';
import moment from 'moment';
import { EditFilled, DeleteFilled } from '@ant-design/icons';
const { Header, Footer, Content } = Layout;

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

export default class MyOffers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            add: false,
            update: false,
            text: {},
            allMyOffers: [],
            countries: [],
            numOfAccounts: 0
        }
    }

    async componentDidMount() {
        await this.getOffers();
    }

    acceptCounterOffer = (counterOfferId) => {
        console.log("accepting counter off");
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/offer/counterOffer/split/accept/` + counterOfferId)
            .then(response => {
                message.success(response.data);
                this.getOffers();
            })
    }

    rejectCounterOffer = (counterOfferId) => {
        console.log("deleting counter off");
        axios.delete(`${process.env.REACT_APP_BACKEND_URL}/offer/counterOffer/` + counterOfferId)
            .then(response => {
                message.success(response.data);
                this.getOffers();
            })
    }

    postOffer = async (text) => {
        console.log("postOffer");
        let data = {
            amountToRemit: text["amount"],
            sourceCurrency: text["sourceCurrency"],
            sourceCountry: text["sourceCountry"],
            exchangeRate: text["exchangeRate"],
            destinationCurrency: text["destinationCurrency"],
            destinationCountry: text["destinationCountry"],
            expirationDate: text["expirationDate"].format("YYYY-MM-DD"),
            allowSplitExchange: text["splitOffers"],
            allowCounterOffer: text["counterOffers"],
            user: {
                "id": localStorage.getItem("id")
            }
        }
        console.log(data);
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/offer`, data)
            .then(response => {
                message.success(response.data);
                this.getOffers();
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
        console.log("update ", JSON.stringify(text))
        this.setState({
            update: true,
            text: text
        })
    }

    updateOffer = async (value) => {
        console.log("updateOffer")
        // this.setState({text : value})
        let offer = {}
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

    getOffers = async () => {
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getAllOfferOfUser/` + localStorage.getItem("id"))
            .then(response => {
                console.log(response.data);
                this.setState({
                    allMyOffers: response.data
                });
            });
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/bankAccount/` + localStorage.getItem("id"))
            .then(async (response) => {
                console.log("accounts ", response.data);
                let countries = await response.data.map(bankAccount => bankAccount.country);
                console.log("countries ", countries);
                this.setState({
                    countries: countries,
                    numOfAccounts: response.data.length
                });
            });
    }

    render() {

        const columns = [
            {
                title: 'Ammount to Remit',
                dataIndex: 'amountToRemit',
                key: 'amountToRemit',
            },
            {
                title: 'Source Currency',
                dataIndex: 'sourceCurrency',
                key: 'sourceCurrency',
            },
            {
                title: 'Destination Currency',
                dataIndex: 'destinationCurrency',
                key: 'destinationCurrency',
            },
            {
                title: 'Source Country',
                dataIndex: 'sourceCountry',
                key: 'sourceCountry',
            },
            {
                title: 'Destination Country',
                dataIndex: 'destinationCountry',
                key: 'destinationCountry',
            },
            {
                title: 'Expiration Date',
                dataIndex: 'expirationDate',
                key: 'exchangeRate',
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <Space size="middle">
                        <Button type="primary" onClick={async () => await this.setState({ update: true, text: record })} icon={<EditFilled />} />
                        <Button type="danger" onClick={() => { this.deleteOffer(text) }} icon={<DeleteFilled />} />
                    </Space>
                )
            }
        ]

        return (
            <>
                <Layout>
                    <Header>
                        <Navbar />
                    </Header>
                    <Content style={{ padding: '0 75px' }} >
                        <Modal
                            title="Update Offer"
                            visible={this.state.update}
                            onCancel={async () => await this.setState({ update: false, text: {} })}
                            footer={[
                                <Button form="updateForm" type="primary" htmlType="submit">Submit</Button>
                            ]}
                            destroyOnClose={true}
                        >
                            <Form
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
                                    <Input defaultValue={this.state.text["amountToRemit"]} />
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
                                    <DatePicker />
                                </Form.Item>
                                <Form.Item {...tailLayout} name="splitOffers" valuePropName="checked" >
                                    <Checkbox checked="checked" >Split Offer</Checkbox>
                                </Form.Item>
                                <Form.Item {...tailLayout} name="counterOffers" valuePropName="checked">
                                    <Checkbox checked="true">Counter Offer</Checkbox>
                                </Form.Item>
                                {/* <Form.Item {...tailLayout}>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item> */}
                            </Form>
                        </Modal>

                        <div className="site-layout-content" style={{ marginTop: "50px" }}>
                            {this.state.numOfAccounts ? <Button type="primary" htmlType="button" onClick={() => { this.setState({ add: !this.state.add }) }}>Post an Offer</Button> : null}
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
                                    onFinish={this.postOffer}
                                // onFinishFailed={this.onFinishFailed}
                                // style={{ display: this.state.add }}
                                ><Form.Item>
                                        <DatePicker />
                                    </Form.Item>

                                    <Form.Item {...tailLayout} name="splitOffers" valuePropName="checked" >
                                        <Checkbox checked="checked">Split Offer</Checkbox>
                                    </Form.Item>
                                    <Form.Item {...tailLayout} name="counterOffers" valuePropName="checked">
                                        <Checkbox checked="true">Counter Offer</Checkbox>
                                    </Form.Item>

                                    {/* <Form.Item {...tailLayout}>
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
                                        <Input />
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
                                        label="DatePicker"
                                        name="expirationDate"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Expiration Date mm/dd/yyyy!',
                                            },
                                        ]}>
                                        <DatePicker />
                                    </Form.Item>

                                    <Form.Item {...tailLayout} name="splitOffers" valuePropName="checked" >
                                        <Checkbox checked="checked">Split Offer</Checkbox>
                                    </Form.Item>
                                    <Form.Item {...tailLayout} name="counterOffers" valuePropName="checked">
                                        <Checkbox checked="true">Counter Offer</Checkbox>
                                    </Form.Item>

                                    {/* <Form.Item {...tailLayout}>
                                    <Button type="primary" htmlType="submit">
                                        Submit
        </Button>
                                </Form.Item> */}
                                </Form>
                            </Modal>
                            <Divider />
                            <Table dataSource={this.state.allMyOffers} columns={columns} />
                        </div>
                    </Content>
                    <Footer></Footer>
                </Layout >
            </>
        )
    }
}
