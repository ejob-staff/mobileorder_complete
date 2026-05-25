package jp.co.mobileorder.dto;

public record AccountResponse(
        String managementCode,
        String username,
        String displayName,
        String role,
        String passwordMask
) {
}
