package com.elitywebstore.service;

import com.elitywebstore.entities.Address;
import com.elitywebstore.entities.User;
import com.elitywebstore.entities.UserDetails;
import com.elitywebstore.model.request.SignUpRequestDto;
import com.elitywebstore.model.request.UserUpdateRequestDto;
import com.elitywebstore.model.response.UserResponseDto;
import com.elitywebstore.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ModelMapper modelMapper;
    private Address address;


    public void createUser(@Valid SignUpRequestDto signUpRequestDto) {

        UserDetails userDetails = UserDetails.builder()
                .firstName(signUpRequestDto.getFirstName())
                .lastName(signUpRequestDto.getLastName())
                .phoneNumber(signUpRequestDto.getPhoneNumber())
                .build();

        User user = User.builder()
                .email(signUpRequestDto.getEmail())
                .password(signUpRequestDto.getPassword())
                .details(userDetails)
                .build();

        userRepository.save(user);

        log.info("User created: {}", user );
    }

    public List<UserResponseDto> listAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> modelMapper.map(user, UserResponseDto.class))
                .collect(Collectors.toList());

    }

    public void updateUser(UserUpdateRequestDto userUpdateRequestDto) {
        User user = userRepository.findById(userUpdateRequestDto.getId())
                .orElseThrow(()-> new EntityNotFoundException("User not found"));

        user.setId(userUpdateRequestDto.getId());
        user.setEmail(userUpdateRequestDto.getEmail());
        user.setPassword(userUpdateRequestDto.getPassword());

        user.getDetails().setFirstName(userUpdateRequestDto.getFirstName());
        user.getDetails().setLastName(userUpdateRequestDto.getLastName());
        user.getDetails().setPhoneNumber(userUpdateRequestDto.getPhoneNumber());

//        user.getDetails().getAddresses().get(0).setAddressType(userUpdateRequestDto.getAddressType());
//        user.getDetails().getAddresses().get(0).setCounty(userUpdateRequestDto.getCounty());
//        user.getDetails().getAddresses().get(0).setCity(userUpdateRequestDto.getCity());
//        user.getDetails().getAddresses().get(0).setStreet(userUpdateRequestDto.getStreet());
//        user.getDetails().getAddresses().get(0).setPostalCode(userUpdateRequestDto.getPostalCode());

        userRepository.save(user);
    }
}
