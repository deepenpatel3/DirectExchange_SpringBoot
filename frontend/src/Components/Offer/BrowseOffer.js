import React, { Component } from 'react';
import axios from "axios";
import Navbar from "../Reuse/Navbar";
import { Card, Col, Row } from 'antd';
import { Link } from "react-router-dom";

export default class BrowseOffer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allOffers: []
        }
    }

    async componentDidMount() {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/offer/all/` + localStorage.getItem("id"))
            .then(response => {
                console.log(response.data);
                this.setState({
                    allOffers: response.data
                })
            })
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
                window.location.assign("/browseOffer");
            })
    }
    render() {

        if (this.state.allOffers.length === 0) {
            return (
                <div>
                    <Navbar />
                    <h1>No offers to show...</h1>
                </div>
            )
        } else {
            return (
                <div>
                    <Navbar />
                    <div className="container">
                        <h1>Offers:</h1>

                        {this.state.allOffers.map(offer =>
                            <Card span={8} title="Default size card" extra={<Link to={{ pathname: "/offer", state: { offer: offer } }} >More</Link>}>
                                <p>{offer.amountToRemit}: {offer.sourceCurrency} to {offer.destinationCurrency}</p>
                                <span className="badge badge-primary">
                                    <span style={{ fontSize: "15px" }}>Split</span>
                                    {offer.allowSplitExchange ?
                                        <svg width="2em" height="1.5em" viewBox="5 5 -16 -12" class="bi bi-check" fill="white" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z" />
                                        </svg> :
                                        <svg width="2em" height="1.5em" viewBox="5 5 -16 -12" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                        </svg>}
                                </span>
                                <span className="badge badge-primary">
                                    <span style={{ fontSize: "15px" }}>Counter Offer</span>
                                    {offer.allowCounterOffer ?
                                        <svg width="2em" height="1.5em" viewBox="5 5 -16 -12" class="bi bi-check" fill="white" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z" />
                                        </svg> :
                                        <svg width="2em" height="1.5em" viewBox="5 5 -16 -12" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                        </svg>}
                                </span>
                            </Card>
                        )}
                    </div>
                </div>
            )
        }

    }
}
