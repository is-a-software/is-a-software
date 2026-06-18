package com.is.a.Software.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.is.a.Software.dto.UserDto;
import com.is.a.Software.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

	public boolean existsByEmail(String email);
	
	Optional<User> findByEmail(String email);

}
