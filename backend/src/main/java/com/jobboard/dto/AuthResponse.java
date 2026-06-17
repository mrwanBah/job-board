package com.jobboard.dto;

public record AuthResponse(
        String token,
        UserResponse user
) {
}
