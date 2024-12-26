package com.example.devjobs.user.dto.request.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class IdSearchRequestDto {

    @NotBlank
    private String username;

    @NotBlank
    private String email;

}