package jp.co.mobileorder.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import jp.co.mobileorder.dto.AnalyticsResponse;
import jp.co.mobileorder.entity.MobileOrder;
import jp.co.mobileorder.repository.MobileOrderRepository;
import jp.co.mobileorder.repository.ProductReviewRepository;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MM/dd");
    private final MobileOrderRepository mobileOrderRepository;
    private final ProductReviewRepository productReviewRepository;

    public AnalyticsService(MobileOrderRepository mobileOrderRepository, ProductReviewRepository productReviewRepository) {
        this.mobileOrderRepository = mobileOrderRepository;
        this.productReviewRepository = productReviewRepository;
    }

    public AnalyticsResponse analyze() {
        var orders = mobileOrderRepository.findAllByOrderByIdDesc();
        var reviews = productReviewRepository.findAll();
        var totalSales = orders.stream().mapToInt(MobileOrder::getTotal).sum();
        var averageRating = reviews.isEmpty() ? 0.0 : reviews.stream().mapToInt(review -> review.getRating()).average().orElse(0.0);
        var dailySales = buildDailySales(orders);
        var categoryScores = buildCategoryScores(orders, averageRating);

        return new AnalyticsResponse(totalSales, orders.size(), Math.round(averageRating * 10) / 10.0, dailySales, categoryScores);
    }

    private List<AnalyticsResponse.DailySales> buildDailySales(List<MobileOrder> orders) {
        var salesByDate = orders.stream().collect(Collectors.groupingBy(
                order -> order.getCreatedAt().toLocalDate(),
                Collectors.summingInt(MobileOrder::getTotal)
        ));

        var start = LocalDate.now().minusDays(6);
        var result = new ArrayList<AnalyticsResponse.DailySales>();
        for (int i = 0; i < 7; i++) {
            var date = start.plusDays(i);
            result.add(new AnalyticsResponse.DailySales(date.format(DATE_FORMATTER), salesByDate.getOrDefault(date, 0)));
        }
        return result;
    }

    private List<AnalyticsResponse.CategoryScore> buildCategoryScores(List<MobileOrder> orders, double averageRating) {
        var itemCounts = orders.stream()
                .flatMap(order -> order.getItems().stream())
                .collect(Collectors.groupingBy(item -> guessCategory(item.getProductName()), Collectors.summingInt(item -> item.getQuantity())));

        return itemCounts.entrySet().stream()
                .sorted(Comparator.comparing(entry -> entry.getKey()))
                .map(entry -> {
                    var volume = Math.min(100, 45 + entry.getValue() * 8);
                    var ratingScore = Math.min(100, (int) Math.round(averageRating * 20));
                    var onTimeRate = Math.min(100, 72 + entry.getValue() * 3);
                    var repeatPotential = Math.min(100, (volume + ratingScore) / 2 + 8);
                    var salesPower = Math.min(100, volume + 10);
                    return new AnalyticsResponse.CategoryScore(entry.getKey(), salesPower, volume, onTimeRate, ratingScore, repeatPotential);
                })
                .toList();
    }

    private String guessCategory(String productName) {
        if (productName.contains("プレミアム")) {
            return "プレミアム";
        }
        if (productName.contains("タピオカ")) {
            return "タピオカ";
        }
        if (productName.contains("桜") || productName.contains("桃")) {
            return "季節限定";
        }
        if (productName.contains("ケーキ") || productName.contains("タルト")) {
            return "ケーキ";
        }
        if (productName.contains("クッキー") || productName.contains("マドレーヌ")) {
            return "焼き菓子";
        }
        if (productName.contains("ラテ") || productName.contains("ティー")) {
            return "ドリンク";
        }
        return "プレミアム";
    }
}
