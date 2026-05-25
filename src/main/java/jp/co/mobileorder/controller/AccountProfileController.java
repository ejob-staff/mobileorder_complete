package jp.co.mobileorder.controller;

import java.security.Principal;
import jakarta.validation.Valid;
import jp.co.mobileorder.dto.AccountResponse;
import jp.co.mobileorder.dto.AccountUpdateRequest;
import jp.co.mobileorder.service.AccountProfileService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/account")
public class AccountProfileController {
    private final AccountProfileService accountProfileService;

    public AccountProfileController(AccountProfileService accountProfileService) {
        this.accountProfileService = accountProfileService;
    }

    @GetMapping
    public AccountResponse account(Principal principal) {
        return accountProfileService.findAccount(principal.getName());
    }

    @PutMapping
    public AccountResponse update(@Valid @RequestBody AccountUpdateRequest request, Principal principal) {
        return accountProfileService.updateAccount(principal.getName(), request);
    }
}
