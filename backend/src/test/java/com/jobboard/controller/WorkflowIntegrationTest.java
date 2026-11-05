package com.jobboard.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobboard.repository.JobRepository;
import com.jobboard.security.JwtUtil;
import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class WorkflowIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired JobRepository jobs;

    private MockHttpServletRequestBuilder body(MockHttpServletRequestBuilder request, Object payload) throws Exception {
        return request.contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(payload));
    }
    private JsonNode account(String role) throws Exception {
        return json.readTree(mvc.perform(body(post("/api/auth/register"), Map.of("email", UUID.randomUUID()+"@example.com", "password", "password123", "fullName", "Test User", "role", role)))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString());
    }
    private String auth(JsonNode account) { return "Bearer " + account.path("token").asText(); }
    private Map<String,Object> job() { return Map.of("title", "Java Developer", "description", "Build APIs", "jobType", "FULL_TIME", "salaryMin", 100, "salaryMax", 200, "expiresAt", LocalDate.now().plusDays(10).toString()); }
    private long create(String token) throws Exception {
        return json.readTree(mvc.perform(body(post("/api/jobs"), job()).header("Authorization",token)).andExpect(status().isCreated())
                .andExpect(jsonPath("$.expiresAt").value(LocalDate.now().plusDays(10).toString())).andReturn().getResponse().getContentAsString()).path("id").asLong();
    }

    @Test void registrationNormalizationAndRoleRestrictions() throws Exception {
        String email=UUID.randomUUID()+"@example.com";
        var payload=Map.of("email", "  "+email.toUpperCase()+"  ", "password","password123","fullName","Test", "role","APPLICANT");
        mvc.perform(body(post("/api/auth/register"), payload)).andExpect(status().isOk()).andExpect(jsonPath("$.user.email").value(email));
        mvc.perform(body(post("/api/auth/register"), payload)).andExpect(status().isConflict());
        mvc.perform(body(post("/api/auth/login"), Map.of("email"," "+email.toUpperCase()+" ","password","password123"))).andExpect(status().isOk());
        mvc.perform(body(post("/api/auth/register"), Map.of("email","admin@example.com","password","password123","fullName","Admin","role","ADMIN"))).andExpect(status().isBadRequest());
        mvc.perform(body(post("/api/auth/login"), Map.of("email",email,"password","wrongpass"))).andExpect(status().isUnauthorized());
    }

    @Test void tokensAreVerifiedAndShortKeysFailFast() throws Exception {
        JsonNode applicant=account("APPLICANT");
        String token=applicant.path("token").asText();
        String email=applicant.path("user").path("email").asText();
        String expired=new JwtUtil("test-secret-at-least-32-characters-long",1).generateToken(email,"APPLICANT");
        Thread.sleep(1100);
        for(String invalid : new String[]{"malformed",token.substring(0,token.lastIndexOf('.')+1)+"invalid-signature",expired})
            mvc.perform(get("/api/auth/me").header("Authorization","Bearer "+invalid)).andExpect(status().isUnauthorized());
        org.junit.jupiter.api.Assertions.assertThrows(IllegalArgumentException.class, () -> new JwtUtil("short",1000));
    }

    @Test void rolesOwnershipAndFullApplicationWorkflow() throws Exception {
        String owner=auth(account("COMPANY")), other=auth(account("COMPANY")), applicant=auth(account("APPLICANT"));
        mvc.perform(body(post("/api/jobs"), job()).header("Authorization",applicant)).andExpect(status().isForbidden());
        mvc.perform(get("/api/applications/mine").header("Authorization",owner)).andExpect(status().isForbidden());
        long id=create(owner);
        mvc.perform(body(put("/api/jobs/"+id),job()).header("Authorization",other)).andExpect(status().isForbidden());
        mvc.perform(delete("/api/jobs/"+id).header("Authorization",other)).andExpect(status().isForbidden());
        mvc.perform(patch("/api/jobs/"+id+"/activate").header("Authorization",other)).andExpect(status().isForbidden());
        mvc.perform(get("/api/jobs/"+id+"/applications").header("Authorization",other)).andExpect(status().isForbidden());
        mvc.perform(get("/api/jobs/"+id+"/my-application").header("Authorization",applicant)).andExpect(status().isNotFound());
        long application=json.readTree(mvc.perform(body(post("/api/jobs/"+id+"/apply"),Map.of("coverLetter","I build APIs")).header("Authorization",applicant)).andExpect(status().isCreated()).andReturn().getResponse().getContentAsString()).path("id").asLong();
        mvc.perform(body(post("/api/jobs/"+id+"/apply"),Map.of()).header("Authorization",applicant)).andExpect(status().isConflict());
        mvc.perform(body(put("/api/applications/"+application+"/status"),Map.of("status","ACCEPTED")).header("Authorization",other)).andExpect(status().isForbidden());
        mvc.perform(body(put("/api/applications/"+application+"/status"),Map.of("status","ACCEPTED")).header("Authorization",owner)).andExpect(status().isOk());
        mvc.perform(get("/api/jobs/"+id+"/my-application").header("Authorization",applicant)).andExpect(status().isOk()).andExpect(jsonPath("$.status").value("ACCEPTED"));
        mvc.perform(get("/api/applications/mine").header("Authorization",applicant)).andExpect(status().isOk()).andExpect(jsonPath("$[0].status").value("ACCEPTED"));
    }

    @Test void paginationValidationAndJobLifecycle() throws Exception {
        String owner=auth(account("COMPANY")), applicant=auth(account("APPLICANT"));
        for(String query : new String[]{"page=-1","size=0","size=51","page=x"}) mvc.perform(get("/api/jobs?"+query)).andExpect(status().isBadRequest());
        for(Map<String,Object> invalid : java.util.List.of(
                Map.<String,Object>of("title"," ","description","x","jobType","FULL_TIME"),
                Map.<String,Object>of("title","x","description","x","jobType","FULL_TIME","salaryMin",300,"salaryMax",200),
                Map.<String,Object>of("title","x","description","x","jobType","FULL_TIME","salaryMin",-1),
                Map.<String,Object>of("title","x","description","x","jobType","FULL_TIME","expiresAt",LocalDate.now().minusDays(1).toString())))
            mvc.perform(body(post("/api/jobs"),invalid).header("Authorization",owner)).andExpect(status().isBadRequest());
        long id=create(owner);
        long companyId=json.readTree(mvc.perform(get("/api/companies/me").header("Authorization",owner)).andReturn().getResponse().getContentAsString()).path("id").asLong();
        mvc.perform(get("/api/jobs?search=java&jobType=FULL_TIME&companyId="+companyId)).andExpect(status().isOk()).andExpect(jsonPath("$.totalElements").value(1));
        mvc.perform(delete("/api/jobs/"+id).header("Authorization",owner)).andExpect(status().isNoContent());
        mvc.perform(get("/api/jobs?companyId="+companyId)).andExpect(jsonPath("$.totalElements").value(0));
        mvc.perform(body(post("/api/jobs/"+id+"/apply"),Map.of()).header("Authorization",applicant)).andExpect(status().isBadRequest());
        mvc.perform(patch("/api/jobs/"+id+"/activate").header("Authorization",owner)).andExpect(status().isOk()).andExpect(jsonPath("$.isActive").value(true));
        var entity=jobs.findById(id).orElseThrow();
        entity.update(entity.getTitle(),entity.getDescription(),entity.getLocation(),entity.getJobType(),entity.getSalaryMin(),entity.getSalaryMax(),LocalDate.now().minusDays(1));
        jobs.saveAndFlush(entity);
        mvc.perform(get("/api/jobs?companyId="+companyId)).andExpect(jsonPath("$.totalElements").value(0));
        mvc.perform(body(post("/api/jobs/"+id+"/apply"),Map.of()).header("Authorization",applicant)).andExpect(status().isBadRequest());
    }

    @Test void companiesAndHttpErrors() throws Exception {
        String owner=auth(account("COMPANY"));
        mvc.perform(get("/api/companies/me").header("Authorization",owner)).andExpect(status().isOk());
        mvc.perform(body(put("/api/companies/me"),Map.of("name","Updated Company","website","https://example.com","logoUrl","http://example.com/logo.png")).header("Authorization",owner)).andExpect(status().isOk()).andExpect(jsonPath("$.name").value("Updated Company"));
        for(String url : new String[]{"javascript:alert(1)","ftp://example.com","https://"}) mvc.perform(body(put("/api/companies/me"),Map.of("name","Company","website",url)).header("Authorization",owner)).andExpect(status().isBadRequest());
        mvc.perform(get("/api/does-not-exist").header("Authorization",owner)).andExpect(status().isNotFound()).andExpect(jsonPath("$.status").value(404));
        mvc.perform(put("/api/jobs").header("Authorization",owner)).andExpect(status().isMethodNotAllowed()).andExpect(jsonPath("$.status").value(405));
        mvc.perform(post("/api/jobs").contentType(MediaType.TEXT_PLAIN).content("test").header("Authorization",owner)).andExpect(status().isUnsupportedMediaType());
        mvc.perform(options("/api/jobs/1/activate").header("Origin","http://localhost:5173").header("Access-Control-Request-Method","PATCH")).andExpect(status().isOk()).andExpect(header().string("Access-Control-Allow-Origin","http://localhost:5173"));
        mvc.perform(get("/actuator/health")).andExpect(status().isOk()).andExpect(jsonPath("$.status").value("UP"));
    }
}
