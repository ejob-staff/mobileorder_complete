package jp.co.mobileorder.controller;

import jp.co.mobileorder.dto.AuthStatusResponse;
import jp.co.mobileorder.entity.Role;
import jp.co.mobileorder.repository.AppUserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    {/*修正7: 未認証で叩けてしまうパスワード確認オラクルだったPOST /login-checkを削除(SecurityConfigのfailureHandlerに統合)*/}
    private final AppUserRepository appUserRepository;

    public AuthController(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    @GetMapping("/status")
    public AuthStatusResponse status(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return new AuthStatusResponse(false, "", "", "");
        }

        return appUserRepository.findByUsername(authentication.getName())
                .map(user -> new AuthStatusResponse(
                        true,
                        user.getUsername(),
                        user.getRole() == Role.ROLE_ADMIN ? "admin" : "user",
                        user.getDisplayName()
                ))
                .orElse(new AuthStatusResponse(false, "", "", ""));
    }
}
