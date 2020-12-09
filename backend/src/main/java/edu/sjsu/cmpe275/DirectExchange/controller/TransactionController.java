package edu.sjsu.cmpe275.DirectExchange.controller;

import java.util.Date;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import edu.sjsu.cmpe275.DirectExchange.model.Offer;
import edu.sjsu.cmpe275.DirectExchange.model.Transaction;
import edu.sjsu.cmpe275.DirectExchange.model.User;
import edu.sjsu.cmpe275.DirectExchange.service.OfferService;
import edu.sjsu.cmpe275.DirectExchange.service.TransactionService;
import edu.sjsu.cmpe275.DirectExchange.service.UserService;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@CrossOrigin(origins = "*")
public class TransactionController {
	 @Autowired
	 OfferService offerService;

    @Autowired
	TransactionService transactionService;
	
	@Autowired
    UserService userService;

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
    		mainOffer.setStatus("fulfilled");
    		for(Offer individual : matchingOffer) {
        		individual.setStatus("fulfilled");
        		offerService.addOffer(individual);
        	}
			offerService.addOffer(mainOffer);
			List<Transaction> allTransactionOfMainOffer = transactionService.getMainOffers(mainOffer);
			for(Transaction transaction : allTransactionOfMainOffer){
				transaction.setPaid(true);
				transaction.setStatus("completed");
				transactionService.addTransaction(transaction);
			}
            return new ResponseEntity<>("All user's completed transaction, Transfer will complete within a day.", HttpStatus.OK);
    	}
    	else {
            return new ResponseEntity<>("Wait for other user to complete transaction", HttpStatus.OK);
    	}
    }
	
	public Boolean checkExpired(List<Transaction> t) {
		boolean bool = false;
		Date now = new Date();
		for(Transaction individualTransaction : t){
			Date date = individualTransaction.getTransactionExpirationDate();
			if(now.compareTo(date) > 0){
				bool = true;
				individualTransaction.setStatus("at-fault");
				transactionService.addTransaction(individualTransaction);
			}
		}
		return(bool);
	}

    @PostMapping(value = "/transactionPay/{id}")
    public ResponseEntity<?> pay(@PathVariable Long id) {
        System.out.println("Adding Payment-> " + offerService.getOfferById(id));
        
		Offer mainOffer = offerService.getOfferById(id).get();
		List<Transaction> isMainOffer = transactionService.getMainOffers(mainOffer);

		boolean isExpired = checkExpired(isMainOffer);

		User user = mainOffer.getUser();
		int at_fault = 0;
		int total = 0;
		List<Transaction> all_t = transactionService.getAllTransaction();
		for(Transaction i : all_t){
			if(i.getMainOffer().getUser().getId() == user.getId() || i.getOtherOffer().getUser().getId() == user.getId()){
				if(i.getStatus() == "at-fault"){
					at_fault++;
				}
				total++;
			}
		}
		int reputation = Math.round(((1 - (at_fault / total)) * 4) + 1);
		user.setReputation(reputation);
		userService.addUser(user);

		if(isExpired == true){
			return new ResponseEntity<>("Cannot Complete Transaction, Time limit Exceeded", HttpStatus.BAD_REQUEST);
		}

        if(isMainOffer.size() != 0) {
        	return(checkTransaction(mainOffer,1));
        }
        else {
        	Offer otherOffer = mainOffer;
        	otherOffer.setSent(true);
        	
        	if(otherOffer.isCounterOfferOrNot()== true) {
            	offerService.addOffer(otherOffer);
            	Offer parentOffer = otherOffer.getParentOffer();
            	return(checkTransaction(parentOffer,0));        		
        	}
        	else {
        		List<Offer> offerOfMatchingOffer = offerService.getOfferOfMatchingOffer(id);
        		if(offerOfMatchingOffer.size() != 0) {
        			Offer parentOffer = offerOfMatchingOffer.get(0);
                	return(checkTransaction(parentOffer,0)); 
        		}
        	}
        }
		return null;
	}   	
}
