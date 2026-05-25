package jp.co.mobileorder.service;

import jp.co.mobileorder.dto.AccountResponse;
import jp.co.mobileorder.dto.AccountUpdateRequest;
import jp.co.mobileorder.entity.Role;
import jp.co.mobileorder.repository.AppUserRepository;
import jp.co.mobileorder.repository.UserManagementCodeRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AccountProfileService {
    private final AppUserRepository appUserRepository;
    private final UserManagementCodeRepository userManagementCodeRepository;
    private final PasswordEncoder passwordEncoder;

    public AccountProfileService(AppUserRepository appUserRepository, UserManagementCodeRepository userManagementCodeRepository, PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.userManagementCodeRepository = userManagementCodeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AccountResponse findAccount(String username) {
        var user = appUserRepository.findByUsername(username).orElseThrow(() -> new IllegalArgumentException("ユーザーが見つかりません。"));
        return toResponse(user.getUsername());
    }

    @Transactional
    public AccountResponse updateAccount(String currentUsername, AccountUpdateRequest request) {
        if (!request.password().equals(request.passwordConfirm())) {
            throw new IllegalArgumentException("パスワードとパスワード確認用が一致しません。");
        }

        var user = appUserRepository.findByUsername(currentUsername).orElseThrow(() -> new IllegalArgumentException("ユーザーが見つかりません。"));
        user.changePassword(passwordEncoder.encode(request.password()));
        return toResponse(user.getUsername());
    }

    private AccountResponse toResponse(String username) {
        var user = appUserRepository.findByUsername(username).orElseThrow(() -> new IllegalArgumentException("ユーザーが見つかりません。"));
        var managementCode = userManagementCodeRepository.findByUsername(username)
                .map(code -> code.getCode())
                .orElse("未設定");
        var roleLabel = user.getRole() == Role.ROLE_ADMIN ? "管理者ユーザー" : "一般ユーザー";
        return new AccountResponse(managementCode, user.getUsername(), user.getDisplayName(), roleLabel, "********");
    }
}
