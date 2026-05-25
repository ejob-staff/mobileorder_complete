package jp.co.mobileorder.repository;

import java.util.List;
import java.util.Optional;
import jp.co.mobileorder.entity.UserManagementCode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserManagementCodeRepository extends JpaRepository<UserManagementCode, Long> {
    Optional<UserManagementCode> findByCode(String code);

    Optional<UserManagementCode> findByUsername(String username);

    boolean existsByCode(String code);

    List<UserManagementCode> findAllByOrderByIdDesc();
}
