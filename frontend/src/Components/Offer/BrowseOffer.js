import React, { Component } from 'react';
import axios from "axios";
import Navbar from "../Reuse/Navbar";

export default class BrowseOffer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allOffers: []
        }
    }

    async componentDidMount() {
        axios.get("http://localhost:8080/offer")
            .then(response => {
                console.log(response.data);
                this.setState({
                    allOffers: response.data
                })
            })
    }

    postOffer = (args) => {
        console.log("waah " + args["sourceCurrency"]);
        let data = {
            amountToRemit: document.getElementById("counterOfferAmount").value,
            userId: 1,
            mainOffer: {
                id: args.offerId
            },
            sourceCountry: args.sourceCountry,
            destinationCountry: args.destinationCountry,
            sourceCurrency: args.sourceCurrency,
            destinationCurrency: args.destinationCurrency
        }
        axios.post("http://localhost:8080/offer/counterOffer", data)
            .then(response => {
                console.log(response);
            })
    }
    render() {


        if (this.state.allOffers.length === 0) {
            return (
                <div>
                    <Navbar />
                    <h1>Loading...</h1>
                </div>
            )
        } else {
            return (
                <div>
                    <Navbar />
                    <div className="container">
                        <h1>Offers:</h1>
                        <ul className="list-group">
                            {this.state.allOffers.map(offer =>
                                <li className="list-group-item">
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
                                    {offer.allowCounterOffer ? <button class="btn btn-primary float-right" data-toggle="modal" data-target={"#counterOfferModal" + offer.id} >Counter Offers</button> : null}

                                    <div class="modal fade" id={"counterOfferModal" + offer.id} tabindex="-1" role="dialog" aria-labelledby={"counterOfferModalLabel" + offer.id} aria-hidden="true">
                                        <div class="modal-dialog" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title" id={"counterOfferModalLabel" + offer.id}>Counter Offer</h5>
                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div class="modal-body">
                                                    {offer.counterOffers.length > 0 ? offer.counterOffers.map(counterOffer => {
                                                        if (counterOffer.status === "accepted") {
                                                            return (
                                                                <li className="list-group-item">
                                                                    <p>{counterOffer.amountToRemit}: {counterOffer.sourceCurrency} to {counterOffer.destinationCurrency}</p>
                                                                </li>
                                                            )
                                                        }
                                                    }
                                                    ) : <h3>No counter offers present. </h3>}

                                                Post your counter offer:
                                                {/* {parseInt(offer.amountToRemit) - parseInt(counterOffer.amountToRemit) - (parseInt(offer.amountToRemit) * 0.1)} and {parseInt(offer.amountToRemit) - parseInt(counterOffer.amountToRemit) + (parseInt(offer.amountToRemit) * 0.1)} */}
                                                    { }
                                                    <form className="input-group" onSubmit={(e) => (e.preventDefault(), this.postOffer({ userId: 1, offerId: offer.id, sourceCountry: offer.destinationCountry, destinationCountry: offer.sourceCountry, sourceCurrency: offer.destinationCurrency, destinationCurrency: offer.sourceCurrency }))}>
                                                        <input type="number" class="form-control" id="counterOfferAmount" placeholder="Enter your counter offer amount" />
                                                        <button type="submit" class="btn btn-primary">Post</button>
                                                    </form>
                                                    <p id="counterOfferWarning" style={{ display: "none" }}></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            )
        }

    }
}
