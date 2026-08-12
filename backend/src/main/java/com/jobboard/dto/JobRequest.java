package com.jobboard.dto;

import com.jobboard.model.JobType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public record JobRequest(
        @NotBlank String title,
        @NotBlank String description,
        String location,
        @NotNull JobType jobType,
        BigDecimal salaryMin,
        BigDecimal salaryMax,
        LocalDate expiresAt
) {
}
