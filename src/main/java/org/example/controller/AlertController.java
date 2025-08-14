package org.example.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.example.dto.AlertResponse;
import org.example.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@Tag(name = "Alerts", description = "Manage stock price alerts")
@SecurityRequirement(name = "bearerAuth")
public class AlertController {
    
    @Autowired
    private AlertService alertService;
    
    @GetMapping
    @Operation(summary = "Get user's alerts with pagination")
    public ResponseEntity<List<AlertResponse>> getAlerts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserDetails userDetails) {
        List<AlertResponse> alerts = alertService.getUserAlerts(userDetails, page, size);
        return ResponseEntity.ok(alerts);
    }
    
    @GetMapping("/unread")
    @Operation(summary = "Get unread alerts")
    public ResponseEntity<List<AlertResponse>> getUnreadAlerts(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<AlertResponse> unreadAlerts = alertService.getUnreadAlerts(userDetails);
        return ResponseEntity.ok(unreadAlerts);
    }
    
    @GetMapping("/unread/count")
    @Operation(summary = "Get count of unread alerts")
    public ResponseEntity<Long> getUnreadCount(
            @AuthenticationPrincipal UserDetails userDetails) {
        long count = alertService.getUnreadCount(userDetails);
        return ResponseEntity.ok(count);
    }
    
    @PutMapping("/mark-read")
    @Operation(summary = "Mark alerts as read")
    public ResponseEntity<Void> markAlertsAsRead(
            @RequestBody List<Long> alertIds,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            alertService.markAlertsAsRead(alertIds, userDetails);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
