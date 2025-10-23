package com.elitywebstore.config;

public class ApiEndpointConstants {

    public static final String BASE_API_V1 = "/api/v1";
    public static final String BASE_USERS_API = BASE_API_V1 + "/users";
    public static final String USERS_SIGNUP = "/signup";
    public static final String USERS_LIST_ALL = "/listAll";
    public static final String USERS_GET_BY_ID = "/getById/{id}";
    public static final String USERS_DELETE_BY_ID = "/deleteById/{id}";
    public static final String USERS_UPDATE = "/update";

    public static final String BASE_CART_API = BASE_API_V1 + "/carts";
}
