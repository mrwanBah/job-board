package com.jobboard.dto;

import com.jobboard.model.Role;

public record UserResponse(
        Long id,
        String email,
        String fullName,
        Role role
) {
}
