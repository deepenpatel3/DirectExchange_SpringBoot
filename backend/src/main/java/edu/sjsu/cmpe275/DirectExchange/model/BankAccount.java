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
    private long accountNumber;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "country", nullable = false)
    private String country;

    @Column(name = "ownerName", nullable = false)
    private String ownerName;

    @ManyToOne
    private User owner;

    @Column(name = "ownerAddress", nullable = false)
    private String ownerAddress;

    @Column(name = "primaryCurrency", nullable = false)
    private String primaryCurrency;

    @Column(name = "sending", nullable = false)
    private Boolean sending;

    @Column(name = "receiving", nullable = false)
    private Boolean receiving;

    public long getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(long accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public String getOwnerAddress() {
        return ownerAddress;
    }

    public void setOwnerAddress(String ownerAddress) {
        this.ownerAddress = ownerAddress;
    }

    public String getPrimaryCurrency() {
        return primaryCurrency;
    }

    public void setPrimaryCurrency(String primaryCurrency) {
        this.primaryCurrency = primaryCurrency;
    }

    public Boolean isSending() {
        return sending;
    }

    public void setSending(Boolean sending) {
        this.sending = sending;
    }

    public Boolean isReceiving() {
        return receiving;
    }

    public void setReceiving(Boolean receiving) {
        this.receiving = receiving;
    }

}
