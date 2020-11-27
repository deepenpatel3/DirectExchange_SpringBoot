package edu.sjsu.cmpe275.DirectExchange.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import edu.sjsu.cmpe275.DirectExchange.model.Offer;
import edu.sjsu.cmpe275.DirectExchange.repository.OfferRepository;

@Service
@Transactional
public class OfferService {

    @Autowired
    OfferRepository offerRepository;

    public Set<Offer> getAllOffers(long id) {
        return offerRepository.findOfferNotSelf(id);
    }

    public Optional<Offer> getOfferById(long id) {
        return offerRepository.findById(id);
    }

    public List<Offer> getOffersBySourceCurrency(String sourceCurrency) {
        return offerRepository.findOfferBySourceCurrency(sourceCurrency);
    }

    public Offer addOffer(Offer offer) {
        return offerRepository.save(offer);
    }

    public List<Offer> getOffersOfAUser(long id) {
        return offerRepository.findOfferByUserId(id);
    }

    public void deleteOffer(long id) {
        offerRepository.deleteById(id);
    }

}
