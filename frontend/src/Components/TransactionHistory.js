import React, { Component } from 'react'
import axios from "axios";
import Navbar from "./Reuse/Navbar";
import { Table, PageHeader } from 'antd';

export default class TransactionHistory extends Component {
    state = {
        myTransactions: []
    }
    componentDidMount() {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/transactionHistory/${localStorage.getItem("id")}`)
            .then(async response => {
                let myTransactions = [];
                await response.data.forEach(transaction => {
                    let obj = {};
                    obj.dateAndTime = new Date(transaction.transactionExpirationDate).toLocaleString();
                    if (transaction.mainOffer.user.id === Number(localStorage.getItem("id"))) {
                        obj.sourceCurrencyAmount = transaction.mainOffer.amountToRemit;
                        obj.destinationCurrencyAmount = transaction.mainOffer.amountToRemit * transaction.mainOffer.exchangeRate;
                        obj.exchangeRate = transaction.mainOffer.exchangeRate;
                        obj.sourceCurrency = transaction.mainOffer.sourceCurrency;
                        obj.destinationCurrency = transaction.mainOffer.destinationCurrency;
                        obj.status = transaction.status;
                        obj.serviceFee = (transaction.mainOffer.amountToRemit * 0.0005) + ` ${obj.sourceCurrency}`;
                    } else {
                        obj.status = transaction.status;
                        obj.sourceCurrencyAmount = transaction.otherOffer.amountToRemit;
                        obj.destinationCurrencyAmount = transaction.otherOffer.amountToRemit * transaction.otherOffer.exchangeRate;
                        obj.exchangeRate = transaction.otherOffer.exchangeRate;
                        obj.sourceCurrency = transaction.otherOffer.sourceCurrency;
                        obj.destinationCurrency = transaction.otherOffer.destinationCurrency;
                        obj.serviceFee = (transaction.otherOffer.amountToRemit * 0.0005) + ` ${obj.sourceCurrency}`;
                    }
                    myTransactions.push(obj);
                });
                this.setState({
                    myTransactions: myTransactions
                });
            });
    }

    render() {
        const columns = [
            {
                title: 'Date and Time',
                dataIndex: 'dateAndTime',
                key: 'dateAndTime',
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
                title: 'Source Country Amount',
                dataIndex: 'sourceCurrencyAmount',
                key: 'sourceCurrencyAmount',
            },
            {
                title: 'Destination Country Amount',
                dataIndex: 'destinationCurrencyAmount',
                key: 'destinationCurrencyAmount',
            },
            {
                title: 'Exchange Rate',
                dataIndex: 'exchangeRate',
                key: 'exchangeRate',
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
            },
            {
                title: 'Service Fee',
                dataIndex: 'serviceFee',
                key: 'serviceFee',
            }
        ]
        return (
            <div>
                <Navbar />
                <PageHeader
                    ghost={false}
                    title="Transaction History"
                ></PageHeader>
                <Table dataSource={this.state.myTransactions} columns={columns} pagination={{ defaultPageSize: 10 }} />
            </div>
        )
    }
}
