package jp.co.mobileorder.service;

import jp.co.mobileorder.dto.AdminUserResponse;
import jp.co.mobileorder.dto.PasswordResetRequest;
import jp.co.mobileorder.dto.SignupRequest;
import jp.co.mobileorder.entity.AppUser;
import jp.co.mobileorder.entity.Role;
import jp.co.mobileorder.repository.AppUserRepository;
import jp.co.mobileorder.repository.UserManagementCodeRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AccountService {
    private static final String USER_CODE_PREFIX = "USER-CODE-";
    private final AppUserRepository appUserRepository;
    private final UserManagementCodeRepository userManagementCodeRepository;
    private final PasswordEncoder passwordEncoder;

    public AccountService(AppUserRepository appUserRepository, UserManagementCodeRepository userManagementCodeRepository, PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.userManagementCodeRepository = userManagementCodeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AdminUserResponse signup(SignupRequest request) {
        if (!request.password().equals(request.passwordConfirm())) {
            throw new IllegalArgumentException("パスワードと確認用パスワードが一致していません。");
        }

        if (appUserRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("入力したユーザー名は既に使用されています。");
        }

        var managementCode = userManagementCodeRepository.findByCode(request.code())
                .orElseThrow(() -> new IllegalArgumentException("入力したユーザー管理番号は存在しません。"));

        if (!managementCode.getCode().startsWith(USER_CODE_PREFIX)) {
            throw new IllegalArgumentException("一般ユーザー用のユーザー管理番号を入力してください。");
        }

        if (managementCode.isUsed()) {
            throw new IllegalArgumentException("入力したユーザー管理番号は既に使用されています。");
        }

        var user = new AppUser(
                request.username(),
                passwordEncoder.encode(request.password()),
                request.username(),
                Role.ROLE_USER
        );
        var saved = appUserRepository.save(user);
        managementCode.markUsed(saved.getUsername());
        return AdminUserResponse.from(saved);
    }

    @Transactional
    public void resetPassword(PasswordResetRequest request) {
        if (!request.password().equals(request.passwordConfirm())) {
            throw new IllegalArgumentException("新しいパスワードと確認用パスワードが一致していません。");
        }

        var managementCode = userManagementCodeRepository.findByCode(request.code())
                .orElseThrow(() -> new IllegalArgumentException("入力したユーザー管理番号は存在しません。"));

        if (!managementCode.isUsed() || !request.username().equals(managementCode.getUsername())) {
            throw new IllegalArgumentException("ユーザー管理番号とユーザー名が一致していません。");
        }

        var user = appUserRepository.findByUsername(request.username())
                .orElseThrow(() -> new IllegalArgumentException("ユーザーが見つかりません。"));
        user.changePassword(passwordEncoder.encode(request.password()));
    }
}
