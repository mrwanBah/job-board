package com.jobboard.service;

import com.jobboard.dto.ApplicationRequest;
import com.jobboard.dto.ApplicationResponse;
import com.jobboard.dto.ApplicationStatusRequest;
import com.jobboard.entity.Company;
import com.jobboard.entity.Job;
import com.jobboard.entity.JobApplication;
import com.jobboard.entity.User;
import com.jobboard.exception.NotFoundException;
import com.jobboard.mapper.ApplicationMapper;
import com.jobboard.model.Role;
import com.jobboard.repository.CompanyRepository;
import com.jobboard.repository.JobApplicationRepository;
import com.jobboard.repository.JobRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class ApplicationService {
    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final AuthService authService;
    private final ApplicationMapper applicationMapper;

    public ApplicationService(
            JobApplicationRepository applicationRepository,
            JobRepository jobRepository,
            CompanyRepository companyRepository,
            AuthService authService,
            ApplicationMapper applicationMapper
    ) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
        this.authService = authService;
        this.applicationMapper = applicationMapper;
    }

    public ApplicationResponse apply(Long jobId, ApplicationRequest request) {
        User applicant = requireApplicant();
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new NotFoundException("Job not found"));

        if (!job.isActive() || job.isExpired()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This job is no longer accepting applications");
        }
        if (applicationRepository.existsByJobIdAndApplicantId(jobId, applicant.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already applied to this job");
        }

        JobApplication application = new JobApplication(job, applicant, request.coverLetter());
        return applicationMapper.toResponse(applicationRepository.save(application));
    }

    @Transactional(readOnly = true)
    public ApplicationResponse findMyApplication(Long jobId) {
        User user = requireApplicant();
        return applicationMapper.toResponse(applicationRepository.findByJobIdAndApplicantId(jobId, user.getId())
                .orElseThrow(() -> new NotFoundException("No application for this job")));
    }
    @Transactional(readOnly = true)
    public List<ApplicationResponse> findMine() {
        User applicant = requireApplicant();
        return applicationRepository.findByApplicantOrderByAppliedAtDesc(applicant)
                .stream()
                .map(applicationMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> findForJob(Long jobId) {
        Company company = requireCompany();
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new NotFoundException("Job not found"));
        ensureJobOwner(job, company);

        return applicationRepository.findByJobIdOrderByAppliedAtDesc(jobId)
                .stream()
                .map(applicationMapper::toResponse)
                .toList();
    }

    public ApplicationResponse updateStatus(Long applicationId, ApplicationStatusRequest request) {
        Company company = requireCompany();
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new NotFoundException("Application not found"));
        ensureJobOwner(application.getJob(), company);

        application.updateStatus(request.status());
        return applicationMapper.toResponse(applicationRepository.save(application));
    }

    private User requireApplicant() {
        User user = authService.getCurrentUser();
        if (user.getRole() != Role.APPLICANT) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only applicants can perform this action");
        }
        return user;
    }

    private Company requireCompany() {
        User user = authService.getCurrentUser();
        if (user.getRole() != Role.COMPANY) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only company users can perform this action");
        }
        return companyRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("Company profile not found"));
    }

    private void ensureJobOwner(Job job, Company company) {
        if (!job.getCompany().getId().equals(company.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only manage applications for your own jobs");
        }
    }
}
