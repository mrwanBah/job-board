package com.jobboard.dto;

import com.jobboard.model.ApplicationStatus;
import java.time.LocalDateTime;

public record ApplicationResponse(
        Long id,
        JobResponse job,
        UserResponse applicant,
        String coverLetter,
        ApplicationStatus status,
        LocalDateTime appliedAt
) {
}
