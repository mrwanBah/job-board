package com.jobboard.config;

import com.jobboard.entity.Company;
import com.jobboard.entity.Job;
import com.jobboard.entity.User;
import com.jobboard.model.JobType;
import com.jobboard.model.Role;
import com.jobboard.repository.CompanyRepository;
import com.jobboard.repository.JobRepository;
import com.jobboard.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@ConditionalOnProperty(name = "app.demo.enabled", havingValue = "true")
public class DemoData implements CommandLineRunner {
    private final UserRepository users;
    private final CompanyRepository companies;
    private final JobRepository jobs;
    private final PasswordEncoder passwords;

    public DemoData(UserRepository users, CompanyRepository companies, JobRepository jobs, PasswordEncoder passwords) {
        this.users = users;
        this.companies = companies;
        this.jobs = jobs;
        this.passwords = passwords;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!users.existsByEmail("company@example.com")) {
            User owner = users.save(new User("company@example.com", passwords.encode("DemoPass123!"), "Acme Company Owner", Role.COMPANY));
            Company company = companies.save(new Company(owner, "Acme Tech", "A demo company for the job board.", "https://example.com", null, "Riyadh"));
            jobs.save(new Job(company, "Backend Intern", "Build Spring Boot APIs for a job board.", "Riyadh", JobType.INTERNSHIP,
                    new BigDecimal("3000.00"), new BigDecimal("5000.00"), LocalDate.now().plusMonths(3)));
            jobs.save(new Job(company, "Junior Java Developer", "Work on REST APIs, database queries, and backend services.", "Jeddah", JobType.FULL_TIME,
                    new BigDecimal("6000.00"), new BigDecimal("9000.00"), LocalDate.now().plusMonths(3)));
        }
        if (!users.existsByEmail("applicant@example.com")) {
            users.save(new User("applicant@example.com", passwords.encode("DemoPass123!"), "Demo Applicant", Role.APPLICANT));
        }
    }
}
