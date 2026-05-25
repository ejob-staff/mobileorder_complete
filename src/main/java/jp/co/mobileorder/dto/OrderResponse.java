package jp.co.mobileorder.dto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import jp.co.mobileorder.entity.MobileOrder;
import jp.co.mobileorder.entity.OrderItem;
import jp.co.mobileorder.entity.OrderStatus;

public record OrderResponse(
        String id,
        String username,
        String createdAt,
        String pickupAt,
        Integer total,
        String status,
        String statusLabel,
        String cancelReason,
        String cancellationAdminUsername,
        String receivedAt,
        List<OrderItemResponse> items
) {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm");

    public static OrderResponse from(MobileOrder order) {
        return new OrderResponse(
                order.getOrderNumber(),
                order.getUsername(),
                format(order.getCreatedAt()),
                format(order.getPickupAt()),
                order.getTotal(),
                order.getStatus().name(),
                label(order.getStatus()),
                order.getCancelReason(),
                order.getCancellationAdminUsername(),
                format(order.getReceivedAt()),
                order.getItems().stream().map(OrderItemResponse::from).toList()
        );
    }

    private static String format(LocalDateTime dateTime) {
        return dateTime == null ? "" : dateTime.format(FORMATTER);
    }

    private static String label(OrderStatus status) {
        return switch (status) {
            case PENDING -> "未対応";
            case COOKING -> "調理中";
            case READY -> "完成";
            case SERVED -> "提供済み";
            case RECEIVED -> "受取完了";
            case CANCELED -> "キャンセル";
        };
    }

    public record OrderItemResponse(
            Long id,
            Long productId,
            String name,
            Integer price,
            Integer quantity
    ) {
        public static OrderItemResponse from(OrderItem item) {
            return new OrderItemResponse(
                    item.getId(),
                    item.getProductId(),
                    item.getProductName(),
                    item.getPrice(),
                    item.getQuantity()
            );
        }
    }
}
