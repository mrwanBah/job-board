package com.jobboard.mapper;

import com.jobboard.dto.CompanyResponse;
import com.jobboard.dto.JobResponse;
import com.jobboard.entity.Company;
import com.jobboard.entity.Job;
import org.springframework.stereotype.Component;

@Component
public class JobMapper {
    public JobResponse toResponse(Job job) {
        Company company = job.getCompany();

        CompanyResponse companyResponse = new CompanyResponse(
                company.getId(),
                company.getName(),
                company.getDescription(),
                company.getWebsite(),
                company.getLogoUrl(),
                company.getLocation()
        );

        return new JobResponse(
                job.getId(),
                job.getTitle(),
                job.getDescription(),
                job.getLocation(),
                job.getJobType(),
                job.getSalaryMin(),
                job.getSalaryMax(),
                job.isActive(),
                job.getCreatedAt(),
                job.getExpiresAt(),
                companyResponse
        );
    }
}
