package com.jobboard.repository;

import com.jobboard.entity.Job;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.lang.Nullable;

public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {
    @Override
    @EntityGraph(attributePaths = "company")
    Page<Job> findAll(@Nullable Specification<Job> specification, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = "company")
    Optional<Job> findById(Long id);
}
