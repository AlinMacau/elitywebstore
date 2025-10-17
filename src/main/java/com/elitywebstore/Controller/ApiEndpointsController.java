package com.elitywebstore.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class ApiEndpointsController {

    @GetMapping("/api/v1")
    public Map<String, String> GetAvailableEndpoints(){
        HashMap<String, String> endpoints = new HashMap<>();

        endpoints.put("/api/v1", "Lists all available endpoints in the api");

        return endpoints;

    }

}
