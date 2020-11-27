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
        return new ResponseEntity<>(true, HttpStatus.OK);

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

    @RequestMapping("/offer")
    public ResponseEntity<?> getAllOffers() {
        System.out.println("get all offers");
        List<Offer> offers = offerService.getAllOffers();
        return new ResponseEntity<>(offers, HttpStatus.OK);
    }

    @PostMapping(value = "/offer/changeOffer", consumes = "application/json")
    public ResponseEntity<?> changeOfferAmount(@RequestBody Map<String, Object> payload) {
        System.out.println("changing an offer amount -> " + payload);
        long offerId = new Long(payload.get("offerId").toString()).longValue();
        int amount = (int) payload.get("amount");

        Optional<Offer> offer = offerService.getOfferById(offerId);
        offer.get().setAmountToRemit(amount);
        offerService.addOffer(offer.get());
        return new ResponseEntity<>(true, HttpStatus.OK);
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
            return new ResponseEntity<>("Offer fullfilled, please complete the transaction", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Counter offer accepted", HttpStatus.OK);
        }

    }

    @RequestMapping(value = "/offer/counterOffer/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteCounterOffer(@PathVariable long id) {
        System.out.println("deleting counter offer -> " + id);
        counterOfferService.deleteCounterOffer(id);
        return new ResponseEntity<>("Counter Offer Deleted", HttpStatus.OK);
    }

}
