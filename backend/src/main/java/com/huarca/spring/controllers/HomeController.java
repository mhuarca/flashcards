package com.huarca.spring.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * HomeController
 */
@Controller
public class HomeController {

    /**
     * Configure Spring to serve the same Single Page Application to all known
     * front-end URLs. 
     * URLs that are not known will be directed to the 404 page.
     */
    @GetMapping(path = {
        "/",
        "/index.html",
        "/new",
        "/browse",
        "/login",
        "/deck/edit/**",
        "/deck/play/**",
        "/register"
    })
    public String greeting() {
        return "home";
    }
}