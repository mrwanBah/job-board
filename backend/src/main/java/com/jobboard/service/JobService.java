package com.jobboard.service;

import com.jobboard.dto.JobResponse;
import com.jobboard.dto.PageResponse;
import com.jobboard.entity.Job;
import com.jobboard.mapper.JobMapper;
import com.jobboard.repository.JobRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class JobService {
    private final JobRepository jobRepository;
    private final JobMapper jobMapper;

    public JobService(JobRepository jobRepository, JobMapper jobMapper) {
        this.jobRepository = jobRepository;
        this.jobMapper = jobMapper;
    }

    public PageResponse<JobResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Job> jobs = jobRepository.findAll(pageable);
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

    public JobResponse findById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return jobMapper.toResponse(job);
    }
}