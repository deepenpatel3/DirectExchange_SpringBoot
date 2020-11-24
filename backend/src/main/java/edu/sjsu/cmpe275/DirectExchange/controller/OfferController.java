package edu.sjsu.cmpe275.DirectExchange.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import edu.sjsu.cmpe275.DirectExchange.model.Offer;
import edu.sjsu.cmpe275.DirectExchange.service.OfferService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@CrossOrigin(origins = "*")
public class OfferController {

    @Autowired
    OfferService offerService;

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

}
