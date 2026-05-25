package jp.co.mobileorder.controller;

import jakarta.validation.Valid;
import jp.co.mobileorder.dto.AdminUserResponse;
import jp.co.mobileorder.dto.PasswordResetRequest;
import jp.co.mobileorder.dto.SignupRequest;
import jp.co.mobileorder.service.AccountService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AccountController {
    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/api/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public AdminUserResponse signup(@Valid @RequestBody SignupRequest request) {
        return accountService.signup(request);
    }

    @PostMapping("/api/password-reset")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resetPassword(@Valid @RequestBody PasswordResetRequest request) {
        accountService.resetPassword(request);
    }
}
