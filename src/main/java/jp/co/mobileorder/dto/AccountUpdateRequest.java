package jp.co.mobileorder.dto;

import jakarta.validation.constraints.NotBlank;

public record AccountUpdateRequest(
        @NotBlank String password,
        @NotBlank String passwordConfirm
) {
}
