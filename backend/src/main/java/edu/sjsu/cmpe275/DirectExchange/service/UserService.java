package edu.sjsu.cmpe275.DirectExchange.service;

import java.util.Optional;

//import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.sjsu.cmpe275.DirectExchange.model.User;
import edu.sjsu.cmpe275.DirectExchange.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	public UserRepository UserRepository;
	
	public Optional<User> getUser(long id){
		return UserRepository.findById(id);
	}
	
	public User addUser(User user){
		return UserRepository.save(user);
	}
	
	public User updateUser(long id, User user) {
		user.setId(id);
		return UserRepository.save(user);
	}
	
	public void deleteUser(long id) {
		UserRepository.deleteById(id);
	}
	
	
}