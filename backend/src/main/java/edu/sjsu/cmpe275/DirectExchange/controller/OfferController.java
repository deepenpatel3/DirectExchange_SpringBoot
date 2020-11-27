package edu.sjsu.cmpe275.DirectExchange.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.css.Counter;

import edu.sjsu.cmpe275.DirectExchange.model.CounterOffer;
import edu.sjsu.cmpe275.DirectExchange.model.Offer;
import edu.sjsu.cmpe275.DirectExchange.service.CounterOfferService;
import edu.sjsu.cmpe275.DirectExchange.service.OfferService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@RestController
@CrossOrigin(origins = "*")
public class OfferController {

    @Autowired
    OfferService offerService;

    @Autowired
    CounterOfferService counterOfferService;

    @PostMapping(value = "/offer")
    public ResponseEntity<?> postOffer(@RequestBody Offer offer) {
        System.out.println("posting an offer -> " + offer.getId());
        offerService.addOffer(offer);
        return new ResponseEntity<>("Offer Posted", HttpStatus.OK);
    }

    @DeleteMapping(value = "/offer/{offerId}")
    public ResponseEntity<?> deleteOffer(@PathVariable long offerId) {
        System.out.println("deleting an offer -> " + offerId);
        offerService.deleteOffer(offerId);
        return new ResponseEntity<>("Offer deleted", HttpStatus.OK);
    }

    @RequestMapping("/offer/sourceCurrency/{sourceCurrency}")
    public ResponseEntity<?> getOffersBySourceCurrency(@PathVariable String sourceCurrency) {
        System.out.println("get offers by source currency -> " + sourceCurrency);
        List<Offer> offers = offerService.getOffersBySourceCurrency(sourceCurrency);
        return new ResponseEntity<>(offers, HttpStatus.OK);
    }

    @GetMapping("/offer/{id}")
    public ResponseEntity<?> getOffersOfAUser(@PathVariable long id) {
        System.out.println("get offers of a user -> " + id);
        List<Offer> offers = offerService.getOffersOfAUser(id);
        return new ResponseEntity<>(offers, HttpStatus.OK);
    }

    @RequestMapping("/offer/all/{id}")
    public ResponseEntity<?> getAllOffersExceptSelf(@PathVariable long id) {
        System.out.println("get all offers");
        Set<Offer> offers = offerService.getAllOffers(id);
        return new ResponseEntity<>(offers, HttpStatus.OK);
    }

    @PostMapping(value = "/offer/counterOffer")
    public ResponseEntity<?> postCounterOffer(@RequestBody CounterOffer counterOffer) {
        System.out.println("posting counter offer -> " + counterOffer.getDestinationCountry());

        counterOfferService.postCounterOffer(counterOffer);
        return new ResponseEntity<>("counter Offer added", HttpStatus.OK);
    }

    @PostMapping(value = "/offer/counterOffer/split/accept/{counterOfferId}")
    public ResponseEntity<?> acceptCounterOffer(@PathVariable long counterOfferId) {
        System.out.println("accepting counter offer -> " + counterOfferId);

        CounterOffer counterOffer = counterOfferService.getCounterOffer(counterOfferId).get();
        counterOffer.setStatus("accepted");
        Set<CounterOffer> counterOffers = counterOfferService
                .getAllCounterOffersOfAnOffer(counterOffer.getMainOffer().getId());

        int sum = 0, amountToRemit = counterOffer.getMainOffer().getAmountToRemit();

        for (CounterOffer oneCounterOffer : counterOffers) {
            if (oneCounterOffer.getStatus().equalsIgnoreCase("accepted"))
                sum += oneCounterOffer.getAmountToRemit();
        }
        System.out.println("sum " + sum + " amount to remit " + amountToRemit);
        if (sum > amountToRemit * 0.9 && sum < amountToRemit * 1.1) {
            long offerId = counterOffer.getMainOffer().getId();
            Optional<Offer> offer = offerService.getOfferById(offerId);
            offer.get().setAccepted(true);
            return new ResponseEntity<>("Offer fullfilled, please complete the transaction", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Counter offer accepted", HttpStatus.OK);
        }

    }

    @PostMapping(value = "/offer/changeAmount/{mainOfferId}")
    public ResponseEntity<?> changeAmountAfterAccept(@PathVariable long mainOfferId) {
        System.out.println("Changing Main Offer to counter offer Amount -> " + mainOfferId);
        Set<CounterOffer> counterOffers = counterOfferService.getAllCounterOffersOfAnOffer(mainOfferId);
        Optional<Offer> offer = offerService.getOfferById(mainOfferId);
        int sum = 0;
        for (CounterOffer oneCounterOffer : counterOffers) {
            if (oneCounterOffer.getStatus().equalsIgnoreCase("accepted"))
                sum += oneCounterOffer.getAmountToRemit();
        }
        System.out.println("sum " + sum);
        offer.get().setAmountToRemit(sum);
        return new ResponseEntity<>("Amount to remit for Offer updated, please complete the transaction", HttpStatus.OK);
    }

    @RequestMapping(value = "/offer/counterOffer/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteCounterOffer(@PathVariable long id) {
        System.out.println("deleting counter offer -> " + id);
        counterOfferService.deleteCounterOffer(id);
        return new ResponseEntity<>("Counter Offer Deleted", HttpStatus.OK);
    }

}
