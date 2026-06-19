package com.jobboard.dto;

import com.jobboard.model.JobType;
import java.math.BigDecimal;

public record JobResponse(
        Long id,
        String title,
        String description,
        String location,
        JobType jobType,
        BigDecimal salaryMin,
        BigDecimal salaryMax,
        boolean isActive,
        String createdAt,
        CompanyResponse company
) {
}
