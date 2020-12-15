import React, { Component } from 'react';
import axios from "axios";
import Navbar from "./Reuse/Navbar";
import { Button, Space, Row, Col, Card, Statistic, } from "antd";
import { CloseOutlined, CheckOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import Title from 'antd/lib/skeleton/Title';

export default class FinancialReport extends Component {
    state = {
        stats: {}
    }

    async componentDidMount() {
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/systemReport`)
            .then(async response => {
                console.log("sys report ", response.data);
                this.setState({ stats: response.data })
            })
    }

    render() {
        return (
            <div>
                <Navbar />
                <div className="container" style={{ marginTop: "20px" }}>
                    <h4>System wide Transaction report:</h4>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Card>
                                <Statistic
                                    title="Completed Transactions"
                                    value={this.state.stats.completed}

                                    valueStyle={{ color: '#3f8600' }}
                                // prefix={<ArrowUpOutlined />}

                                />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card>
                                <Statistic
                                    title="Unfinished Transactions"
                                    value={this.state.stats.unCompleted}

                                    valueStyle={{ color: '#cf1322' }}
                                // prefix={<ArrowDownOutlined />}

                                />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card>
                                <Statistic
                                    title="Total Remitted amount(in USD)"
                                    value={this.state.stats.remittedAmount}
                                    precision={2}
                                    valueStyle={{ color: '#3474eb' }}
                                // prefix={<ArrowDownOutlined />}

                                />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card>
                                <Statistic
                                    title="Total service Fee(in USD)"
                                    value={this.state.stats.serviceFee}
                                    precision={2}
                                    valueStyle={{ color: '#3474eb' }}
                                // prefix={<ArrowDownOutlined />}

                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}
