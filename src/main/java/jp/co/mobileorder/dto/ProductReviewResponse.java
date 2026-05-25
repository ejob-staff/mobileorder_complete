package jp.co.mobileorder.dto;

import java.time.format.DateTimeFormatter;
import jp.co.mobileorder.entity.ProductReview;

public record ProductReviewResponse(
        Long id,
        String orderNumber,
        Long productId,
        String productName,
        String username,
        Integer rating,
        String comment,
        String createdAt
) {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm");

    public static ProductReviewResponse from(ProductReview review) {
        return new ProductReviewResponse(
                review.getId(),
                review.getOrderNumber(),
                review.getProductId(),
                review.getProductName(),
                review.getUsername(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt().format(FORMATTER)
        );
    }
}
