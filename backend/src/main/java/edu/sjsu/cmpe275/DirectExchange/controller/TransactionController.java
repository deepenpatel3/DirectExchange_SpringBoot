//package edu.sjsu.cmpe275.DirectExchange.controller;
//import java.util.List;
//import java.util.Map;
//import java.util.Optional;
//import java.util.Set;
//
//import com.fasterxml.jackson.databind.JsonNode;
//import com.fasterxml.jackson.databind.node.ObjectNode;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.RestController;
//import org.w3c.dom.css.Counter;
//
////import edu.sjsu.cmpe275.DirectExchange.model.CounterOffer;
//import edu.sjsu.cmpe275.DirectExchange.model.Offer;
//import edu.sjsu.cmpe275.DirectExchange.service.CounterOfferService;
//import edu.sjsu.cmpe275.DirectExchange.service.OfferService;
//import edu.sjsu.cmpe275.DirectExchange.service.TransactionService;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestMethod;
//
//@RestController
//@CrossOrigin(origins = "*")
//public class TransactionController {
//	 @Autowired
//	 OfferService offerService;
//
////    @Autowired
////    CounterOfferService counterOfferService;
//
//    @Autowired
//    TransactionService transactionService;
//    
////    @PostMapping(value = "/transaction/{Id}")
////    public ResponseEntity<?> postTransaction(@PathVariable Long offer_id) {
////        System.out.println("Entering Transaction mode for-> " + offerService.getOfferById(offer_id));
//////        transactionService.addTransaction(offerService.getOfferById(offer_id).get());
////        return new ResponseEntity<>("Entered Transaction Mode", HttpStatus.OK);
////    }
//
//
//}
