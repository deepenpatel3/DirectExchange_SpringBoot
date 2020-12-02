package edu.sjsu.cmpe275.DirectExchange.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.sjsu.cmpe275.DirectExchange.model.Offer;
import edu.sjsu.cmpe275.DirectExchange.model.Transaction;
import edu.sjsu.cmpe275.DirectExchange.repository.OfferRepository;
import edu.sjsu.cmpe275.DirectExchange.repository.TransactionRepository;

@Service
@Transactional
public class TransactionService {
    @Autowired
    TransactionRepository transactionRepository;

    public List<Transaction> getAllTransaction() {
        return transactionRepository.findAll();
    }

    public Optional<Transaction> getTransactionById(long id) {
        return transactionRepository.findById(id);
    }

    public List<Transaction> getTransactionByPaid(Boolean status) {
        return transactionRepository.findTransactionByPaid(status);
    }

    public List<Transaction> getMainOffers(Offer offer) {
        return transactionRepository.findTransactionByMainOffer(offer);
    }

    public List<Transaction> getOtherOffers(Offer offer) {
        return transactionRepository.findTransactionByOtherOffer(offer);
    }

    public Transaction addTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

}
