package jp.co.mobileorder.repository;

import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import jp.co.mobileorder.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByPublishedTrueOrderByIdDesc();

    List<Product> findAllByOrderByIdDesc();

    /*追加実装1: 在庫の同時更新による売り越し防止のための排他ロック付き取得*/
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Product p where p.id = :id")
    Optional<Product> findByIdForUpdate(@Param("id") Long id);
}
