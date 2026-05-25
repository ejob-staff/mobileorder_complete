package jp.co.mobileorder.repository;

import java.util.List;
import java.util.Optional;
import jp.co.mobileorder.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByUsername(String username);

    boolean existsByUsername(String username);

    List<AppUser> findAllByOrderByIdDesc();
}
