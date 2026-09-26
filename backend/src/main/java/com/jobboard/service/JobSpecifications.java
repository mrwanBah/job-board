package com.jobboard.service;

import com.jobboard.entity.Job;
import com.jobboard.model.JobType;
import org.springframework.data.jpa.domain.Specification;

public final class JobSpecifications {
    private JobSpecifications() {
    }

    public static Specification<Job> active() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.isTrue(root.get("active"));
    }

    public static Specification<Job> ownedByCompany(Long companyId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("company").get("id"), companyId);
    }

    public static Specification<Job> matchesSearch(String search) {
        return (root, query, criteriaBuilder) -> {
            String pattern = "%" + search.toLowerCase() + "%";
            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), pattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), pattern)
            );
        };
    }

    public static Specification<Job> hasJobType(JobType jobType) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("jobType"), jobType);
    }

    public static Specification<Job> publicFilters(String search, JobType jobType) {
        Specification<Job> specification = active();

        if (search != null && !search.isBlank()) {
            specification = specification.and(matchesSearch(search));
        }

        if (jobType != null) {
            specification = specification.and(hasJobType(jobType));
        }

        return specification;
    }
}
