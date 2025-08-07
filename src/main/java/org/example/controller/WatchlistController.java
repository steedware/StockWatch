package org.example.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.example.dto.WatchedStockRequest;
import org.example.dto.WatchedStockResponse;
import org.example.service.WatchedStockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
@Tag(name = "Watchlist", description = "Manage watched stocks")
@SecurityRequirement(name = "bearerAuth")
public class WatchlistController {

    @Autowired
    private WatchedStockService watchedStockService;

    @GetMapping
    @Operation(summary = "Get user's watchlist")
    public ResponseEntity<List<WatchedStockResponse>> getWatchlist(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<WatchedStockResponse> watchlist = watchedStockService.getUserWatchedStocks(userDetails);
        return ResponseEntity.ok(watchlist);
    }

    @PostMapping
    @Operation(summary = "Add stock to watchlist")
    public ResponseEntity<WatchedStockResponse> addToWatchlist(
            @Valid @RequestBody WatchedStockRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            WatchedStockResponse response = watchedStockService.addWatchedStock(request, userDetails);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update watched stock")
    public ResponseEntity<WatchedStockResponse> updateWatchedStock(
            @PathVariable Long id,
            @Valid @RequestBody WatchedStockRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            WatchedStockResponse response = watchedStockService.updateWatchedStock(id, request, userDetails);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove stock from watchlist")
    public ResponseEntity<Void> removeFromWatchlist(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            watchedStockService.deleteWatchedStock(id, userDetails);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
