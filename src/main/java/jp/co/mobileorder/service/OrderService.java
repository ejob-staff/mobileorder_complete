package jp.co.mobileorder.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import jp.co.mobileorder.dto.OrderRequest;
import jp.co.mobileorder.dto.OrderResponse;
import jp.co.mobileorder.dto.OrderStatusUpdateRequest;
import jp.co.mobileorder.entity.MobileOrder;
import jp.co.mobileorder.entity.OrderItem;
import jp.co.mobileorder.entity.OrderStatus;
import jp.co.mobileorder.repository.MobileOrderRepository;
import jp.co.mobileorder.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {
    private final MobileOrderRepository mobileOrderRepository;
    private final ProductRepository productRepository;

    public OrderService(MobileOrderRepository mobileOrderRepository, ProductRepository productRepository) {
        this.mobileOrderRepository = mobileOrderRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public OrderResponse createOrder(String username, OrderRequest request) {
        var orderNumber = generateOrderNumber();
        var now = LocalDateTime.now();
        var pickupAt = LocalDateTime.parse(request.pickupAt());
        if (pickupAt.isBefore(now) || pickupAt.isAfter(now.plusHours(4))) {
            throw new IllegalArgumentException("現在時刻より現在から4時間後までの日時を選択できます。");
        }
        var order = new MobileOrder(orderNumber, username, now, pickupAt, 0);
        var total = 0;

        for (var item : request.items()) {
            var product = productRepository.findById(item.productId())
                    .orElseThrow(() -> new IllegalArgumentException("商品が見つかりません。"));
            if (!product.isPublished()) {
                throw new IllegalArgumentException("非公開の商品は注文できません。");
            }
            if (product.getStock() < item.quantity()) {
                throw new IllegalArgumentException(product.getName() + "の在庫数が不足しています。");
            }
            product.decreaseStock(item.quantity());
            order.addItem(new OrderItem(product.getId(), product.getName(), product.getPrice(), item.quantity()));
            total += product.getPrice() * item.quantity();
        }

        var savedOrder = new MobileOrder(orderNumber, username, order.getCreatedAt(), pickupAt, total);
        order.getItems().forEach(savedOrder::addItem);
        return OrderResponse.from(mobileOrderRepository.save(savedOrder));
    }

    public List<OrderResponse> findOrders(String username) {
        return mobileOrderRepository.findByUsernameOrderByIdDesc(username).stream().map(OrderResponse::from).toList();
    }

    public List<OrderResponse> findActiveOrders(String username) {
        var receivedAfter = LocalDateTime.now().minusMinutes(10);
        return mobileOrderRepository.findByUsernameOrderByIdDesc(username)
                .stream()
                .filter(order -> order.getStatus() != OrderStatus.RECEIVED || order.getReceivedAt().isAfter(receivedAfter))
                .map(OrderResponse::from)
                .toList();
    }

    public List<OrderResponse> findAdminOrders() {
        return mobileOrderRepository.findAllByOrderByIdDesc().stream().map(OrderResponse::from).toList();
    }

    @Transactional
    public OrderResponse updateStatus(String orderNumber, OrderStatusUpdateRequest request, String adminUsername) {
        var order = findByOrderNumber(orderNumber);
        var status = OrderStatus.valueOf(request.status());

        if (status == OrderStatus.CANCELED && (request.cancelReason() == null || request.cancelReason().isBlank())) {
            throw new IllegalArgumentException("キャンセルの理由を入力してください。");
        }

        order.updateStatus(status, request.cancelReason(), adminUsername);
        return OrderResponse.from(order);
    }

    @Transactional
    public OrderResponse markReceived(String orderNumber, String username) {
        var order = findByOrderNumber(orderNumber);
        if (!order.getUsername().equals(username)) {
            throw new IllegalArgumentException("対象の注文が見つかりません。");
        }
        if (order.getStatus() != OrderStatus.SERVED) {
            throw new IllegalArgumentException("提供済みの注文のみ受取完了にできます。");
        }

        order.markReceived(LocalDateTime.now());
        return OrderResponse.from(order);
    }

    private MobileOrder findByOrderNumber(String orderNumber) {
        var order = mobileOrderRepository.findByOrderNumber(orderNumber);
        if (order == null) {
            throw new IllegalArgumentException("対象の注文が見つかりません。");
        }
        return order;
    }

    private String generateOrderNumber() {
        String orderNumber;
        do {
            orderNumber = "MOBILE-CODE-" + String.format("%06d", ThreadLocalRandom.current().nextInt(1_000_000));
        } while (mobileOrderRepository.findByOrderNumber(orderNumber) != null);

        return orderNumber;
    }
}
