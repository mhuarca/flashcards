package com.huarca.spring.api;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonRootName;
import com.huarca.spring.api.data.UserWithToken;
import com.huarca.spring.model.User;
import com.huarca.spring.services.JwtService;
import com.huarca.spring.services.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Handles all User related API calls.
 */
@RestController
@RequestMapping(path = "/api")
public class UsersApi {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Autowired
    public UsersApi(PasswordEncoder passwordEncoder,
                    UserRepository userRepository,
                    JwtService jwtService) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @GetMapping(path = "/user", produces = "application/json")
    public ResponseEntity<Map<String, Object>> getUser(@AuthenticationPrincipal User user,
                                                       @RequestHeader("authorization") String authorizationHeader) {
        if (user == null) {
            return ResponseEntity.status(404).body(null);
        } else {
            UserWithToken userWithToken = new UserWithToken(user, authorizationHeader.split(" ")[1]);
            return ResponseEntity.ok(generateUserResponse(userWithToken));
        }
    }

    @PostMapping(path = "/users", produces = "application/json")
    public ResponseEntity<Map<String, Object>> createUser(@Valid @RequestBody RegistrationData registrationData, 
                                                          BindingResult bindingResult) {
        checkUserInput(registrationData, bindingResult);
        final User user = new User(
            registrationData.getEmail(),
            registrationData.getUsername(),
            passwordEncoder.encode(registrationData.getPassword())
        );
        userRepository.save(user);
        final Optional<User> createdUser = userRepository.findByEmail(registrationData.getEmail());
        String token = jwtService.toToken(createdUser.get());
        UserWithToken userWithToken = new UserWithToken(createdUser.get(), token);
        return ResponseEntity.status(201).body(generateUserResponse(userWithToken));
    }

    @PostMapping(path = "/users/login", produces = "application/json")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginData loginData, 
                                                     BindingResult bindingResult) {
        checkBindingResult(bindingResult);
        Optional<User> matchedUser = userRepository.findByEmail(loginData.getEmail());
        if (matchedUser.isPresent() && passwordEncoder.matches(loginData.getPassword(), matchedUser.get().getPassword())) {
            String token = jwtService.toToken(matchedUser.get());
            UserWithToken userWithToken = new UserWithToken(matchedUser.get(), token);
            return ResponseEntity.ok(generateUserResponse(userWithToken));
        } else {
            bindingResult.rejectValue("email", "INVALID", "Invalid email or password.");
            bindingResult.rejectValue("password", "INVALID", "Invalid email or password.");
            throw new InvalidAPIRequestException(bindingResult);
        }
    }

    private void checkUserInput(RegistrationData registrationData, BindingResult bindingResult) {
        checkBindingResult(bindingResult);

        if (userRepository.findByUsername(registrationData.getUsername()).isPresent()) {
            bindingResult.rejectValue("username", "DUPLICATED", "Username is already taken.");
            throw new InvalidAPIRequestException(bindingResult);
        }

        if (userRepository.findByEmail(registrationData.getEmail()).isPresent()) {
            bindingResult.rejectValue("email", "DUPLICATED", "Email is already taken.");
            throw new InvalidAPIRequestException(bindingResult);
        }
    }

    private void checkBindingResult(BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new InvalidAPIRequestException(bindingResult);
        }
    }

    private Map<String,Object> generateUserResponse(UserWithToken userWithToken) {
        Map<String,Object> userResponse = new HashMap<>();
        userResponse.put("user", userWithToken);
        return userResponse;
    }

    /* ==================================== HELPER CLASSES ===================================== */

    @JsonRootName("user")
    static class RegistrationData {
        @NotBlank
        private String username;
        @NotBlank
        private String password;
        @NotBlank
        private String email;

        public RegistrationData() {}

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }

    @JsonRootName("user")
    static class LoginData {
        @NotBlank
        private String password;
        @NotBlank
        private String email;

        public LoginData() {}

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }
}
