package jp.co.mobileorder.dto;

import jp.co.mobileorder.entity.AppUser;
import jp.co.mobileorder.entity.Role;

public record AdminUserResponse(
        Long id,
        String username,
        String displayName,
        String role,
        String status,
        boolean enabled
) {
    public static AdminUserResponse from(AppUser user) {
        return new AdminUserResponse(
                user.getId(),
                user.getUsername(),
                user.getDisplayName(),
                user.getRole() == Role.ROLE_ADMIN ? "管理者ユーザー" : "一般ユーザー",
                user.isEnabled() ? "利用可" : "利用不可",
                user.isEnabled()
        );
    }
}
