package com.is.a.Software.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.is.a.Software.entity.Social;
import com.is.a.Software.entity.User;

public interface SocialRepository extends JpaRepository<Social, Integer> {

	Optional<Social> findByUser(User user);
}
	