package org.example.service;

import org.example.dto.AlertResponse;
import org.example.entity.Alert;
import org.example.entity.User;
import org.example.entity.WatchedStock;
import org.example.repository.AlertRepository;
import org.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlertService {

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private UserRepository userRepository;

    public void createAlert(BigDecimal currentPrice, BigDecimal thresholdPrice, Alert.AlertType alertType,
                           User user, WatchedStock watchedStock) {
        Alert alert = new Alert(currentPrice, thresholdPrice, alertType, user, watchedStock);
        alertRepository.save(alert);
    }

    public List<AlertResponse> getUserAlerts(UserDetails userDetails, int page, int size) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Page<Alert> alertPage = alertRepository.findByUserIdOrderByTriggeredAtDesc(
            user.getId(), PageRequest.of(page, size));

        return alertPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AlertResponse> getUnreadAlerts(UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Alert> unreadAlerts = alertRepository.findByUserIdAndReadFalseOrderByTriggeredAtDesc(user.getId());

        return unreadAlerts.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return alertRepository.countUnreadByUserId(user.getId());
    }

    @Transactional
    public void markAlertsAsRead(List<Long> alertIds, UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        alertRepository.markAsRead(user.getId(), alertIds);
    }

    private AlertResponse mapToResponse(Alert alert) {
        return new AlertResponse(
            alert.getId(),
            alert.getWatchedStock().getSymbol(),
            alert.getCurrentPrice(),
            alert.getThresholdPrice(),
            alert.getAlertType(),
            alert.getTriggeredAt(),
            alert.isRead()
        );
    }
}
