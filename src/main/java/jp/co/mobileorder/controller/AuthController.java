package jp.co.mobileorder.controller;

import jakarta.validation.Valid;
import java.util.Map;
import jp.co.mobileorder.dto.AuthStatusResponse;
import jp.co.mobileorder.dto.LoginCheckRequest;
import jp.co.mobileorder.entity.Role;
import jp.co.mobileorder.repository.AppUserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
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

    @PostMapping("/login-check")
    public Map<String, Boolean> loginCheck(@Valid @RequestBody LoginCheckRequest request) {
        return appUserRepository.findByUsername(request.username())
                .filter(user -> passwordEncoder.matches(request.password(), user.getPassword()))
                .map(user -> Map.of("matched", true, "enabled", user.isEnabled()))
                .orElse(Map.of("matched", false, "enabled", false));
    }
}
