package edu.sjsu.cmpe275.DirectExchange.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import edu.sjsu.cmpe275.DirectExchange.model.Offer;
import edu.sjsu.cmpe275.DirectExchange.model.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

	// @Query(value = "Select * from transaction where main_offer = :id",
	// nativeQuery = true)
	List<Transaction> findTransactionByMainOfferId(long id);

	// List<Transaction> findTransactionByOtherOffer(Offer offer);

	List<Transaction> findTransactionById(long id);

	List<Transaction> findTransactionByPaid(Boolean status);

	// @Query(value = "Select * from transaction group by 'main_offer'", nativeQuery
	// = true)
	// List<Transaction> getSystemReport();

}
