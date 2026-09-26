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

    public CompanyResponse updateMine(CompanyUpdateRequest request) {
        User user = authService.getCurrentUser();
        if (user.getRole() != Role.COMPANY) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only company users can update a company profile");
        }

        Company company = companyRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("Company profile not found"));
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
