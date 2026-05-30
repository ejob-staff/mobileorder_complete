package jp.co.mobileorder.service;

import java.util.Comparator;
import java.util.List;
import jp.co.mobileorder.dto.ProductRequest;
import jp.co.mobileorder.dto.ProductResponse;
import jp.co.mobileorder.entity.Product;
import jp.co.mobileorder.repository.MobileOrderRepository;
import jp.co.mobileorder.repository.ProductRepository;
import jp.co.mobileorder.repository.ProductReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductReviewRepository productReviewRepository;
    private final MobileOrderRepository mobileOrderRepository;

    public ProductService(ProductRepository productRepository, ProductReviewRepository productReviewRepository, MobileOrderRepository mobileOrderRepository) {
        this.productRepository = productRepository;
        this.productReviewRepository = productReviewRepository;
        this.mobileOrderRepository = mobileOrderRepository;
    }

    public List<ProductResponse> findPublishedProducts() {
        return sortByPopularity(productRepository.findByPublishedTrueOrderByIdDesc().stream().map(this::toResponse).toList());
    }

    public List<ProductResponse> findAllProducts() {
        return sortByPopularity(productRepository.findAllByOrderByIdDesc().stream().map(this::toResponse).toList());
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        var product = new Product(request.name(), request.description(), request.category(), request.price(), request.stock(), request.published(), request.accent());
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        var product = productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("商品が見つかりません。"));
        product.update(request.name(), request.description(), request.category(), request.price(), request.stock(), request.published(), request.accent());
        return toResponse(product);
    }

    @Transactional
    public ProductResponse togglePublished(Long id) {
        var product = productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("商品が見つかりません。"));
        product.togglePublished();
        return toResponse(product);
    }

    @Transactional
    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    private ProductResponse toResponse(Product product) {
        var reviews = productReviewRepository.findByProductId(product.getId());
        var average = reviews.isEmpty() ? 0.0 : reviews.stream().mapToInt(review -> review.getRating()).average().orElse(0.0);
        var roundedAverage = Math.round(average * 10) / 10.0;
        return ProductResponse.from(product, roundedAverage, (long) reviews.size(), orderedQuantity(product.getId()));
    }

    private List<ProductResponse> sortByPopularity(List<ProductResponse> products) {
        return products.stream()
                .sorted(Comparator
                        .comparingInt(ProductResponse::orderedQuantity).reversed()
                        .thenComparing(ProductResponse::averageRating, Comparator.reverseOrder())
                        .thenComparing(ProductResponse::id, Comparator.reverseOrder()))
                .toList();
    }

    private int orderedQuantity(Long productId) {
        return mobileOrderRepository.findAll().stream()
                .flatMap(order -> order.getItems().stream())
                .filter(item -> item.getProductId().equals(productId))
                .mapToInt(item -> item.getQuantity())
                .sum();
    }
}
