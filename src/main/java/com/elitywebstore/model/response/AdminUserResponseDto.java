package com.elitywebstore.model.response;

import com.elitywebstore.entities.ROLE;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminUserResponseDto {
    private Long id;
    private String email;
    private ROLE role;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Integer orderCount;
}