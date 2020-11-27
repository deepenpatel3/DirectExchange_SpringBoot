package edu.sjsu.cmpe275.DirectExchange.service;

import java.util.List;
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
	
	public User getUserByUID(String uid){
		List<User> users =  UserRepository.findUserByUid(uid);
		return users.size() > 0 ? users.get(0): null;
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