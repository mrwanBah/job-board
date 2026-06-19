package com.jobboard.controller;

import com.jobboard.dto.JobResponse;
import com.jobboard.dto.PageResponse;
import com.jobboard.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/jobs")
public class JobController {
    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @Operation(summary = "List jobs with pagination and optional filters")
    @GetMapping
    public PageResponse<JobResponse> getJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String jobType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return jobService.findAll(page, size);
    }

    @Operation(summary = "Get one job with company information")
    @GetMapping("/{id}")
    public JobResponse getJob(@PathVariable Long id) {
        return jobService.findById(id);
    }

    @Operation(summary = "Create a job listing")
    @PostMapping
    public JobResponse createJob() {
        throw new UnsupportedOperationException("Create job is not implemented yet");
    }

    @Operation(summary = "Update a job listing")
    @PutMapping("/{id}")
    public JobResponse updateJob(@PathVariable Long id) {
        throw new UnsupportedOperationException("Update job is not implemented yet");
    }

    @Operation(summary = "Soft-delete or deactivate a job listing")
    @DeleteMapping("/{id}")
    public void deleteJob(@PathVariable Long id) {
        throw new UnsupportedOperationException("Delete job is not implemented yet");
    }

    @Operation(summary = "Get the current company's jobs")
    @GetMapping("/my")
    public PageResponse<JobResponse> myJobs() {
        throw new UnsupportedOperationException("My jobs is not implemented yet");
    }
}