package com.jobboard.controller;

import com.jobboard.dto.JobRequest;
import com.jobboard.dto.JobResponse;
import com.jobboard.dto.PageResponse;
import com.jobboard.model.JobType;
import com.jobboard.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@RestController
@RequestMapping("/api/jobs")
@Tag(name = "Jobs", description = "Job listing endpoints")
public class JobController {
    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @Operation(summary = "List active jobs", description = "Public paginated search by text and job type.")
    @GetMapping
    public PageResponse<JobResponse> getJobs(
            @Parameter(description = "Search text matched against job title and description")
            @RequestParam(required = false) String search,
            @Parameter(description = "Filter by job type")
            @RequestParam(required = false) JobType jobType,
            @RequestParam(required = false) Long companyId,
            @Parameter(description = "Zero-based page number")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "10") int size
    ) {
        return jobService.findAll(search, jobType, companyId, page, size);
    }

    @Operation(summary = "Get job details", description = "Public job details including the company profile.")
    @GetMapping("/{id}")
    public JobResponse getJob(@Parameter(description = "Job id") @PathVariable Long id) {
        return jobService.findById(id);
    }

    @Operation(summary = "Create a job listing", description = "Company-only endpoint.")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('COMPANY')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobResponse createJob(@Valid @RequestBody JobRequest request) {
        return jobService.create(request);
    }

    @Operation(summary = "Update a job listing", description = "Only the company that owns the job can update it.")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('COMPANY')")
    @PutMapping("/{id}")
    public JobResponse updateJob(
            @Parameter(description = "Job id") @PathVariable Long id,
            @Valid @RequestBody JobRequest request
    ) {
        return jobService.update(id, request);
    }

    @Operation(summary = "Deactivate a job listing", description = "Only the owning company can set the job inactive.")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('COMPANY')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteJob(@Parameter(description = "Job id") @PathVariable Long id) {
        jobService.delete(id);
    }

    @Operation(summary = "Reactivate an owned job")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('COMPANY')")
    @org.springframework.web.bind.annotation.PatchMapping("/{id}/activate")
    public JobResponse activate(@PathVariable Long id) { return jobService.activate(id); }

    @Operation(summary = "Get current company's jobs", description = "Returns active jobs owned by the authenticated company.")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('COMPANY')")
    @GetMapping("/my")
    public PageResponse<JobResponse> myJobs(
            @Parameter(description = "Zero-based page number")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "10") int size
    ) {
        return jobService.findCurrentCompanyJobs(page, size);
    }
}
