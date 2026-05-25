package jp.co.mobileorder.dto;

import jakarta.validation.constraints.NotBlank;

public record PasswordResetRequest(
        @NotBlank String code,
        @NotBlank String username,
        @NotBlank String password,
        @NotBlank String passwordConfirm
) {
}
