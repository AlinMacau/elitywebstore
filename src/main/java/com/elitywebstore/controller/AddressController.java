package com.elitywebstore.controller;

import com.elitywebstore.config.ApiEndpointConstants;
import com.elitywebstore.entities.AddressType;
import com.elitywebstore.model.request.AddressRequestDto;
import com.elitywebstore.model.request.AddressUpdateRequestDto;
import com.elitywebstore.model.response.AddressResponseDto;
import com.elitywebstore.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(ApiEndpointConstants.BASE_ADDRESSES_API)
@Slf4j
public class AddressController {

    private final AddressService addressService;

    @PostMapping
    public AddressResponseDto createAddress(@Valid @RequestBody AddressRequestDto addressRequestDto) {
        log.info("Creating address for user: {}", addressRequestDto.getUserId());
        return addressService.createAddress(addressRequestDto);
    }

    @GetMapping(ApiEndpointConstants.BY_ID)
    public AddressResponseDto getById(@PathVariable Long id) {
        log.info("Getting address by id: {}", id);
        return addressService.getDtoById(id);
    }

    @GetMapping(ApiEndpointConstants.ADDRESSES_GET_ALL_BY_USER_ID)
    public List<AddressResponseDto> getAllByUserId(@PathVariable Long userId) {
        log.info("Getting all addresses for user: {}", userId);
        return addressService.getAllByUserId(userId);
    }

    @GetMapping("/user/{userId}/type/{addressType}")
    public List<AddressResponseDto> getByUserIdAndType(
            @PathVariable Long userId,
            @PathVariable AddressType addressType) {
        log.info("Getting {} addresses for user: {}", addressType, userId);
        return addressService.getByUserIdAndType(userId, addressType);
    }

    @GetMapping("/user/{userId}/default/{addressType}")
    public AddressResponseDto getDefaultByUserIdAndType(
            @PathVariable Long userId,
            @PathVariable AddressType addressType) {
        log.info("Getting default {} address for user: {}", addressType, userId);
        return addressService.getDefaultByUserIdAndType(userId, addressType);
    }

    @PutMapping
    public AddressResponseDto update(@Valid @RequestBody AddressUpdateRequestDto addressUpdateRequestDto) {
        log.info("Updating address: {}", addressUpdateRequestDto.getId());
        return addressService.update(addressUpdateRequestDto);
    }

    @PatchMapping("/{id}/default")
    public AddressResponseDto setDefault(@PathVariable Long id) {
        log.info("Setting address {} as default", id);
        return addressService.setDefault(id);
    }

    @DeleteMapping(ApiEndpointConstants.BY_ID)
    public void deleteById(@PathVariable Long id) {
        log.info("Deleting address: {}", id);
        addressService.deleteById(id);
    }
}
