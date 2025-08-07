package org.example.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class WatchedStockResponse {
    private Long id;
    private String symbol;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private LocalDateTime createdAt;
    private boolean active;

    public WatchedStockResponse() {}

    public WatchedStockResponse(Long id, String symbol, BigDecimal minPrice, BigDecimal maxPrice,
                              LocalDateTime createdAt, boolean active) {
        this.id = id;
        this.symbol = symbol;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.createdAt = createdAt;
        this.active = active;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public BigDecimal getMinPrice() { return minPrice; }
    public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }

    public BigDecimal getMaxPrice() { return maxPrice; }
    public void setMaxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
