package edu.sjsu.cmpe275.DirectExchange.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import edu.sjsu.cmpe275.DirectExchange.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	
	List<User> findUserByUid(String uid);

}
