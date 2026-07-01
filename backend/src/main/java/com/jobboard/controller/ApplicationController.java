package com.jobboard.controller;

import com.jobboard.dto.ApplicationResponse;
import com.jobboard.dto.CompanyResponse;
import com.jobboard.dto.JobResponse;
import com.jobboard.model.ApplicationStatus;
import com.jobboard.model.JobType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Tag(name = "Applications", description = "Job application endpoints")
public class ApplicationController {
    @Operation(summary = "Apply to a job")
    @PostMapping("/jobs/{id}/apply")
    public ApplicationResponse apply(@Parameter(description = "Job id") @PathVariable Long id) {
        return demoApplication();
    }

    @Operation(summary = "Get my applications")
    @GetMapping("/applications/mine")
    public List<ApplicationResponse> myApplications() {
        return List.of(demoApplication());
    }

    @Operation(summary = "Get applicants for a job")
    @GetMapping("/jobs/{id}/applications")
    public List<ApplicationResponse> jobApplications(@Parameter(description = "Job id") @PathVariable Long id) {
        return List.of(demoApplication());
    }

    @Operation(summary = "Update an application status")
    @PutMapping("/applications/{id}/status")
    public ApplicationResponse updateStatus(@Parameter(description = "Application id") @PathVariable Long id) {
        return demoApplication();
    }

    private ApplicationResponse demoApplication() {
        CompanyResponse company = new CompanyResponse(1L, "Acme Tech", null, null, null, "Riyadh");
        JobResponse job = new JobResponse(
                1L,
                "Backend Intern",
                "Build Spring Boot APIs for a job board.",
                "Riyadh",
                JobType.INTERNSHIP,
                new BigDecimal("3000.00"),
                new BigDecimal("5000.00"),
                true,
                "2026-06-12T10:00:00",
                company
        );
        return new ApplicationResponse(1L, job, "I am interested in this role.", ApplicationStatus.PENDING, "2026-06-12T10:30:00");
    }
}
