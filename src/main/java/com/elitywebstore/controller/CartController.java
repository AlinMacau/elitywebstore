package com.elitywebstore.controller;

import com.elitywebstore.config.ApiEndpointConstants;
import com.elitywebstore.model.request.UpdateCartDto;
import com.elitywebstore.model.response.CartResponseDto;
import com.elitywebstore.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiEndpointConstants.BASE_CARTS_API)
public class CartController {

    @Autowired
    private CartService cartService;

    @PutMapping()
    public void updateCart(@Valid @RequestBody UpdateCartDto updateCartDto){
        cartService.updateCart(updateCartDto);
    }

    @GetMapping(ApiEndpointConstants.CARTS_GET_BY_ID)
    public CartResponseDto getCartById(@PathVariable Long id){

        return cartService.getDtoById(id);
    }


}
