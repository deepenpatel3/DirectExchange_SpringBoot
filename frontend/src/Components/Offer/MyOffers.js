import React, { Component } from 'react';
import Navbar from '../Reuse/Navbar';
import axios from "axios";
import { Col, Row, Card } from 'antd';

export default class MyOffers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allMyOffers: [],
            countries: []
        }
    }

    async componentDidMount() {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/offer/` + localStorage.getItem("id"))
            .then(response => {
                console.log(response.data);
                this.setState({
                    allMyOffers: response.data
                })
            })
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/bankAccount/` + localStorage.getItem("id"))
            .then(async response => {
                console.log("accounts ", response.data);
                let countries = await response.data.map(bankAccount => bankAccount.country);
                console.log("countries ", countries);
                this.setState({
                    countries: countries
                })
            })
    }

    acceptCounterOffer = (counterOfferId) => {
        console.log("accepting counter off");
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/offer/counterOffer/split/accept/` + counterOfferId)
            .then(response => {
                alert(response.data);
                window.location.assign("/myOffers");
            })
    }

    rejectCounterOffer = (counterOfferId) => {
        console.log("deleting counter off");
        axios.delete(`${process.env.REACT_APP_BACKEND_URL}/offer/counterOffer/` + counterOfferId)
            .then(response => {
                alert(response.data);
                window.location.assign("/myOffers");
            })
    }

    postOffer = async (event) => {
        event.preventDefault();

        let data = {
            amountToRemit: document.getElementById("amount").value,
            sourceCurrency: document.getElementById("sourceCurrency").value,
            sourceCountry: document.getElementById("sourceCountry").value,
            exchangeRate: document.getElementById("exchangeRate").value,
            destinationCurrency: document.getElementById("destinationCurrency").value,
            destinationCountry: document.getElementById("destinationCountry").value,
            expirationDate: document.getElementById("expirationDate").value,
            allowSplitExchange: document.getElementById("splitOffers").checked,
            allowCounterOffer: document.getElementById("counterOffers").checked,
            userId: localStorage.getItem("id")
        }
        console.log(data);
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/offer/`, data)
            .then(response => {
                alert(response.data);
                window.location.assign("/myOffers");
            })
    }

    deleteOffer = async (offerId) => {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/offer/` + offerId)
            .then(response => {
                alert(response.data);
                window.location.assign("/myOffers");
            })
    }

    updateOffer = async (offer) => {
        offer.amountToRemit = document.getElementById("amount" + offer.id).value;
        offer.exchangeRate = document.getElementById("exchangeRate" + offer.id).value;
        offer.expirationDate = document.getElementById("expirationDate" + offer.id).value;
        offer.allowCounterOffer = document.getElementById("counterOffers" + offer.id).checked;
        offer.allowSplitExchange = document.getElementById("splitOffers" + offer.id).checked;

        console.log("offer ", offer);
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/offer`, offer)
            .then(response => {
                alert(response.data);
                window.location.assign("/myOffers");
            })
    }

    render() {
        return (
            <div>
                <Navbar />
                <div className="container">
                    <h1>My Offers:</h1>
                    <div className="row">
                        <div className="col-3">
                            <img src="https://api-private.atlassian.com/users/8f525203adb5093c5954b43a5b6420c2/avatar" alt="Avatar" class="avatar" />
                            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#postOfferModal">Post Offer</button>

                            <div class="modal fade" id="postOfferModal" tabindex="-1" role="dialog" aria-labelledby="postOfferModalLabel" aria-hidden="true">
                                <div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="postOfferModalLabel">Post Offer</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <form onSubmit={this.postOffer}>
                                                <div class="form-row">
                                                    <div class="form-group col-md-4">
                                                        <label for="amount">Amount to Remit</label>
                                                        <input type="number" class="form-control" id="amount" placeholder="Amount" />
                                                    </div>
                                                    <div class="form-group col-md-4">
                                                        <label for="sourceCurrency">Source Currency</label>
                                                        <input type="text" class="form-control" id="sourceCurrency" placeholder="Source Currency" />
                                                    </div>
                                                    <div class="form-group col-md-4">
                                                        <label for="destinationCurrency">Destination Currency</label>
                                                        <input type="text" class="form-control" id="destinationCurrency" placeholder="Dest. Currency" />
                                                    </div>
                                                </div>
                                                <div class="form-row">
                                                    <div class="form-group col-md-4">
                                                        <label for="exchangeRate">Exchange rate</label>
                                                        <input type="number" class="form-control" id="exchangeRate" placeholder="Exchange rate" />
                                                    </div>
                                                    <div class="form-group col-md-4">
                                                        <label for="sourceCountry">Source Country</label>
                                                        <select class="form-control" id="sourceCountry" placeholder="Source country">
                                                            {this.state.countries.map(country =>
                                                                <option>{country}</option>
                                                            )}
                                                        </select>
                                                        {/* <input type="text" class="form-control" id="sourceCountry" placeholder="Source Country" /> */}
                                                    </div>
                                                    <div class="form-group col-md-4">
                                                        <label for="destinationCountry">Destination Country</label>
                                                        <select class="form-control" id="destinationCountry" placeholder="Dest. country">
                                                            {this.state.countries.map(country =>
                                                                <option>{country}</option>
                                                            )}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="form-row">
                                                    <div class="form-group">
                                                        <label for="expirationDate">Expiration Date</label>
                                                        <input type="date" class="form-control" id="expirationDate" />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="splitOffers" defaultChecked={true} />
                                                        <label class="form-check-label" for="splitOffers">
                                                            Split offers
                                                        </label>
                                                    </div>
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="counterOffers" defaultChecked={true} />
                                                        <label class="form-check-label" for="counterOffers">
                                                            Counter Offers
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="submit" class="btn btn-primary">Post</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-9">

                            {this.state.allMyOffers.map(offer =>
                                <Card title={`${offer.amountToRemit} : ${offer.sourceCurrency} to ${offer.destinationCurrency}`}
                                    extra={
                                        <div>
                                            <button className="btn-danger" onClick={() => this.deleteOffer(offer.id)}>Delete</button>
                                            {offer.counterOffers.length === 0 && offer.matchingOffer == null}<button className="btn-success" data-toggle="modal" data-target={"#updateOfferModal" + offer.id} >Update</button>
                                        </div>}>
                                    <div class="modal fade" id={"updateOfferModal" + offer.id} tabindex="-1" aria-labelledby={"updateOfferModalLabel" + offer.id} aria-hidden="true">
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title" id={"updateOfferModal" + offer.id}>Update Offer</h5>
                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div class="modal-body">
                                                    <div class="modal-footer">
                                                        <form onSubmit={(e) => { e.preventDefault(); this.updateOffer(offer) }}>
                                                            <div class="form-row">
                                                                <div class="form-group col-md-4">
                                                                    <label for="amount">Amount to Remit</label>
                                                                    <input type="number" class="form-control" id={"amount" + offer.id} placeholder="Amount" defaultValue={offer.amountToRemit} />
                                                                </div>
                                                                <div class="form-group col-md-3">
                                                                    <label for="exchangeRate">Exchange rate</label>
                                                                    <input type="number" class="form-control" id={"exchangeRate" + offer.id} placeholder="Exchange rate" defaultValue={offer.exchangeRate} />
                                                                </div>
                                                                <div class="form-group col-md-5">
                                                                    <label for="expirationDate">Expiration Date</label>
                                                                    <input type="date" class="form-control" id={"expirationDate" + offer.id} defaultValue={offer.expirationDate} />
                                                                </div>
                                                            </div>
                                                            <div class="form-group">
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="checkbox" id={"splitOffers" + offer.id} defaultChecked={offer.allowSplitExchange} />
                                                                    <label class="form-check-label" for="splitOffers">
                                                                        Split offers
                                                                    </label>
                                                                </div>
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="checkbox" id={"counterOffers" + offer.id} defaultChecked={offer.allowCounterOffer} />
                                                                    <label class="form-check-label" for="counterOffers">
                                                                        Counter Offers
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div class="modal-footer">
                                                                <button type="submit" class="btn btn-primary">Update</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                                    <div className="float-right">
                                        {offer.allowCounterOffer ? <button class="btn btn-primary " data-toggle="modal" data-target={"#counterOfferModal" + offer.id} >Counter Offers</button> : null}
                                    </div>
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
                                                        return (
                                                            <li className="list-group-item">
                                                                <button className="btn btn-dark float-right">Message</button>
                                                                <p>{counterOffer.amountToRemit}: {counterOffer.sourceCurrency} to {counterOffer.destinationCurrency}</p>
                                                                {counterOffer.status === "accepted" ? <button className="btn-success" disabled>Accepted</button> : null}
                                                                {counterOffer.status === "pending" ?
                                                                    <div>
                                                                        <button className="btn-success" onClick={() => this.acceptCounterOffer(counterOffer.id)}>
                                                                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                                <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z" />
                                                                            </svg>
                                                                        </button>
                                                                        <button className="btn-danger" onClick={() => this.rejectCounterOffer(counterOffer.id)}>
                                                                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                                <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                    : null}
                                                            </li>
                                                        )
                                                    }) : <h3>No counter offers present. </h3>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}