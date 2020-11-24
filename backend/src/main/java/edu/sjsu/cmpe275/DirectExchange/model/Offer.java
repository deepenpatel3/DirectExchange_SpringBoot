package edu.sjsu.cmpe275.DirectExchange.model;
import java.util.*;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "Offer")
public class Offer implements Serializable{

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
    private int exchangeRate;
	
	@Column(nullable = false)
    private Date expirationDate;
	
	@Column(nullable = false)
    private int amoutToRemit;
	
	@Column(columnDefinition = "BIT(1) default 1")
    private boolean allowCounterOffer;
	
	@Column(columnDefinition = "BIT(1) default 1")
    private boolean allowSplitExchange;
	
	@Column(columnDefinition = "varchar(255) default 'open'")
    private String status;
	
	@Column()
    private boolean sent;

//	@Column()
//  private boolean accepted;
	
//	@OneToMany(mappedBy = "id" )
//	private Set<Offer> counterOffers;
	
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

	public int getExchangeRate() {
		return exchangeRate;
	}

	public void setExchangeRate(int exchangeRate) {
		this.exchangeRate = exchangeRate;
	}

	public Date getExpirationDate() {
		return expirationDate;
	}

	public void setExpirationDate(Date expirationDate) {
		this.expirationDate = expirationDate;
	}

	public int getAmoutToRemit() {
		return amoutToRemit;
	}

	public void setAmoutToRemit(int amoutToRemit) {
		this.amoutToRemit = amoutToRemit;
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
	
}
