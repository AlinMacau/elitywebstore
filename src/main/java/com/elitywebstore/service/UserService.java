package com.elitywebstore.service;

import com.elitywebstore.entities.User;
import com.elitywebstore.entities.UserDetails;
import com.elitywebstore.model.request.SignUpRequestDto;
import com.elitywebstore.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UserService {

    @Autowired
    UserRepository userRepository;


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
}
