import React, { Component } from 'react'
import axios from "axios";
import Navbar from "./Reuse/Navbar";
import { Table, PageHeader } from 'antd';

export default class TransactionHistory extends Component {
    state = {
        myCompletedOffers: []
    }
    componentDidMount() {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/transactions/${localStorage.getItem("id")}`)
            .then(response => {
                console.log(response.data);
                this.setState({
                    myCompletedOffers: response.data
                });
            });
    }

    render() {
        const columns = [
            {
                title: 'Amount to Remit',
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
                title: 'Exchange Rate',
                dataIndex: 'exchangeRate',
                key: 'exchangeRate',
            }
        ]
        return (
            <div>
                <Navbar />
                <PageHeader
                    ghost={false}
                    title="Transaction History"
                ></PageHeader>
                <Table dataSource={this.state.myCompletedOffers} columns={columns} />
            </div>
        )
    }
}
