package edu.sjsu.cmpe275.DirectExchange.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import javax.persistence.Tuple;

import java.time.Instant;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;

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

import edu.sjsu.cmpe275.DirectExchange.model.Transaction;
import edu.sjsu.cmpe275.DirectExchange.model.Offer;
import edu.sjsu.cmpe275.DirectExchange.model.BankAccount;
import edu.sjsu.cmpe275.DirectExchange.service.TransactionService;
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

	@Autowired
	TransactionService transactionService;

	@PostMapping(value = "/offer")
	public ResponseEntity<?> postOffer(@RequestBody Offer offer) {
		System.out.println("posting an offer -> " + offer.getId());
		Set<BankAccount> canSend = bankAccountService.getCanSend(offer.getUser().getId(), offer.getSourceCountry());
		Set<BankAccount> canReceive = bankAccountService.getCanReceive(offer.getUser().getId(),
				offer.getDestinationCountry());
		if (canSend.size() == 0) {
			return new ResponseEntity<>(
					"Create Bank Account in " + offer.getSourceCountry() + " with Sending enabled to deduct money.",
					HttpStatus.BAD_REQUEST);
		}
		if (canReceive.size() == 0) {
			return new ResponseEntity<>("Create Bank Account in " + offer.getDestinationCountry()
					+ " with Receiving enabled to receive money.", HttpStatus.BAD_REQUEST);
		}
		offer.setRemainingBalance(offer.getAmountToRemit());
		offerService.addOffer(offer);
		return new ResponseEntity<>("Offer Posted", HttpStatus.OK);
	}

	@DeleteMapping(value = { "/offer/{offerId}", "/offer/{offerId}/{mainOfferId}" })
	public ResponseEntity<?> deleteOffer(@PathVariable long offerId, @PathVariable Optional<Long> mainOfferId) {
		System.out.println("deleting an offer -> " + offerId);

		Optional<Offer> mainOffer = offerService.getOfferById(offerId);
		if (mainOffer.get().isCounterOfferOrNot() == false) {
			if (mainOffer.get().getMatchingOffers().size() > 0) {
				return new ResponseEntity<>("Offer Cannot be deleted.", HttpStatus.BAD_REQUEST);
			}
			Set<Offer> counterOffer = mainOffer.get().getCounterOffers();
			for (Offer off : counterOffer) {
				offerService.deleteOffer(off.getId());
			}
			offerService.deleteOffer(offerId);
		} else {
			Optional<Offer> counterOffer = offerService.getOfferById(offerId);
			if (counterOffer.get().getHoldOffer() != null) {
				Offer oldOffer = counterOffer.get().getHoldOffer();
				oldOffer.setStatus("open");
				offerService.addOffer(oldOffer);
			}
			offerService.deleteOffer(offerId);
		}
		return new ResponseEntity<>("Offer deleted", HttpStatus.OK);
	}

	@PostMapping(value = { "/offer/counterOffer/{mainOfferId}", "/offer/counterOffer/{mainOfferId}/{holdOfferId}" })
	public ResponseEntity<?> postCounterOffer(@RequestBody Offer offer, @PathVariable long mainOfferId,
			@PathVariable Optional<Long> holdOfferId) {
		System.out.println("posting counter offer -> ");

		Set<BankAccount> canSend = bankAccountService.getCanSend(offer.getUser().getId(), offer.getSourceCountry());
		Set<BankAccount> canReceive = bankAccountService.getCanReceive(offer.getUser().getId(),
				offer.getDestinationCountry());
		if (canSend.size() == 0) {
			return new ResponseEntity<>(
					"Create Bank Account in " + offer.getSourceCountry() + " with Sending enabled to deduct money.",
					HttpStatus.BAD_REQUEST);
		}
		if (canReceive.size() == 0) {
			return new ResponseEntity<>("Create Bank Account in " + offer.getDestinationCountry()
					+ " with Receiving enabled to receive money.", HttpStatus.BAD_REQUEST);
		}

		Offer mainOffer = offerService.getOfferById(mainOfferId).get();
		float amount_to_remit = mainOffer.getAmountToRemit();
		float remaining_amount_to_remit = mainOffer.getRemainingBalance();
		float counterOfferAmountToRemit = offer.getAmountToRemit();
		if (mainOffer.isAllowCounterOffer() == true) {
			Boolean canSplit = mainOffer.isAllowSplitExchange();
			if (canSplit == true) {
				if (counterOfferAmountToRemit > remaining_amount_to_remit + (amount_to_remit * 0.1)) {
					return new ResponseEntity<>("Cannot add Counter offer more than Main Offer Amount.",
							HttpStatus.BAD_REQUEST);
				}
			} else {
				if (counterOfferAmountToRemit < (amount_to_remit * 0.9)
						|| counterOfferAmountToRemit > (amount_to_remit * 1.1)) {
					return new ResponseEntity<>("Cannot add Counter offer more or less than Main Offer Amount range.",
							HttpStatus.BAD_REQUEST);
				}
			}
			offer.setParentOffer(mainOffer);
			if (holdOfferId.isPresent()) {
				Offer holdOffer = offerService.getOfferById(holdOfferId.get()).get();
				holdOffer.setStatus("hold");
				offer.setHoldOffer(holdOffer);
				offerService.addOffer(holdOffer);
			}
			long minutes = 5;
			long hours = 8;
			offer.setExpirationDate(
					Date.from(Instant.now().minus(hours, ChronoUnit.HOURS).plus(minutes, ChronoUnit.MINUTES)));
			offerService.addOffer(offer);
			Set<Offer> counterOffers = mainOffer.getCounterOffers();
			counterOffers.add(offer);
			mainOffer.setCounterOffers(counterOffers);
			offerService.addOffer(mainOffer);
			return new ResponseEntity<>("Offer Posted", HttpStatus.OK);
		} else {
			return new ResponseEntity<>("Main Offer do not accept Counter Offers.", HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping(value = "/offer/matchingOffer/{mainOfferId}")
	public ResponseEntity<?> acceptMatchingOffer(@RequestBody Offer offer, @PathVariable long mainOfferId) {
		System.out.println("posting matching offer -> ");

		Offer mainOffer = offerService.getOfferById(mainOfferId).get();
		// if (referenceOfferId.isPresent()) {
		// Offer referenceOffer =
		// offerService.getOfferById(referenceOfferId.get()).get();
		// if (referenceOffer.getAmountToRemit() < mainOffer.getAmountToRemit() *
		// mainOffer.getExchangeRate() * 0.9
		// || referenceOffer.getAmountToRemit() > mainOffer.getAmountToRemit() *
		// mainOffer.getExchangeRate()
		// * 1.1) {
		// return new ResponseEntity<>("Offer amount is not in required range of 10%",
		// HttpStatus.BAD_REQUEST);
		// }
		// offer = referenceOffer;
		// }
		Set<BankAccount> canSend = bankAccountService.getCanSend(offer.getUser().getId(), offer.getSourceCountry());
		Set<BankAccount> canReceive = bankAccountService.getCanReceive(offer.getUser().getId(),
				offer.getDestinationCountry());
		if (canSend.size() == 0) {
			return new ResponseEntity<>(
					"Create Bank Account in" + offer.getSourceCountry() + "with Sending enabled to deduct money.",
					HttpStatus.BAD_REQUEST);
		}
		if (canReceive.size() == 0) {
			return new ResponseEntity<>("Create Bank Account in" + offer.getDestinationCountry()
					+ "with Receiving enabled to receive money.", HttpStatus.BAD_REQUEST);
		}
		offer.setAccepted(true);
		offerService.addOffer(offer);
		// Offer mainOffer = offerService.getOfferById(mainOfferId).get();
		Set<Offer> matchingOffers = mainOffer.getMatchingOffers();
		matchingOffers.add(offer);
		mainOffer.setMatchingOffers(matchingOffers);
		mainOffer.setAccepted(true);
		offerService.addOffer(mainOffer);
		Transaction transaction = new Transaction();
		transaction.setMainOffer(mainOffer);
		transaction.setOtherOffer(offer);
		transactionService.addTransaction(transaction);
		return new ResponseEntity<>("Offer matched", HttpStatus.OK);
	}

	@PostMapping(value = "/offer/counterOffer/accept/{counterOfferId}")
	public ResponseEntity<?> acceptCounterOffer(@PathVariable long counterOfferId) {
		System.out.println("accepting counter offer -> " + counterOfferId);

		Offer counterOffer = offerService.getOfferById(counterOfferId).get();
		Offer parentOffer = counterOffer.getParentOffer();
		float remainingBal = parentOffer.getRemainingBalance();
		Set<Offer> matchingOffers = parentOffer.getMatchingOffers();
		Boolean canSplit = parentOffer.isAllowSplitExchange();
		if (canSplit == true) {

			if (matchingOffers.size() == 1) {
				if (remainingBal - (parentOffer.getAmountToRemit() * 0.1) > counterOffer.getAmountToRemit()
						|| (parentOffer.getAmountToRemit() * 0.1) + remainingBal < counterOffer.getAmountToRemit()) {
					return new ResponseEntity<>("Offer cannot be accepted as amount not in range.",
							HttpStatus.BAD_REQUEST);
				}
				if (counterOffer.getHoldOffer() != null) {
					Offer oldOffer = counterOffer.getHoldOffer();
					counterOffer.setHoldOffer(null);
					offerService.deleteOffer(oldOffer.getId());
				}

				Transaction previousOfferTransaction = new Transaction();
				previousOfferTransaction.setMainOffer(parentOffer);
				Offer previousOffer = matchingOffers.iterator().next();
				previousOfferTransaction.setOtherOffer(previousOffer);
				transactionService.addTransaction(previousOfferTransaction);

				counterOffer.setAccepted(true);
				parentOffer.setAccepted(true);
				matchingOffers.add(counterOffer);
				parentOffer.setMatchingOffers(matchingOffers);
				parentOffer.setRemainingBalance(remainingBal - counterOffer.getAmountToRemit());
				offerService.addOffer(parentOffer);
				offerService.addOffer(counterOffer);
				Transaction transaction = new Transaction();
				transaction.setMainOffer(parentOffer);
				transaction.setOtherOffer(counterOffer);
				transactionService.addTransaction(transaction);
				return new ResponseEntity<>("Offer accepted", HttpStatus.OK);
			} else {
				if ((parentOffer.getAmountToRemit() * 0.1) + remainingBal < counterOffer.getAmountToRemit()) {
					return new ResponseEntity<>("Offer cannot be accepted as amount not in range.",
							HttpStatus.BAD_REQUEST);
				}
				if (counterOffer.getHoldOffer() != null) {
					Offer oldOffer = counterOffer.getHoldOffer();
					counterOffer.setHoldOffer(null);
					offerService.deleteOffer(oldOffer.getId());
				}
				counterOffer.setAccepted(true);
				matchingOffers.add(counterOffer);
				parentOffer.setMatchingOffers(matchingOffers);
				parentOffer.setRemainingBalance(remainingBal - counterOffer.getAmountToRemit());
				if (parentOffer.getRemainingBalance() <= parentOffer.getAmountToRemit() * 0.1) {
					parentOffer.setAccepted(true);
					Transaction transaction = new Transaction();
					transaction.setMainOffer(parentOffer);
					transaction.setOtherOffer(counterOffer);
					transactionService.addTransaction(transaction);
				}
				offerService.addOffer(parentOffer);
				offerService.addOffer(counterOffer);
				return new ResponseEntity<>("Offer accepted", HttpStatus.OK);
			}
		} else {
			if (remainingBal - (parentOffer.getAmountToRemit() * 0.1) > counterOffer.getAmountToRemit()
					|| (parentOffer.getAmountToRemit() * 0.1) + remainingBal < counterOffer.getAmountToRemit()) {
				return new ResponseEntity<>("Offer cannot be accepted as amount not in range.", HttpStatus.BAD_REQUEST);
			}
			if (counterOffer.getHoldOffer() != null) {
				Offer oldOffer = counterOffer.getHoldOffer();
				counterOffer.setHoldOffer(null);
				offerService.deleteOffer(oldOffer.getId());
			}
			counterOffer.setAccepted(true);
			parentOffer.setAccepted(true);
			matchingOffers.add(counterOffer);
			parentOffer.setRemainingBalance(remainingBal - counterOffer.getAmountToRemit());
			parentOffer.setMatchingOffers(matchingOffers);
			offerService.addOffer(parentOffer);
			offerService.addOffer(counterOffer);
			Transaction transaction = new Transaction();
			transaction.setMainOffer(parentOffer);
			transaction.setOtherOffer(counterOffer);
			transactionService.addTransaction(transaction);
			return new ResponseEntity<>("Offer accepted", HttpStatus.OK);
		}

	}

	@PostMapping(value = "/offer/changeAmount/{mainOfferId}")
	public ResponseEntity<?> changeAmountAfterAccept(@PathVariable long mainOfferId) {
		System.out.println("Changing Main Offer to counter offers Amount -> " + mainOfferId);
		Offer mainOffer = offerService.getOfferById(mainOfferId).get();
		float remainingBal = mainOffer.getRemainingBalance();
		float amountToRemit = mainOffer.getAmountToRemit();
		mainOffer.setAmountToRemit(amountToRemit - remainingBal);
		offerService.addOffer(mainOffer);
		return new ResponseEntity<>("Amount to remit for Offer updated, please complete the transaction",
				HttpStatus.OK);
	}

	@PostMapping(value = "/offer/otherOffer/{mainOfferId}/{otherOfferId}")
	public ResponseEntity<?> addPostedOffers(@PathVariable long mainOfferId, @PathVariable long otherOfferId) {
		System.out.println("addposted offers called");
		Offer mainOffer = offerService.getOfferById(mainOfferId).get();
		Offer otherOffer = offerService.getOfferById(otherOfferId).get();
		float remainingBal = mainOffer.getRemainingBalance();
		float remainingBalforOther = otherOffer.getRemainingBalance();

		System.out.println("mainOffer.getDestinationCurrency() " + mainOffer.getDestinationCurrency()
				+ " otherOffer.getSourceCurrency() " + otherOffer.getSourceCurrency()
				+ " otherOffer.getDestinationCurrency() " + otherOffer.getDestinationCurrency()
				+ " mainOffer.getSourceCurrency() " + mainOffer.getSourceCurrency());
		if (!mainOffer.getDestinationCurrency().equalsIgnoreCase(otherOffer.getSourceCurrency())
				|| !otherOffer.getDestinationCurrency().equalsIgnoreCase(mainOffer.getSourceCurrency())) {
			return new ResponseEntity<>("More than two countries involved between two offers.", HttpStatus.BAD_REQUEST);
		}

		if (remainingBalforOther > remainingBal * (mainOffer.getExchangeRate())) {
			Offer intermediate = mainOffer;
			mainOffer = otherOffer;
			otherOffer = intermediate;
		}
		remainingBal = mainOffer.getRemainingBalance();
		remainingBalforOther = otherOffer.getRemainingBalance();
		float amountToRemit = mainOffer.getAmountToRemit();
		Set<Offer> matchingOffers = mainOffer.getMatchingOffers();

		Boolean canSplit = mainOffer.isAllowSplitExchange();
		if (canSplit == true) {
			if (matchingOffers.size() == 1) {
				if (remainingBal - (amountToRemit * 0.1) > otherOffer.getAmountToRemit()
						* (otherOffer.getExchangeRate())
						|| (amountToRemit * 0.1) + remainingBal < otherOffer.getAmountToRemit()
								* (otherOffer.getExchangeRate())) {
					return new ResponseEntity<>("Offer cannot be added as amount not in remaining balance range",
							HttpStatus.BAD_REQUEST);
				}

				Transaction previousOfferTransaction = new Transaction();
				previousOfferTransaction.setMainOffer(mainOffer);
				Offer previousOffer = matchingOffers.iterator().next();
				previousOfferTransaction.setOtherOffer(previousOffer);
				transactionService.addTransaction(previousOfferTransaction);

				matchingOffers.add(otherOffer);
				mainOffer.setRemainingBalance(
						remainingBal - (otherOffer.getAmountToRemit() * (otherOffer.getExchangeRate())));
				otherOffer.setRemainingBalance(0);
				mainOffer.setAccepted(true);
				otherOffer.setAccepted(true);
				offerService.addOffer(otherOffer);
				offerService.addOffer(mainOffer);
				Transaction transaction = new Transaction();
				transaction.setMainOffer(mainOffer);
				transaction.setOtherOffer(otherOffer);
				transactionService.addTransaction(transaction);
				return new ResponseEntity<>("Offer Fulfilled, Please Complete the transaction", HttpStatus.OK);
			} else {
				System.out.println("otherOffer.getAmountToRemit() * (otherOffer.getExchangeRate() "
						+ otherOffer.getAmountToRemit() * (otherOffer.getExchangeRate()));
				System.out.println("(amountToRemit * 0.1) + remainingBal " + (remainingBal + amountToRemit * 0.1));
				System.out.println("remainingBal - (amountToRemit * 0.1) " + (remainingBal - (amountToRemit * 0.1)));
				System.out.println((amountToRemit * 0.1 + remainingBal) > (otherOffer.getRemainingBalance()
						* otherOffer.getExchangeRate()));
				if ((amountToRemit * 0.1) + remainingBal < otherOffer.getRemainingBalance()
						* (otherOffer.getExchangeRate())) {
					return new ResponseEntity<>("Offer cannot be added as amount not in remaining balance range",
							HttpStatus.BAD_REQUEST);
				} else if ((amountToRemit * 0.1 + remainingBal) > (otherOffer.getRemainingBalance()
						* (otherOffer.getExchangeRate()))
						&& (remainingBal - (amountToRemit * 0.1)) < (otherOffer.getRemainingBalance())
								* (otherOffer.getExchangeRate())) {
					matchingOffers.add(otherOffer);
					mainOffer.setRemainingBalance(
							remainingBal - (otherOffer.getAmountToRemit() * (otherOffer.getExchangeRate())));
					otherOffer.setRemainingBalance(0);
					otherOffer.setAccepted(true);
					mainOffer.setAccepted(true);
					offerService.addOffer(otherOffer);
					offerService.addOffer(mainOffer);
					Transaction transaction = new Transaction();
					transaction.setMainOffer(mainOffer);
					transaction.setOtherOffer(otherOffer);
					transactionService.addTransaction(transaction);
					return new ResponseEntity<>("Offer Fulfilled, Please Complete the transaction", HttpStatus.OK);
				}
				matchingOffers.add(otherOffer);
				mainOffer.setRemainingBalance(
						remainingBal - (otherOffer.getAmountToRemit() * (otherOffer.getExchangeRate())));
				otherOffer.setRemainingBalance(0);
				otherOffer.setAccepted(true);
				offerService.addOffer(otherOffer);
				offerService.addOffer(mainOffer);
				return new ResponseEntity<>("Offer Added", HttpStatus.OK);
			}
		} else {
			System.out.println("remainingBal " + remainingBal + " amountToRemit * 0.1 " + amountToRemit * 0.1
					+ " otherOffer.getAmountToRemit() * (otherOffer.getExchangeRate() "
					+ (otherOffer.getAmountToRemit() * (otherOffer.getExchangeRate())
							+ " (amountToRemit * 0.1) + remainingBal " + ((amountToRemit * 0.1) + remainingBal)));
			if (remainingBal - (amountToRemit * 0.1) > otherOffer.getAmountToRemit() * (otherOffer.getExchangeRate())
					|| (amountToRemit * 0.1) + remainingBal < otherOffer.getAmountToRemit()
							* (otherOffer.getExchangeRate())) {
				return new ResponseEntity<>("Offer cannot be matched. Amount not in remaining balance range",
						HttpStatus.BAD_REQUEST);
			} else {
				matchingOffers.add(otherOffer);
				mainOffer.setRemainingBalance(
						remainingBal - (otherOffer.getAmountToRemit() * (otherOffer.getExchangeRate())));
				otherOffer.setRemainingBalance(0);
				mainOffer.setAccepted(true);
				otherOffer.setAccepted(true);
				offerService.addOffer(otherOffer);
				offerService.addOffer(mainOffer);
				Transaction transaction = new Transaction();
				transaction.setMainOffer(mainOffer);
				transaction.setOtherOffer(otherOffer);
				transactionService.addTransaction(transaction);
				return new ResponseEntity<>("Offer Fulfilled, Please Complete the transaction", HttpStatus.OK);
			}
		}
	}

	@GetMapping("/getAllOfferOfSourceCurrency/{id}/{sourceCurrency}")
	public ResponseEntity<?> getOffersBySourceCurrency(@PathVariable long id, @PathVariable String sourceCurrency) {
		System.out.println("get offers by source currency -> " + sourceCurrency);
		Set<Offer> offers = offerService.getOffersBySourceCurrency(id, sourceCurrency);
		return new ResponseEntity<>(offers, HttpStatus.OK);
	}

	@GetMapping("/getAllOfferOfDestinationCurrency/{id}/{destinationCurrency}")
	public ResponseEntity<?> getOffersByDestinationCurrency(@PathVariable long id,
			@PathVariable String destinationCurrency) {
		System.out.println("get offers by destination currency -> " + destinationCurrency);
		Set<Offer> offers = offerService.getOffersByDestinationCurrency(id, destinationCurrency);
		return new ResponseEntity<>(offers, HttpStatus.OK);
	}

	@GetMapping("/getAllOfferOfUser/{id}")
	public ResponseEntity<?> getOffersOfAUser(@PathVariable long id) {
		System.out.println("get offers of a user -> " + id);
		Set<Offer> offers = offerService.getOffersOfAUser(id);
		return new ResponseEntity<>(offers, HttpStatus.OK);
	}

	@GetMapping("/getAllOfferExceptUser/{id}")
	public ResponseEntity<?> getAllOffersExceptSelf(@PathVariable long id) {
		System.out.println("get all offers");
		Set<Offer> offers = offerService.getAllOffers(id);
		return new ResponseEntity<>(offers, HttpStatus.OK);
	}

	public List<Offer> allExactMatchingOffer(long id) {
		System.out.println("get all exact matching offers");
		Offer offer = offerService.getOfferById(id).get();
		float matchingAmount = offer.getRemainingBalance() * (offer.getExchangeRate());
		String sourceCountry = offer.getDestinationCountry();
		String destinationCountry = offer.getSourceCountry();
		List<Offer> offers = offerService.getAllExactMatchingOffer(id, matchingAmount, sourceCountry,
				destinationCountry);
		return (offers);
	}

	public List<List<Offer>> allSplitMatchingOffer(long id) {
		System.out.println("get all exact matching offers");
		Offer offer = offerService.getOfferById(id).get();
		float matchingAmount = offer.getRemainingBalance() * (offer.getExchangeRate());
		String sourceCountry = offer.getDestinationCountry();
		String destinationCountry = offer.getSourceCountry();
		List<Offer> offers = offerService.getAllSplitMatchingOffer(id, matchingAmount, sourceCountry,
				destinationCountry);
		List<List<Offer>> return_list = new ArrayList<>();
		int i = 0;
		int j = offers.size();
		if (i < j) {
			while (i <= j) {
				Offer smaller = offers.get(i);
				Offer bigger = offers.get(j);
				float small_remaining = smaller.getRemainingBalance();
				float bigger_remaining = bigger.getRemainingBalance();
				if (small_remaining + bigger_remaining >= matchingAmount * 0.9
						&& small_remaining + bigger_remaining <= matchingAmount * 1.1) {
					List<Offer> pair_match = new ArrayList<Offer>();
					pair_match.add(smaller);
					pair_match.add(bigger);
					return_list.add(pair_match);
					if (i + 1 < j - 1) {
						Offer smaller_next = offers.get(i + 1);
						Offer bigger_next = offers.get(j - 1);
						float small_remaining_next = smaller.getRemainingBalance();
						float bigger_remaining_next = bigger.getRemainingBalance();
						if (small_remaining == small_remaining_next && bigger_remaining == bigger_remaining_next) {
							List<Offer> pair_match_1 = new ArrayList<Offer>();
							pair_match.add(smaller);
							pair_match.add(bigger_next);
							return_list.add(pair_match_1);

							List<Offer> pair_match_2 = new ArrayList<Offer>();
							pair_match.add(smaller_next);
							pair_match.add(bigger);
							return_list.add(pair_match_2);

							List<Offer> pair_match_3 = new ArrayList<Offer>();
							pair_match.add(smaller_next);
							pair_match.add(bigger_next);
							return_list.add(pair_match_3);
							i = i + 2;
							j = j - 2;
						} else if (small_remaining == small_remaining_next) {
							List<Offer> pair_match_2 = new ArrayList<Offer>();
							pair_match.add(smaller_next);
							pair_match.add(bigger);
							return_list.add(pair_match_2);
							i = i + 2;
						} else if (bigger_remaining == bigger_remaining_next) {
							List<Offer> pair_match_1 = new ArrayList<Offer>();
							pair_match.add(smaller);
							pair_match.add(bigger_next);
							return_list.add(pair_match_1);
							j = j - 2;

						} else {
							i++;
							j--;
						}
					}
				} else if (small_remaining + bigger_remaining >= matchingAmount * 0.9) {
					i++;
				} else if (small_remaining + bigger_remaining <= matchingAmount * 1.1) {
					j--;
				}
			}
		}
		return (return_list);
	}

	public List<Offer> allRangeMatchingOffer(long id) {
		System.out.println("get all exact matching offers");
		Offer offer = offerService.getOfferById(id).get();
		float matchingAmount = offer.getRemainingBalance() * (offer.getExchangeRate());
		System.out.println(matchingAmount);
		String sourceCountry = offer.getDestinationCountry();
		String destinationCountry = offer.getSourceCountry();
		List<Offer> offers = offerService.getAllRangeMatchingOffer(id, matchingAmount, sourceCountry,
				destinationCountry);
		return (offers);
	}

	public List<List<Offer>> allOppositeMatchingOffer(long id) {
		System.out.println("get all exact matching offers");
		Offer offer = offerService.getOfferById(id).get();
		float matchingAmount = offer.getRemainingBalance() * (offer.getExchangeRate());
		System.out.println(matchingAmount);
		String sourceCountry = offer.getDestinationCountry();
		String destinationCountry = offer.getSourceCountry();

		String sameSourceCountry = offer.getSourceCountry();
		String sameDestinationCountry = offer.getDestinationCountry();
		List<Offer> oppositeOffers = offerService.getAllOppositeMatchingOffer(id, matchingAmount, sourceCountry,
				destinationCountry);
		List<Offer> sameCountryOffers = offerService.getAllSameMatchingOffer(id, sameSourceCountry,
				sameDestinationCountry);
		List<List<Offer>> return_list = new ArrayList<>();
		for (Offer c : oppositeOffers) {
			float remaining_c = c.getRemainingBalance() * (c.getExchangeRate());
			for (Offer b : sameCountryOffers) {
				float remaining_b = b.getRemainingBalance();
				if (remaining_c > remaining_b) {
					if ((matchingAmount + remaining_b) * 0.9 < remaining_c
							&& (matchingAmount + remaining_b) * 1.1 < remaining_c) {
						List<Offer> pair_match = new ArrayList<Offer>();
						pair_match.add(c);
						pair_match.add(b);
						return_list.add(pair_match);
					}
				}
			}
		}
		return (return_list);
	}

	@GetMapping("/getMatchingOffer/{id}")
	public ResponseEntity<?> getMatchingOffer(@PathVariable long id) {
		Offer offer = offerService.getOfferById(id).get();
		Set<Offer> matchingOffer = offer.getMatchingOffers();
		List<Offer> exactMatch = allExactMatchingOffer(id);
		List<Offer> rangeMatch = allRangeMatchingOffer(id);
		List<Offer> matches = exactMatch;
		matches.addAll(rangeMatch);
		if (offer.isAllowSplitExchange() == true) {
			if (matchingOffer.size() == 0) {
				List<List<Offer>> splitMatch = allSplitMatchingOffer(id);
				List<List<Offer>> oppositeMatch = allOppositeMatchingOffer(id);
				splitMatch.addAll(oppositeMatch);
				HashMap<String, Object> final_obj = new HashMap<String, Object>();
				final_obj.put("Exact_and_range", matches);
				final_obj.put("Split_and_Opposite", splitMatch);
				return new ResponseEntity<>(final_obj, HttpStatus.OK);
			}
		}
		HashMap<String, Object> final_obj = new HashMap<String, Object>();
		final_obj.put("Exact_and_range", matches);
		return new ResponseEntity<>(final_obj, HttpStatus.OK);
	}
}
