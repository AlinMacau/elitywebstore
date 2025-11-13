package com.elitywebstore.controller;

import com.elitywebstore.config.ApiEndpointConstants;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(ApiEndpointConstants.BASE_API_V1)
public class ApiEndpointsController {

    @GetMapping
    public Map<String, String> getAvailableEndpoints(){
        HashMap<String, String> endpoints = new HashMap<>();

        endpoints.put(ApiEndpointConstants.BASE_API_V1, "Lists all available endpoints in the api");
        endpoints.put(ApiEndpointConstants.USERS_SIGNUP, "Sign up for users");
        endpoints.put(ApiEndpointConstants.BY_ID, "by id");



        return endpoints;

    }

}
