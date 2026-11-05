package com.jobboard.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @Email @NotBlank @jakarta.validation.constraints.Size(max = 255) String email,
        @NotBlank String password
) {
    public LoginRequest { if (email != null) email = email.trim().toLowerCase(java.util.Locale.ROOT); }
}
