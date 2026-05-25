package jp.co.mobileorder.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_review")
public class ProductReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String orderNumber;
    private Long productId;
    private String productName;
    private String username;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

    protected ProductReview() {
    }

    public ProductReview(String orderNumber, Long productId, String productName, String username, Integer rating, String comment, LocalDateTime createdAt) {
        this.orderNumber = orderNumber;
        this.productId = productId;
        this.productName = productName;
        this.username = username;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public Long getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public String getUsername() {
        return username;
    }

    public Integer getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
