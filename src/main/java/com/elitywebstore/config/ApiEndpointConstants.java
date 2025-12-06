package com.elitywebstore.config;

public class ApiEndpointConstants {

    public static final String BASE_API_V1 = "/api/v1";
    public static final String BY_ID = "/{id}";


    public static final String BASE_USERS_API = BASE_API_V1 + "/users";
    public static final String USERS_SIGNUP = BASE_USERS_API + "/signup";
    public static final String USERS_LOGIN = BASE_USERS_API + "/login";
    public static final String TOKENS_INVALIDATE = BASE_API_V1 + "/tokens/invalidate";
    public static final String AUDIT = BASE_API_V1 + "/audit";

    public static final String BASE_CARTS_API = BASE_API_V1 + "/carts";

    public static final String BASE_ORDERS_API = BASE_API_V1 + "/orders";

    public static final String BASE_ADDRESSES_API = BASE_API_V1 + "/addresses";
    public static final String ADDRESSES_GET_ALL_BY_USER_ID = "/user/{userId}";






}
