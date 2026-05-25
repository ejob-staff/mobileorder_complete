package jp.co.mobileorder.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "mobile_order")
public class MobileOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String orderNumber;
    private String username;
    private LocalDateTime createdAt;
    private LocalDateTime pickupAt;
    private Integer total;
    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;
    private String cancelReason;
    private String cancellationAdminUsername;
    private LocalDateTime receivedAt;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    protected MobileOrder() {
    }

    public MobileOrder(String orderNumber, String username, LocalDateTime createdAt, LocalDateTime pickupAt, Integer total) {
        this.orderNumber = orderNumber;
        this.username = username;
        this.createdAt = createdAt;
        this.pickupAt = pickupAt;
        this.total = total;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public String getUsername() {
        return username;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getPickupAt() {
        return pickupAt;
    }

    public Integer getTotal() {
        return total;
    }

    public OrderStatus getStatus() {
        return status == null ? OrderStatus.PENDING : status;
    }

    public String getCancelReason() {
        return cancelReason;
    }

    public String getCancellationAdminUsername() {
        return cancellationAdminUsername;
    }

    public LocalDateTime getReceivedAt() {
        return receivedAt;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void addItem(OrderItem item) {
        item.setOrder(this);
        items.add(item);
    }

    public void updateStatus(OrderStatus status, String cancelReason, String adminUsername) {
        this.status = status;

        if (status == OrderStatus.CANCELED) {
            this.cancelReason = cancelReason;
            this.cancellationAdminUsername = adminUsername;
            return;
        }

        this.cancelReason = null;
        this.cancellationAdminUsername = null;
    }

    public void markReceived(LocalDateTime receivedAt) {
        this.status = OrderStatus.RECEIVED;
        this.receivedAt = receivedAt;
    }
}
