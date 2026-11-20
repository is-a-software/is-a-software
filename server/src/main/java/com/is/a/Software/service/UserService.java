package com.is.a.Software.service;

import com.is.a.Software.dto.LimitDto;
import com.is.a.Software.dto.UpdateUsernameDto;
import com.is.a.Software.entity.User;

public interface UserService {

	LimitDto getLimits(String email);

	UpdateUsernameDto updateUsername(String email, String name);

	/**
	 * Finds the account for a Central Auth identity, linking a migrated email/password account by
	 * verified email the first time, or creating a new account.
	 *
	 * @throws IllegalStateException if the email belongs to an account linked to a different identity
	 */
	User signInWithCentralAuth(String sub, String verifiedEmail, String name);
}
