package com.jobboard.repository;

import com.jobboard.entity.JobApplication;
import com.jobboard.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    boolean existsByJobIdAndApplicantId(Long jobId, Long applicantId);

    List<JobApplication> findByApplicantOrderByAppliedAtDesc(User applicant);

    List<JobApplication> findByJobIdOrderByAppliedAtDesc(Long jobId);
}
