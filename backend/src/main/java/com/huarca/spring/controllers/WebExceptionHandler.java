package com.huarca.spring.controllers;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.core.annotation.Order;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.ModelAndView;


/**
 * Handles Exceptions for all controllers. 
 * This allows us to resend the Single Page Application to all known urls, and throw a 404 page
 * for unknown URLs.
 * 
 * Based off of the advice in this blog:
 * https://spring.io/blog/2013/11/01/exception-handling-in-spring-mvc
 */
@ControllerAdvice
@Order(2000) // Should lose to APIExceptionHandler with order 1000. Lower number is higher priority.
public class WebExceptionHandler {

    Logger logger = LoggerFactory.getLogger(WebExceptionHandler.class);

    public static final String DEFAULT_ERROR_VIEW = "error";
    

    @ExceptionHandler(value = Exception.class)
    public ModelAndView defaultErrorHandler(HttpServletRequest request, Exception e) throws Exception {
        // Rethrow already annotated exceptions to let the framework handle it.
        if (AnnotationUtils.findAnnotation(e.getClass(), ResponseStatus.class) != null) {
            throw e;
        }

        //Otherwise return default error-view
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("exception", e);
        modelAndView.addObject("url", request.getRequestURL());
        modelAndView.setViewName(DEFAULT_ERROR_VIEW);
        return modelAndView;
    }   
}