package edu.sjsu.cmpe275.DirectExchange.model;

import java.util.*;
import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;

@Entity
@Table(name = "Offer")
public class Offer implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@Column(nullable = false)
	private long userId;

	@Column(nullable = false)
	private String sourceCurrency;

	@Column(nullable = false)
	private String sourceCountry;

	@Column(nullable = false)
	private String destinationCurrency;

	@Column(nullable = false)
	private String destinationCountry;

	@Column(nullable = false)
	private float exchangeRate;

	@JsonFormat(pattern = "yyyy-MM-dd")
	@Column(nullable = false)
	private Date expirationDate;

	@Column(nullable = false)
	private int amountToRemit;

	@Column
	private boolean allowCounterOffer;

	@Column
	private boolean allowSplitExchange;

	@Column
	private String status = "open";

	@Column
	private boolean sent = false;

	@Column
	private boolean accepted = false;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "matching_offer_id", nullable = true)
	private Offer matchingOffer;
	
	@JsonIgnoreProperties({ "mainOffer" })
	@OneToMany(mappedBy = "mainOffer")
	private Set<CounterOffer> counterOffers;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getUserId() {
		return userId;
	}

	public void setUserId(long userId) {
		this.userId = userId;
	}

	public String getSourceCurrency() {
		return sourceCurrency;
	}

	public void setSourceCurrency(String sourceCurrency) {
		this.sourceCurrency = sourceCurrency;
	}

	public String getSourceCountry() {
		return sourceCountry;
	}

	public void setSourceCountry(String sourceCountry) {
		this.sourceCountry = sourceCountry;
	}

	public String getDestinationCurrency() {
		return destinationCurrency;
	}

	public void setDestinationCurrency(String destinationCurrency) {
		this.destinationCurrency = destinationCurrency;
	}

	public String getDestinationCountry() {
		return destinationCountry;
	}

	public void setDestinationCountry(String destinationCountry) {
		this.destinationCountry = destinationCountry;
	}

	public float getExchangeRate() {
		return exchangeRate;
	}

	public void setExchangeRate(float exchangeRate) {
		this.exchangeRate = exchangeRate;
	}

	public Date getExpirationDate() {
		return expirationDate;
	}

	public void setExpirationDate(Date expirationDate) {
		this.expirationDate = expirationDate;
	}

	public int getAmountToRemit() {
		return amountToRemit;
	}

	public void setAmountToRemit(int amountToRemit) {
		this.amountToRemit = amountToRemit;
	}

	public boolean isAllowCounterOffer() {
		return allowCounterOffer;
	}

	public void setAllowCounterOffer(boolean allowCounterOffer) {
		this.allowCounterOffer = allowCounterOffer;
	}

	public boolean isAllowSplitExchange() {
		return allowSplitExchange;
	}

	public void setAllowSplitExchange(boolean allowSplitExchange) {
		this.allowSplitExchange = allowSplitExchange;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public boolean isSent() {
		return sent;
	}

	public void setSent(boolean sent) {
		this.sent = sent;
	}

	public boolean isAccepted() {
		return accepted;
	}

	public void setAccepted(boolean accepted) {
		this.accepted = accepted;
	}

	public Set<CounterOffer> getCounterOffers() {
		return counterOffers;
	}

	public void setCounterOffers(Set<CounterOffer> counterOffers) {
		this.counterOffers = counterOffers;
	}

	public Offer getMatchingOffer() {
		return matchingOffer;
	}

	public void setMatchingOffer(Offer matchingOffer) {
		this.matchingOffer = matchingOffer;
	}

}
