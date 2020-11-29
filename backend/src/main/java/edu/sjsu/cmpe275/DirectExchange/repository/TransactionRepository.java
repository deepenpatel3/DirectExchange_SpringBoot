//package edu.sjsu.cmpe275.DirectExchange.repository;
//
//import java.util.List;
//import java.util.Optional;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import edu.sjsu.cmpe275.DirectExchange.model.Offer;
//import edu.sjsu.cmpe275.DirectExchange.model.Transaction;
//
//public interface TransactionRepository extends JpaRepository<Transaction, Long>{
//	
//	
//	List<Transaction> findTransactionByOffer(Offer offer);
//
//	List<Transaction> findAllTransaction();
//
//    List<Transaction> findTransactionById(long id);
//
//	Transaction save(Offer offer);
//}
