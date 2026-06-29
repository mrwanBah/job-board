CREATE DATABASE IF NOT EXISTS jobboard;
USE jobboard;

CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role ENUM('COMPANY', 'APPLICANT', 'ADMIN') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE companies (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  website VARCHAR(255),
  logo_url VARCHAR(500),
  location VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE jobs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  company_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255),
  job_type ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'),
  salary_min DECIMAL(10,2),
  salary_max DECIMAL(10,2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at DATE,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE applications (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  job_id BIGINT NOT NULL,
  applicant_id BIGINT NOT NULL,
  cover_letter TEXT,
  status ENUM('PENDING', 'REVIEWED', 'REJECTED', 'ACCEPTED') DEFAULT 'PENDING',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE
);
INSERT INTO users (email, password_hash, full_name, role)
VALUES
  ('company@example.com', '$2a$10$MRlk8pJ3C435VBjxgTFKgO1rqNEsDldx1XwcKadnM1JHs.IAWTwI6', 'Acme Company Owner', 'COMPANY');

INSERT INTO companies (user_id, name, description, website, logo_url, location)
VALUES
  (1, 'Acme Tech', 'A demo company for the API contract.', 'https://example.com', NULL, 'Riyadh');

INSERT INTO jobs (
  company_id,
  title,
  description,
  location,
  job_type,
  salary_min,
  salary_max,
  is_active,
  expires_at
)
VALUES
  (
    1,
    'Backend Intern',
    'Build Spring Boot APIs for a job board.',
    'Riyadh',
    'INTERNSHIP',
    3000.00,
    5000.00,
    TRUE,
    '2026-12-31'
  ),
  (
    1,
    'Junior Java Developer',
    'Work on REST APIs, database queries, and backend services.',
    'Jeddah',
    'FULL_TIME',
    6000.00,
    9000.00,
    TRUE,
    '2026-12-31'
  );
