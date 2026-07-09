package com.jobboard.service;

import com.jobboard.dto.JobRequest;
import com.jobboard.dto.JobResponse;
import com.jobboard.dto.PageResponse;
import com.jobboard.entity.Company;
import com.jobboard.entity.Job;
import com.jobboard.entity.User;
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
import org.springframework.web.server.ResponseStatusException;

@Service
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

    public PageResponse<JobResponse> findAll(String search, JobType jobType, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Job> jobs = jobRepository.findAll(buildSpecification(search, jobType), pageable);

        return toPageResponse(jobs);
    }

    public PageResponse<JobResponse> findCurrentCompanyJobs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Company company = getCurrentCompany();

        Specification<Job> specification = (root, query, criteriaBuilder) ->
                criteriaBuilder.and(
                        criteriaBuilder.equal(root.get("company").get("id"), company.getId()),
                        criteriaBuilder.isTrue(root.get("active"))
                );

        return toPageResponse(jobRepository.findAll(specification, pageable));
    }

    public JobResponse findById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
        return jobMapper.toResponse(job);
    }

    public JobResponse create(JobRequest request) {
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

    private Job getCurrentCompanyJob(Long id) {
        Company company = getCurrentCompany();
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));

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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Company profile not found"));
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

    private Specification<Job> buildSpecification(String search, JobType jobType) {
        Specification<Job> specification = (root, query, criteriaBuilder) ->
                criteriaBuilder.isTrue(root.get("active"));

        if (search != null && !search.isBlank()) {
            String pattern = "%" + search.toLowerCase() + "%";
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.or(
                            criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), pattern),
                            criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), pattern)
                    )
            );
        }

        if (jobType != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("jobType"), jobType)
            );
        }

        return specification;
    }
}
