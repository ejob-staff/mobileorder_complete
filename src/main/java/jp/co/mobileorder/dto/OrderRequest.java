package jp.co.mobileorder.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;

public record OrderRequest(
        @NotEmpty List<@Valid OrderItemRequest> items,
        @NotBlank String pickupAt
) {
    public record OrderItemRequest(
            @NotNull Long productId,
            @Positive Integer quantity
    ) {
    }
}
