//package edu.sjsu.cmpe275.DirectExchange.service;
//
//import java.util.List;
//import java.util.Optional;
//import java.util.Set;
//
//import javax.transaction.Transactional;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import edu.sjsu.cmpe275.DirectExchange.model.Offer;
//import edu.sjsu.cmpe275.DirectExchange.model.Transaction;
//import edu.sjsu.cmpe275.DirectExchange.repository.OfferRepository;
//import edu.sjsu.cmpe275.DirectExchange.repository.TransactionRepository;
//
//@Service
//@Transactional
//public class TransactionService {
//	@Autowired
//	TransactionRepository transactionRepository;
//	
//	public List<Transaction> getAllTransaction() {
//        return transactionRepository.findAllTransaction();
//    }
//
//    public Optional<Transaction> getTransactionById(long id) {
//        return transactionRepository.findById(id);
//    }
//
//    public List<Transaction> getOffersByOffer(Offer offer) {
//        return transactionRepository.findTransactionByOffer(offer);
//    }
//
//    public Transaction addTransaction(Offer offer) {
//        return transactionRepository.save(offer);
//    }
//
//    public void deleteOffer(long id) {
//    	transactionRepository.deleteById(id);
//    }
//}
