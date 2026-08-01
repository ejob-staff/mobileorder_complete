package jp.co.mobileorder.repository;

import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import jp.co.mobileorder.entity.UserManagementCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserManagementCodeRepository extends JpaRepository<UserManagementCode, Long> {
    Optional<UserManagementCode> findByCode(String code);

    Optional<UserManagementCode> findByUsername(String username);

    boolean existsByCode(String code);

    List<UserManagementCode> findAllByOrderByIdDesc();

    /*追加実装6: サインアップ・管理者登録時の管理番号の同時使用を防ぐための排他ロック付き取得*/
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select c from UserManagementCode c where c.code = :code")
    Optional<UserManagementCode> findByCodeForUpdate(@Param("code") String code);
}
