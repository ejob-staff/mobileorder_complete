package jp.co.mobileorder.dto;

import jakarta.validation.constraints.NotBlank;

public record AdminUserRequest(
        @NotBlank String username,
        @NotBlank String password,
        @NotBlank String role
) {
}
