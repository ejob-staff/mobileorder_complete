package jp.co.mobileorder.dto;

import jp.co.mobileorder.entity.Product;

public record ProductResponse(
        Long id,
        String name,
        String description,
        String category,
        Integer price,
        Integer stock,
        boolean published,
        String accent,
        Double averageRating,
        Long reviewCount,
        Integer orderedQuantity
) {
    public static ProductResponse from(Product product) {
        return from(product, 0.0, 0L, 0);
    }

    public static ProductResponse from(Product product, Double averageRating, Long reviewCount, Integer orderedQuantity) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getCategory(),
                product.getPrice(),
                product.getStock(),
                product.isPublished(),
                product.getAccent(),
                averageRating,
                reviewCount,
                orderedQuantity
        );
    }
}
