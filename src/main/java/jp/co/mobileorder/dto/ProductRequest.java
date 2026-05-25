package jp.co.mobileorder.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProductRequest(
        @NotBlank String name,
        @NotBlank String description,
        @NotBlank String category,
        @NotNull @Min(1) Integer price,
        @NotNull @Min(0) Integer stock,
        boolean published,
        @NotBlank String accent
) {
}
