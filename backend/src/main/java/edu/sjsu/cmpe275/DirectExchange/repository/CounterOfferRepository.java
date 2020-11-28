package edu.sjsu.cmpe275.DirectExchange.repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import edu.sjsu.cmpe275.DirectExchange.model.CounterOffer;

public interface CounterOfferRepository extends JpaRepository<CounterOffer, Long> {

    Set<CounterOffer> findCounterOfferByMainOfferId(long id);
}
