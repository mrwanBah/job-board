package com.jobboard.controller;

import com.jobboard.dto.CompanyResponse;
import com.jobboard.dto.CompanyUpdateRequest;
import com.jobboard.service.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/companies")
@Tag(name = "Companies", description = "Public and authenticated company profile endpoints")
public class CompanyController {
    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @Operation(summary = "Get a public company profile")
    @GetMapping("/{id}")
    public CompanyResponse getCompany(
            @Parameter(description = "Company id", required = true) @PathVariable Long id
    ) {
        return companyService.findById(id);
    }

    @Operation(summary = "Get current company profile")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('COMPANY')")
    @GetMapping("/me")
    public CompanyResponse myCompany() { return companyService.findMine(); }

    @Operation(summary = "Update current company profile", description = "Updates the profile owned by the authenticated company user.")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('COMPANY')")
    @PutMapping("/me")
    public CompanyResponse updateMyCompany(@Valid @RequestBody CompanyUpdateRequest request) {
        return companyService.updateMine(request);
    }
}
