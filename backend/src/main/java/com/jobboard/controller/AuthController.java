package com.jobboard.controller;

import com.jobboard.dto.AuthResponse;
import com.jobboard.dto.LoginRequest;
import com.jobboard.dto.RegisterRequest;
import com.jobboard.dto.UserResponse;
import com.jobboard.model.Role;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Operation(summary = "Register a new user")
    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        UserResponse user = new UserResponse(1L, request.email(), request.fullName(), request.role());
        return new AuthResponse("stub-jwt-token", user);
    }

    @Operation(summary = "Login and return a JWT token with user details")
    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        UserResponse user = new UserResponse(1L, request.email(), "Demo Company", Role.COMPANY);
        return new AuthResponse("stub-jwt-token", user);
    }

    @Operation(summary = "Get the current logged-in user")
    @GetMapping("/me")
    public UserResponse me() {
        return new UserResponse(1L, "company@example.com", "Demo Company", Role.COMPANY);
    }
}
