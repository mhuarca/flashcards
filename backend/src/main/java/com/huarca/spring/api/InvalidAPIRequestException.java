package com.huarca.spring.api;

import org.springframework.validation.Errors;

/**
 * InvalidAPIRequestException
 */
public class InvalidAPIRequestException extends RuntimeException {

    private static final long serialVersionUID = 1L;
    private final Errors errors;

    public InvalidAPIRequestException(Errors errors) {
        super("");
        this.errors = errors;
    }

    public Errors getErrors() {
        return errors;
    }
}