package org.example.dto;

import org.example.entity.Alert.AlertType;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AlertResponse {
    private Long id;
    private String symbol;
    private BigDecimal currentPrice;
    private BigDecimal thresholdPrice;
    private AlertType alertType;
    private LocalDateTime triggeredAt;
    private boolean read;

    public AlertResponse() {}

    public AlertResponse(Long id, String symbol, BigDecimal currentPrice, BigDecimal thresholdPrice,
                        AlertType alertType, LocalDateTime triggeredAt, boolean read) {
        this.id = id;
        this.symbol = symbol;
        this.currentPrice = currentPrice;
        this.thresholdPrice = thresholdPrice;
        this.alertType = alertType;
        this.triggeredAt = triggeredAt;
        this.read = read;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public BigDecimal getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }

    public BigDecimal getThresholdPrice() { return thresholdPrice; }
    public void setThresholdPrice(BigDecimal thresholdPrice) { this.thresholdPrice = thresholdPrice; }

    public AlertType getAlertType() { return alertType; }
    public void setAlertType(AlertType alertType) { this.alertType = alertType; }

    public LocalDateTime getTriggeredAt() { return triggeredAt; }
    public void setTriggeredAt(LocalDateTime triggeredAt) { this.triggeredAt = triggeredAt; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
}
