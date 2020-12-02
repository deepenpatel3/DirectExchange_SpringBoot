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

//import edu.sjsu.cmpe275.DirectExchange.model.CounterOffer;
import edu.sjsu.cmpe275.DirectExchange.model.Offer;
import edu.sjsu.cmpe275.DirectExchange.model.Transaction;
//import edu.sjsu.cmpe275.DirectExchange.service.CounterOfferService;
import edu.sjsu.cmpe275.DirectExchange.service.OfferService;
import edu.sjsu.cmpe275.DirectExchange.service.TransactionService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@RestController
@CrossOrigin(origins = "*")
public class TransactionController {
	 @Autowired
	 OfferService offerService;

    @Autowired
    TransactionService transactionService;
    
    public ResponseEntity<?> checkTransaction(Offer mainOffer, int isParent) {
    	if(isParent == 1) {
    		mainOffer.setSent(true);
        	offerService.addOffer(mainOffer);
    	}
    	int allDone = 1;
    	Set<Offer> matchingOffer = mainOffer.getMatchingOffers();
    	for(Offer individual : matchingOffer) {
    		if(individual.isSent() != true) {
    			allDone = 0;
    		}
    	}
    	if(allDone == 1) {
    		mainOffer.setStatus("completed");
    		for(Offer individual : matchingOffer) {
        		individual.setStatus("completed");
        		offerService.addOffer(individual);
        	}
    		offerService.addOffer(mainOffer);
            return new ResponseEntity<>("All user's completed transaction, Transfer will complete within a day.", HttpStatus.OK);
    	}
    	else {
            return new ResponseEntity<>("Wait for other user to complete transaction", HttpStatus.OK);
    	}
    }
    
    @PostMapping(value = "/transactionPay/{id}")
    public void pay(@PathVariable Long id) {
        System.out.println("Adding Payment-> " + offerService.getOfferById(id));
        
        Offer mainOffer = offerService.getOfferById(id).get();
        List<Transaction> isMainOffer = transactionService.getMainOffers(mainOffer);
        if(isMainOffer.size() != 0) {
        	checkTransaction(mainOffer,1);
        }
        else {
        	Offer otherOffer = mainOffer;
        	otherOffer.setSent(true);
        	
        	if(otherOffer.isCounterOfferOrNot()== true) {
            	offerService.addOffer(otherOffer);
            	Offer parentOffer = otherOffer.getParentOffer();
            	checkTransaction(parentOffer,0);        		
        	}
        	else {
        		List<Offer> offerOfMatchingOffer = offerService.getOfferOfMatchingOffer(id);
        		if(offerOfMatchingOffer.size() != 0) {
        			Offer parentOffer = offerOfMatchingOffer.get(0);
                	checkTransaction(parentOffer,0); 
        		}
        	}
        }
    }    
}
