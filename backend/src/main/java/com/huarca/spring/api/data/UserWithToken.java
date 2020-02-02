package com.huarca.spring.api.data;

import com.huarca.spring.model.User;

/**
 * Combines User data and an associated authentication token to return
 * to the client as one object.
 */
public class UserWithToken {

    private final String email;
    private final String username;
    private final String token;

    public UserWithToken(User user, String token) {
        this.email = user.getEmail();
        this.username = user.getUsername();
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }

    public String getToken() {
        return token;
    }
}