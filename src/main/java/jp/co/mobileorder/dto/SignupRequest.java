package jp.co.mobileorder.dto;

import jakarta.validation.constraints.NotBlank;

public record SignupRequest(
        @NotBlank String code,
        @NotBlank String username,
        @NotBlank String password,
        @NotBlank String passwordConfirm
) {
}
