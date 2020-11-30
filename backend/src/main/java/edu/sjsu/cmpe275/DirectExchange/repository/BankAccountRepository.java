package edu.sjsu.cmpe275.DirectExchange.repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import edu.sjsu.cmpe275.DirectExchange.model.BankAccount;
//import edu.sjsu.cmpe275.DirectExchange.model.Offer;

@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount, Long>{
	
	@Query(value = "Select * from Bank_Account Where owner_id = :id and country = :country and sending = 1", nativeQuery = true)
    Set<BankAccount> canSend(@Param("id") long id, @Param("country") String country);

	@Query(value = "Select * from Bank_Account Where owner_id = :id and country = :country and receiving = 1", nativeQuery = true)
    Set<BankAccount> canReceive(@Param("id") long id, @Param("country") String country);
}
