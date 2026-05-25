package jp.co.mobileorder.controller;

import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import jp.co.mobileorder.dto.ProductReviewRequest;
import jp.co.mobileorder.dto.ProductReviewResponse;
import jp.co.mobileorder.service.ProductReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ProductReviewController {
    private final ProductReviewService productReviewService;

    public ProductReviewController(ProductReviewService productReviewService) {
        this.productReviewService = productReviewService;
    }

    @GetMapping("/reviews")
    public List<ProductReviewResponse> userReviews(Principal principal) {
        return productReviewService.findUserReviews(principal.getName());
    }

    @PostMapping("/reviews")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductReviewResponse create(@Valid @RequestBody ProductReviewRequest request, Principal principal) {
        return productReviewService.create(principal.getName(), request);
    }

    @GetMapping("/admin/reviews")
    public List<ProductReviewResponse> adminReviews(@RequestParam(defaultValue = "all") String period) {
        return productReviewService.findAdminReviews(period);
    }
}
