package com.elitywebstore.repository;

import com.elitywebstore.entities.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> getByEmail(@NotBlank(message = "Email should not be blank") @Email String email);

    boolean existsByEmail(String email);
}
