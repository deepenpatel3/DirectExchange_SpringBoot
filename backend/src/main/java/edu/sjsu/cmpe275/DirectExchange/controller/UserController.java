package edu.sjsu.cmpe275.DirectExchange.controller;

import java.util.Optional;
import java.util.Set;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.sjsu.cmpe275.DirectExchange.model.BankAccount;
import edu.sjsu.cmpe275.DirectExchange.model.User;
import edu.sjsu.cmpe275.DirectExchange.service.UserService;;

@RestController
@CrossOrigin(origins = "*")
public class UserController {

	@Autowired
	public UserService userService;

	@RequestMapping(method = RequestMethod.POST, value = "/user")
	public ResponseEntity<?> createUser(@RequestBody User user) {
		try {
			System.out.println("create user -> " + user.getUid());

			Optional<User> user_found = userService.getUserByUID(user.getUid());

			if (user_found.isPresent()) {
				return new ResponseEntity<>("User already exists", HttpStatus.BAD_REQUEST);
			}

			return new ResponseEntity<>(userService.addUser(user), HttpStatus.CREATED);

		} catch (Exception e) {

			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/user/verify")
	public ResponseEntity<?> verifyUser(@RequestBody User user) {
		try {

			Optional<User> user_found = userService.getUser(user.getId());

			if (user_found.isPresent()) {
				user_found.get().setVerified(true);
				userService.updateUser(user.getId(), user_found.get());
				return new ResponseEntity<>("Verified", HttpStatus.OK);
			} else {
				return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
			}

		} catch (Exception e) {

			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
	}

	@RequestMapping(method = RequestMethod.GET, value = "/user/uid/{uid}")
	public ResponseEntity<?> getUserByUid(@PathVariable String uid) {
		System.out.println("get user by id called");
		try {
			Optional<User> user_found = userService.getUserByUID(uid);

			if (user_found.isPresent()) {
				System.out.println("user " + user_found.get().getId() + " nickname " + user_found.get().getNickname()
						+ " username " + user_found.get().getUsername());
				System.out.println("user " + user_found.get().toString());
				return new ResponseEntity<>(user_found, HttpStatus.OK);
			} else {
				return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {

			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
	}

}