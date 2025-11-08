package com.elitywebstore.controller;

import com.elitywebstore.config.ApiEndpointConstants;
import com.elitywebstore.model.request.AddressRequestDto;
import com.elitywebstore.model.request.AddressUpdateRequestDto;
import com.elitywebstore.model.response.AddressResponseDto;
import com.elitywebstore.service.AddressService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiEndpointConstants.BASE_ADDRESSES_API)
public class AddressController {

    @Autowired
    private AddressService addressService;

    @PostMapping
    public void createAddress(@Valid @RequestBody AddressRequestDto addressRequestDto){
        addressService.createAddress(addressRequestDto);
    }

    @GetMapping(ApiEndpointConstants.BY_ID)
    public AddressResponseDto getById(@PathVariable Long id){
        return addressService.getDtoById(id);
    }

    @GetMapping(ApiEndpointConstants.ADDRESSES_GET_ALL_BY_USER_ID)
    public List<AddressResponseDto> getAllByUserId(@PathVariable Long userId){
        return addressService.getAllByUserId(userId);
    }

    @PutMapping
    public void update(@Valid @RequestBody AddressUpdateRequestDto addressUpdateRequestDto){
        addressService.update(addressUpdateRequestDto);
    }

    @DeleteMapping(ApiEndpointConstants.BY_ID)
    public void deleteById(@PathVariable Long id){
        addressService.deleteById(id);
    }

}
