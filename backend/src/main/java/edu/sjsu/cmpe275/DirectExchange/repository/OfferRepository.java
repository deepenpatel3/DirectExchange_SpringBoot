package edu.sjsu.cmpe275.DirectExchange.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.sjsu.cmpe275.DirectExchange.model.Offer;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {

    List<Offer> findOfferBySourceCurrency(String sourceCurrency);

    List<Offer> findOfferByUserId(long id);
}
