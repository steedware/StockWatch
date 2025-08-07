package org.example.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;

public class WatchedStockRequest {

    @NotBlank(message = "Stock symbol is required")
    @Pattern(regexp = "^[A-Z]{1,5}$", message = "Stock symbol must be 1-5 uppercase letters")
    private String symbol;

    @DecimalMin(value = "0.01", message = "Minimum price must be greater than 0")
    private BigDecimal minPrice;

    @DecimalMin(value = "0.01", message = "Maximum price must be greater than 0")
    private BigDecimal maxPrice;

    public WatchedStockRequest() {}

    public WatchedStockRequest(String symbol, BigDecimal minPrice, BigDecimal maxPrice) {
        this.symbol = symbol;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
    }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public BigDecimal getMinPrice() { return minPrice; }
    public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }

    public BigDecimal getMaxPrice() { return maxPrice; }
    public void setMaxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; }
}
