package com.jobboard.dto;
import com.jobboard.model.JobType;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
public record JobRequest(
    @NotBlank @Size(max=255) String title,
    @NotBlank @Size(max=10000) String description,
    @Size(max=255) String location,
    @NotNull JobType jobType,
    @PositiveOrZero @Digits(integer=8, fraction=2) BigDecimal salaryMin,
    @PositiveOrZero @Digits(integer=8, fraction=2) BigDecimal salaryMax,
    LocalDate expiresAt
) {
    @AssertTrue(message="Minimum salary must not exceed maximum salary")
    public boolean isSalaryRangeValid() { return salaryMin == null || salaryMax == null || salaryMin.compareTo(salaryMax) <= 0; }
}
