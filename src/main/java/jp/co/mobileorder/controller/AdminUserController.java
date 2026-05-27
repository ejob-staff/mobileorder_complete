package jp.co.mobileorder.controller;

import jakarta.validation.Valid;
import java.util.List;
import jp.co.mobileorder.dto.AdminUserResponse;
import jp.co.mobileorder.dto.SignupRequest;
import jp.co.mobileorder.dto.UserManagementCodeResponse;
import jp.co.mobileorder.service.AdminUserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminUserController {
    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @GetMapping("/users")
    public List<AdminUserResponse> users() {
        return adminUserService.findAllUsers();
    }

    @PostMapping("/users/admin")
    @ResponseStatus(HttpStatus.CREATED)
    public AdminUserResponse createAdmin(@Valid @RequestBody SignupRequest request) {
        return adminUserService.createAdmin(request);
    }

    @PostMapping("/users/{id}/toggle-enabled")
    public AdminUserResponse toggleEnabled(@PathVariable Long id) {
        return adminUserService.toggleEnabled(id);
    }

    @DeleteMapping("/users/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        adminUserService.delete(id);
    }

    @GetMapping("/user-management-codes")
    public List<UserManagementCodeResponse> codes() {
        return adminUserService.findAllCodes();
    }

    @PostMapping("/user-management-codes/user")
    @ResponseStatus(HttpStatus.CREATED)
    public UserManagementCodeResponse issueUserCode() {
        return adminUserService.issueUserCode();
    }

    @PostMapping("/user-management-codes/admin")
    @ResponseStatus(HttpStatus.CREATED)
    public UserManagementCodeResponse issueAdminCode() {
        return adminUserService.issueAdminCode();
    }

    @DeleteMapping("/user-management-codes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUnusedCode(@PathVariable Long id) {
        adminUserService.deleteUnusedCode(id);
    }
}
