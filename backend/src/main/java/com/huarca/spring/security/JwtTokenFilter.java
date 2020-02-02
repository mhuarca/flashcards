package com.huarca.spring.security;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.huarca.spring.model.User;
import com.huarca.spring.services.JwtService;
import com.huarca.spring.services.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * JwtTokenFilter
 */
public class JwtTokenFilter extends OncePerRequestFilter {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    private final String AUTH_HEADER = "Authorization";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        Optional<String> token = getTokenString(request.getHeader(AUTH_HEADER));
        if (token.isPresent()) {
            Optional<String> subject = jwtService.getSubFromToken(token.get());
            if (subject.isPresent()) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication == null 
                        || authentication.getPrincipal() == null 
                        || !(authentication.getPrincipal() instanceof User)) {
                    Optional<User> user = userRepository.findByEmail(subject.get());
                    if (user.isPresent()) {
                        setUserAsPrincipal(user.get(), request);
                    }
                }
                Object principal = authentication.getPrincipal();
                if (principal != null && principal instanceof User) {
                    if (principal != null && principal instanceof User) {
                        setUserAsPrincipal((User) principal, request);
                    }
                }
            }
        }
        filterChain.doFilter(request, response);
    }

    private Optional<String> getTokenString(String header) {
        if (header == null) {
            return Optional.empty();
        } else {
            String[] split = header.split(" ");
            if (split.length < 2) {
                return Optional.empty();
            } else {
                return Optional.ofNullable(split[1]);
            }
        }
    }

    private void setUserAsPrincipal(User user, HttpServletRequest request) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
            user, 
            null, 
            Collections.emptyList()
        );
        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
    }
}