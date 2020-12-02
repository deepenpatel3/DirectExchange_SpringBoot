package edu.sjsu.cmpe275.DirectExchange.model;

import java.util.*;
import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;

@Entity
@Table(name = "Transacation")
public class Transaction implements Serializable{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@OneToOne
	@JsonIgnoreProperties({ "matchingOffer" ,"mainOffer"})
	@JoinColumn(name = "offer", nullable = false)
	private Offer mainOffer;

	@OneToOne
	@JsonIgnoreProperties({ "matchingOffer" ,"mainOffer"})
	@JoinColumn(name = "offer", nullable = false)
	private Offer otherOffer;

	
	@Column(nullable = false)
	private Boolean paid = false;


	public Offer getMainOffer() {
		return mainOffer;
	}


	public void setMainOffer(Offer mainOffer) {
		this.mainOffer = mainOffer;
	}


	public Offer getOtherOffer() {
		return otherOffer;
	}


	public void setOtherOffer(Offer otherOffer) {
		this.otherOffer = otherOffer;
	}


	public Boolean getPaid() {
		return paid;
	}


	public void setPaid(Boolean paid) {
		this.paid = paid;
	}
}
