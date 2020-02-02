package com.huarca.spring.services;

import java.util.Optional;

import com.huarca.spring.model.User;

import org.springframework.stereotype.Service;

/**
 * JwtService
 */
@Service
public interface JwtService {
    String toToken(User user);

    Optional<String> getSubFromToken(String token);
}