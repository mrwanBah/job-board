package com.jobboard.dto;

public record CompanyResponse(
        Long id,
        String name,
        String description,
        String website,
        String logoUrl,
        String location
) {
}
