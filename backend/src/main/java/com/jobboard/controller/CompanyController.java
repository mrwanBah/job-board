package com.jobboard.controller;

import com.jobboard.dto.CompanyResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/companies")
@Tag(name = "Companies", description = "Company profile endpoints")
public class CompanyController {
    @Operation(summary = "Get a public company profile")
    @GetMapping("/{id}")
    public CompanyResponse getCompany(@Parameter(description = "Company id") @PathVariable Long id) {
        return demoCompany();
    }

    @Operation(summary = "Update the current company's profile")
    @PutMapping("/me")
    public CompanyResponse updateMyCompany() {
        return demoCompany();
    }

    private CompanyResponse demoCompany() {
        return new CompanyResponse(
                1L,
                "Acme Tech",
                "A demo company for the API contract.",
                "https://example.com",
                null,
                "Riyadh"
        );
    }
}
