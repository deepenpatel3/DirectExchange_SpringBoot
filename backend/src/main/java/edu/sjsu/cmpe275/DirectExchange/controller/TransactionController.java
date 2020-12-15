package edu.sjsu.cmpe275.DirectExchange.controller;

import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Stream;

import javax.mail.MessagingException;
import javax.mail.internet.AddressException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import edu.sjsu.cmpe275.DirectExchange.model.Offer;
import edu.sjsu.cmpe275.DirectExchange.model.Transaction;
import edu.sjsu.cmpe275.DirectExchange.model.User;
import edu.sjsu.cmpe275.DirectExchange.service.EmailService;
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

	@Autowired
	EmailService emailService;

	public ResponseEntity<?> checkTransaction(Offer mainOffer, int isParent)
			throws AddressException, MessagingException, IOException {
		if (isParent == 1) {
			mainOffer.setSent(true);
			offerService.addOffer(mainOffer);
		}
		int allDone = 1;
		Set<Offer> matchingOffer = mainOffer.getMatchingOffers();
		if (!mainOffer.isSent()) {
			allDone = 0;
		}
		for (Offer individual : matchingOffer) {
			if (individual.isSent() != true) {
				allDone = 0;
			}
		}
		if (allDone == 1) {
			mainOffer.setStatus("fulfilled");
			for (Offer individual : matchingOffer) {
				individual.setStatus("fulfilled");
				offerService.addOffer(individual);
			}
			offerService.addOffer(mainOffer);
			List<Transaction> allTransactionOfMainOffer = transactionService.getMainOffers(mainOffer);
			Transaction firstTransaction = allTransactionOfMainOffer.iterator().next();
			emailService.sendmail("directexchange.cmpe275@gmail.com",
					firstTransaction.getMainOffer().getUser().getUsername(),
					"Transaction Completed. You successfully remitted "
							+ firstTransaction.getMainOffer().getAmountToRemit() + ". Service Fee = "
							+ firstTransaction.getMainOffer().getAmountToRemit() * 0.0005 + ". You received "
							+ firstTransaction.getMainOffer().getAmountToRemit() * 0.9995 + " in your bank account in "
							+ firstTransaction.getMainOffer().getDestinationCountry());
			for (Transaction transaction : allTransactionOfMainOffer) {
				transaction.setPaid(true);
				transaction.setStatus("completed");

				emailService.sendmail("directexchange.cmpe275@gmail.com",
						transaction.getOtherOffer().getUser().getUsername(),
						"Transaction Completed. You successfully remitted "
								+ transaction.getOtherOffer().getAmountToRemit() + ". Service Fee = "
								+ transaction.getOtherOffer().getAmountToRemit() * 0.0005 + ". You received "
								+ transaction.getOtherOffer().getAmountToRemit() * 0.9995 + " in your bank account in "
								+ transaction.getOtherOffer().getDestinationCountry());
				transactionService.addTransaction(transaction);
			}

			return new ResponseEntity<>("All user's completed transaction, Transfer will complete within a day.",
					HttpStatus.OK);
		} else {
			return new ResponseEntity<>("Wait for other user to complete transaction", HttpStatus.OK);
		}
	}

	public Boolean checkExpired(List<Transaction> t) {
		boolean bool = false;
		Date now = new Date();
		System.out.println(" check expired now --->" + now.toString());
		for (Transaction individualTransaction : t) {
			Date date = individualTransaction.getTransactionExpirationDate();
			date.setHours(date.getHours() + 8);
			// date = Date.from(date.plus(hours, ChronoUnit.HOURS));
			System.out.println("date --->" + date.toString());
			if (now.compareTo(date) > 0) {
				bool = true;
				individualTransaction.setStatus("at-fault");
				transactionService.addTransaction(individualTransaction);
			}
		}
		return (bool);
	}

	@PostMapping(value = "/transactionPay/{id}")
	public ResponseEntity<?> pay(@PathVariable Long id) throws AddressException, MessagingException, IOException {
		System.out.println("Adding Payment-> " + id);

		Offer mainOffer = offerService.getOfferById(id).get();
		List<Transaction> isMainOffer = transactionService.getMainOffers(mainOffer);

		boolean isExpired = checkExpired(isMainOffer);

		User user = mainOffer.getUser();
		int at_fault = 0;
		int total = 0;
		List<Transaction> all_t = transactionService.getAllTransaction();
		for (Transaction i : all_t) {
			if (i.getMainOffer().getUser().getId() == user.getId()
					|| i.getOtherOffer().getUser().getId() == user.getId()) {
				if (i.getStatus() == "at-fault") {
					at_fault++;
				}
				total++;
			}
		}
		int reputation = Math.round(((1 - (at_fault / total)) * 4) + 1);
		user.setReputation(reputation);
		userService.addUser(user);

		if (isExpired == true) {
			return new ResponseEntity<>("Cannot Complete Transaction, Time limit Exceeded", HttpStatus.BAD_REQUEST);
		}

		if (isMainOffer.size() != 0) {
			return (checkTransaction(mainOffer, 1));
		} else {
			Offer otherOffer = mainOffer;
			otherOffer.setSent(true);

			if (otherOffer.isCounterOfferOrNot() == true) {
				offerService.addOffer(otherOffer);
				Offer parentOffer = otherOffer.getParentOffer();
				return (checkTransaction(parentOffer, 0));
			} else {
				System.out.println("id -------_> " + id + " main offer " + mainOffer.getId());
				List<Offer> offerOfMatchingOffer = offerService.getOfferOfMatchingOffer(id);
				if (offerOfMatchingOffer.size() != 0) {

					Offer temp = offerOfMatchingOffer.get(0);
					System.out.println(" temp id " + temp.getId());
					Offer parentOffer = offerOfMatchingOffer.get(0);
					return (checkTransaction(parentOffer, 0));
				}
			}
		}
		return null;
	}

	@GetMapping(value = "transactionHistory/{id}")
	public ResponseEntity<?> transactionHistory(@PathVariable long id) {
		System.out.println("getting transaction history of a user -> " + id);
		List<Transaction> allTransactions = transactionService.getAllTransaction();
		// Stream<Transaction> filteredTransactions = allTransactions.stream().forEach(
		// x -> (x.getMainOffer().getUser().getId()) == id )
		List<Transaction> filteredTransactions = new ArrayList<>();
		for (Transaction transaction : allTransactions) {
			if (transaction.getMainOffer().getUser().getId() == id
					|| transaction.getOtherOffer().getUser().getId() == id) {
				filteredTransactions.add(transaction);
			}
		}

		return new ResponseEntity<>(filteredTransactions, HttpStatus.OK);
	}
}
