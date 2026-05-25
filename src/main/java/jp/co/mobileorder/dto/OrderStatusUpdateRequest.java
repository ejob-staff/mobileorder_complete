package jp.co.mobileorder.dto;

import jakarta.validation.constraints.NotBlank;

public record OrderStatusUpdateRequest(
        @NotBlank String status,
        String cancelReason
) {
}
