package jp.co.mobileorder.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProductReviewRequest(
        @NotBlank String orderNumber,
        @NotNull Long productId,
        @Min(1) @Max(5) Integer rating,
        String comment
) {
}
