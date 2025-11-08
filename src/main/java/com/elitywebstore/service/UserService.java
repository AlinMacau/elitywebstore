package com.elitywebstore.service;

import com.elitywebstore.entities.Address;
import com.elitywebstore.entities.User;
import com.elitywebstore.entities.UserDetails;
import com.elitywebstore.model.request.SignUpRequestDto;
import com.elitywebstore.model.request.UserUpdateRequestDto;
import com.elitywebstore.model.response.UserResponseDto;
import com.elitywebstore.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.lang.reflect.Array;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@Slf4j
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    PasswordEncoder passwordEncoder;

    public void createUser(@Valid SignUpRequestDto signUpRequestDto) {

        UserDetails userDetails = UserDetails.builder()
                .firstName(signUpRequestDto.getFirstName())
                .lastName(signUpRequestDto.getLastName())
                .phoneNumber(signUpRequestDto.getPhoneNumber())
                .build();

        User user = User.builder()
                .email(signUpRequestDto.getEmail())
                .password(passwordEncoder.encode(signUpRequestDto.getPassword()))
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

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    public UserResponseDto getDtoById(Long id) {
        User user = getById(id);

        return modelMapper.map(user, UserResponseDto.class);
    }

    public void updateUser(UserUpdateRequestDto userUpdateRequestDto) {
        User user = getById(userUpdateRequestDto.getId());

        user.setEmail(userUpdateRequestDto.getEmail());
        user.setPassword(userUpdateRequestDto.getPassword());

        user.getDetails().setFirstName(userUpdateRequestDto.getFirstName());
        user.getDetails().setLastName(userUpdateRequestDto.getLastName());
        user.getDetails().setPhoneNumber(userUpdateRequestDto.getPhoneNumber());

        userRepository.save(user);
    }

    public void deleteById(Long id) {
        userRepository.deleteById(id);     // soft delete?
    }

    public String loginUser(@Valid SignUpRequestDto signUpRequestDto) {
        User user = userRepository.getByEmail(signUpRequestDto.getEmail())
                .orElseThrow(() -> new EntityNotFoundException());

        if(passwordEncoder.matches(signUpRequestDto.getPassword(), user.getPassword())){
            return Jwts.builder()
                    .setSubject(user.getEmail())
                    .setIssuedAt(new Date())
                    .setExpiration(Date.from(LocalDateTime.now().plusHours(1).atZone(ZoneId.systemDefault()).toInstant()))
                    .signWith(SignatureAlgorithm.HS256, "e7d7c5c5acc9d80aa11dbe3a2f3fe55bc1d5148a91184b119a60db7883724015".getBytes())
                    .compact();
        }
        return "Invalid Credentials";
    }
}
