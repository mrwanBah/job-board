package com.jobboard.dto;

import com.jobboard.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @Email @NotBlank @Size(max = 255) String email,
        @NotBlank @Size(min = 8, max = 72) String password,
        @NotBlank @Size(max = 255) String fullName,
        @NotNull Role role
) {
    public RegisterRequest { if (email != null) email = email.trim().toLowerCase(java.util.Locale.ROOT); }
    @jakarta.validation.constraints.AssertTrue(message = "Password must not exceed 72 UTF-8 bytes")
    public boolean isPasswordByteLengthValid() {
        return password == null || password.getBytes(java.nio.charset.StandardCharsets.UTF_8).length <= 72;
    }
}
