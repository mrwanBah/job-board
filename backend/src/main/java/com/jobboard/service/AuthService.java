package com.jobboard.service;

import com.jobboard.dto.AuthResponse;
import com.jobboard.dto.LoginRequest;
import com.jobboard.dto.RegisterRequest;
import com.jobboard.dto.UserResponse;
import com.jobboard.entity.Company;
import com.jobboard.entity.User;
import com.jobboard.model.Role;
import com.jobboard.repository.CompanyRepository;
import com.jobboard.repository.UserRepository;
import com.jobboard.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(
            UserRepository userRepository,
            CompanyRepository companyRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @org.springframework.transaction.annotation.Transactional
    public AuthResponse register(RegisterRequest request) {
        if (request.role() != Role.APPLICANT && request.role() != Role.COMPANY) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only APPLICANT and COMPANY registration is allowed");
        }
        String email = request.email().trim().toLowerCase(java.util.Locale.ROOT);
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }

        User user = new User(
                email,
                passwordEncoder.encode(request.password()),
                request.fullName(),
                request.role()
        );
        User savedUser = userRepository.save(user);

        if (savedUser.getRole() == Role.COMPANY) {
            companyRepository.save(new Company(savedUser, savedUser.getFullName(), null, null, null, null));
        }

        return toAuthResponse(savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email().trim().toLowerCase(java.util.Locale.ROOT))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return toAuthResponse(user);
    }

    public UserResponse currentUser() {
        return toUserResponse(getCurrentUser());
    }

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated"));
    }

    private AuthResponse toAuthResponse(User user) {
        return new AuthResponse(jwtUtil.generateToken(user.getEmail(), user.getRole().name()), toUserResponse(user));
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getFullName(), user.getRole());
    }
}
