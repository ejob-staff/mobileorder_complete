package jp.co.mobileorder.dto;

public record AuthStatusResponse(
        boolean authenticated,
        String username,
        String role,
        String displayName
) {
}
