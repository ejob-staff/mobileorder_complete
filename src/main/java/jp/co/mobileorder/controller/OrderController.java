package jp.co.mobileorder.controller;

import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import jp.co.mobileorder.dto.OrderRequest;
import jp.co.mobileorder.dto.OrderResponse;
import jp.co.mobileorder.dto.OrderStatusUpdateRequest;
import jp.co.mobileorder.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/orders")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse create(@Valid @RequestBody OrderRequest request, Principal principal) {
        return orderService.createOrder(principal.getName(), request);
    }

    @GetMapping("/orders")
    public List<OrderResponse> history(Principal principal) {
        return orderService.findOrders(principal.getName());
    }

    @GetMapping("/orders/active")
    public List<OrderResponse> activeOrders(Principal principal) {
        return orderService.findActiveOrders(principal.getName());
    }

    @PostMapping("/orders/{orderNumber}/received")
    public OrderResponse markReceived(@PathVariable String orderNumber, Principal principal) {
        return orderService.markReceived(orderNumber, principal.getName());
    }

    @GetMapping("/admin/orders")
    public List<OrderResponse> adminOrders() {
        return orderService.findAdminOrders();
    }

    @PutMapping("/admin/orders/{orderNumber}/status")
    public OrderResponse updateStatus(
            @PathVariable String orderNumber,
            @Valid @RequestBody OrderStatusUpdateRequest request,
            Principal principal
    ) {
        return orderService.updateStatus(orderNumber, request, principal.getName());
    }
}
