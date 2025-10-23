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
        endpoints.put(ApiEndpointConstants.USERS_LIST_ALL, "List all users");
        endpoints.put(ApiEndpointConstants.USERS_GET_BY_ID, "Get user by id");
        endpoints.put(ApiEndpointConstants.USERS_UPDATE, "Update user");
        endpoints.put(ApiEndpointConstants.USERS_DELETE_BY_ID, "Delete user by id");


        return endpoints;

    }

}
