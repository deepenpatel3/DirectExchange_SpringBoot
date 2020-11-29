package edu.sjsu.cmpe275.DirectExchange.controller;

import java.util.HashSet;
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

// import edu.sjsu.cmpe275.DirectExchange.model.CounterOffer;
import edu.sjsu.cmpe275.DirectExchange.model.Offer;
import edu.sjsu.cmpe275.DirectExchange.model.BankAccount;
import edu.sjsu.cmpe275.DirectExchange.service.BankAccountService;
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
     BankAccountService bankAccountService;

    @PostMapping(value = "/offer")
    public ResponseEntity<?> postOffer(@RequestBody Offer offer) {
        System.out.println("posting an offer -> " + offer.getId());
        Set<BankAccount> canSend = bankAccountService.getCanSend(offer.getUser().getId(), offer.getSourceCountry());
        Set<BankAccount> canReceive = bankAccountService.getCanReceive(offer.getUser().getId(), offer.getDestinationCountry());
        if(canSend.size() == 0) {
            return new ResponseEntity<>("Create Bank Account in " + offer.getSourceCountry()+ " with Sending enabled to deduct money.", HttpStatus.BAD_REQUEST);
        }
        if(canReceive.size() == 0) {
            return new ResponseEntity<>("Create Bank Account in " + offer.getDestinationCountry()+ " with Receiving enabled to receive money.", HttpStatus.BAD_REQUEST);
        }
        offerService.addOffer(offer);
        return new ResponseEntity<>("Offer Posted", HttpStatus.OK);
    }

    @DeleteMapping(value = {"/offer/{offerId}","/offer/{offerId}/{mainOfferId}"})
    public ResponseEntity<?> deleteOffer(@PathVariable long offerId, @PathVariable Optional<Long> mainOfferId) {
        System.out.println("deleting an offer -> " + offerId);
        
        Optional<Offer> mainOffer = offerService.getOfferById(offerId);
        if(mainOffer.get().isCounterOfferOrNot() == false) {
	        if(mainOffer.get().getMatchingOffers().size() > 0) {
	            return new ResponseEntity<>("Offer Cannot be deleted.", HttpStatus.BAD_REQUEST);
	        }
	        Set<Offer> counterOffer = mainOffer.get().getCounterOffers(); 
	        for(Offer off : counterOffer) {
	        	offerService.deleteOffer(off.getId());
	        }
	        offerService.deleteOffer(offerId);
        }
        else {
//        	Set<Offer> counterOffers = postedOffer.get().getCounterOffers();
//        	Set<Offer> newCounterOffers = new HashSet<Offer>();
//        	for(Offer off : counterOffers) {
//        		if(off.getId() == offerId) {
//        			if(off.getHoldOffer()!= null) {
//        				Offer oldOffer = off.getHoldOffer();
//        				oldOffer.setStatus("open");
//        				offerService.addOffer(oldOffer);
//        			}
//        			offerService.deleteOffer(off.getId());
//        		}
//        		else {
//        			newCounterOffers.add(off);
//        		}
//        	}
//        	postedOffer.get().setCounterOffers(newCounterOffers);
//        	offerService.addOffer(postedOffer.get());
        	Optional<Offer> counterOffer = offerService.getOfferById(offerId);
        	if(counterOffer.get().getHoldOffer() != null) {
        		Offer oldOffer = counterOffer.get().getHoldOffer();
				oldOffer.setStatus("open");
				offerService.addOffer(oldOffer);
        	}
        	offerService.deleteOffer(offerId);
        }
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

    @PostMapping(value = {"/offer/counterOffer/{mainOfferId}","/offer/counterOffer/{mainOfferId}/{holdOfferId}"})
    public ResponseEntity<?> postCounterOffer(@RequestBody Offer offer, @PathVariable long mainOfferId, @PathVariable Optional<Long> holdOfferId) {
        System.out.println("posting counter offer -> ");
        
        Set<BankAccount> canSend = bankAccountService.getCanSend(offer.getUser().getId(), offer.getSourceCountry());
        Set<BankAccount> canReceive = bankAccountService.getCanSend(offer.getUser().getId(), offer.getDestinationCountry());
        if(canSend.size() == 0) {
            return new ResponseEntity<>("Create Bank Account in" + offer.getSourceCountry()+ "with Sending enabled to deduct money.", HttpStatus.BAD_REQUEST);
        }
        if(canReceive.size() == 0) {
            return new ResponseEntity<>("Create Bank Account in" + offer.getDestinationCountry()+ "with Receiving enabled to receive money.", HttpStatus.BAD_REQUEST);
        }
        
        Offer mainOffer = offerService.getOfferById(mainOfferId).get();
        float amount_to_remit = mainOffer.getAmountToRemit();
        float remaining_amount_to_remit = mainOffer.getRemainigBalance();
    	float counterOfferAmountToRemit = offer.getAmountToRemit();
        Boolean canSplit = mainOffer.isAllowSplitExchange();
        if(canSplit == true) {
        	if(counterOfferAmountToRemit > (amount_to_remit*1.1)-remaining_amount_to_remit) {
        		return new ResponseEntity<>("Cannot add Counter offer more than Main Offer Amount.",HttpStatus.BAD_REQUEST);
        	}
        }
        else{
        	if(counterOfferAmountToRemit < (amount_to_remit*0.9) || counterOfferAmountToRemit > (amount_to_remit*1.1)){
        		return new ResponseEntity<>("Cannot add Counter offer more or less than Main Offer Amount range.",HttpStatus.BAD_REQUEST);
        	}
        }
        offer.setParentOffer(mainOffer);
        if(holdOfferId.isPresent()) {
        	Offer holdOffer = offerService.getOfferById(holdOfferId.get()).get();
        	holdOffer.setStatus("hold");
        	offer.setHoldOffer(holdOffer);
        	offerService.addOffer(holdOffer);
        }
        offerService.addOffer(offer);
        Set<Offer> counterOffers = mainOffer.getCounterOffers();
        counterOffers.add(offer);
        mainOffer.setCounterOffers(counterOffers);
        offerService.addOffer(mainOffer);
        return new ResponseEntity<>("Offer Posted", HttpStatus.OK);
    }

    
    @PostMapping(value = "/offer/matchingOffer/accept/{mainOfferId}")
    public ResponseEntity<?> acceptMatchingOffer(@RequestBody Offer offer, @PathVariable long mainOfferId) {
        System.out.println("posting matching offer -> ");

        Set<BankAccount> canSend = bankAccountService.getCanSend(offer.getUser().getId(), offer.getSourceCountry());
        Set<BankAccount> canReceive = bankAccountService.getCanSend(offer.getUser().getId(), offer.getDestinationCountry());
        if(canSend.size() == 0) {
            return new ResponseEntity<>("Create Bank Account in" + offer.getSourceCountry()+ "with Sending enabled to deduct money.", HttpStatus.BAD_REQUEST);
        }
        if(canReceive.size() == 0) {
            return new ResponseEntity<>("Create Bank Account in" + offer.getDestinationCountry()+ "with Receiving enabled to receive money.", HttpStatus.BAD_REQUEST);
        }
        offer.setAccepted(true);
        offerService.addOffer(offer);
        Offer mainOffer = offerService.getOfferById(mainOfferId).get();
        Set<Offer> matchingOffers = mainOffer.getMatchingOffers();
        matchingOffers.add(offer);
        mainOffer.setMatchingOffers(matchingOffers);
        mainOffer.setAccepted(true);
        offerService.addOffer(mainOffer);
        return new ResponseEntity<>("Offer matched", HttpStatus.OK);
    }

    @PostMapping(value = "/offer/counterOffer/accept/{counterOfferId}")
    public ResponseEntity<?> acceptCounterOffer(@PathVariable long counterOfferId) {
        System.out.println("accepting counter offer -> " + counterOfferId);

        Offer counterOffer = offerService.getOfferById(counterOfferId).get();
        Offer parentOffer = counterOffer.getParentOffer();
        float remainingBal = parentOffer.getRemainigBalance();
        Set<Offer> matchingOffers = parentOffer.getMatchingOffers();

        Boolean canSplit = parentOffer.isAllowSplitExchange();
        if(canSplit == true) {
        	if(matchingOffers.size() == 1) {
        		if((parentOffer.getAmountToRemit()*0.9) - remainingBal < counterOffer.getAmountToRemit() && (parentOffer.getAmountToRemit()*1.1) - remainingBal > counterOffer.getAmountToRemit()) {
            		if(counterOffer.getHoldOffer() != null) {
            			Offer oldOffer = counterOffer.getHoldOffer();
            			counterOffer.setHoldOffer(null);
            			offerService.deleteOffer(oldOffer.getId());
            		}
        			counterOffer.setAccepted(true);
            		parentOffer.setAccepted(true);
        			matchingOffers.add(counterOffer);
        	        parentOffer.setMatchingOffers(matchingOffers);
        	        parentOffer.setRemainigBalance(remainingBal - counterOffer.getAmountToRemit());
        	        offerService.addOffer(parentOffer);
        	        offerService.addOffer(counterOffer);
        	        return new ResponseEntity<>("Offer accepted", HttpStatus.OK);
        		}
        		else {
        	        return new ResponseEntity<>("Offer cannot be accepted as amount not in range.", HttpStatus.BAD_REQUEST);
        		}
        	}
        	else {
        		if(counterOffer.getHoldOffer() != null) {
        			Offer oldOffer = counterOffer.getHoldOffer();
        			counterOffer.setHoldOffer(null);
        			offerService.deleteOffer(oldOffer.getId());
        		}
        		counterOffer.setAccepted(true);
        		matchingOffers.add(counterOffer);
    	        parentOffer.setMatchingOffers(matchingOffers);
    	        parentOffer.setRemainigBalance(remainingBal - counterOffer.getAmountToRemit());
    	        offerService.addOffer(parentOffer);
    	        offerService.addOffer(counterOffer);
    	        return new ResponseEntity<>("Offer accepted", HttpStatus.OK);
        	}
        }
        else {
        	if((parentOffer.getAmountToRemit()*0.9) - remainingBal < counterOffer.getAmountToRemit() && (parentOffer.getAmountToRemit()*1.1) - remainingBal > counterOffer.getAmountToRemit()) {
        		if(counterOffer.getHoldOffer() != null) {
        			Offer oldOffer = counterOffer.getHoldOffer();
        			counterOffer.setHoldOffer(null);
        			offerService.deleteOffer(oldOffer.getId());
        		}
        		counterOffer.setAccepted(true);
        		parentOffer.setAccepted(true);
    			matchingOffers.add(counterOffer);
    	        parentOffer.setRemainigBalance(remainingBal - counterOffer.getAmountToRemit());
    	        parentOffer.setMatchingOffers(matchingOffers);
    	        offerService.addOffer(parentOffer);
    	        offerService.addOffer(counterOffer);
    	        return new ResponseEntity<>("Offer accepted", HttpStatus.OK);
    		}
    		else {
    	        return new ResponseEntity<>("Offer cannot be accepted as amount not in range.", HttpStatus.BAD_REQUEST);
    		}
        }
       
    }
    
     @PostMapping(value = "/offer/changeAmount/{mainOfferId}")
     public ResponseEntity<?> changeAmountAfterAccept(@PathVariable long mainOfferId) {
	     System.out.println("Changing Main Offer to counter offers Amount -> " + mainOfferId);
	     Offer mainOffer = offerService.getOfferById(mainOfferId).get();
	     float remainingBal = mainOffer.getRemainigBalance();
	     float amountToRemit = mainOffer.getAmountToRemit();
	     mainOffer.setAmountToRemit(amountToRemit-remainingBal);
	     offerService.addOffer(mainOffer);
	     return new ResponseEntity<>("Amount to remit for Offer updated, please complete the transaction", HttpStatus.OK);
     }
     
     @PostMapping(value = "/offer/otherOffer/{mainOfferId}/{otherOfferId}")
     public ResponseEntity<?> addPostedOffers(@PathVariable long mainOfferId, @PathVariable long otherOfferId){
    	 Offer mainOffer = offerService.getOfferById(mainOfferId).get();
    	 Offer otherOffer = offerService.getOfferById(otherOfferId).get();
    	 float remainingBal = mainOffer.getRemainigBalance();
    	 float remainingBalforOther = otherOffer.getRemainigBalance();
    	 
    	 if(remainingBalforOther > remainingBal) {
    		 Offer intermediate = mainOffer;
    		 mainOffer = otherOffer;
    		 otherOffer = intermediate;
    		 
    		 float intermediatebal = remainingBal;
    		 remainingBal = remainingBalforOther;
    		 remainingBalforOther = intermediatebal;
    	 }
    	 
		 float amountToRemit = mainOffer.getAmountToRemit();
		 Set<Offer> matchingOffers = mainOffer.getMatchingOffers();

    	 Boolean canSplit = mainOffer.isAllowSplitExchange();
    	 if(canSplit == true) {
    		 if(matchingOffers.size() == 1) {
    			 if((amountToRemit*0.9)-remainingBal > otherOffer.getAmountToRemit() || (amountToRemit*1.1)-remainingBal < otherOffer.getAmountToRemit()) {
        	    	 return new ResponseEntity<>("Offer cannot be amount not in remaining balance range", HttpStatus.BAD_REQUEST);    				 
    			 }
    			 else {
    				 matchingOffers.add(otherOffer);
    				 mainOffer.setRemainigBalance(remainingBal-(otherOffer.getAmountToRemit()));
    				 mainOffer.setAccepted(true);
    				 otherOffer.setAccepted(true);
    				 offerService.addOffer(otherOffer);
    				 offerService.addOffer(mainOffer);
    		    	 return new ResponseEntity<>("Offer Fulfilled, Please Complete the transaction", HttpStatus.OK);
    			 }
    		 }
    		 else {
    			 matchingOffers.add(otherOffer);
    			 mainOffer.setRemainigBalance(remainingBal-(otherOffer.getAmountToRemit()));
    			 otherOffer.setAccepted(true);
    			 offerService.addOffer(otherOffer);
    			 offerService.addOffer(mainOffer);
    	    	 return new ResponseEntity<>("Offer Added", HttpStatus.OK);
    		 }
    	 }
    	 else {
			 if((amountToRemit*0.9) > otherOffer.getAmountToRemit() || (amountToRemit*1.1) < otherOffer.getAmountToRemit()) {
    	    	 return new ResponseEntity<>("Offer cannot be amount not in remaining balance range", HttpStatus.BAD_REQUEST);    				 
			 }
			 else {
				 matchingOffers.add(otherOffer);
				 mainOffer.setRemainigBalance(remainingBal-(otherOffer.getAmountToRemit()));
				 mainOffer.setAccepted(true);
				 otherOffer.setAccepted(true);
				 offerService.addOffer(otherOffer);
				 offerService.addOffer(mainOffer);
		    	 return new ResponseEntity<>("Offer Fulfilled, Please Complete the transaction", HttpStatus.OK);
			 }
    	 }
		 
     }

//    @RequestMapping(value = "/offer/counterOffer/{id}", method = RequestMethod.DELETE)
//    public ResponseEntity<?> deleteCounterOffer(@PathVariable long id) {
//        System.out.println("deleting counter offer -> " + id);
//        offerService.deleteOffer(id);
//        return new ResponseEntity<>("Counter Offer Deleted", HttpStatus.OK);
//    }

    // @PostMapping(value = "/offer/counterOffer")
    // public ResponseEntity<?> postCounterOffer(@RequestBody CounterOffer
    // counterOffer) {
    // System.out.println("posting counter offer -> " +
    // counterOffer.getDestinationCountry());

    // counterOfferService.postCounterOffer(counterOffer);
    // return new ResponseEntity<>("counter Offer added", HttpStatus.OK);
    // }

    // @PostMapping(value = "/offer/counterOffer/split/accept/{counterOfferId}")
    // public ResponseEntity<?> acceptCounterOffer(@PathVariable long
    // counterOfferId) {
    // System.out.println("accepting counter offer -> " + counterOfferId);

    // CounterOffer counterOffer =
    // counterOfferService.getCounterOffer(counterOfferId).get();
    // counterOffer.setStatus("accepted");
    // Set<CounterOffer> counterOffers = counterOfferService
    // .getAllCounterOffersOfAnOffer(counterOffer.getMainOffer().getId());

    // int sum = 0, amountToRemit = counterOffer.getMainOffer().getAmountToRemit();

    // for (CounterOffer oneCounterOffer : counterOffers) {
    // if (oneCounterOffer.getStatus().equalsIgnoreCase("accepted"))
    // sum += oneCounterOffer.getAmountToRemit();
    // }
    // System.out.println("sum " + sum + " amount to remit " + amountToRemit);
    // if (sum > amountToRemit * 0.9 && sum < amountToRemit * 1.1) {
    // long offerId = counterOffer.getMainOffer().getId();
    // Optional<Offer> offer = offerService.getOfferById(offerId);
    // offer.get().setAccepted(true);
    // return new ResponseEntity<>("Offer fullfilled, please complete the
    // transaction", HttpStatus.OK);
    // } else {
    // return new ResponseEntity<>("Counter offer accepted", HttpStatus.OK);
    // }

    // }

  

    // @RequestMapping(value = "/offer/counterOffer/{id}", method =
    // RequestMethod.DELETE)
    // public ResponseEntity<?> deleteCounterOffer(@PathVariable long id) {
    // System.out.println("deleting counter offer -> " + id);
    // counterOfferService.deleteCounterOffer(id);
    // return new ResponseEntity<>("Counter Offer Deleted", HttpStatus.OK);
    // }

}
