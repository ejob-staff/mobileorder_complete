package jp.co.mobileorder.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_management_code")
public class UserManagementCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private String username;
    private boolean used;
    private LocalDateTime createdAt;
    private LocalDateTime usedAt;

    protected UserManagementCode() {
    }

    public UserManagementCode(String code) {
        this.code = code;
        this.used = false;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getUsername() {
        return username;
    }

    public boolean isUsed() {
        return used;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUsedAt() {
        return usedAt;
    }

    public void markUsed(String username) {
        this.username = username;
        this.used = true;
        this.usedAt = LocalDateTime.now();
    }
}
