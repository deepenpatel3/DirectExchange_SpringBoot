package edu.sjsu.cmpe275.DirectExchange.model;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "Offer")
public class Offer implements Serializable {

	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@ManyToOne
	private User user;

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
	@Column
	private Date expirationDate;

	@Column(nullable = false)
	private float amountToRemit;

	@Column
	private boolean allowCounterOffer = false;

	@Column
	private boolean allowSplitExchange = false;

	@Column
	private String status = "open";

	@Column
	private boolean sent = false;

	@Column
	private boolean accepted = false;

	@Column
	private float remainingBalance = amountToRemit;

	// @JsonIgnoreProperties({ "counterOffers", "matchingOffers" })
	// @ManyToMany(cascade = CascadeType.PERSIST)
	// @JoinTable(name = "matchingOffer", joinColumns = { @JoinColumn(name =
	// "offer_id") }, inverseJoinColumns = {
	// @JoinColumn(name = "matching_offer_id") })
	@JsonIgnoreProperties({ "counterOffers", "matchingOffers", "parentOffer", "holdOffer" })
	@OneToMany
	@JoinTable(name = "offer_matching_offers", joinColumns = {
			@JoinColumn(name = "offer_id", referencedColumnName = "id") }, inverseJoinColumns = {
					@JoinColumn(name = "matching_offers_id", referencedColumnName = "id", unique = true) })
	private Set<Offer> matchingOffers;

	@Column(nullable = false)
	private boolean counterOfferOrNot = false;

	@JsonIgnoreProperties({ "counterOffers", "matchingOffers", "parentOffer", "holdOffer" })
	@OneToMany(mappedBy = "parentOffer")
	private Set<Offer> counterOffers;

	@JsonIgnoreProperties({ "counterOffers", "matchingOffers", "parentOffer", "holdOffer" })
	@ManyToOne()
	private Offer parentOffer;

	@JsonIgnoreProperties({ "counterOffers", "matchingOffers", "parentOffer", "holdOffer" })
	@OneToOne()
	private Offer holdOffer;

	public Offer getHoldOffer() {
		return holdOffer;
	}

	public void setHoldOffer(Offer holdOffer) {
		this.holdOffer = holdOffer;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
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

	public float getAmountToRemit() {
		return amountToRemit;
	}

	public void setAmountToRemit(float amountToRemit) {
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

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Set<Offer> getMatchingOffers() {
		return matchingOffers;
	}

	public void setMatchingOffers(Set<Offer> matchingOffers) {
		this.matchingOffers = matchingOffers;
	}

	public Set<Offer> getCounterOffers() {
		return counterOffers;
	}

	public void setCounterOffers(Set<Offer> counterOffers) {
		this.counterOffers = counterOffers;
	}

	public float getRemainingBalance() {
		return remainingBalance;
	}

	public void setRemainingBalance(float remainingBalance) {
		this.remainingBalance = remainingBalance;
	}

	public boolean isCounterOfferOrNot() {
		return counterOfferOrNot;
	}

	public void setCounterOfferOrNot(boolean counterOfferOrNot) {
		this.counterOfferOrNot = counterOfferOrNot;
	}

	public Offer getParentOffer() {
		return parentOffer;
	}

	public void setParentOffer(Offer parentOffer) {
		this.parentOffer = parentOffer;
	}

}
