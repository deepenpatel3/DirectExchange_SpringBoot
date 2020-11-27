package edu.sjsu.cmpe275.DirectExchange.controller;

import java.util.Optional;
import java.util.Set;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.sjsu.cmpe275.DirectExchange.model.BankAccount;
import edu.sjsu.cmpe275.DirectExchange.model.User;
import edu.sjsu.cmpe275.DirectExchange.service.BankAccountService;
import edu.sjsu.cmpe275.DirectExchange.service.UserService;;

@RestController
@CrossOrigin(origins = "*")
public class BankAccountController {

	@Autowired
	public BankAccountService bankAccountService;

	@Autowired
	public UserService userService;

	@RequestMapping(method = RequestMethod.POST, value = "/bankAccount")
	public ResponseEntity<?> createBankAccount(@Valid @RequestBody BankAccount bankAccount) {
		try {
			System.out.println("create BankAccount -> " + bankAccount.getAccountNumber());

			Optional<BankAccount> bankAccount_found = bankAccountService.getBankAccount(bankAccount.getAccountNumber());

			if (bankAccount_found.isPresent()) {
				return new ResponseEntity<>("Bank Account already exists", HttpStatus.BAD_REQUEST);
			}

			// Optional<User> user_found = userService.getUser(user);
			//
			// if (user_found.isPresent()) {
			// bankAccount.setOwner(user_found.get());
			// } else {
			// return new ResponseEntity<>("User not found", HttpStatus.BAD_REQUEST);
			// }
			return new ResponseEntity<>(bankAccountService.saveBankAccount(bankAccount), HttpStatus.CREATED);

		} catch (Exception e) {

			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
	}

	/**
	 * Get a BankAccount by Id
	 * 
	 * @param id
	 * @return BankAccount if exists
	 */

	@GetMapping(value = "/bankAccount/{userId}")
	public ResponseEntity<?> getBankAccounts(@PathVariable long userId) {
		System.out.println("get BankAccounts -> id: " + userId);
		return new ResponseEntity<>(userService.getUser(userId).get().getBankAccounts(), HttpStatus.OK);
	}

	@RequestMapping("/bankAccount/{accountNumber}")
	public ResponseEntity<?> getBankAccount(@PathVariable long accountNumber) {
		System.out.println("get BankAccount -> id: " + accountNumber);
		Optional<BankAccount> bankAccount = bankAccountService.getBankAccount(accountNumber);
		if (bankAccount.isPresent()) {
			return new ResponseEntity<>(bankAccount.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<>("BankAccount not found", HttpStatus.NOT_FOUND);
		}
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/bankAccount")
	public ResponseEntity<?> updateBankAccount(@Valid @RequestBody BankAccount bankAccount) {
		try {
			System.out.println("create BankAccount -> " + bankAccount.getAccountNumber());

			Optional<BankAccount> bankAccount_found = bankAccountService.getBankAccount(bankAccount.getAccountNumber());

			if (!bankAccount_found.isPresent()) {
				return new ResponseEntity<>("Bank Account not found", HttpStatus.NOT_FOUND);
			}
			// To do : should not be able to change user.

			return new ResponseEntity<>(bankAccountService.saveBankAccount(bankAccount), HttpStatus.OK);

		} catch (Exception e) {

			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/bankAccount/{accountNumber}")
	public ResponseEntity<?> deleteBankAccount(@PathVariable long accountNumber) {
		System.out.println("delete BankAccount -> id: " + accountNumber);

		Optional<BankAccount> bankAccount_found = bankAccountService.getBankAccount(accountNumber);
		if (bankAccount_found.isPresent()) {
			bankAccountService.deleteBankAccount(accountNumber);
			return new ResponseEntity<>("Bank Account deleted", HttpStatus.OK);
		} else {
			return new ResponseEntity<>("BankAccount not found", HttpStatus.NOT_FOUND);
		}
	}
}