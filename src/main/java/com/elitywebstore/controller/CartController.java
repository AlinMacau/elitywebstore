package com.elitywebstore.controller;

import com.elitywebstore.config.ApiEndpointConstants;
import com.elitywebstore.model.request.UpdateCartDto;
import com.elitywebstore.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiEndpointConstants.BASE_CART_API)
public class CartController {

    @Autowired
    private CartService cartService;

    @PutMapping()
    public void updateCart(@RequestBody UpdateCartDto updateCartDto){
        cartService.updateCart(updateCartDto);
    }


}
