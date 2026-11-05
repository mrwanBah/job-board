package com.jobboard.controller;

import com.jobboard.dto.ApplicationRequest;
import com.jobboard.dto.ApplicationResponse;
import com.jobboard.dto.ApplicationStatusRequest;
import com.jobboard.service.ApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Tag(name = "Applications", description = "Applicant and company application workflows")
@SecurityRequirement(name = "bearerAuth")
public class ApplicationController {
    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @Operation(summary = "Apply to a job", description = "Applicant-only endpoint. Duplicate applications are rejected.")
    @PreAuthorize("hasRole('APPLICANT')")
    @PostMapping("/jobs/{id}/apply")
    @ResponseStatus(HttpStatus.CREATED)
    public ApplicationResponse apply(
            @Parameter(description = "Job id", required = true) @PathVariable Long id,
            @Valid @RequestBody ApplicationRequest request
    ) {
        return applicationService.apply(id, request);
    }

    @Operation(summary = "Get my application for a job")
    @PreAuthorize("hasRole('APPLICANT')")
    @GetMapping("/jobs/{id}/my-application")
    public ApplicationResponse myApplication(@PathVariable Long id) { return applicationService.findMyApplication(id); }

    @Operation(summary = "Get my applications", description = "Returns applications submitted by the authenticated applicant.")
    @PreAuthorize("hasRole('APPLICANT')")
    @GetMapping("/applications/mine")
    public List<ApplicationResponse> myApplications() {
        return applicationService.findMine();
    }

    @Operation(summary = "Get applicants for a job", description = "Company-only endpoint for a job owned by the company.")
    @PreAuthorize("hasRole('COMPANY')")
    @GetMapping("/jobs/{id}/applications")
    public List<ApplicationResponse> jobApplications(
            @Parameter(description = "Job id", required = true) @PathVariable Long id
    ) {
        return applicationService.findForJob(id);
    }

    @Operation(summary = "Update application status", description = "The owning company can accept, reject, or review an application.")
    @PreAuthorize("hasRole('COMPANY')")
    @PutMapping("/applications/{id}/status")
    public ApplicationResponse updateStatus(
            @Parameter(description = "Application id", required = true) @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusRequest request
    ) {
        return applicationService.updateStatus(id, request);
    }
}
