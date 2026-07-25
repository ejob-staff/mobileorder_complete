package jp.co.mobileorder.service;

import java.time.Duration;
import java.time.LocalDate;
import java.util.HashMap;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import jp.co.mobileorder.dto.AnalyticsResponse;
import jp.co.mobileorder.entity.MobileOrder;
import jp.co.mobileorder.repository.MobileOrderRepository;
import jp.co.mobileorder.repository.ProductRepository;
import jp.co.mobileorder.repository.ProductReviewRepository;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MM/dd");
    private final MobileOrderRepository mobileOrderRepository;
    private final ProductRepository productRepository;
    private final ProductReviewRepository productReviewRepository;

    public AnalyticsService(MobileOrderRepository mobileOrderRepository, ProductRepository productRepository, ProductReviewRepository productReviewRepository) {
        this.mobileOrderRepository = mobileOrderRepository;
        this.productRepository = productRepository;
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
        {/*注文分析データ取得処理4 練習問題11-1-7-1*/}
        {/*productテーブルのcategoryを参照するようにする*/}
        var categoryByProductId = productRepository.findAll().stream()
                .collect(Collectors.toMap(product -> product.getId(), product -> product.getCategory()));
        var itemCounts = orders.stream()
                .flatMap(order -> order.getItems().stream())
                .collect(Collectors.groupingBy(item -> categoryByProductId.getOrDefault(item.getProductId(), "プレミアム"), Collectors.summingInt(item -> item.getQuantity())));
        {/*注文分析データ取得処理4 練習問題11-1-7-2*/}
        {/*リピート期待の計算方法 ※それ以外も修正*/}
        var categorySales = orders.stream()
                .flatMap(order -> order.getItems().stream())
                .collect(Collectors.groupingBy(item -> categoryByProductId.getOrDefault(item.getProductId(), "プレミアム"), Collectors.summingInt(item -> item.getPrice() * item.getQuantity())));
        var totalMinutesByCategory = new HashMap<String, Long>();
        var orderCountByCategory = new HashMap<String, Integer>();
        orders.forEach(order -> {
            var minutes = Duration.between(order.getCreatedAt(), order.getPickupAt()).toMinutes();
            order.getItems().forEach(item -> {
                var category = categoryByProductId.getOrDefault(item.getProductId(), "プレミアム");
                totalMinutesByCategory.merge(category, minutes, Long::sum);
                orderCountByCategory.merge(category, 1, Integer::sum);
            });
        });
        var maxCategoryQuantity = itemCounts.values().stream().mapToInt(Integer::intValue).max().orElse(0);
        var maxCategorySales = categorySales.values().stream().mapToInt(Integer::intValue).max().orElse(0);
        var ratingScore = (int) Math.round(averageRating * 20);

        return itemCounts.entrySet().stream()
                .sorted(Comparator.comparing(entry -> entry.getKey()))
                .map(entry -> {
                    var categoryQuantity = entry.getValue();
                    var categorySalesAmount = categorySales.getOrDefault(entry.getKey(), 0);
                    var salesPower = maxCategorySales == 0 ? 0 : (int) Math.round(40 + categorySalesAmount * 60.0 / maxCategorySales);
                    var volume = maxCategoryQuantity == 0 ? 0 : (int) Math.round(40 + categoryQuantity * 60.0 / maxCategoryQuantity);
                    var category = entry.getKey();
                    var orderCount = orderCountByCategory.getOrDefault(category, 0);
                    var averageMinutes = orderCount == 0 ? 0 : totalMinutesByCategory.getOrDefault(category, 0L) / orderCount;
                    var onTimeRate = (int) Math.clamp(100 - Math.max(0, averageMinutes - 30) * 2, 0, 100);
                    var repeatPotential = (int) Math.round((volume + ratingScore) / 2.0);
                    return new AnalyticsResponse.CategoryScore(entry.getKey(), salesPower, volume, onTimeRate, ratingScore, repeatPotential);
                })
                .toList();
    }

    {/*注文分析データ取得処理4 練習問題11-1-7-1*/}
    {/*不要な処理なのでコメントアウトにしておく*/}
//    private String guessCategory(String productName) {
//        if (productName.contains("プレミアム")) {
//            return "プレミアム";
//        }
//        if (productName.contains("タピオカ")) {
//            return "タピオカ";
//        }
//        if (productName.contains("桜") || productName.contains("桃")) {
//            return "季節限定";
//        }
//        if (productName.contains("ケーキ") || productName.contains("タルト")) {
//            return "ケーキ";
//        }
//        if (productName.contains("クッキー") || productName.contains("マドレーヌ")) {
//            return "焼き菓子";
//        }
//        if (productName.contains("ラテ") || productName.contains("ティー")) {
//            return "ドリンク";
//        }
//        return "プレミアム";
//    }
}
