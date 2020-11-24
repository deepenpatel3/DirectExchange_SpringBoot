//package edu.sjsu.cmpe275.DirectExchange.model;
//import java.util.*;
//import javax.persistence.*;
//import java.io.Serializable;
//
//@Entity
//@Table(name = "CounterOffer")
//public class CounterOffer implements Serializable{
//	
//	@Id
//	@GeneratedValue(strategy = GenerationType.IDENTITY)
//	private long id;
//	
//	@Column(nullable = false)
//    private long userId;
//	
//	@Column(nullable = false)
//    private String sourceCurrency;
//	
//	@Column(nullable = false)
//    private String sourceCountry;
//	
//	@Column(nullable = false)
//    private String destinationCurrency;
//	
//	@Column(nullable = false)
//    private String destinationCountry;
//	
//	@Column(nullable = false)
//    private int amoutToRemit;
//	
//	@Column(columnDefinition = "BIT(1) default 1")
//    private boolean allowCounterOffer;
//	
//	@Column(columnDefinition = "BIT(1) default 1")
//    private boolean allowSplitExchange;
//	
//	@Column(columnDefinition = "varchar(255) default 'open'")
//    private String status;
//	
//	@Column()
//    private boolean sent;
//}
