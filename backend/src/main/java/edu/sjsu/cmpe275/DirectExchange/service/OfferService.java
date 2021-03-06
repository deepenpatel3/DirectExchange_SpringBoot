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

    public Set<Offer> getCompletedOffers(long id) {
        return offerRepository.findCompletedOfferOfAUser(id);
    }

    public Set<Offer> getOffersBySourceCurrency(long id, String sourceCurrency) {
        return offerRepository.findOfferBySourceCurrency(id, sourceCurrency);
    }

    public Set<Offer> getOffersByDestinationCurrency(long id, String destinationCurrency) {
        return offerRepository.findOfferByDestinationCurrency(id, destinationCurrency);
    }

    public List<Offer> getAllExactMatchingOffer(long id, float matchingAmount, String sourceCountry,
            String destinationCountry) {
        return offerRepository.findExactMatchingOffer(id, matchingAmount, sourceCountry, destinationCountry);
    }

    public List<Offer> getAllOfferBySourceCurrencyAmount(long id, String sourceCurrency, float min, float max) {
        return offerRepository.findOfferBySourceCurrencyAmount(id, sourceCurrency, min, max);
    }

    public List<Offer> getAllOfferByDestinationCurrencyAmount(long id, String destinationCurrency, float min,
            float max) {
        return offerRepository.findOfferByDestinationCurrencyAmount(id, destinationCurrency, min, max);
    }

    public List<Offer> getAllRangeMatchingOffer(long id, float matchingAmount, String sourceCountry,
            String destinationCountry) {
        return offerRepository.findRangeMatchingOffer(id, matchingAmount, sourceCountry, destinationCountry);
    }

    public List<Offer> getAllSplitMatchingOffer(long id, float matchingAmount, String sourceCountry,
            String destinationCountry) {
        return offerRepository.findSplitMatchingOffer(id, matchingAmount, sourceCountry, destinationCountry);
    }

    public List<Offer> getAllOppositeMatchingOffer(long id, float matchingAmount, String sourceCountry,
            String destinationCountry) {
        return offerRepository.findOppositeMatchingOffer(id, matchingAmount, sourceCountry, destinationCountry);
    }

    public List<Offer> getOfferOfMatchingOffer(long id) {
        return offerRepository.findOfferOfMatchingOffer(id);
    }

    public List<Offer> getAllSameMatchingOffer(long id, String sourceCountry, String destinationCountry) {
        return offerRepository.findSameMatchingOffer(id, sourceCountry, destinationCountry);
    }

    public Offer addOffer(Offer offer) {
        return offerRepository.save(offer);
    }

    public Set<Offer> getOffersOfAUser(long id) {
        return offerRepository.findOfferByUserId(id);
    }

    public void deleteOffer(long id) {
        offerRepository.deleteById(id);
    }
}