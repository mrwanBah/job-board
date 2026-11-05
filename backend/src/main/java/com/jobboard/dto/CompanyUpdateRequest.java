package com.jobboard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CompanyUpdateRequest(
        @NotBlank(message = "Company name is required")
        @Size(max = 255, message = "Company name must not exceed 255 characters")
        String name,

        @Size(max = 5000, message = "Description must not exceed 5000 characters")
        String description,

        @Size(max = 255, message = "Website must not exceed 255 characters")
        @org.hibernate.validator.constraints.URL
        @jakarta.validation.constraints.Pattern(regexp = "(?i)^(https?://\\S+)?$", message = "Use a valid http/https URL")
        String website,

        @Size(max = 500, message = "Logo URL must not exceed 500 characters")
        @org.hibernate.validator.constraints.URL
        @jakarta.validation.constraints.Pattern(regexp = "(?i)^(https?://\\S+)?$", message = "Use a valid http/https URL")
        String logoUrl,

        @Size(max = 255, message = "Location must not exceed 255 characters")
        String location
) {
}
