package edu.sjsu.cmpe275.DirectExchange.controller;

import java.util.HashMap;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@RestController
@CrossOrigin(origins = "*")
public class PrevailingRates {
    
    @RequestMapping(value = "/rates", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<?> deleteCounterOffer() {
        System.out.println("Prevailing Rates called -> ");
        HashMap<String,Double> rates = new HashMap<String,Double>();
        
        rates.put("EUR", 1.20);
        rates.put("GBP", 1.33);
        rates.put("INR", 0.014);
        rates.put("RMB", 0.15);
        
        return new ResponseEntity<>(rates, HttpStatus.OK);
    }

}
