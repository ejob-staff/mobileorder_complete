package jp.co.mobileorder.service;

import java.time.LocalDateTime;
import java.util.List;
import jp.co.mobileorder.dto.ProductReviewRequest;
import jp.co.mobileorder.dto.ProductReviewResponse;
import jp.co.mobileorder.entity.OrderStatus;
import jp.co.mobileorder.entity.ProductReview;
import jp.co.mobileorder.repository.MobileOrderRepository;
import jp.co.mobileorder.repository.ProductReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductReviewService {
    private final ProductReviewRepository productReviewRepository;
    private final MobileOrderRepository mobileOrderRepository;

    public ProductReviewService(ProductReviewRepository productReviewRepository, MobileOrderRepository mobileOrderRepository) {
        this.productReviewRepository = productReviewRepository;
        this.mobileOrderRepository = mobileOrderRepository;
    }

    public List<ProductReviewResponse> findUserReviews(String username) {
        return productReviewRepository.findByUsernameOrderByIdDesc(username).stream().map(ProductReviewResponse::from).toList();
    }

    public List<ProductReviewResponse> findAdminReviews(String period) {
        var reviews = switch (period == null ? "all" : period) {
            case "week" -> productReviewRepository.findByCreatedAtAfterOrderByIdDesc(LocalDateTime.now().minusWeeks(1));
            case "month" -> productReviewRepository.findByCreatedAtAfterOrderByIdDesc(LocalDateTime.now().minusMonths(1));
            default -> productReviewRepository.findAllByOrderByIdDesc();
        };
        return reviews.stream().map(ProductReviewResponse::from).toList();
    }

    @Transactional
    public ProductReviewResponse create(String username, ProductReviewRequest request) {
        productReviewRepository.findByOrderNumberAndProductIdAndUsername(request.orderNumber(), request.productId(), username)
                .ifPresent(review -> {
                    throw new IllegalArgumentException("この商品はすでに評価済みです。");
                });

        var order = mobileOrderRepository.findByOrderNumber(request.orderNumber());
        if (order == null || !order.getUsername().equals(username)) {
            throw new IllegalArgumentException("対象の注文が見つかりません。");
        }
        if (order.getStatus() != OrderStatus.RECEIVED) {
            throw new IllegalArgumentException("受取完了後に商品を評価できます。");
        }

        var orderItem = order.getItems().stream()
                .filter(item -> item.getProductId().equals(request.productId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("対象の商品が見つかりません。"));

        var review = new ProductReview(
                order.getOrderNumber(),
                orderItem.getProductId(),
                orderItem.getProductName(),
                username,
                request.rating(),
                request.comment(),
                LocalDateTime.now()
        );
        return ProductReviewResponse.from(productReviewRepository.save(review));
    }
}
