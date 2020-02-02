package com.huarca.spring.services;

import java.util.Optional;

import com.huarca.spring.mapper.UserMapper;
import com.huarca.spring.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

/**
 * MyBatis implementation of a User Repository.
 */
@Repository
public class MyBatisUserRepository implements UserRepository {
    private final UserMapper userMapper;

    @Autowired
    public MyBatisUserRepository(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return Optional.ofNullable(userMapper.findByEmail(email));
    }

    @Override
    public void save(User user) {
        if (userMapper.findByEmail(user.getEmail()) == null) {
            userMapper.insert(user);
        } else {
            userMapper.update(user);
        }
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return Optional.ofNullable(userMapper.findByUsername(username));
    }
}