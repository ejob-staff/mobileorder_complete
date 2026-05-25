package jp.co.mobileorder.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginCheckRequest(
        @NotBlank String username,
        @NotBlank String password
) {
}
