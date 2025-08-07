package org.example.dto;
import java.math.BigDecimal;

public class StockPriceResponse {
    private String symbol;
    private BigDecimal price;
    private String timestamp;

    public StockPriceResponse() {}

    public StockPriceResponse(String symbol, BigDecimal price, String timestamp) {
        this.symbol = symbol;
        this.price = price;
        this.timestamp = timestamp;
    }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}

