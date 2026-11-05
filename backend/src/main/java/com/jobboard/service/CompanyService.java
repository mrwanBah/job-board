package com.jobboard.service;

import com.jobboard.dto.CompanyResponse;
import com.jobboard.dto.CompanyUpdateRequest;
import com.jobboard.entity.Company;
import com.jobboard.entity.User;
import com.jobboard.exception.NotFoundException;
import com.jobboard.model.Role;
import com.jobboard.repository.CompanyRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class CompanyService {
    private final CompanyRepository companyRepository;
    private final AuthService authService;

    public CompanyService(CompanyRepository companyRepository, AuthService authService) {
        this.companyRepository = companyRepository;
        this.authService = authService;
    }

    @Transactional(readOnly = true)
    public CompanyResponse findById(Long id) {
        return toResponse(companyRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Company not found")));
    }

    @Transactional(readOnly = true)
    public CompanyResponse findMine() {
        return toResponse(companyRepository.findByUser(authService.getCurrentUser())
                .orElseThrow(() -> new NotFoundException("Company profile not found")));
    }
    private void validateUrl(String value) {
        if (value == null || value.isBlank()) return;
        try {
            java.net.URI uri = java.net.URI.create(value);
            if (!("https".equalsIgnoreCase(uri.getScheme()) || "http".equalsIgnoreCase(uri.getScheme())) || uri.getHost() == null)
                throw new IllegalArgumentException();
        } catch (IllegalArgumentException ex) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Website and logo must be valid http/https URLs"); }
    }
    public CompanyResponse updateMine(CompanyUpdateRequest request) {
        User user = authService.getCurrentUser();
        if (user.getRole() != Role.COMPANY) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only company users can update a company profile");
        }

        Company company = companyRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("Company profile not found"));
        validateUrl(request.website());
        validateUrl(request.logoUrl());
        company.update(request.name(), request.description(), request.website(), request.logoUrl(), request.location());
        return toResponse(companyRepository.save(company));
    }

    private CompanyResponse toResponse(Company company) {
        return new CompanyResponse(
                company.getId(),
                company.getName(),
                company.getDescription(),
                company.getWebsite(),
                company.getLogoUrl(),
                company.getLocation()
        );
    }
}
