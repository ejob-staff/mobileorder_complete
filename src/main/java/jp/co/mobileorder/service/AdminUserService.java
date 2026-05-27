package jp.co.mobileorder.service;

import java.security.SecureRandom;
import java.util.List;
import jp.co.mobileorder.dto.AdminUserResponse;
import jp.co.mobileorder.dto.SignupRequest;
import jp.co.mobileorder.dto.UserManagementCodeResponse;
import jp.co.mobileorder.entity.AppUser;
import jp.co.mobileorder.entity.Role;
import jp.co.mobileorder.entity.UserManagementCode;
import jp.co.mobileorder.repository.AppUserRepository;
import jp.co.mobileorder.repository.UserManagementCodeRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminUserService {
    private static final String CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final String USER_CODE_PREFIX = "USER-CODE-";
    private static final String ADMIN_CODE_PREFIX = "ADMIN-CODE-";
    private final SecureRandom random = new SecureRandom();
    private final AppUserRepository appUserRepository;
    private final UserManagementCodeRepository userManagementCodeRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUserService(
            AppUserRepository appUserRepository,
            UserManagementCodeRepository userManagementCodeRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.appUserRepository = appUserRepository;
        this.userManagementCodeRepository = userManagementCodeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<AdminUserResponse> findAllUsers() {
        return appUserRepository.findAllByOrderByIdDesc().stream().map(AdminUserResponse::from).toList();
    }

    public List<UserManagementCodeResponse> findAllCodes() {
        return userManagementCodeRepository.findAllByOrderByIdDesc().stream().map(UserManagementCodeResponse::from).toList();
    }

    @Transactional
    public UserManagementCodeResponse issueUserCode() {
        return issueCode(USER_CODE_PREFIX);
    }

    @Transactional
    public UserManagementCodeResponse issueAdminCode() {
        return issueCode(ADMIN_CODE_PREFIX);
    }

    @Transactional
    public AdminUserResponse createAdmin(SignupRequest request) {
        if (!request.password().equals(request.passwordConfirm())) {
            throw new IllegalArgumentException("パスワードと確認用パスワードが一致していません。");
        }

        if (appUserRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("入力されたユーザー名は既に使用されています。");
        }

        var managementCode = userManagementCodeRepository.findByCode(request.code())
                .orElseThrow(() -> new IllegalArgumentException("入力したユーザー管理番号は存在しません。"));

        if (!managementCode.getCode().startsWith(ADMIN_CODE_PREFIX)) {
            throw new IllegalArgumentException("管理者ユーザー用のユーザー管理番号を入力してください。");
        }

        if (managementCode.isUsed()) {
            throw new IllegalArgumentException("入力したユーザー管理番号は既に使用されています。");
        }

        var user = new AppUser(
                request.username(),
                passwordEncoder.encode(request.password()),
                request.username(),
                Role.ROLE_ADMIN
        );
        var saved = appUserRepository.save(user);
        managementCode.markUsed(saved.getUsername());
        return AdminUserResponse.from(saved);
    }

    @Transactional
    public AdminUserResponse toggleEnabled(Long id) {
        var user = appUserRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("ユーザーが見つかりません。"));

        if (user.getRole() == Role.ROLE_ADMIN) {
            throw new IllegalArgumentException("管理者ユーザーの利用状態は変更できません。");
        }

        user.toggleEnabled();
        return AdminUserResponse.from(user);
    }

    @Transactional
    public void delete(Long id) {
        var user = appUserRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("ユーザーが見つかりません。"));
        appUserRepository.delete(user);
    }

    @Transactional
    public void deleteUnusedCode(Long id) {
        var code = userManagementCodeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("ユーザー管理番号が見つかりません。"));
        if (code.isUsed()) {
            throw new IllegalArgumentException("使用済みのユーザー管理番号は削除できません。");
        }
        userManagementCodeRepository.delete(code);
    }

    private UserManagementCodeResponse issueCode(String prefix) {
        var code = new UserManagementCode(generateCode(prefix));
        return UserManagementCodeResponse.from(userManagementCodeRepository.save(code));
    }

    private String generateCode(String prefix) {
        String code;

        do {
            var builder = new StringBuilder(prefix);
            for (int i = 0; i < 12; i++) {
                builder.append(CODE_CHARS.charAt(random.nextInt(CODE_CHARS.length())));
            }
            code = builder.toString();
        } while (userManagementCodeRepository.existsByCode(code));

        return code;
    }
}
