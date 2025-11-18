package com.elitywebstore.service;

import com.elitywebstore.entities.User;
import com.elitywebstore.model.request.UserUpdateRequestDto;
import com.elitywebstore.model.response.UserResponseDto;
import com.elitywebstore.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ModelMapper modelMapper;

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

        save(user);
    }

    public void deleteById(Long id) {
        userRepository.deleteById(id);     // soft delete?
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public String getTokenByUserEmail(String email){
        return userRepository.getByEmail(email)
                .orElseThrow(()->new EntityNotFoundException())
                .getActiveToken();
    }

    public void save(User user){
        log.info("User {} saved", user.getId());
    }
}
