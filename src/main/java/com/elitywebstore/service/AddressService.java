package com.elitywebstore.service;

import com.elitywebstore.entities.Address;
import com.elitywebstore.model.request.AddressRequestDto;
import com.elitywebstore.model.request.AddressUpdateRequestDto;
import com.elitywebstore.model.response.AddressResponseDto;
import com.elitywebstore.repository.AddressRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ModelMapper modelMapper;

    public void createAddress(AddressRequestDto addressRequestDto) {
        Address newAddress = Address.builder()
                .addressType(addressRequestDto.getAddressType())
                .county(addressRequestDto.getCounty())
                .city(addressRequestDto.getCity())
                .street(addressRequestDto.getStreet())
                .postalCode(addressRequestDto.getPostalCode())
                .userDetails(userService.getById(addressRequestDto.getUserId()).getDetails())
                .build();

        addressRepository.save(newAddress);

    }

    public Address getById(Long id) {
        return addressRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Address not found"));
    }

    public AddressResponseDto getDtoById(Long id) {
        Address address = getById(id);

        return modelMapper.map(address, AddressResponseDto.class);
    }

    public List<AddressResponseDto> getAllByUserId(Long id) {
        List<Address> addresses = userService.getById(id)
                .getDetails()
                .getAddresses();

        return addresses.stream()
                .map(address -> modelMapper.map(address, AddressResponseDto.class))
                .collect(Collectors.toList());
    }

    public void update(@Valid AddressUpdateRequestDto addressUpdateRequestDto) {
        Address address = getById(addressUpdateRequestDto.getId());

        address.setAddressType(addressUpdateRequestDto.getAddressType());
        address.setCounty(addressUpdateRequestDto.getCounty());
        address.setCity(addressUpdateRequestDto.getCity());
        address.setStreet(addressUpdateRequestDto.getStreet());
        address.setPostalCode(addressUpdateRequestDto.getPostalCode());

        addressRepository.save(address);
    }

    public void deleteById(Long id) {
        addressRepository.deleteById(id);
    }
}

