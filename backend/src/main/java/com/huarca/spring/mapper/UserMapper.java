package com.huarca.spring.mapper;

import com.huarca.spring.model.User;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * Mybatis Mapper for User queries.
 */
@Mapper
public interface UserMapper {
    void insert(@Param("user") User user);

    User findByEmail(@Param("email") String email);

    User findByUsername(@Param("username") String username);

    void update(@Param("user") User user);
}