package com.elitywebstore.config;

public class ApiEndpointConstants {

    public static final String BASE_API_V1 = "/api/v1";
    
    // User endpoints
    public static final String BASE_USERS_API = BASE_API_V1 + "/users";
    public static final String USERS_SIGNUP = "/users/signup";
    public static final String USERS_LOGIN = "/users/login";
    public static final String TOKENS_INVALIDATE = "/users/tokens/invalidate";
    
    // Product endpoints
    public static final String BASE_PRODUCTS_API = BASE_API_V1 + "/products";
    
    // Order endpoints
    public static final String BASE_ORDERS_API = BASE_API_V1 + "/orders";
    
    // Cart endpoints
    public static final String BASE_CARTS_API = BASE_API_V1 + "/carts";
    
    // Address endpoints
    public static final String BASE_ADDRESSES_API = BASE_API_V1 + "/addresses";
    public static final String ADDRESSES_GET_ALL_BY_USER_ID = "/user/{userId}";
    
    // Audit endpoints
    public static final String BASE_AUDIT_API = BASE_API_V1 + "/audit";
    public static final String AUDIT = "/audit";
    
    // Common
    public static final String BY_ID = "/{id}";
    
    // Admin endpoints (preparation for next iterations)
    public static final String BASE_ADMIN_API = BASE_API_V1 + "/admin";
    public static final String ADMIN_PRODUCTS = BASE_ADMIN_API + "/products";
    public static final String ADMIN_CATEGORIES = BASE_ADMIN_API + "/categories";
    public static final String ADMIN_ORDERS = BASE_ADMIN_API + "/orders";
    public static final String ADMIN_USERS = BASE_ADMIN_API + "/users";
    public static final String ADMIN_DASHBOARD = BASE_ADMIN_API + "/dashboard";
}
