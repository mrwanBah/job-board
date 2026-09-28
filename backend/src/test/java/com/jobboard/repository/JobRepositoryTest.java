package com.jobboard.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.jobboard.entity.Company;
import com.jobboard.entity.Job;
import com.jobboard.entity.User;
import com.jobboard.model.JobType;
import com.jobboard.model.Role;
import com.jobboard.service.JobSpecifications;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

@DataJpaTest(showSql = false)
@ActiveProfiles("test")
class JobRepositoryTest {
    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    void publicFiltersSearchJobTypeAndActiveJobsInDatabase() {
        Company company = persistCompany();
        persistJob(company, "Junior Java Developer", "Build Spring Boot APIs", JobType.FULL_TIME, true);
        persistJob(company, "Frontend Intern", "React and TypeScript", JobType.INTERNSHIP, true);
        persistJob(company, "Inactive Java Role", "Old Java posting", JobType.FULL_TIME, false);
        entityManager.flush();
        entityManager.clear();

        Page<Job> jobs = jobRepository.findAll(
                JobSpecifications.publicFilters("java", JobType.FULL_TIME),
                PageRequest.of(0, 10)
        );

        assertThat(jobs.getContent())
                .extracting(Job::getTitle)
                .containsExactly("Junior Java Developer");
        assertThat(jobs.getContent().get(0).getCompany().getName()).isEqualTo("Acme Tech");
    }

    private Company persistCompany() {
        User user = new User("company@example.com", "hash", "Acme Tech Owner", Role.COMPANY);
        entityManager.persist(user);
        Company company = new Company(user, "Acme Tech", "Demo company", "https://example.com", null, "Riyadh");
        entityManager.persist(company);
        return company;
    }

    private void persistJob(Company company, String title, String description, JobType type, boolean active) {
        Job job = new Job(
                company,
                title,
                description,
                "Riyadh",
                type,
                BigDecimal.valueOf(3000),
                BigDecimal.valueOf(5000),
                null
        );
        if (!active) {
            job.deactivate();
        }
        entityManager.persist(job);
    }
}
