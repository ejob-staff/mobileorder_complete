package jp.co.mobileorder.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import jp.co.mobileorder.entity.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {
    List<ProductReview> findAllByOrderByIdDesc();

    List<ProductReview> findByUsernameOrderByIdDesc(String username);

    List<ProductReview> findByCreatedAtAfterOrderByIdDesc(LocalDateTime createdAt);

    List<ProductReview> findByProductId(Long productId);

    Optional<ProductReview> findByOrderNumberAndProductIdAndUsername(String orderNumber, Long productId, String username);
}
