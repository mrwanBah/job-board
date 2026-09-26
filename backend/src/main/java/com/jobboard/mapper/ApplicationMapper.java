package com.jobboard.mapper;

import com.jobboard.dto.ApplicationResponse;
import com.jobboard.dto.UserResponse;
import com.jobboard.entity.JobApplication;
import com.jobboard.entity.User;
import org.springframework.stereotype.Component;

@Component
public class ApplicationMapper {
    private final JobMapper jobMapper;

    public ApplicationMapper(JobMapper jobMapper) {
        this.jobMapper = jobMapper;
    }

    public ApplicationResponse toResponse(JobApplication application) {
        User applicant = application.getApplicant();
        UserResponse applicantResponse = new UserResponse(
                applicant.getId(),
                applicant.getEmail(),
                applicant.getFullName(),
                applicant.getRole()
        );

        return new ApplicationResponse(
                application.getId(),
                jobMapper.toResponse(application.getJob()),
                applicantResponse,
                application.getCoverLetter(),
                application.getStatus(),
                application.getAppliedAt()
        );
    }
}
