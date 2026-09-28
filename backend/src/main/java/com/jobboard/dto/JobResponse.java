package com.jobboard.dto;

import com.jobboard.model.JobType;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record JobResponse(
        Long id,
        String title,
        String description,
        String location,
        JobType jobType,
        BigDecimal salaryMin,
        BigDecimal salaryMax,
        boolean isActive,
        LocalDateTime createdAt,
        CompanyResponse company
) {
}
