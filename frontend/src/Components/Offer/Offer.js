import { Card, Row } from 'antd';
import React, { Component } from 'react';
import Navbar from "../Reuse/Navbar";
import axios from "axios";

export default class Offer extends Component {

    state = {
        offer: this.props.location.state.offer
    }

    postOffer = (args) => {
        let data = {
            amountToRemit: document.getElementById("counterOfferAmount").value,
            userId: localStorage.getItem("id"),
            mainOffer: {
                id: args.offerId
            },
            sourceCountry: args.sourceCountry,
            destinationCountry: args.destinationCountry,
            sourceCurrency: args.sourceCurrency,
            destinationCurrency: args.destinationCurrency
        }
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/offer/counterOffer`, data)
            .then(response => {
                alert(response.data);
                window.location.reload();
            })
    }

    render() {
        return (
            <div>
                <Navbar />
                <div className=" container site-card-wrapper" style={{ marginTop: "50px" }}>
                    <Card title="Offer Details" bordered={false} style={{ boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)" }}>
                        <div className="row">
                            <div className="col-4">
                                <Card style={{ borderRight: "1px solid black" }} bordered={false}>
                                    Amount:<b>{this.state.offer.amountToRemit}</b><br />
                                    <b>{this.state.offer.sourceCurrency}<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-right-short" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z" />
                                    </svg> {this.state.offer.destinationCurrency}</b>
                                    <Row>
                                        Exchange rate: 1 {this.state.offer.sourceCurrency} = {this.state.offer.exchangeRate} {this.state.offer.destinationCurrency}
                                    </Row>
                                    <Row>
                                        Expires on: {new Date(this.state.offer.expirationDate).getMonth() + 1} - {new Date(this.state.offer.expirationDate).getDate() + 1} - {new Date(this.state.offer.expirationDate).getFullYear()}
                                    </Row>
                                    <Row>
                                        <span className="badge badge-primary">
                                            <span style={{ fontSize: "15px" }}>Split</span>
                                            {this.state.offer.allowSplitExchange ?
                                                <svg width="2em" height="1.5em" viewBox="5 5 -16 -12" class="bi bi-check" fill="white" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z" />
                                                </svg> :
                                                <svg width="2em" height="1.5em" viewBox="5 5 -16 -12" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                                </svg>}
                                        </span>
                                        <span className="badge badge-primary">
                                            <span style={{ fontSize: "15px" }}>Counter Offer</span>
                                            {this.state.offer.allowCounterOffer ?
                                                <svg width="2em" height="1.5em" viewBox="5 5 -16 -12" class="bi bi-check" fill="white" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z" />
                                                </svg> :
                                                <svg width="2em" height="1.5em" viewBox="5 5 -16 -12" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                                </svg>}
                                        </span>
                                    </Row>
                                </Card>
                            </div>
                            <div className="col-8">
                                <Card bordered={false}>
                                    <h2>Counter Offers:</h2>
                                    {this.state.offer.counterOffers.length > 0 ? this.state.offer.counterOffers.map(counterOffer => {
                                        if (counterOffer.status === "accepted") {
                                            return (
                                                <li className="list-group-item">
                                                    <p>{counterOffer.amountToRemit}: {counterOffer.sourceCurrency} to {counterOffer.destinationCurrency}</p>
                                                </li>
                                            )
                                        }
                                    }) : <h4 style={{ color: "grey" }}>No counter offers present. </h4>}
                                </Card>
                                {this.state.offer.allowCounterOffer ? <form className="input-group" onSubmit={(e) => (e.preventDefault(), this.postOffer({ userId: 1, offerId: this.state.offer.destinationCountry, destinationCountry: this.state.offer.sourceCountry, sourceCurrency: this.state.offer.destinationCurrency, destinationCurrency: this.state.offer.sourceCurrency }))}>
                                    Post your counter offer:
                                    <input type="number" class="form-control" id="counterOfferAmount" placeholder="Enter your counter offer amount" />
                                    <button type="submit" class="btn btn-primary">Post</button>
                                </form> : null}
                            </div>
                        </div>
                    </Card>
                </div >
            </div >
        )
    }
}