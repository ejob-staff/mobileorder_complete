package jp.co.mobileorder.dto;

import java.time.format.DateTimeFormatter;
import jp.co.mobileorder.entity.UserManagementCode;

public record UserManagementCodeResponse(
        Long id,
        String code,
        String username,
        String status,
        String createdAt
) {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm");

    public static UserManagementCodeResponse from(UserManagementCode code) {
        return new UserManagementCodeResponse(
                code.getId(),
                code.getCode(),
                code.getUsername(),
                code.isUsed() ? "使用済み" : "未使用",
                code.getCreatedAt().format(FORMATTER)
        );
    }
}
