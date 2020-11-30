// package edu.sjsu.cmpe275.DirectExchange.model;

// import java.util.*;
// import javax.persistence.*;

// import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

// import java.io.Serializable;

// @Entity
// @Table(name = "CounterOffer")
// public class CounterOffer implements Serializable {

// @Id
// @GeneratedValue(strategy = GenerationType.IDENTITY)
// private long id;

// @JsonIgnoreProperties({ "counterOffers" })
// @ManyToOne
// private Offer mainOffer;

// @Column(nullable = false)
// private long userId;

// @Column(nullable = false)
// private String sourceCurrency;

// @Column(nullable = false)
// private String sourceCountry;

// @Column(nullable = false)
// private String destinationCurrency;

// @Column(nullable = false)
// private String destinationCountry;

// @Column(nullable = false)
// private int amountToRemit;

// @Column
// private String status = "pending";

// @Column()
// private boolean sent = false;

// public long getId() {
// return id;
// }

// public void setId(long id) {
// this.id = id;
// }

// public Offer getMainOffer() {
// return mainOffer;
// }

// public void setMainOffer(Offer mainOffer) {
// this.mainOffer = mainOffer;
// }

// public long getUserId() {
// return userId;
// }

// public void setUserId(long userId) {
// this.userId = userId;
// }

// public String getSourceCurrency() {
// return sourceCurrency;
// }

// public void setSourceCurrency(String sourceCurrency) {
// this.sourceCurrency = sourceCurrency;
// }

// public String getSourceCountry() {
// return sourceCountry;
// }

// public void setSourceCountry(String sourceCountry) {
// this.sourceCountry = sourceCountry;
// }

// public String getDestinationCurrency() {
// return destinationCurrency;
// }

// public void setDestinationCurrency(String destinationCurrency) {
// this.destinationCurrency = destinationCurrency;
// }

// public String getDestinationCountry() {
// return destinationCountry;
// }

// public void setDestinationCountry(String destinationCountry) {
// this.destinationCountry = destinationCountry;
// }

// public int getAmountToRemit() {
// return amountToRemit;
// }

// public void setAmountToRemit(int amountToRemit) {
// this.amountToRemit = amountToRemit;
// }

// public String getStatus() {
// return status;
// }

// public void setStatus(String status) {
// this.status = status;
// }

// public boolean isSent() {
// return sent;
// }

// public void setSent(boolean sent) {
// this.sent = sent;
// }
// }
