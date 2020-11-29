import React, { Component } from 'react';
import Navbar from './Reuse/Navbar';
import { Form, Input, Button, Checkbox, Layout, message, Table, Space, Modal, Divider } from 'antd';
import { EditFilled, DeleteFilled } from '@ant-design/icons';
import axios from "axios";

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

class BankAccounts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accounts: [],
            add: false,
            visible: false,
            text: {}
        }

    }



    async componentDidMount() {

        await this.getAccounts();
    }


    async getAccounts() {
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/bankAccount/${localStorage.getItem("id")}`)
            .then((res) => {
                console.log(res.data);
                this.setState({
                    accounts: res.data
                });
            });
    }

    delete = async(text) => {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/bankAccount/${text["accountNumber"]}`)
        .then((res) =>{
            message.success("Bank Account Deleted !!!")
            this.getAccounts();
        })
        .catch((e) => message.error("Error Deleting Account"))
    }

    update = async (text) => {
        await this.setState({
            visible: true,
            text: text
        })
    }

    onFinish = async(values) => {
        values["owner"] = { "id": localStorage.getItem("id") }
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/bankAccount`, values)
            .then(async(res) => {
                if (res.status === 201)
                    message.success("Bank Account Added");
                
                await this.getAccounts();

            })
            .catch((e) => {
                if (e.status === 400)
                    message.error("Bank Account Already Exist");
                else
                    console.log(e);
            });
        console.log('Success:', values);
    };

    onFinishUpdate = async (values) => {
        values["owner"] = { "id": localStorage.getItem("id") }
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/bankAccount`, values)
            .then(async(res) => {
                message.success("Bank Account Updated");
                await this.getAccounts();
            })
            .catch((e) => {
                console.log(e);
            });
        console.log('Success:', values);
    }

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    toggleForm = () => {
        if (this.state.add === true) {
            this.setState({
                add: false
            });
        }
        else {
            this.setState({
                add: true
            });
        }
    }
    render() {

        const columns = [
            {
                title: 'Account #',
                dataIndex: 'accountNumber',
                key: 'accountNumber',
            },
            {
                title: 'Bank Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Owner',
                dataIndex: 'ownerName',
                key: 'ownerName',
            },
            {
                title: 'Address',
                dataIndex: 'ownerAddress',
                key: 'ownerAddress',
            },
            {
                title: 'Country',
                dataIndex: 'country',
                key: 'country',
            },
            {
                title: 'Currency',
                dataIndex: 'primaryCurrency',
                key: 'primaryCurrency',
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <Space size="middle">
                        <Button onClick={() => { this.update(text) }}><EditFilled /></Button>
                        <Button onClick={() => {this.delete(text)}}><DeleteFilled /></Button>
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
                            title="Update Account"
                            visible={this.state.visible}
                            onCancel={async () => await this.setState({ visible: false, text: {} })}
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
                                    accountNumber: this.state.text['accountNumber'],
                                    name: this.state.text['name'],
                                    country: this.state.text['country'],
                                    ownerName: this.state.text['ownerName'],
                                    ownerAddress: this.state.text['ownerAddress'],
                                    primaryCurrency: this.state.text["primaryCurrency"],
                                    sending: this.state.text['sending'],
                                    receiving: this.state.text['receiving']
                                }}
                                onFinish={this.onFinishUpdate}
                                onFinishFailed={this.onFinishFailed}


                            >
                                <Form.Item
                                    label="Account Number"
                                    name="accountNumber"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Account Number!',
                                        },
                                    ]}

                                >
                                    <Input value={this.state.text["accountNumber"]} />
                                </Form.Item>
                                <Form.Item
                                    label="Bank Name"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Bank Name!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Country"
                                    name="country"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Country!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Account Holder Name"
                                    name="ownerName"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Account Holder Name!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Address"
                                    name="ownerAddress"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Owners Address!',
                                        },
                                    ]}
                                >
                                    <Input.TextArea />
                                </Form.Item>
                                <Form.Item
                                    label="Currency"
                                    name="primaryCurrency"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Currency!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item {...tailLayout} name="sending" valuePropName="checked" >
                                    <Checkbox checked="checked">sending</Checkbox>
                                </Form.Item>
                                <Form.Item {...tailLayout} name="receiving" valuePropName="checked">
                                    <Checkbox checked="true">receiving</Checkbox>
                                </Form.Item>

                                {/* <Form.Item {...tailLayout}>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item> */}
                            </Form>
                        </Modal>

                        <div className="site-layout-content" style={{ marginTop: "50px" }}>


                            <Button type="primary" htmlType="button" onClick={this.toggleForm}>Add an account</Button>
                            <Modal
                                title="Update Account"
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
                                id = "insertForm"
                                initialValues={{
                                    sending: true,
                                    receiving: true
                                }}
                                onFinish={this.onFinish}
                                onFinishFailed={this.onFinishFailed}
                                // style={{ display: this.state.add }}

                            >
                                <Form.Item
                                    label="Account Number"
                                    name="accountNumber"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Account Number!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Bank Name"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Bank Name!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Country"
                                    name="country"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Country!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Account Holder Name"
                                    name="ownerName"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Account Holder Name!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Address"
                                    name="ownerAddress"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Owners Address!',
                                        },
                                    ]}
                                >
                                    <Input.TextArea />
                                </Form.Item>
                                <Form.Item
                                    label="Currency"
                                    name="primaryCurrency"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Currency!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item {...tailLayout} name="sending" valuePropName="checked" >
                                    <Checkbox checked="checked">sending</Checkbox>
                                </Form.Item>
                                <Form.Item {...tailLayout} name="receiving" valuePropName="checked">
                                    <Checkbox checked="true">receiving</Checkbox>
                                </Form.Item>

                                {/* <Form.Item {...tailLayout}>
                                    <Button type="primary" htmlType="submit">
                                        Submit
        </Button>
                                </Form.Item> */}
                            </Form>
                            </Modal>
                            <Divider />
                            <Table dataSource={this.state.accounts} columns={columns} />
                        </div>

                    </Content>
                    <Footer></Footer>
                </Layout>


            </>
        );
    }
}

export default BankAccounts;