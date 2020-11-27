package edu.sjsu.cmpe275.DirectExchange.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import edu.sjsu.cmpe275.DirectExchange.model.Offer;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {

    List<Offer> findOfferBySourceCurrency(String sourceCurrency);

    List<Offer> findOfferByUserId(long id);

    @Query(value = "Select * from Offer Where user_id != :id and status = 'open'", nativeQuery = true)
    Set<Offer> findOfferNotSelf(@Param("id") long id);

}
