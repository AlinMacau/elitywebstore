package com.elitywebstore.service;

import com.elitywebstore.entities.ROLE;
import com.elitywebstore.entities.User;
import com.elitywebstore.model.response.AdminUserResponseDto;
import com.elitywebstore.repository.OrderRepository;
import com.elitywebstore.repository.UserRepository;
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
public class AdminUserService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public List<AdminUserResponseDto> getAllUsers() {
        log.info("Getting all users for admin");
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public AdminUserResponseDto getUserById(Long id) {
        log.info("Getting user by id for admin: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        return convertToDto(user);
    }

    @Transactional
    public AdminUserResponseDto updateUserRole(Long id, ROLE newRole) {
        log.info("Updating user {} role to {}", id, newRole);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));

        ROLE oldRole = user.getRole();
        user.setRole(newRole);
        userRepository.save(user);

        log.info("User {} role updated from {} to {}", id, oldRole, newRole);
        return convertToDto(user);
    }

    private AdminUserResponseDto convertToDto(User user) {
        AdminUserResponseDto dto = new AdminUserResponseDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());

        if (user.getDetails() != null) {
            dto.setFirstName(user.getDetails().getFirstName());
            dto.setLastName(user.getDetails().getLastName());
            dto.setPhoneNumber(user.getDetails().getPhoneNumber());
        }

        // Count orders for this user
        int orderCount = orderRepository.findByUserId(user.getId()).size();
        dto.setOrderCount(orderCount);

        return dto;
    }
}