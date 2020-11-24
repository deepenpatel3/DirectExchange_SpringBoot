package edu.sjsu.cmpe275.DirectExchange.model;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "BankAccount")
public class BankAccount implements Serializable {

    // @Id
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    // private long id;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long accountNumber;

    @Column(name = "name")
    private String name;

    @Column(name = "country")
    private String country;

    @Column(name = "ownerName")
    private String ownerName;

    @ManyToOne
    private User owner;

    @Column(name = "ownerAddress")
    private String ownerAddress;

    @Column(name = "primaryCurrency")
    private String primaryCurrency;

    @Column(name = "sending")
    private boolean sending;

    @Column(name = "receiving")
    private boolean receiving;
}
