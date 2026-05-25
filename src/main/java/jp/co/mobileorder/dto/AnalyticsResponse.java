package jp.co.mobileorder.dto;

import java.util.List;

public record AnalyticsResponse(
        Integer totalSales,
        Integer orderCount,
        Double averageRating,
        List<DailySales> dailySales,
        List<CategoryScore> categoryScores
) {
    public record DailySales(String date, Integer sales) {
    }

    public record CategoryScore(String category, Integer salesPower, Integer orderVolume, Integer onTimeRate, Integer customerRating, Integer repeatPotential) {
    }
}
