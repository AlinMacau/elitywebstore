package com.elitywebstore.service;

import com.elitywebstore.entities.Address;
import com.elitywebstore.entities.AddressType;
import com.elitywebstore.entities.User;
import com.elitywebstore.entities.UserDetails;
import com.elitywebstore.model.request.AddressRequestDto;
import com.elitywebstore.model.request.AddressUpdateRequestDto;
import com.elitywebstore.model.response.AddressResponseDto;
import com.elitywebstore.repository.AddressRepository;
import com.elitywebstore.repository.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AddressService {

        private final AddressRepository addressRepository;
        private final OrderRepository orderRepository;
        private final UserService userService;

        // ==================== PUBLIC METHODS ====================

        @Transactional
        public AddressResponseDto createAddress(AddressRequestDto request) {
            log.info("Creating address for user: {}", request.getUserId());

            User user = userService.getById(request.getUserId());
            UserDetails userDetails = user.getDetails();

            if (userDetails == null) {
                throw new RuntimeException("User details not found for user: " + request.getUserId());
            }

            if (Boolean.TRUE.equals(request.getIsDefault())) {
                clearDefaultForType(userDetails.getId(), request.getAddressType());
            }

            Address address = Address.builder()
                    .addressType(request.getAddressType())
                    .county(request.getCounty())
                    .city(request.getCity())
                    .street(request.getStreet())
                    .postalCode(request.getPostalCode())
                    .isDefault(request.getIsDefault() != null ? request.getIsDefault() : false)
                    .active(true)
                    .userDetails(userDetails)
                    .build();

            Address savedAddress = addressRepository.save(address);
            log.info("Address created with id: {}", savedAddress.getId());

            return convertToDto(savedAddress);
        }

        public AddressResponseDto getDtoById(Long id) {
            return convertToDto(getById(id));
        }

        public Address getById(Long id) {
            return addressRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Address not found with id: " + id));
        }

        public List<AddressResponseDto> getAllByUserId(Long userId) {
            log.info("Getting all active addresses for user: {}", userId);

            User user = userService.getById(userId);
            UserDetails userDetails = user.getDetails();

            if (userDetails == null) {
                return List.of();
            }

            return addressRepository.findActiveByUserDetailsId(userDetails.getId())
                    .stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        }

        public List<AddressResponseDto> getByUserIdAndType(Long userId, AddressType addressType) {
            log.info("Getting {} addresses for user: {}", addressType, userId);

            User user = userService.getById(userId);
            UserDetails userDetails = user.getDetails();

            if (userDetails == null) {
                return List.of();
            }

            return addressRepository.findActiveByUserDetailsIdAndAddressType(userDetails.getId(), addressType)
                    .stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        }

        public AddressResponseDto getDefaultByUserIdAndType(Long userId, AddressType addressType) {
            log.info("Getting default {} address for user: {}", addressType, userId);

            User user = userService.getById(userId);
            UserDetails userDetails = user.getDetails();

            if (userDetails == null) {
                return null;
            }

            return addressRepository.findDefaultByUserDetailsIdAndAddressType(userDetails.getId(), addressType)
                    .map(this::convertToDto)
                    .orElse(null);
        }

        @Transactional
        public AddressResponseDto update(AddressUpdateRequestDto request) {
            log.info("Updating address: {}", request.getId());

            Address address = getById(request.getId());

            if (Boolean.FALSE.equals(address.getActive())) {
                throw new RuntimeException("Cannot update inactive address");
            }

            if (Boolean.TRUE.equals(request.getIsDefault()) && !Boolean.TRUE.equals(address.getIsDefault())) {
                clearDefaultForType(address.getUserDetails().getId(), request.getAddressType());
            }

            address.setAddressType(request.getAddressType());
            address.setCounty(request.getCounty());
            address.setCity(request.getCity());
            address.setStreet(request.getStreet());
            address.setPostalCode(request.getPostalCode());

            if (request.getIsDefault() != null) {
                address.setIsDefault(request.getIsDefault());
            }

            Address updatedAddress = addressRepository.save(address);
            log.info("Address updated: {}", updatedAddress.getId());

            return convertToDto(updatedAddress);
        }

        @Transactional
        public AddressResponseDto setDefault(Long addressId) {
            log.info("Setting address {} as default", addressId);

            Address address = getById(addressId);

            if (Boolean.FALSE.equals(address.getActive())) {
                throw new RuntimeException("Cannot set inactive address as default");
                }

            clearDefaultForType(address.getUserDetails().getId(), address.getAddressType());

            address.setIsDefault(true);
            Address updatedAddress = addressRepository.save(address);

            log.info("Address {} set as default for type {}", addressId, address.getAddressType());
            return convertToDto(updatedAddress);
        }

        @Transactional
        public void deleteById(Long id) {
            log.info("Attempting to delete address: {}", id);

            Address address = getById(id);

            boolean hasOrders = orderRepository.existsByShippingAddressIdOrBillingAddressId(id);

            if (hasOrders) {
                long orderCount = orderRepository.countByAddressId(id);
                log.info("Address {} has {} orders - performing soft delete", id, orderCount);

                address.setActive(false);
                address.setIsDefault(false);
                addressRepository.save(address);

                log.info("Address {} soft deleted", id);
            } else {
                log.info("Address {} has no orders - performing hard delete", id);
                addressRepository.delete(address);
                log.info("Address {} hard deleted", id);
            }
        }

        // ==================== INTERNAL METHODS ====================

        /**
         * Creates a new address and returns the entity (for internal use by other services)
         */
        @Transactional
        public Address createAddressEntity(AddressRequestDto request) {
            log.info("Creating new address entity: {}", request);

            Address address = Address.builder()
                    .addressType(request.getAddressType())
                    .street(request.getStreet())
                    .city(request.getCity())
                    .county(request.getCounty())
                    .postalCode(request.getPostalCode())
                    .isDefault(false)
                    .active(true)
                    .build();

            return addressRepository.save(address);
        }

        // ==================== PRIVATE METHODS ====================

        private void clearDefaultForType(Long userDetailsId, AddressType addressType) {
            log.debug("Clearing default flag for {} addresses of userDetails: {}", addressType, userDetailsId);

            List<Address> addresses = addressRepository.findActiveByUserDetailsIdAndAddressType(userDetailsId, addressType);
            for (Address addr : addresses) {
                if (Boolean.TRUE.equals(addr.getIsDefault())) {
                    addr.setIsDefault(false);
                    addressRepository.save(addr);
                }
            }
        }

        private AddressResponseDto convertToDto(Address address) {
            return AddressResponseDto.builder()
                    .id(address.getId())
                    .addressType(address.getAddressType())
                    .county(address.getCounty())
                    .city(address.getCity())
                    .street(address.getStreet())
                    .postalCode(address.getPostalCode())
                    .isDefault(address.getIsDefault())
                    .active(address.getActive())
                    .build();
        }
}
