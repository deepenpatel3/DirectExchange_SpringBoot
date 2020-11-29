//package edu.sjsu.cmpe275.DirectExchange.model;
//
//import java.util.*;
//import javax.persistence.*;
//import com.fasterxml.jackson.annotation.JsonFormat;
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
//
//import java.io.Serializable;
//
//@Entity
//@Table(name = "Transacation")
//public class Transaction implements Serializable{
//	@Id
//	@GeneratedValue(strategy = GenerationType.IDENTITY)
//	private long id;
//
//	@OneToMany(fetch = FetchType.LAZY)
//	@JsonIgnoreProperties({ "matchingOffer" ,"mainOffer"})
//	@JoinColumn(name = "offer", nullable = false)
//	private Offer offer;
//
//	@Column(nullable = false)
//	private Boolean paid = false;
//}
