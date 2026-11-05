package com.jobboard.service;

import com.jobboard.dto.JobRequest;
import com.jobboard.dto.JobResponse;
import com.jobboard.dto.PageResponse;
import com.jobboard.entity.Company;
import com.jobboard.entity.Job;
import com.jobboard.entity.User;
import com.jobboard.exception.NotFoundException;
import com.jobboard.mapper.JobMapper;
import com.jobboard.model.JobType;
import com.jobboard.model.Role;
import com.jobboard.repository.CompanyRepository;
import com.jobboard.repository.JobRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class JobService {
    private final JobRepository jobRepository;
    private final JobMapper jobMapper;
    private final AuthService authService;
    private final CompanyRepository companyRepository;

    public JobService(
            JobRepository jobRepository,
            JobMapper jobMapper,
            AuthService authService,
            CompanyRepository companyRepository
    ) {
        this.jobRepository = jobRepository;
        this.jobMapper = jobMapper;
        this.authService = authService;
        this.companyRepository = companyRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<JobResponse> findAll(String search, JobType jobType, Long companyId, int page, int size) {
        validatePagination(page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Specification<Job> filters = JobSpecifications.publicFilters(search, jobType);
        if (companyId != null) filters = filters.and(JobSpecifications.ownedByCompany(companyId));
        Page<Job> jobs = jobRepository.findAll(filters, pageable);

        return toPageResponse(jobs);
    }

    @Transactional(readOnly = true)
    public PageResponse<JobResponse> findCurrentCompanyJobs(int page, int size) {
        validatePagination(page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Company company = getCurrentCompany();

        // Includes inactive (deactivated) jobs so the company can still review past
        // applicants - the frontend shows an "Inactive" badge and hides Deactivate
        // for these.
        Specification<Job> specification = JobSpecifications.ownedByCompany(company.getId());

        return toPageResponse(jobRepository.findAll(specification, pageable));
    }

    @Transactional(readOnly = true)
    public JobResponse findById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Job not found"));
        return jobMapper.toResponse(job);
    }

    public JobResponse create(JobRequest request) {
        if (request.expiresAt() != null && request.expiresAt().isBefore(java.time.LocalDate.now()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Expiry date must not be in the past");
        Company company = getCurrentCompany();

        Job job = new Job(
                company,
                request.title(),
                request.description(),
                request.location(),
                request.jobType(),
                request.salaryMin(),
                request.salaryMax(),
                request.expiresAt()
        );

        return jobMapper.toResponse(jobRepository.save(job));
    }

    public JobResponse update(Long id, JobRequest request) {
        Job job = getCurrentCompanyJob(id);
        job.update(
                request.title(),
                request.description(),
                request.location(),
                request.jobType(),
                request.salaryMin(),
                request.salaryMax(),
                request.expiresAt()
        );

        return jobMapper.toResponse(jobRepository.save(job));
    }

    public void delete(Long id) {
        Job job = getCurrentCompanyJob(id);
        job.deactivate();
        jobRepository.save(job);
    }

    public JobResponse activate(Long id) {
        Job job = getCurrentCompanyJob(id);
        if (job.isExpired()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Update the expiry date before reactivating this job");
        job.activate();
        return jobMapper.toResponse(jobRepository.save(job));
    }
    private void validatePagination(int page, int size) {
        if (page < 0 || size < 1 || size > 50) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Page must be nonnegative and size between 1 and 50");
    }
    private Job getCurrentCompanyJob(Long id) {
        Company company = getCurrentCompany();
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Job not found"));

        if (!job.getCompany().getId().equals(company.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only manage your own jobs");
        }

        return job;
    }

    private Company getCurrentCompany() {
        User user = authService.getCurrentUser();
        if (user.getRole() != Role.COMPANY) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only company users can manage jobs");
        }

        return companyRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("Company profile not found"));
    }

    private PageResponse<JobResponse> toPageResponse(Page<Job> jobs) {
        List<JobResponse> content = jobs.getContent()
                .stream()
                .map(jobMapper::toResponse)
                .toList();

        return new PageResponse<>(
                content,
                jobs.getNumber(),
                jobs.getSize(),
                jobs.getTotalElements(),
                jobs.getTotalPages()
        );
    }
}
