package edu.sjsu.cmpe275.DirectExchange.service;

import java.util.Optional;
import java.util.Set;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.sjsu.cmpe275.DirectExchange.model.CounterOffer;
import edu.sjsu.cmpe275.DirectExchange.repository.CounterOfferRepository;

@Service
@Transactional
public class CounterOfferService {

    @Autowired
    CounterOfferRepository counterOfferRepository;

    public CounterOffer postCounterOffer(CounterOffer counterOffer) {
        return counterOfferRepository.save(counterOffer);
    }

    public Optional<CounterOffer> getCounterOffer(long id) {
        return counterOfferRepository.findById(id);
    }

    public Set<CounterOffer> getAllCounterOffersOfAnOffer(long id) {
        return counterOfferRepository.findCounterOfferByMainOfferId(id);
    }

    public void deleteCounterOffer(long id) {
        counterOfferRepository.deleteById(id);
    }
}
