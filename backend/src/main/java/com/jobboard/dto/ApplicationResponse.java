package com.jobboard.dto;

import com.jobboard.model.ApplicationStatus;

public record ApplicationResponse(
        Long id,
        JobResponse job,
        UserResponse applicant,
        String coverLetter,
        ApplicationStatus status,
        String appliedAt
) {
}
