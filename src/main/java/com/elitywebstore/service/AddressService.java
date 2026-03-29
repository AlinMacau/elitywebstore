package com.elitywebstore.service;

import com.elitywebstore.entities.Address;
import com.elitywebstore.entities.User;
import com.elitywebstore.model.request.AddressRequestDto;
import com.elitywebstore.model.request.AddressUpdateRequestDto;
import com.elitywebstore.model.response.AddressResponseDto;
import com.elitywebstore.repository.AddressRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AddressService {

        private final AddressRepository addressRepository;
        private final UserService userService;
        private final ModelMapper modelMapper;

        public void createAddress(AddressRequestDto addressRequestDto) {
            log.info("Creating address for user: {}", addressRequestDto.getUserId());
            User user = userService.getById(addressRequestDto.getUserId());
        
            Address address = Address.builder()
                    .addressType(addressRequestDto.getAddressType())
                    .county(addressRequestDto.getCounty())
                    .city(addressRequestDto.getCity())
                    .street(addressRequestDto.getStreet())
                    .postalCode(addressRequestDto.getPostalCode())
                    .userDetails(user.getDetails())
                    .build();
        
            addressRepository.save(address);
            log.info("Address created successfully with id: {}", address.getId());
        }

        public Address getById(Long id) {
            log.info("Fetching address by id: {}", id);
            return addressRepository.findById(id)
                    .orElseThrow(() -> {
                        log.error("Address not found with id: {}", id);
                        return new EntityNotFoundException("Address not found");
                    });
        }

        public AddressResponseDto getDtoById(Long id) {
            Address address = getById(id);
            return modelMapper.map(address, AddressResponseDto.class);
        }

        public List<AddressResponseDto> getAllByUserId(Long id) {
            log.info("Fetching all addresses for user: {}", id);
            List<Address> addresses = userService.getById(id)
                    .getDetails()
                    .getAddresses();

            log.info("Found {} addresses for user {}", addresses.size(), id);
            return addresses.stream()
                    .map(address -> modelMapper.map(address, AddressResponseDto.class))
                    .collect(Collectors.toList());
        }

        public void update(AddressUpdateRequestDto addressUpdateRequestDto) {
            log.info("Updating address with id: {}", addressUpdateRequestDto.getId());
            Address address = getById(addressUpdateRequestDto.getId());
        
            address.setAddressType(addressUpdateRequestDto.getAddressType());
            address.setCounty(addressUpdateRequestDto.getCounty());
            address.setCity(addressUpdateRequestDto.getCity());
            address.setStreet(addressUpdateRequestDto.getStreet());
            address.setPostalCode(addressUpdateRequestDto.getPostalCode());
        
            addressRepository.save(address);
            log.info("Address updated successfully");
        }

        public void deleteById(Long id) {
            log.info("Deleting address with id: {}", id);
            addressRepository.deleteById(id);
            log.info("Address deleted successfully");
        }
}
