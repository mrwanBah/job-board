package com.jobboard.dto;

import com.jobboard.model.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public record ApplicationStatusRequest(
        @NotNull(message = "Status is required")
        ApplicationStatus status
) {
}
