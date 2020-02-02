package com.huarca.spring.services;

import java.util.Optional;

import com.huarca.spring.model.User;

import org.springframework.stereotype.Repository;

/**
 * Repository for User data.
 */
@Repository
public interface UserRepository {
    void save(User user);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);
}