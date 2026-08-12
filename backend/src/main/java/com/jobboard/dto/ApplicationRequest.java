package com.jobboard.dto;

import jakarta.validation.constraints.Size;

public record ApplicationRequest(
        @Size(max = 5000, message = "Cover letter must not exceed 5000 characters")
        String coverLetter
) {
}
