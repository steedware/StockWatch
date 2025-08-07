package org.example.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "current_price", nullable = false)
    private BigDecimal currentPrice;

    @Column(name = "threshold_price", nullable = false)
    private BigDecimal thresholdPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "alert_type", nullable = false)
    private AlertType alertType;

    @Column(name = "triggered_at", nullable = false)
    private LocalDateTime triggeredAt;

    @Column(name = "is_read")
    private boolean read = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "watched_stock_id", nullable = false)
    private WatchedStock watchedStock;

    @PrePersist
    protected void onCreate() {
        if (triggeredAt == null) {
            triggeredAt = LocalDateTime.now();
        }
    }

    public Alert() {}

    public Alert(BigDecimal currentPrice, BigDecimal thresholdPrice, AlertType alertType, User user, WatchedStock watchedStock) {
        this.currentPrice = currentPrice;
        this.thresholdPrice = thresholdPrice;
        this.alertType = alertType;
        this.user = user;
        this.watchedStock = watchedStock;
    }

    public enum AlertType {
        MIN_PRICE_EXCEEDED,
        MAX_PRICE_EXCEEDED
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public WatchedStock getWatchedStock() { return watchedStock; }
    public void setWatchedStock(WatchedStock watchedStock) { this.watchedStock = watchedStock; }
}
