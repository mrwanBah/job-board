package com.jobboard.repository;

import com.jobboard.entity.JobApplication;
import com.jobboard.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    @EntityGraph(attributePaths = {"job", "job.company", "applicant"})
    Optional<JobApplication> findByJobIdAndApplicantId(Long jobId, Long applicantId);
    boolean existsByJobIdAndApplicantId(Long jobId, Long applicantId);

    @EntityGraph(attributePaths = {"job", "job.company", "applicant"})
    List<JobApplication> findByApplicantOrderByAppliedAtDesc(User applicant);

    @EntityGraph(attributePaths = {"job", "job.company", "applicant"})
    List<JobApplication> findByJobIdOrderByAppliedAtDesc(Long jobId);

    @Override
    @EntityGraph(attributePaths = {"job", "job.company", "applicant"})
    Optional<JobApplication> findById(Long id);
}
