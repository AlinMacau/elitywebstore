package com.elitywebstore.config;

public class ApiEndpointConstants {

    public static final String BASE_API_V1 = "/api/v1";
    public static final String BASE_USERS_API = BASE_API_V1 + "/users";
    public static final String USERS_SIGNUP = "/signup";
    public static final String USERS_GET_BY_ID = "/{id}";
    public static final String USERS_DELETE_BY_ID = "/{id}";

    public static final String BASE_CARTS_API = BASE_API_V1 + "/carts";
    public static final String CARTS_GET_BY_ID = "/{id}";

    public static final String BASE_ORDERS_API = BASE_API_V1 + "/orders";


}
